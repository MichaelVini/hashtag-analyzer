<template>
  <UCard class="hashtag-analyzer">
    <template #header>
      <h1 class="text-center text-xl font-bold text-primary mb-2">
        Analisador de Hashtags
      </h1>
    </template>

    <div class="relative mb-4">
      <div class="flex gap-2">
        <UInput
          v-model="searchTerm"
          icon="i-heroicons-magnifying-glass"
          placeholder="Digite uma hashtag..."
          size="lg"
          class="flex-1"
          @input="handleInput"
          trailing-icon="i-heroicons-hashtag"
        />
        <div class="flex gap-2">
          <UButton
            v-if="selectedHashtag"
            icon="i-heroicons-squares-2x2"
            color="primary"
            variant="soft"
            size="lg"
            :loading="false"
            :disabled="isInComparison || comparisonList.length >= 3"
            @click="addToComparison"
          >
            {{ comparisonList.length >= 3 ? 'Limite atingido' : 'Comparar' }}
          </UButton>
          <UButton
            v-if="selectedHashtag || comparisonList.length > 0"
            icon="i-heroicons-document-chart-bar"
            color="primary"
            variant="soft"
            size="lg"
            @click="imprimirRelatorio"
          >
            Relatório
          </UButton>
        </div>
      </div>
      
      <UCard
        v-if="showSuggestions && filteredSuggestions.length"
        class="suggestions"
      >
        <UList class="!p-0">
          <UListItem
            v-for="suggestion in filteredSuggestions"
            :key="suggestion.tag"
            class="suggestion-item !p-0"
            @click="selectSuggestion(suggestion)"
          >
            <div class="flex items-center w-full px-4 py-3">
              <UIcon name="i-heroicons-hashtag" class="flex-shrink-0" />
              <div class="flex justify-between items-center w-full gap-4 ml-2">
                <span class="font-medium">{{ suggestion.tag }}</span>
                <UBadge color="gray" variant="soft" class="flex-shrink-0">
                  {{ formatNumber(suggestion.mentions) }} menções
                </UBadge>
              </div>
            </div>
          </UListItem>
        </UList>
      </UCard>
    </div>

    <!-- Lista de hashtags para comparação -->
    <div v-if="comparisonList.length > 0" class="mb-4">
      <div class="flex items-center justify-between mb-2">
        <h3 class="font-medium text-gray-700 dark:text-gray-300">Hashtags para comparação</h3>
        <UButton
          icon="i-heroicons-x-mark"
          color="gray"
          variant="ghost"
          size="xs"
          @click="clearComparison"
        >
          Limpar
        </UButton>
      </div>
      <div class="flex flex-wrap gap-2">
        <div 
          v-for="hashtag in comparisonList" 
          :key="hashtag.tag"
          class="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
        >
          <span class="font-medium">#{{ hashtag.tag }}</span>
          <UButton
            icon="i-heroicons-x-mark"
            color="gray"
            variant="ghost"
            size="xs"
            @click="removeFromComparison(hashtag)"
          />
        </div>
      </div>
    </div>

    <!-- Detalhes da hashtag selecionada -->
    <div v-if="selectedHashtag && comparisonList.length === 0" class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-bold text-primary">
          #{{ selectedHashtag.tag }}
        </h2>
        <UBadge color="primary" class="text-base">
          {{ formatNumber(selectedHashtag.mentions) }} menções
        </UBadge>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <!-- Crescimento -->
        <div class="stat-card">
          <div class="flex items-center gap-2 mb-2">
            <UIcon name="i-heroicons-arrow-trending-up" class="text-primary" />
            <span class="font-medium">Crescimento (24h)</span>
          </div>
          <UBadge
            :color="selectedHashtag.growth >= 0 ? 'green' : 'red'"
            variant="soft"
            class="text-sm"
          >
            {{ selectedHashtag.growth >= 0 ? '+' : '' }}{{ selectedHashtag.growth }}%
          </UBadge>
        </div>

        <!-- Melhor horário -->
        <div class="stat-card">
          <div class="flex items-center gap-2 mb-2">
            <UIcon name="i-heroicons-clock" class="text-primary" />
            <span class="font-medium">Melhor horário</span>
          </div>
          <span>{{ selectedHashtag.bestTime }}</span>
        </div>

        <!-- Engajamento -->
        <div class="stat-card">
          <div class="flex items-center gap-2 mb-2">
            <UIcon name="i-heroicons-heart" class="text-primary" />
            <span class="font-medium">Engajamento médio</span>
          </div>
          <span>{{ selectedHashtag.engagement }}%</span>
        </div>

        <!-- Tópicos relacionados -->
        <div class="stat-card">
          <div class="flex items-center gap-2 mb-2">
            <UIcon name="i-heroicons-hashtag" class="text-primary" />
            <span class="font-medium">Tópicos relacionados</span>
          </div>
          <div class="flex flex-wrap gap-2">
            <UBadge
              v-for="topic in selectedHashtag.relatedTopics"
              :key="topic"
              color="gray"
              variant="soft"
            >
              #{{ topic }}
            </UBadge>
          </div>
        </div>
      </div>

      <!-- Gráfico de menções -->
      <div class="chart-container">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-medium text-gray-700 dark:text-gray-300">
            Evolução das menções
          </h3>
          <USelect
            v-model="selectedPeriod"
            :options="periodOptions"
            size="sm"
            class="w-32"
          />
        </div>
        <canvas ref="chartRef"></canvas>
      </div>
    </div>

    <!-- Seção de comparação -->
    <div v-if="(comparisonList.length >= 1 && selectedHashtag && !isInComparison) || comparisonList.length >= 2" class="mt-8 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <h3 class="font-medium text-lg mb-4 text-gray-700 dark:text-gray-300">
        Comparação de Menções
      </h3>
      
      <!-- Cards de menções -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div
          v-for="hashtag in comparisonList"
          :key="hashtag.tag"
          class="p-4 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
        >
          <div class="text-center">
            <h4 class="font-medium text-primary mb-2">#{{ hashtag.tag }}</h4>
            <div class="text-2xl font-bold">{{ formatNumber(hashtag.mentions) }}</div>
            <div class="text-sm text-gray-500">menções</div>
          </div>
        </div>

        <div
          v-if="selectedHashtag && !isInComparison"
          class="p-4 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 border-dashed"
        >
          <div class="text-center">
            <h4 class="font-medium text-primary mb-2">#{{ selectedHashtag.tag }}</h4>
            <div class="text-2xl font-bold">{{ formatNumber(selectedHashtag.mentions) }}</div>
            <div class="text-sm text-gray-500">menções</div>
          </div>
        </div>
      </div>

      <!-- Gráfico de comparação -->
      <div class="h-[300px] relative">
        <canvas ref="comparisonChartRef"></canvas>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { Chart } from 'chart.js'
