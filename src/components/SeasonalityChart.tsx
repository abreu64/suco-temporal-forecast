
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface SeasonalityChartProps {
  data: any[];
}

export const SeasonalityChart: React.FC<SeasonalityChartProps> = ({ data }) => {
  // Calcular dados sazonais
  const seasonalData = React.useMemo(() => {
    const monthlyAverages = {};
    
    data.forEach(item => {
      const month = parseInt(item.mes.split('-')[1]);
      if (!monthlyAverages[month]) {
        monthlyAverages[month] = { total: 0, count: 0 };
      }
      monthlyAverages[month].total += item.vendas;
      monthlyAverages[month].count += 1;
    });

    const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    
    return Object.keys(monthlyAverages).map(month => ({
      mes: monthNames[parseInt(month) - 1],
      mediaVendas: Math.round(monthlyAverages[month].total / monthlyAverages[month].count),
      monthNumber: parseInt(month)
    })).sort((a, b) => a.monthNumber - b.monthNumber);
  }, [data]);

  // Dados por trimestre
  const quarterlyData = React.useMemo(() => {
    const quarters = {
      'Q1 (Jan-Mar)': [],
      'Q2 (Abr-Jun)': [],
      'Q3 (Jul-Set)': [],
      'Q4 (Out-Dez)': []
    };

    data.forEach(item => {
      const month = parseInt(item.mes.split('-')[1]);
      if (month <= 3) quarters['Q1 (Jan-Mar)'].push(item.vendas);
      else if (month <= 6) quarters['Q2 (Abr-Jun)'].push(item.vendas);
      else if (month <= 9) quarters['Q3 (Jul-Set)'].push(item.vendas);
      else quarters['Q4 (Out-Dez)'].push(item.vendas);
    });

    return Object.entries(quarters).map(([quarter, sales]) => ({
      trimestre: quarter,
      mediaVendas: Math.round(sales.reduce((sum, val) => sum + val, 0) / sales.length),
      totalVendas: sales.reduce((sum, val) => sum + val, 0)
    }));
  }, [data]);

  const COLORS = ['#f97316', '#fb923c', '#fdba74', '#fed7aa'];

  return (
    <div className="space-y-8">
      {/* Gráfico de barras mensal */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Média de Vendas por Mês</h3>
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={seasonalData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="mes" stroke="#666" fontSize={12} />
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
                formatter={(value) => [`${value.toLocaleString()} L`, 'Média de Vendas']}
              />
              <Bar 
                dataKey="mediaVendas" 
                fill="#f97316"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfico de pizza trimestral */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Distribuição por Trimestre</h3>
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={quarterlyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  dataKey="totalVendas"
                  label={({ trimestre, percent }) => `${trimestre}: ${(percent * 100).toFixed(1)}%`}
                >
                  {quarterlyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value.toLocaleString()} L`, 'Total de Vendas']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Métricas sazonais */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Análise Sazonal</h3>
          <div className="space-y-4">
            {quarterlyData.map((quarter, index) => (
              <div key={quarter.trimestre} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{quarter.trimestre}</span>
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: COLORS[index] }}
                  ></div>
                </div>
                <div className="text-sm text-gray-600">
                  <div>Média: {quarter.mediaVendas.toLocaleString()} L</div>
                  <div>Total: {quarter.totalVendas.toLocaleString()} L</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
