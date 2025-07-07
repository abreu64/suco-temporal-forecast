
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Calendar, BarChart3, Zap } from "lucide-react";
import { TimeSeriesChart } from "@/components/TimeSeriesChart";
import { SeasonalityChart } from "@/components/SeasonalityChart";
import { PredictionChart } from "@/components/PredictionChart";
import { MetricsCards } from "@/components/MetricsCards";
import { generateSalesData, calculatePredictions, analyzeTrends } from "@/utils/dataAnalysis";

const Index = () => {
  const [salesData, setSalesData] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [trends, setTrends] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      const data = generateSalesData();
      const predictionsData = calculatePredictions(data);
      const trendsData = analyzeTrends(data);
      
      setSalesData(data);
      setPredictions(predictionsData);
      setTrends(trendsData);
      setIsLoading(false);
    }, 1500);
  }, []);

  const handleRegenerateData = () => {
    setIsLoading(true);
    setTimeout(() => {
      const data = generateSalesData();
      const predictionsData = calculatePredictions(data);
      const trendsData = analyzeTrends(data);
      
      setSalesData(data);
      setPredictions(predictionsData);
      setTrends(trendsData);
      setIsLoading(false);
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-orange-300 border-t-orange-600 rounded-full animate-spin mx-auto"></div>
          <h2 className="text-2xl font-bold text-orange-800">Carregando Análises</h2>
          <p className="text-orange-600">Processando dados de vendas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
              Análise de Vendas - Suco de Laranja
            </h1>
          </div>
          <p className="text-lg text-gray-600 mb-4">
            Análise de Séries Temporais com Machine Learning para Previsão de Vendas
          </p>
          <div className="flex items-center justify-center gap-4">
            <Badge variant="secondary" className="bg-orange-100 text-orange-800">
              <Calendar className="w-4 h-4 mr-1" />
              24 Meses de Dados
            </Badge>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <TrendingUp className="w-4 h-4 mr-1" />
              ML Predictions
            </Badge>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              <Zap className="w-4 h-4 mr-1" />
              Análise em Tempo Real
            </Badge>
          </div>
        </div>

        {/* Metrics Cards */}
        <MetricsCards salesData={salesData} trends={trends} />

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="grid w-full max-w-md grid-cols-4 bg-white shadow-sm">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="trends">Tendências</TabsTrigger>
              <TabsTrigger value="seasonal">Sazonalidade</TabsTrigger>
              <TabsTrigger value="predictions">Previsões</TabsTrigger>
            </TabsList>
            <Button 
              onClick={handleRegenerateData}
              className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
            >
              Gerar Novos Dados
            </Button>
          </div>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-orange-600" />
                  Série Temporal Completa - Vendas Mensais
                </CardTitle>
                <CardDescription>
                  Visualização completa dos dados históricos de vendas (2022-2023) com linha de tendência
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TimeSeriesChart data={salesData} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Análise de Tendências</CardTitle>
                  <CardDescription>
                    Decomposição da série temporal em componentes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TimeSeriesChart data={salesData} showTrend={true} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Métricas de Tendência</CardTitle>
                  <CardDescription>
                    Indicadores estatísticos da série temporal
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {trends && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">Tendência Geral:</span>
                        <Badge variant={trends.overallTrend > 0 ? "default" : "destructive"}>
                          {trends.overallTrend > 0 ? "Crescimento" : "Declínio"}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">Média Mensal:</span>
                        <span className="font-bold text-lg">{trends.averageMonthly.toLocaleString()} L</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">Variação (CV):</span>
                        <span className="font-bold">{(trends.coefficientOfVariation * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">Crescimento Anual:</span>
                        <span className="font-bold text-green-600">+{(trends.yearOverYearGrowth * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="seasonal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Análise de Sazonalidade</CardTitle>
                <CardDescription>
                  Padrões sazonais nas vendas ao longo do ano
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SeasonalityChart data={salesData} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="predictions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Previsões de Machine Learning
                </CardTitle>
                <CardDescription>
                  Previsões para os próximos 12 meses usando algoritmos de suavização exponencial
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PredictionChart historicalData={salesData} predictions={predictions} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
