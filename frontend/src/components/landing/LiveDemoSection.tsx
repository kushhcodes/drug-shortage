import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import {
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Building2,
  Pill,
  Activity,
  RefreshCw,
} from 'lucide-react';

// Demo data for showcasing the system
const inventoryTrendData = [
  { month: 'Jan', stock: 4200, consumption: 3800, reorder: 1000 },
  { month: 'Feb', stock: 3800, consumption: 4100, reorder: 1500 },
  { month: 'Mar', stock: 3200, consumption: 3900, reorder: 2000 },
  { month: 'Apr', stock: 4500, consumption: 4200, reorder: 800 },
  { month: 'May', stock: 4100, consumption: 4500, reorder: 1200 },
  { month: 'Jun', stock: 3600, consumption: 4000, reorder: 1800 },
];

const shortagePredictions = [
  { medicine: 'Amoxicillin', risk: 85, daysUntil: 3, trend: 'critical' },
  { medicine: 'Paracetamol', risk: 72, daysUntil: 5, trend: 'high' },
  { medicine: 'Insulin', risk: 45, daysUntil: 12, trend: 'medium' },
  { medicine: 'Metformin', risk: 30, daysUntil: 18, trend: 'low' },
];

const categoryDistribution = [
  { name: 'Antibiotics', value: 25, fill: 'hsl(var(--chart-1))' },
  { name: 'Analgesics', value: 20, fill: 'hsl(var(--chart-2))' },
  { name: 'Cardiovascular', value: 18, fill: 'hsl(var(--chart-3))' },
  { name: 'Diabetes', value: 15, fill: 'hsl(var(--chart-4))' },
  { name: 'Other', value: 22, fill: 'hsl(var(--chart-5))' },
];

const hospitals = [
  { id: 1, name: 'City General Hospital', location: 'Downtown', alerts: 3, status: 'warning' },
  { id: 2, name: 'Regional Medical Center', location: 'North District', alerts: 1, status: 'good' },
  { id: 3, name: 'Children\'s Hospital', location: 'East Side', alerts: 5, status: 'critical' },
  { id: 4, name: 'University Hospital', location: 'Campus Area', alerts: 0, status: 'good' },
];

const alertsData = [
  { id: 1, medicine: 'Amoxicillin 500mg', hospital: 'City General', stock: 45, threshold: 100, severity: 'critical' },
  { id: 2, medicine: 'Insulin Glargine', hospital: 'Children\'s Hospital', stock: 23, threshold: 50, severity: 'critical' },
  { id: 3, medicine: 'Paracetamol 500mg', hospital: 'Regional Medical', stock: 180, threshold: 200, severity: 'warning' },
  { id: 4, medicine: 'Metformin 850mg', hospital: 'City General', stock: 95, threshold: 150, severity: 'warning' },
];

