// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxt/ui'],
  colorMode: {
    preference: 'light',
    fallback: 'light',
    classSuffix: ''
  },
  app: {
    baseURL: '/hashtag-analyzer/',
    buildAssetsDir: 'assets',
    pageTransition: {
      name: 'page',
      mode: 'out-in'
    }
  },
  plugins: [
    '~/plugins/chart.ts'
  ]
})
