/**
 * Formata números grandes para uma representação mais legível
 * @param num Número a ser formatado
 * @returns String formatada (ex: 1.2M, 500K)
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

/**
 * Formata uma data para o formato brasileiro
 * @param date Data a ser formatada
 * @returns String no formato dd/mm/yyyy
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('pt-BR')
}

/**
 * Formata uma porcentagem
 * @param value Valor a ser formatado
 * @param decimals Número de casas decimais
 * @returns String formatada com o símbolo de porcentagem
 */
export function formatPercentage(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`
} 