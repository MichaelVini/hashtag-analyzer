export interface HashtagData {
  tag: string
  mentions: number
  growth: number
  bestTime: string
  engagement: number
  relatedTopics: string[]
  weeklyData: TimeSeriesData[]
  monthlyData: TimeSeriesData[]
  yearlyData: TimeSeriesData[]
}

export interface TimeSeriesData {
  date: string
  mentions: number
}

export const mockHashtags: HashtagData[] = [
  { 
    tag: 'educação',
    mentions: 3456789,
    growth: 12.5,
    bestTime: '14:00 - 16:00',
    engagement: 4.2,
    relatedTopics: ['ensino', 'escola', 'aprendizagem', 'professor'],
    weeklyData: [
      { date: '25/03', mentions: 115000 },
      { date: '26/03', mentions: 118000 },
      { date: '27/03', mentions: 122000 },
      { date: '28/03', mentions: 125000 },
      { date: '29/03', mentions: 128000 },
      { date: '30/03', mentions: 130000 },
      { date: '31/03', mentions: 135000 }
    ],
    monthlyData: [
      { date: '01/03', mentions: 95000 },
      { date: '05/03', mentions: 102000 },
      { date: '10/03', mentions: 98000 },
      { date: '15/03', mentions: 115000 },
      { date: '20/03', mentions: 125000 },
      { date: '25/03', mentions: 118000 },
      { date: '31/03', mentions: 130000 }
    ],
    yearlyData: [
      { date: 'Jan', mentions: 850000 },
      { date: 'Fev', mentions: 920000 },
      { date: 'Mar', mentions: 980000 },
      { date: 'Abr', mentions: 1050000 },
      { date: 'Mai', mentions: 1150000 },
      { date: 'Jun', mentions: 1250000 },
      { date: 'Jul', mentions: 1350000 },
      { date: 'Ago', mentions: 1450000 },
      { date: 'Set', mentions: 1550000 },
      { date: 'Out', mentions: 1650000 },
      { date: 'Nov', mentions: 1750000 },
      { date: 'Dez', mentions: 1850000 }
    ]
  },
  { 
    tag: 'ensino',
    mentions: 2345678,
    growth: 8.3,
    bestTime: '10:00 - 12:00',
    engagement: 3.8,
    relatedTopics: ['educação', 'escola', 'professor', 'aula'],
    weeklyData: [
      { date: '25/03', mentions: 75000 },
      { date: '26/03', mentions: 78000 },
      { date: '27/03', mentions: 82000 },
      { date: '28/03', mentions: 85000 },
      { date: '29/03', mentions: 88000 },
      { date: '30/03', mentions: 92000 },
      { date: '31/03', mentions: 95000 }
    ],
    monthlyData: [
      { date: '01/03', mentions: 75000 },
      { date: '05/03', mentions: 78000 },
      { date: '10/03', mentions: 82000 },
      { date: '15/03', mentions: 85000 },
      { date: '20/03', mentions: 88000 },
      { date: '25/03', mentions: 92000 },
      { date: '31/03', mentions: 95000 }
    ],
    yearlyData: [
      { date: 'Jan', mentions: 650000 },
      { date: 'Fev', mentions: 720000 },
      { date: 'Mar', mentions: 780000 },
      { date: 'Abr', mentions: 850000 },
      { date: 'Mai', mentions: 950000 },
      { date: 'Jun', mentions: 1050000 },
      { date: 'Jul', mentions: 1150000 },
      { date: 'Ago', mentions: 1250000 },
      { date: 'Set', mentions: 1350000 },
      { date: 'Out', mentions: 1450000 },
      { date: 'Nov', mentions: 1550000 },
      { date: 'Dez', mentions: 1650000 }
    ]
  },
  {
    tag: 'educacaoinfantil',
    mentions: 890000,
    growth: 12.5,
    bestTime: '09:00 - 11:00',
    engagement: 4.2,
    relatedTopics: ['alfabetização', 'criança', 'brincar', 'maternal'],
    weeklyData: [
      { date: '25/03', mentions: 25000 },
      { date: '26/03', mentions: 27000 },
      { date: '27/03', mentions: 28500 },
      { date: '28/03', mentions: 30000 },
      { date: '29/03', mentions: 32000 },
      { date: '30/03', mentions: 33500 },
      { date: '31/03', mentions: 35000 }
    ],
    monthlyData: [
      { date: '01/03', mentions: 95000 },
      { date: '05/03', mentions: 98000 },
      { date: '10/03', mentions: 102000 },
      { date: '15/03', mentions: 105000 },
      { date: '20/03', mentions: 108000 },
      { date: '25/03', mentions: 112000 },
      { date: '31/03', mentions: 115000 }
    ],
    yearlyData: generateYearlyData(650000, 890000)
  },
  {
    tag: 'alfabetizacao',
    mentions: 750000,
    growth: 9.8,
    bestTime: '14:00 - 16:00',
    engagement: 3.9,
    relatedTopics: ['educacaoinfantil', 'leitura', 'escrita', 'letramento'],
    weeklyData: [
      { date: '25/03', mentions: 20000 },
      { date: '26/03', mentions: 21500 },
      { date: '27/03', mentions: 22800 },
      { date: '28/03', mentions: 24000 },
      { date: '29/03', mentions: 25500 },
      { date: '30/03', mentions: 26800 },
      { date: '31/03', mentions: 28000 }
    ],
    monthlyData: [
      { date: '01/03', mentions: 85000 },
      { date: '05/03', mentions: 87000 },
      { date: '10/03', mentions: 89000 },
      { date: '15/03', mentions: 92000 },
      { date: '20/03', mentions: 94000 },
      { date: '25/03', mentions: 96000 },
      { date: '31/03', mentions: 98000 }
    ],
    yearlyData: generateYearlyData(550000, 750000)
  },
  {
    tag: 'ensinofundamental',
    mentions: 980000,
    growth: 7.2,
    bestTime: '13:00 - 15:00',
    engagement: 3.5,
    relatedTopics: ['escola', 'professor', 'aprendizagem', 'matematica'],
    weeklyData: [
      { date: '25/03', mentions: 28000 },
      { date: '26/03', mentions: 29500 },
      { date: '27/03', mentions: 31000 },
      { date: '28/03', mentions: 32500 },
      { date: '29/03', mentions: 34000 },
      { date: '30/03', mentions: 35500 },
      { date: '31/03', mentions: 37000 }
    ],
    monthlyData: [
      { date: '01/03', mentions: 105000 },
      { date: '05/03', mentions: 108000 },
      { date: '10/03', mentions: 112000 },
      { date: '15/03', mentions: 115000 },
      { date: '20/03', mentions: 118000 },
      { date: '25/03', mentions: 122000 },
      { date: '31/03', mentions: 125000 }
    ],
    yearlyData: generateYearlyData(720000, 980000)
  },
  {
    tag: 'materialdidatico',
    mentions: 420000,
    growth: 15.3,
    bestTime: '10:00 - 12:00',
    engagement: 4.7,
    relatedTopics: ['educacao', 'escola', 'professor', 'atividades'],
    weeklyData: [
      { date: '25/03', mentions: 15000 },
      { date: '26/03', mentions: 16200 },
      { date: '27/03', mentions: 17400 },
      { date: '28/03', mentions: 18600 },
      { date: '29/03', mentions: 19800 },
      { date: '30/03', mentions: 21000 },
      { date: '31/03', mentions: 22200 }
    ],
    monthlyData: [
      { date: '01/03', mentions: 65000 },
      { date: '05/03', mentions: 68000 },
      { date: '10/03', mentions: 72000 },
      { date: '15/03', mentions: 75000 },
      { date: '20/03', mentions: 78000 },
      { date: '25/03', mentions: 82000 },
      { date: '31/03', mentions: 85000 }
    ],
    yearlyData: generateYearlyData(280000, 420000)
  },
  {
    tag: 'educacao',
    mentions: 1250000,
    growth: 11.2,
    bestTime: '10:00 - 12:00',
    engagement: 4.5,
    relatedTopics: ['ensino', 'escola', 'professor', 'aprendizagem'],
    weeklyData: [
      { date: '25/03', mentions: 35000 },
      { date: '26/03', mentions: 37500 },
      { date: '27/03', mentions: 39000 },
      { date: '28/03', mentions: 41000 },
      { date: '29/03', mentions: 43000 },
      { date: '30/03', mentions: 45000 },
      { date: '31/03', mentions: 47000 }
    ],
    monthlyData: [
      { date: '01/03', mentions: 115000 },
      { date: '05/03', mentions: 118000 },
      { date: '10/03', mentions: 122000 },
      { date: '15/03', mentions: 125000 },
      { date: '20/03', mentions: 128000 },
      { date: '25/03', mentions: 132000 },
      { date: '31/03', mentions: 135000 }
    ],
    yearlyData: generateYearlyData(850000, 1250000)
  },
  {
    tag: 'educaçao',
    mentions: 320000,
    growth: 5.8,
    bestTime: '09:00 - 11:00',
    engagement: 3.2,
    relatedTopics: ['ensino', 'escola', 'educacao', 'professor'],
    weeklyData: [
      { date: '25/03', mentions: 8000 },
      { date: '26/03', mentions: 8500 },
      { date: '27/03', mentions: 9000 },
      { date: '28/03', mentions: 9500 },
      { date: '29/03', mentions: 10000 },
      { date: '30/03', mentions: 10500 },
      { date: '31/03', mentions: 11000 }
    ],
    monthlyData: [
      { date: '01/03', mentions: 25000 },
      { date: '05/03', mentions: 27000 },
      { date: '10/03', mentions: 29000 },
      { date: '15/03', mentions: 31000 },
      { date: '20/03', mentions: 33000 },
      { date: '25/03', mentions: 35000 },
      { date: '31/03', mentions: 37000 }
    ],
    yearlyData: generateYearlyData(220000, 320000)
  }
]

// Função auxiliar para gerar dados anuais com crescimento progressivo
function generateYearlyData(startValue: number, endValue: number) {
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
  const increment = (endValue - startValue) / 11
  
  return months.map((month, index) => ({
    date: month,
    mentions: Math.round(startValue + (increment * index))
  }))
} 