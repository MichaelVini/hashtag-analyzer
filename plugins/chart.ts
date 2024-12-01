import { Chart, registerables } from 'chart.js'

// Registra todos os componentes necessários do Chart.js
Chart.register(...registerables)

export default defineNuxtPlugin(() => {}) 