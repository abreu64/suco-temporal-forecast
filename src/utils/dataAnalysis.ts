
// Utilitários para análise de dados e machine learning

export const generateSalesData = () => {
  const data = [];
  const baseAmount = 20000; // 20K litros base
  
  // Gerar dados para 2022 e 2023 (24 meses)
  for (let year = 2022; year <= 2023; year++) {
    for (let month = 1; month <= 12; month++) {
      // Fator sazonal (verão brasileiro = dez-fev, pico de vendas)
      let seasonalFactor = 1;
      if (month >= 12 || month <= 2) {
        seasonalFactor = 1.4; // Verão - alta
      } else if (month >= 3 && month <= 5) {
        seasonalFactor = 1.1; // Outono - moderada
      } else if (month >= 6 && month <= 8) {
        seasonalFactor = 0.7; // Inverno - baixa
      } else {
        seasonalFactor = 1.2; // Primavera - moderada-alta
      }
      
      // Tendência de crescimento anual
      const growthFactor = year === 2022 ? 1 : 1.15;
      
      // Variação aleatória mensal (-15% a +15%)
      const randomFactor = 0.85 + Math.random() * 0.3;
      
      // Tendência mensal gradual
      const monthTrend = 1 + (month - 1) * 0.02;
      
      const sales = Math.round(
        baseAmount * seasonalFactor * growthFactor * randomFactor * monthTrend
      );
      
      data.push({
        mes: `${year}-${month.toString().padStart(2, '0')}`,
        vendas: sales,
        ano: year,
        mesNumero: month
      });
    }
  }
  
  // Adicionar linha de tendência
  return data.map((item, index) => ({
    ...item,
    tendencia: Math.round(baseAmount + (index * 150) + (Math.sin(index * 0.5) * 2000))
  }));
};

export const calculatePredictions = (historicalData: any[]) => {
  const predictions = [];
  const dataLength = historicalData.length;
  
  // Calcular componentes para suavização exponencial
  const alpha = 0.3; // Fator de suavização para nível
  const beta = 0.2;  // Fator de suavização para tendência
  const gamma = 0.4; // Fator de suavização para sazonalidade
  
  // Calcular médias móveis e componentes sazonais
  const seasonalPeriod = 12;
  const seasonalIndices = calculateSeasonalIndices(historicalData, seasonalPeriod);
  
  // Implementar Holt-Winters (suavização exponencial tripla)
  let level = historicalData.slice(0, 12).reduce((sum, item) => sum + item.vendas, 0) / 12;
  let trend = 0;
  
  // Calcular tendência inicial
  for (let i = 12; i < 24 && i < dataLength; i++) {
    trend += (historicalData[i].vendas - historicalData[i - 12].vendas) / 12;
  }
  trend = trend / Math.min(12, dataLength - 12);
  
  // Fazer previsões para os próximos 12 meses
  for (let h = 1; h <= 12; h++) {
    const seasonalIndex = seasonalIndices[(dataLength + h - 1) % seasonalPeriod];
    
    // Previsão usando Holt-Winters
    const forecast = (level + h * trend) * seasonalIndex;
    
    // Calcular intervalo de confiança (simulado)
    const standardError = forecast * 0.15; // 15% de erro padrão estimado
    const confidenceLevel = 1.96; // 95% de confiança
    
    const year = h <= 12 - (12 - new Date().getMonth()) ? 2024 : 2025;
    const month = ((new Date().getMonth() + h - 1) % 12) + 1;
    
    predictions.push({
      mes: `${year}-${month.toString().padStart(2, '0')}`,
      previsao: Math.round(forecast),
      limiteInferior: Math.round(forecast - confidenceLevel * standardError),
      limiteSuperior: Math.round(forecast + confidenceLevel * standardError),
      tipo: 'previsao'
    });
  }
  
  return predictions;
};

const calculateSeasonalIndices = (data: any[], period: number) => {
  const seasonalSums = new Array(period).fill(0);
  const seasonalCounts = new Array(period).fill(0);
  
  data.forEach((item, index) => {
    const seasonIndex = index % period;
    seasonalSums[seasonIndex] += item.vendas;
    seasonalCounts[seasonIndex]++;
  });
  
  // Calcular médias sazonais
  const seasonalAverages = seasonalSums.map((sum, index) => 
    seasonalCounts[index] > 0 ? sum / seasonalCounts[index] : 1
  );
  
  // Normalizar para que a média seja 1
  const overallAverage = seasonalAverages.reduce((sum, avg) => sum + avg, 0) / period;
  
  return seasonalAverages.map(avg => avg / overallAverage);
};

export const analyzeTrends = (data: any[]) => {
  if (!data.length) return null;
  
  const values = data.map(item => item.vendas);
  const n = values.length;
  
  // Calcular estatísticas básicas
  const sum = values.reduce((acc, val) => acc + val, 0);
  const mean = sum / n;
  
  // Calcular tendência linear usando regressão simples
  const xSum = (n * (n + 1)) / 2;
  const xySum = values.reduce((acc, val, index) => acc + val * (index + 1), 0);
  const xxSum = (n * (n + 1) * (2 * n + 1)) / 6;
  
  const slope = (n * xySum - sum * xSum) / (n * xxSum - xSum * xSum);
  
  // Calcular variabilidade
  const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / n;
  const standardDeviation = Math.sqrt(variance);
  const coefficientOfVariation = standardDeviation / mean;
  
  // Calcular crescimento ano a ano
  const firstYearAvg = data.slice(0, 12).reduce((sum, item) => sum + item.vendas, 0) / 12;
  const secondYearAvg = data.slice(12, 24).reduce((sum, item) => sum + item.vendas, 0) / 12;
  const yearOverYearGrowth = (secondYearAvg - firstYearAvg) / firstYearAvg;
  
  return {
    averageMonthly: Math.round(mean),
    overallTrend: slope,
    standardDeviation: Math.round(standardDeviation),
    coefficientOfVariation,
    yearOverYearGrowth,
    totalSales: sum,
    maxSales: Math.max(...values),
    minSales: Math.min(...values)
  };
};

// Função auxiliar para calcular médias móveis
export const calculateMovingAverage = (data: number[], window: number) => {
  const result = [];
  for (let i = window - 1; i < data.length; i++) {
    const sum = data.slice(i - window + 1, i + 1).reduce((acc, val) => acc + val, 0);
    result.push(sum / window);
  }
  return result;
};

// Função para detectar outliers usando Z-score
export const detectOutliers = (data: number[], threshold: number = 2) => {
  const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
  const std = Math.sqrt(data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length);
  
  return data.map((value, index) => ({
    index,
    value,
    zScore: (value - mean) / std,
    isOutlier: Math.abs((value - mean) / std) > threshold
  }));
};
