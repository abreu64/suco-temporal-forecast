
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, BarChart3, Target } from "lucide-react";

interface MetricsCardsProps {
  salesData: any[];
  trends: any;
}

export const MetricsCards: React.FC<MetricsCardsProps> = ({ salesData, trends }) => {
  if (!salesData.length || !trends) return null;

  const totalSales = salesData.reduce((sum, item) => sum + item.vendas, 0);
  const averageMonthlySales = totalSales / salesData.length;
  const lastMonthSales = salesData[salesData.length - 1]?.vendas || 0;
  const previousMonthSales = salesData[salesData.length - 2]?.vendas || 0;
  const monthlyGrowth = ((lastMonthSales - previousMonthSales) / previousMonthSales) * 100;

  const maxSales = Math.max(...salesData.map(item => item.vendas));
  const minSales = Math.min(...salesData.map(item => item.vendas));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="bg-gradient-to-br from-orange-500 to-yellow-500 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Vendas</CardTitle>
          <BarChart3 className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalSales.toLocaleString()} L</div>
          <p className="text-xs opacity-90">24 meses de dados</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Média Mensal</CardTitle>
          <Target className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{Math.round(averageMonthlySales).toLocaleString()} L</div>
          <p className="text-xs opacity-90">Média dos 24 meses</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-500 to-emerald-500 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Crescimento Mensal</CardTitle>
          {monthlyGrowth >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {monthlyGrowth >= 0 ? '+' : ''}{monthlyGrowth.toFixed(1)}%
          </div>
          <p className="text-xs opacity-90">Último mês vs anterior</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Variação</CardTitle>
          <BarChart3 className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{((maxSales - minSales) / 1000).toFixed(0)}K L</div>
          <p className="text-xs opacity-90">Max: {(maxSales/1000).toFixed(0)}K - Min: {(minSales/1000).toFixed(0)}K</p>
        </CardContent>
      </Card>
    </div>
  );
};
