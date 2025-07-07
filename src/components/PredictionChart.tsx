
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface PredictionChartProps {
  historicalData: any[];
  predictions: any[];
}

export const PredictionChart: React.FC<PredictionChartProps> = ({ historicalData, predictions }) => {
  // Combinar dados históricos com previsões
  const combinedData = React.useMemo(() => {
    const historical = historicalData.map(item => ({
      ...item,
      tipo: 'historico'
    }));

    const predicted = predictions.map(item => ({
      ...item,
      tipo: 'previsao'
    }));

    return [...historical, ...predicted];
  }, [historicalData, predictions]);

  const formatTooltip = (value: any, name: string) => {
    if (name === 'vendas') {
      return [`${value.toLocaleString()} L`, 'Vendas Reais'];
    }
    if (name === 'previsao') {
      return [`${value.toLocaleString()} L`, 'Previsão ML'];
    }
    if (name === 'limiteInferior') {
      return [`${value.toLocaleString()} L`, 'Limite Inferior'];
    }
    if (name === 'limiteSuperior') {
      return [`${value.toLocaleString()} L`, 'Limite Superior'];
    }
    return [value, name];
  };

  return (
    <div className="space-y-6">
      <div className="w-full h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={combinedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="mes" 
              stroke="#666"
              fontSize={12}
              tickFormatter={(value) => {
                const [year, month] = value.split('-');
                return `${month}/${year.slice(2)}`;
              }}
            />
            <YAxis 
              stroke="#666"
              fontSize={12}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #ccc',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              formatter={formatTooltip}
              labelFormatter={(label) => {
                const [year, month] = label.split('-');
                const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
                return `${monthNames[parseInt(month) - 1]} ${year}`;
              }}
            />
            
            {/* Linha de separação entre histórico e previsão */}
            <ReferenceLine 
              x="2023-12" 
              stroke="#666" 
              strokeDasharray="2 2" 
              label={{ value: "Início das Previsões", position: "top" }}
            />
            
            {/* Dados históricos */}
            <Line 
              type="monotone" 
              dataKey="vendas" 
              stroke="#f97316" 
              strokeWidth={3}
              dot={{ fill: '#f97316', strokeWidth: 2, r: 4 }}
              connectNulls={false}
            />
            
            {/* Previsões */}
            <Line 
              type="monotone" 
              dataKey="previsao" 
              stroke="#22c55e" 
              strokeWidth={3}
              strokeDasharray="5 5"
              dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
              connectNulls={false}
            />
            
            {/* Limites de confiança */}
            <Line 
              type="monotone" 
              dataKey="limiteSuperior" 
              stroke="#22c55e" 
              strokeWidth={1}
              strokeDasharray="2 2"
              dot={false}
              connectNulls={false}
            />
            <Line 
              type="monotone" 
              dataKey="limiteInferior" 
              stroke="#22c55e" 
              strokeWidth={1}
              strokeDasharray="2 2"
              dot={false}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Resumo das previsões */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <h4 className="font-semibold text-green-800 mb-2">Próximo Mês</h4>
          <p className="text-2xl font-bold text-green-700">
            {predictions[0]?.previsao?.toLocaleString()} L
          </p>
          <p className="text-sm text-green-600">
            ±{((predictions[0]?.limiteSuperior - predictions[0]?.limiteInferior) / 2)?.toLocaleString()} L
          </p>
        </div>
        
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-800 mb-2">Média Próximos 6 Meses</h4>
          <p className="text-2xl font-bold text-blue-700">
            {Math.round(predictions.slice(0, 6).reduce((sum, p) => sum + p.previsao, 0) / 6).toLocaleString()} L
          </p>
          <p className="text-sm text-blue-600">Projeção semestral</p>
        </div>
        
        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
          <h4 className="font-semibold text-purple-800 mb-2">Total Anual Previsto</h4>
          <p className="text-2xl font-bold text-purple-700">
            {Math.round(predictions.reduce((sum, p) => sum + p.previsao, 0)).toLocaleString()} L
          </p>
          <p className="text-sm text-purple-600">Projeção 12 meses</p>
        </div>
      </div>
    </div>
  );
};