const LiveDemoSection = () => {
  const [selectedHospital, setSelectedHospital] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const filteredAlerts = selectedHospital === 'all'
    ? alertsData
    : alertsData.filter(a => a.hospital.includes(selectedHospital));

  return (
    <section id="demo" className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <Badge variant="outline" className="mb-4">Interactive Demo</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Live Dashboard Preview
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Experience our drug shortage prediction system in action. This demo showcases
            real-time analytics, predictive insights, and smart alerts that help hospitals
            prevent medicine stockouts.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Hospital Filter Bar */}
          <Card className="mb-8 bg-background border-border">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Building2 className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">Hospital Filter</p>
                    <p className="text-sm text-muted-foreground">Select a hospital to filter data</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <Select value={selectedHospital} onValueChange={setSelectedHospital}>
                    <SelectTrigger className="w-full md:w-[250px] bg-card">
                      <SelectValue placeholder="All Hospitals" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="all">All Hospitals</SelectItem>
                      {hospitals.map(h => (
                        <SelectItem key={h.id} value={h.name}>{h.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleRefresh}
                    className={isRefreshing ? 'animate-spin' : ''}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-background border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Medicines</p>
                    <p className="text-2xl font-bold text-foreground">1,247</p>
                  </div>
                  <Pill className="h-8 w-8 text-primary opacity-50" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-background border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Alerts</p>
                    <p className="text-2xl font-bold text-destructive">9</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-destructive opacity-50" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-background border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Hospitals</p>
                    <p className="text-2xl font-bold text-foreground">4</p>
                  </div>
                  <Building2 className="h-8 w-8 text-primary opacity-50" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-background border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Prediction Accuracy</p>
                    <p className="text-2xl font-bold text-primary">94.8%</p>
                  </div>
                  <Activity className="h-8 w-8 text-primary opacity-50" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Charts */}
          <Tabs defaultValue="overview" className="mb-8">
            <TabsList className="mb-6 bg-muted/30">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="predictions">Predictions</TabsTrigger>
              <TabsTrigger value="alerts">Alerts</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="bg-background border-border">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      Inventory Trends
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={280}>
                      <AreaChart data={inventoryTrendData}>
                        <defs>
                          <linearGradient id="stockGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="month" className="text-muted-foreground" />
                        <YAxis className="text-muted-foreground" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="stock"
                          stroke="hsl(var(--chart-1))"
                          fill="url(#stockGradient)"
                          strokeWidth={2}
                        />
                        <Line
                          type="monotone"
                          dataKey="consumption"
                          stroke="hsl(var(--chart-2))"
                          strokeWidth={2}
                          dot={false}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="bg-background border-border">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Pill className="h-5 w-5 text-primary" />
                      Medicine Categories
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={280}>
                      <PieChart>
                        <Pie
                          data={categoryDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={2}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {categoryDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="predictions" className="space-y-6">
              <Card className="bg-background border-border">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingDown className="h-5 w-5 text-destructive" />
                    Shortage Risk Predictions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {shortagePredictions.map((pred, index) => (
                      <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-card border border-border">
                        <div className="flex items-center gap-4">
                          <div className={`w-3 h-3 rounded-full ${pred.trend === 'critical' ? 'bg-destructive' :
                              pred.trend === 'high' ? 'bg-orange-500' :
                                pred.trend === 'medium' ? 'bg-yellow-500' :
                                  'bg-green-500'
                            }`} />
                          <div>
                            <p className="font-medium text-foreground">{pred.medicine}</p>
                            <p className="text-sm text-muted-foreground">
                              Shortage in ~{pred.daysUntil} days
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-foreground">{pred.risk}%</p>
                          <Badge variant={pred.trend === 'critical' ? 'destructive' : 'secondary'}>
                            {pred.trend.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6">
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={shortagePredictions}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="medicine" className="text-muted-foreground" />
                        <YAxis className="text-muted-foreground" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                        />
                        <Bar dataKey="risk" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="alerts" className="space-y-6">
              <Card className="bg-background border-border">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    Low Stock Alerts {selectedHospital !== 'all' && `- ${selectedHospital}`}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left p-3 text-muted-foreground font-medium">Medicine</th>
                          <th className="text-left p-3 text-muted-foreground font-medium">Hospital</th>
                          <th className="text-left p-3 text-muted-foreground font-medium">Current Stock</th>
                          <th className="text-left p-3 text-muted-foreground font-medium">Threshold</th>
                          <th className="text-left p-3 text-muted-foreground font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAlerts.map((alert) => (
                          <tr key={alert.id} className="border-b border-border/50 hover:bg-muted/20">
                            <td className="p-3 font-medium text-foreground">{alert.medicine}</td>
                            <td className="p-3 text-muted-foreground">{alert.hospital}</td>
                            <td className="p-3 text-foreground">{alert.stock} units</td>
                            <td className="p-3 text-muted-foreground">{alert.threshold} units</td>
                            <td className="p-3">
                              <Badge variant={alert.severity === 'critical' ? 'destructive' : 'secondary'}>
                                {alert.severity.toUpperCase()}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="bg-background border-border">
                  <CardHeader>
                    <CardTitle className="text-lg">Consumption vs Reorder</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={280}>
                      <LineChart data={inventoryTrendData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="month" className="text-muted-foreground" />
                        <YAxis className="text-muted-foreground" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="consumption" stroke="hsl(var(--chart-1))" strokeWidth={2} />
                        <Line type="monotone" dataKey="reorder" stroke="hsl(var(--chart-2))" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="bg-background border-border">
                  <CardHeader>
                    <CardTitle className="text-lg">Hospital Status Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {hospitals.map((hospital) => (
                        <div key={hospital.id} className="flex items-center justify-between p-3 rounded-lg bg-card border border-border">
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${hospital.status === 'critical' ? 'bg-destructive' :
                                hospital.status === 'warning' ? 'bg-orange-500' :
                                  'bg-green-500'
                              }`} />
                            <div>
                              <p className="font-medium text-foreground">{hospital.name}</p>
                              <p className="text-sm text-muted-foreground">{hospital.location}</p>
                            </div>
                          </div>
                          <Badge variant={hospital.alerts > 2 ? 'destructive' : hospital.alerts > 0 ? 'secondary' : 'outline'}>
                            {hospital.alerts} alerts
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </section>
  );
};

export default LiveDemoSection;
