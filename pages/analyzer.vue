<template>
  <div>
    <div class="fixed top-4 right-4 flex gap-2">
      <UButton
        icon="i-heroicons-arrow-path"
        color="gray"
        variant="ghost"
        @click="toggleVersion"
      >
        {{ isOfficialVersion ? 'Demo' : 'Oficial' }}
      </UButton>
      <UButton
        icon="i-heroicons-moon"
        color="gray"
        variant="ghost"
        @click="toggleColorMode"
      />
    </div>
    <UContainer class="min-h-screen flex items-start justify-center pt-6">
      <HashtagAnalyzer v-if="!isOfficialVersion" />
      <HashtagAnalyzerOfficial v-else />
    </UContainer>
  </div>
</template>

<script setup>
const colorMode = useColorMode()
const isOfficialVersion = ref(false)

const toggleColorMode = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

const toggleVersion = () => {
  isOfficialVersion.value = !isOfficialVersion.value
}
</script> 