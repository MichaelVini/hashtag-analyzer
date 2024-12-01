import { defineEventHandler, getQuery } from 'h3'

const INSTAGRAM_API_URL = 'https://graph.instagram.com/v12.0'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const searchTerm = query.q as string

    if (!searchTerm) {
      return {
        error: 'Search term is required'
      }
    }

    // Buscar dados do Instagram
    const response = await fetch(
      `${INSTAGRAM_API_URL}/ig_hashtag_search?user_id=${process.env.INSTAGRAM_APP_ID}&q=${searchTerm}&access_token=${process.env.INSTAGRAM_ACCESS_TOKEN}`
    )

    const data = await response.json()

    if (!response.ok) {
      console.error('Instagram API error:', data)
      return {
        error: 'Failed to fetch hashtag data'
      }
    }

    // Para cada hashtag encontrada, buscar as métricas
    const hashtagsWithMetrics = await Promise.all(
      data.data.map(async (hashtag: any) => {
        const metricsResponse = await fetch(
          `${INSTAGRAM_API_URL}/${hashtag.id}/top_media?fields=like_count,comments_count,timestamp&access_token=${process.env.INSTAGRAM_ACCESS_TOKEN}`
        )

        const metricsData = await metricsResponse.json()

        // Calcular métricas
        const metrics = calculateMetrics(metricsData.data)

        return {
          tag: hashtag.name,
          id: hashtag.id,
          mentions: metrics.totalPosts,
          engagement: metrics.engagementRate,
          growth: metrics.growth,
          bestTime: metrics.bestTime,
          relatedTopics: [] // Será implementado em outro endpoint
        }
      })
    )

    return {
      hashtags: hashtagsWithMetrics
    }

  } catch (error) {
    console.error('Server error:', error)
    return {
      error: 'Internal server error'
    }
  }
})

function calculateMetrics(posts: any[]) {
  const now = new Date()
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  // Filtrar posts da última semana
  const recentPosts = posts.filter(post => new Date(post.timestamp) > oneWeekAgo)

  // Calcular métricas básicas
  const totalPosts = posts.length
  const totalEngagement = posts.reduce((sum, post) => sum + post.like_count + post.comments_count, 0)
  const engagementRate = totalPosts > 0 ? (totalEngagement / totalPosts / 100).toFixed(1) : 0

  // Calcular crescimento (comparando com a semana anterior)
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)
  const lastWeekPosts = posts.filter(
    post => new Date(post.timestamp) > oneWeekAgo && new Date(post.timestamp) <= now
  )
  const previousWeekPosts = posts.filter(
    post => new Date(post.timestamp) > twoWeeksAgo && new Date(post.timestamp) <= oneWeekAgo
  )

  const growth = previousWeekPosts.length > 0
    ? ((lastWeekPosts.length - previousWeekPosts.length) / previousWeekPosts.length * 100).toFixed(1)
    : 0

  // Determinar melhor horário baseado nos posts com mais engajamento
  const postsByHour = new Array(24).fill(0)
  posts.forEach(post => {
    const hour = new Date(post.timestamp).getHours()
    postsByHour[hour] += post.like_count + post.comments_count
  })

  const bestHour = postsByHour.indexOf(Math.max(...postsByHour))
  const bestTime = `${bestHour.toString().padStart(2, '0')}:00 - ${(bestHour + 1).toString().padStart(2, '0')}:00`

  return {
    totalPosts,
    engagementRate,
    growth,
    bestTime
  }
} 