import { mockHashtags, type HashtagData } from '~/mocks/hashtags'
import { formatNumber } from '~/utils/formatters'
import { createChartConfig } from '~/utils/chartConfig'

const searchTerm = ref('')
const showSuggestions = ref(false)
const selectedHashtag = ref<HashtagData | null>(null)
const selectedPeriod = ref<'week' | 'month' | 'year'>('week')
const chartRef = ref<HTMLCanvasElement | null>(null)
const colorMode = useColorMode()
let chart: Chart | null = null

const periodOptions = [
  { label: 'Semana', value: 'week' },
  { label: 'Mês', value: 'month' },
  { label: 'Ano', value: 'year' }
]

const filteredSuggestions = computed(() => {
  if (!searchTerm.value) return []
  return mockHashtags
    .filter(hashtag =>
      hashtag.tag.toLowerCase().includes(searchTerm.value.toLowerCase())
    )
    .slice(0, 5)
})

const getDataForPeriod = (hashtag: HashtagData) => {
  switch (selectedPeriod.value) {
    case 'week':
      return hashtag.weeklyData
    case 'month':
      return hashtag.monthlyData
    case 'year':
      return hashtag.yearlyData
  }
}

const getPeriodTitle = () => {
  switch (selectedPeriod.value) {
    case 'week':
      return 'Menções na última semana'
    case 'month':
      return 'Menções no último mês'
    case 'year':
      return 'Menções no último ano'
  }
}

const handleInput = () => {
  showSuggestions.value = true
}

const selectSuggestion = (hashtag: HashtagData) => {
  searchTerm.value = hashtag.tag
  selectedHashtag.value = hashtag
  showSuggestions.value = false
  nextTick(() => {
    updateChart()
  })
}

const updateChart = () => {
  if (!process.client || !selectedHashtag.value || !chartRef.value) return

  const ctx = chartRef.value.getContext('2d')
  if (!ctx) return

  const data = getDataForPeriod(selectedHashtag.value)
  const config = createChartConfig(data, getPeriodTitle())

  if (chart) {
    chart.destroy()
  }

  chart = new Chart(ctx, config as any)
}

watch(() => colorMode.value, () => {
  nextTick(() => {
    updateChart()
  })
}, { immediate: true })

watch(selectedPeriod, () => {
  nextTick(() => {
    updateChart()
  })
})

