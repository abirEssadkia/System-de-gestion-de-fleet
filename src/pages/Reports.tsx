
import React, { useState } from 'react';
import { Navbar } from '@/components/dashboard/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, FileText, RefreshCw, TrendingUp, AlertTriangle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { OverspeedCharts } from '@/components/reports/OverspeedCharts';

interface OverspeedData {
  range: string;
  vehicle_count: number;
  percentage: number;
}

const Reports = () => {
  const [dateFrom, setDateFrom] = useState(new Date().toISOString().split('T')[0]);
  const [dateTo, setDateTo] = useState(new Date().toISOString().split('T')[0]);
  const [speedLimit, setSpeedLimit] = useState('80');
  const [isGenerating, setIsGenerating] = useState(false);
  const [overspeedData, setOverspeedData] = useState<OverspeedData[]>([]);
  const { toast } = useToast();

  // Fetch recent positions for dashboard stats
  const { data: recentPositions } = useQuery({
    queryKey: ['recent-positions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('positions')
        .select('*')
        .order('server_time', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch overspeed reports count
  const { data: overspeedCount } = useQuery({
    queryKey: ['overspeed-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('overspeed_reports')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      return count || 0;
    },
  });

  const handleSyncData = async () => {
    try {
      setIsGenerating(true);
      const { data, error } = await supabase.functions.invoke('sync-pinme-data');
      
      if (error) throw error;
      
      toast({
        title: "Synchronisation réussie",
        description: "Les données PinMe.io ont été synchronisées avec succès.",
      });
    } catch (error) {
      console.error('Error syncing data:', error);
      toast({
        title: "Erreur de synchronisation",
        description: "Impossible de synchroniser les données PinMe.io.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateReport = async () => {
    try {
      setIsGenerating(true);
      const { data, error } = await supabase.functions.invoke('overspeed-reports', {
        body: new URLSearchParams({
          from: dateFrom,
          to: dateTo,
          speedLimit: speedLimit
        }).toString(),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      });
      
      if (error) throw error;
      
      setOverspeedData(data || []);
      toast({
        title: "Rapport généré",
        description: "Le rapport de dépassement de vitesse a été généré avec succès.",
      });
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: "Erreur de génération",
        description: "Impossible de générer le rapport.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      const response = await fetch(`https://qgtidoblhycdzajcpxwyo.supabase.co/functions/v1/generate-pdf-report?from=${dateFrom}&to=${dateTo}`, {
        headers: {
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFndGlkb2JoeWNkemFqY3B4d3lvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0MzkyNjksImV4cCI6MjA2MjAxNTI2OX0.-WNvw9pHQ7D-KiPneX9MQCkaDkdDptoHhsnn2lprsy0`,
        }
      });
      
      if (!response.ok) throw new Error('Failed to generate PDF');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `rapport-vitesse-${dateFrom}-${dateTo}.html`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Export réussi",
        description: "Le rapport PDF a été téléchargé avec succès.",
      });
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast({
        title: "Erreur d'export",
        description: "Impossible d'exporter le rapport PDF.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-fleet-gray">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-fleet-navy">Rapports de Dépassement de Vitesse</h1>
          <p className="text-fleet-dark-gray">Génération et analyse des rapports de vitesse avec intégration PinMe.io</p>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Positions Récentes</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recentPositions?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Positions synchronisées</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Infractions Vitesse</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overspeedCount}</div>
              <p className="text-xs text-muted-foreground">Total enregistré</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Synchronisation</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleSyncData} 
                disabled={isGenerating}
                className="w-full"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Synchroniser PinMe.io
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="generate" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="generate">Générer Rapport</TabsTrigger>
            <TabsTrigger value="analysis">Analyse</TabsTrigger>
          </TabsList>
          
          <TabsContent value="generate" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres du Rapport</CardTitle>
                <CardDescription>
                  Configurez les paramètres pour générer votre rapport de dépassement de vitesse
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateFrom">Date de début</Label>
                    <Input
                      id="dateFrom"
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dateTo">Date de fin</Label>
                    <Input
                      id="dateTo"
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="speedLimit">Limite de vitesse (km/h)</Label>
                    <Input
                      id="speedLimit"
                      type="number"
                      value={speedLimit}
                      onChange={(e) => setSpeedLimit(e.target.value)}
                      placeholder="80"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    onClick={handleGenerateReport} 
                    disabled={isGenerating}
                    className="flex-1"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    {isGenerating ? 'Génération...' : 'Générer Rapport'}
                  </Button>
                  
                  <Button 
                    onClick={handleExportPDF} 
                    variant="outline"
                    disabled={overspeedData.length === 0}
                    className="flex-1"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Exporter PDF
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Use the new OverspeedCharts component */}
            {overspeedData.length > 0 && (
              <OverspeedCharts data={overspeedData} />
            )}
          </TabsContent>

          <TabsContent value="analysis">
            <Card>
              <CardHeader>
                <CardTitle>Analyse des Données</CardTitle>
                <CardDescription>
                  Statistiques détaillées sur les dépassements de vitesse
                </CardDescription>
              </CardHeader>
              <CardContent>
                {overspeedData.length > 0 ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {overspeedData.map((range, index) => (
                        <Card key={index}>
                          <CardContent className="pt-6">
                            <div className="text-2xl font-bold">{range.vehicle_count}</div>
                            <p className="text-xs text-muted-foreground">{range.range}</p>
                            <p className="text-sm text-green-600">{range.percentage}%</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    Générez d'abord un rapport pour voir l'analyse des données
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Reports;
