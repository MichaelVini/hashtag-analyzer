import type { TimeSeriesData } from '~/mocks/hashtags'
import { formatNumber } from './formatters'

interface ChartColors {
  borderColor: string
  backgroundColor: string
  textColor: string
  isDark: boolean
}

export function getChartColors(): ChartColors {
  const colorMode = useColorMode()
  const isDark = colorMode.value === 'dark'

  return {
    borderColor: '#00DC82',
    backgroundColor: isDark ? 'rgba(0, 220, 130, 0.1)' : 'rgba(0, 220, 130, 0.15)',
    textColor: isDark ? '#fff' : '#18181b',
    isDark
  }
}

export function createChartConfig(data: TimeSeriesData[], title: string) {
  const colors = getChartColors()

  return {
    type: 'line',
    data: {
      labels: data.map(item => item.date),
      datasets: [{
        label: 'Menções',
        data: data.map(item => item.mentions),
        borderColor: colors.borderColor,
        backgroundColor: colors.backgroundColor,
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: colors.borderColor,
        pointBorderColor: colors.borderColor,
        pointHoverBackgroundColor: colors.borderColor,
        pointHoverBorderColor: colors.borderColor,
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: title,
          color: colors.textColor,
          font: {
            size: 16,
            weight: 'bold'
          }
        },
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
      },
      interaction: {
        intersect: false,
        mode: 'index'
      }
    }
  }
} 