const comparisonList = ref<HashtagData[]>([])
const isInComparison = computed(() => {
  return selectedHashtag.value && comparisonList.value.some(h => h.tag === selectedHashtag.value?.tag)
})

const addToComparison = () => {
  if (selectedHashtag.value && !isInComparison.value && comparisonList.value.length < 3) {
    const newList = comparisonList.value.concat(selectedHashtag.value)
    comparisonList.value = newList
    searchTerm.value = ''
    showSuggestions.value = false
    selectedHashtag.value = null
  }
}

const removeFromComparison = (hashtag: HashtagData) => {
  const newList = comparisonList.value.filter(h => h.tag !== hashtag.tag)
  comparisonList.value = newList
}

const clearComparison = () => {
  comparisonList.value = []
}

const imprimirRelatorio = () => {
  window.print()
}

const comparisonChartRef = ref<HTMLCanvasElement | null>(null)
let comparisonChart: Chart | null = null

const updateComparisonChart = () => {
  if (!process.client || !comparisonChartRef.value) return

  const ctx = comparisonChartRef.value.getContext('2d')
  if (!ctx) return

  const colors = getChartColors()

  if (comparisonChart) {
    comparisonChart.destroy()
  }

  // Combina as hashtags da lista com a selecionada (se existir e não estiver na lista)
  const hashtagsToCompare = [...comparisonList.value]
  if (selectedHashtag.value && !isInComparison.value) {
    hashtagsToCompare.push(selectedHashtag.value)
  }

  nextTick(() => {
    comparisonChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: hashtagsToCompare.map(h => '#' + h.tag),
        datasets: [{
          label: 'Menções',
          data: hashtagsToCompare.map(h => h.mentions),
          backgroundColor: colors.borderColor,
          borderColor: colors.borderColor,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: colors.isDark ? '#1f2937' : 'white',
            titleColor: colors.textColor,
            bodyColor: colors.textColor,
            borderColor: colors.borderColor,
            borderWidth: 1,
            padding: 12,
            displayColors: false,
            callbacks: {
              label: (context: any) => `${formatNumber(context.raw)} menções`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(128, 128, 128, 0.1)'
            },
            ticks: {
              callback: (value: any) => formatNumber(value),
              color: colors.textColor
            }
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: colors.textColor
            }
          }
        }
      }
    })
  })
}

// Observar mudanças que podem afetar a comparação
watch([comparisonList, selectedHashtag, () => colorMode.value], () => {
  if ((comparisonList.value.length >= 1 && selectedHashtag.value && !isInComparison.value) || comparisonList.value.length >= 2) {
    nextTick(() => {
      updateComparisonChart()
    })
  }
}, { deep: true })

// Observar mudanças na lista de comparação para debug
watch(comparisonList, (newValue) => {
  console.log('Lista de comparação atualizada:', newValue)
}, { deep: true })
</script>

<style scoped>
.hashtag-analyzer {
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
  border: 1px solid #e5e7eb;
  background-color: white;
  box-shadow: 
    0 1px 3px 0 rgb(0 0 0 / 0.1),
    0 1px 2px -1px rgb(0 0 0 / 0.1),
    0 0 0 1px rgb(0 0 0 / 0.05);
}

:root.dark .hashtag-analyzer {
  border: 1px solid rgba(255, 255, 255, 0.05);
  background-color: var(--color-gray-900);
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.3);
}

.search-container {
  position: relative;
  margin-bottom: 1rem;
}

.suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 0.25rem;
  z-index: 50;
}

.suggestion-item {
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 1px solid var(--color-gray-200);
}

.suggestion-item:last-child {
  border-bottom: none;
}

:root.dark .suggestion-item {
  border-bottom-color: var(--color-gray-700);
}

.suggestion-item:hover {
  background-color: var(--color-gray-100);
}

:root.dark .suggestion-item:hover {
  background-color: var(--color-gray-800);
}

.stat-card {
  padding: 1rem;
  border-radius: 0.5rem;
  background-color: white;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}

:root.dark .stat-card {
  background-color: var(--color-gray-800);
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: none;
}

.hashtag-details {
  margin-top: 0.5rem;
}

.chart-container {
  margin-top: 1rem;
  padding: 1rem;
  background-color: white;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}

:root.dark .chart-container {
  background-color: var(--color-gray-800);
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: none;
}

:root.dark .suggestions {
  border: 1px solid rgba(255, 255, 255, 0.05);
}

/* Ajuste para o badge não quebrar em telas pequenas */
.suggestion-item :deep(.u-list-item-content) {
  min-width: 0;
}
</style> 