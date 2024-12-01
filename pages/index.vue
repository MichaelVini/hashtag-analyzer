<template>
  <div class="min-h-screen flex items-center justify-center -mt-20">
    <UCard
      class="w-full max-w-md mx-auto text-center p-8 transform transition-all duration-300 hover:scale-105 cursor-pointer hover:ring-2 hover:ring-primary-500"
      :ui="{ 
        background: 'white dark:gray-900',
        divide: 'gray-100 dark:gray-800',
        ring: 'gray-200 dark:gray-800',
        shadow: 'lg'
      }"
      @click="navigateToAnalyzer"
    >
      <div class="space-y-6">
        <span class="text-6xl font-bold text-primary">#</span>
        <h1 class="text-3xl font-bold text-primary">
          Hashtag Analyzer
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Potencialize sua estratégia com análises detalhadas e maximize o desempenho das suas hashtags!
        </p>
      </div>
    </UCard>
  </div>
</template>

<script setup>
const router = useRouter()

const navigateToAnalyzer = () => {
  router.push('/analyzer')
}
</script> 