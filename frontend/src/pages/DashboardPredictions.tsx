import { useState, useEffect } from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TrendingUp, Target, Calendar, Activity, BarChart3, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getInventoryAdmin, getHospitalsAdmin, getMedicinesAdmin, apiRequest } from '@/lib/api';

const DashboardPredictions = () => {
  const [loading, setLoading] = useState(true);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    highRisk: 0,
    criticalRisk: 0,
    lowRisk: 0,
    inventoryCount: 0,
  });
  const { toast } = useToast();

  const fetchPredictions = async () => {
    try {
      setLoading(true);
      // 1. Fetch Inventory Data first
      const inventory = await getInventoryAdmin();
      const medicines = await getMedicinesAdmin();
      const hospitals = await getHospitalsAdmin();

      if (!Array.isArray(inventory) || inventory.length === 0) {
        setLoading(false);
        return;
      }

      // Map IDs to details for the prediction payload
      const payload = inventory.map(item => ({
        medicine_id: item.medicine,
        hospital_id: item.hospital,
        current_stock: item.current_stock,
        // Prevent 0 daily consumption which might cause model issues (division by zero)
        daily_consumption: item.average_daily_usage > 0 ? item.average_daily_usage : 1,
        reorder_level: item.reorder_level
      }));

      console.log('Sending Prediction Payload:', payload); // Debug log
      const response = await apiRequest<any>('/api/predictions/batch-predict/', {
        method: 'POST',
        body: JSON.stringify({ inventories: payload }),
      });

      if (response.success && response.predictions) {
        // Enrich predictions with names
        const enrichedPredictions = response.predictions.map((p: any) => {
          const med = medicines.find(m => m.id === p.medicine_id);
          const hosp = hospitals.find(h => h.id === p.hospital_id);
          return {
            ...p,
            medicine_name: med ? med.name : `Medicine ${p.medicine_id}`,
            hospital_name: hosp ? hosp.name : `Hospital ${p.hospital_id}`,
          };
        });

        setPredictions(enrichedPredictions);
        setStats({
          total: response.total_predictions,
          highRisk: response.risk_summary.HIGH,
          criticalRisk: response.risk_summary.CRITICAL,
          lowRisk: response.risk_summary.LOW,
          inventoryCount: inventory.length,
        });
      }

    } catch (error) {
      console.error('Error fetching predictions:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate predictions. Ensure backend ML service is running.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPredictions();
  }, []);

  const riskData = [
    { name: 'Low', count: stats.lowRisk, fill: '#22c55e' },
    { name: 'High', count: stats.highRisk, fill: '#f97316' },
    { name: 'Critical', count: stats.criticalRisk, fill: '#ef4444' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Shortage Predictions</h1>
          <p className="text-muted-foreground">
            AI-powered drug shortage forecasts with risk analysis
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-primary/10">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Predictions</p>
                  <p className="text-xl font-bold text-foreground">{loading ? '...' : stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-destructive/10">
                  <Target className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Critical Risk</p>
                  <p className="text-xl font-bold text-destructive">{loading ? '...' : stats.criticalRisk}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-orange-500/10">
                  <Calendar className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">High Risk</p>
                  <p className="text-xl font-bold text-orange-500">{loading ? '...' : stats.highRisk}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="bg-card border-border col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Risk Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                {loading ? (
                  <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin" /></div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={riskData}>
                      <XAxis dataKey="name" />
                      <YAxis allowDecimals={false} />
                      <Tooltip
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                      />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Prediction Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Medicine</TableHead>
                  <TableHead>Hospital</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead>Confidence</TableHead>
                  <TableHead>Recommendation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                    </TableCell>
                  </TableRow>
                ) : predictions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 mx-auto text-muted-foreground">
                      {stats.total === 0 && loading === false ? (
                        stats.inventoryCount === 0
                          ? "No inventory found. Go to Inventory page to add stock."
                          : "No predictions returned from model."
                      ) : "No data available"}
                    </TableCell>
                  </TableRow>
                ) : (
                  predictions.map((p, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{p.medicine_name}</TableCell>
                      <TableCell>{p.hospital_name}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${p.risk_level === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                          p.risk_level === 'HIGH' ? 'bg-orange-100 text-orange-700' :
                            p.risk_level === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                          }`}>
                          {p.risk_level}
                        </span>
                      </TableCell>
                      <TableCell>{(p.confidence * 100).toFixed(1)}%</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{p.recommendation}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPredictions;
