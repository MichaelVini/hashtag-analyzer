<template>
  <UCard class="hashtag-analyzer">
    <template #header>
      <h1 class="text-center text-xl font-bold text-primary mb-2">
        Analisador de Hashtags
      </h1>
    </template>

    <div class="relative mb-4">
      <UInput
        v-model="searchTerm"
        icon="i-heroicons-magnifying-glass"
        placeholder="Digite uma hashtag..."
        size="lg"
        :loading="isLoading"
        @input="handleInput"
        trailing-icon="i-heroicons-hashtag"
      />
      
      <UCard
        v-if="showSuggestions && !error && (suggestions.length > 0 || isLoading)"
        class="absolute top-full left-0 right-0 mt-1 z-50"
      >
        <div v-if="isLoading" class="p-4 text-center">
          <UIcon name="i-heroicons-arrow-path" class="animate-spin" />
          <span class="ml-2">Buscando hashtags...</span>
        </div>

        <UList v-else class="!p-0">
          <UListItem
            v-for="suggestion in suggestions"
            :key="suggestion.tag"
            class="cursor-pointer border-b border-gray-200 last:border-b-0 dark:border-gray-700 !p-0"
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

      <UAlert
        v-if="error"
        :title="error"
        color="red"
        variant="soft"
        class="mt-2"
      />
    </div>

    <!-- Detalhes da hashtag selecionada -->
    <div v-if="selectedHashtag" class="space-y-4">
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
        <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <div class="flex items-center gap-2 mb-2">
            <UIcon name="i-heroicons-arrow-trending-up" class="text-primary" />
            <span class="font-medium">Crescimento (7 dias)</span>
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
        <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <div class="flex items-center gap-2 mb-2">
            <UIcon name="i-heroicons-clock" class="text-primary" />
            <span class="font-medium">Melhor horário</span>
          </div>
          <span>{{ selectedHashtag.bestTime }}</span>
        </div>

        <!-- Engajamento -->
        <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <div class="flex items-center gap-2 mb-2">
            <UIcon name="i-heroicons-heart" class="text-primary" />
            <span class="font-medium">Engajamento médio</span>
          </div>
          <span>{{ selectedHashtag.engagement }}%</span>
        </div>

        <!-- Tópicos relacionados -->
        <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <div class="flex items-center gap-2 mb-2">
            <UIcon name="i-heroicons-hashtag" class="text-primary" />
            <span class="font-medium">Tópicos relacionados</span>
          </div>
          <div v-if="selectedHashtag.relatedTopics.length > 0" class="flex flex-wrap gap-2">
            <UBadge
              v-for="topic in selectedHashtag.relatedTopics"
              :key="topic"
              color="gray"
              variant="soft"
            >
              #{{ topic }}
            </UBadge>
          </div>
          <span v-else class="text-sm text-gray-500">
            Nenhum tópico relacionado encontrado
          </span>
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'

const searchTerm = ref('')
const showSuggestions = ref(false)
const selectedHashtag = ref(null)
const suggestions = ref([])
const isLoading = ref(false)
const error = ref(null)

// Debounce a busca para evitar muitas requisições
const debouncedSearch = useDebounceFn(async (term) => {
  if (!term || term.length < 2) {
    suggestions.value = []
    return
  }

  try {
    isLoading.value = true
    error.value = null
    const response = await fetch(`/api/hashtags/search?q=${encodeURIComponent(term)}`)
    const data = await response.json()

    if (data.error) {
      error.value = data.error
      suggestions.value = []
      return
    }

    suggestions.value = data.hashtags
  } catch (err) {
    error.value = 'Erro ao buscar sugestões'
    suggestions.value = []
  } finally {
    isLoading.value = false
  }
}, 300)

const handleInput = async () => {
  showSuggestions.value = true
  await debouncedSearch(searchTerm.value)
}

const selectSuggestion = (hashtag) => {
  searchTerm.value = hashtag.tag
  selectedHashtag.value = hashtag
  showSuggestions.value = false
}

const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}
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
  background-color: #111827;
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