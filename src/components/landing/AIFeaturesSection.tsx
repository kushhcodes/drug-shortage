import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  LineChart,
  Line,
} from 'recharts';
import {
  Brain,
  AlertTriangle,
  TrendingUp,
  Building2,
  ArrowRight,
  Bell,
  RefreshCw,
  Truck,
  Shield,
  Zap,
  Activity,
  Clock,
} from 'lucide-react';

// AI Demand Forecasting Data
const forecastData = [
  { month: 'Jan', actual: 4200, predicted: 4100, seasonal: 3800 },
  { month: 'Feb', actual: 3800, predicted: 3900, seasonal: 4000 },
  { month: 'Mar', actual: 4500, predicted: 4400, seasonal: 4200 },
  { month: 'Apr', actual: 4100, predicted: 4200, seasonal: 4100 },
  { month: 'May', actual: null, predicted: 4600, seasonal: 4400 },
  { month: 'Jun', actual: null, predicted: 5200, seasonal: 4800 },
  { month: 'Jul', actual: null, predicted: 4900, seasonal: 4600 },
];

// Early Alert Data
const earlyAlerts = [
  { id: 1, medicine: 'Amoxicillin 500mg', currentStock: 120, safeLevel: 200, predictedDays: 3, severity: 'critical', confidence: 94 },
  { id: 2, medicine: 'Insulin Glargine', currentStock: 45, safeLevel: 80, predictedDays: 5, severity: 'critical', confidence: 89 },
  { id: 3, medicine: 'Paracetamol 500mg', currentStock: 350, safeLevel: 400, predictedDays: 8, severity: 'warning', confidence: 82 },
  { id: 4, medicine: 'Metformin 850mg', currentStock: 180, safeLevel: 250, predictedDays: 12, severity: 'moderate', confidence: 76 },
];

// Smart Redistribution Data
const redistributionData = [
  { 
    medicine: 'Amoxicillin 500mg',
    needingHospital: 'City General Hospital',
    needingStock: 45,
    surplusHospitals: [
      { name: 'Regional Medical Center', surplus: 320, distance: '12 km' },
      { name: 'University Hospital', surplus: 180, distance: '18 km' },
    ]
  },
  { 
    medicine: 'Insulin Glargine',
    needingHospital: "Children's Hospital",
    needingStock: 23,
    surplusHospitals: [
      { name: 'Metro Health Center', surplus: 95, distance: '8 km' },
      { name: 'Community Clinic', surplus: 67, distance: '15 km' },
    ]
  },
];

// Predictive Planning Stats
const planningMetrics = [
  { label: 'Shortages Prevented', value: 156, change: '+23%', icon: Shield },
  { label: 'Avg Response Time', value: '2.4h', change: '-45%', icon: Clock },
  { label: 'Cost Savings', value: '$847K', change: '+18%', icon: TrendingUp },
  { label: 'Lives Impacted', value: '12,400+', change: '+31%', icon: Activity },
  { label: 'Emergency Response', value: '< 15min', change: '-60%', icon: Zap },
  { label: 'Medicine Wastage', value: '-42%', change: 'Reduced', icon: RefreshCw },
];

// Real-time alerts stream
const realTimeAlerts = [
  { id: 1, time: '2 min ago', message: 'Low stock predicted for Amoxicillin at City General in 3 days', type: 'critical' },
  { id: 2, time: '5 min ago', message: 'Surplus detected: 320 units of Paracetamol at Regional Medical', type: 'info' },
  { id: 3, time: '12 min ago', message: 'Redistribution complete: Insulin transferred to Children\'s Hospital', type: 'success' },
  { id: 4, time: '18 min ago', message: 'Seasonal demand spike predicted for antibiotics next month', type: 'warning' },
  { id: 5, time: '25 min ago', message: 'Stock levels normalized at University Hospital', type: 'success' },
];

const hospitals = [
  { id: 'all', name: 'All Hospitals' },
  { id: 'cgh', name: 'City General Hospital' },
  { id: 'rmc', name: 'Regional Medical Center' },
  { id: 'ch', name: "Children's Hospital" },
  { id: 'uh', name: 'University Hospital' },
];

const AIFeaturesSection = () => {
  const [selectedHospital, setSelectedHospital] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [alertIndex, setAlertIndex] = useState(0);

  // Simulate real-time alert rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setAlertIndex((prev) => (prev + 1) % realTimeAlerts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  const currentAlert = realTimeAlerts[alertIndex];

  return (
    <section id="ai-features" className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">AI-Powered Features</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Intelligent Drug Shortage Prevention
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Our AI system transforms reactive inventory management into predictive planning,
            helping hospitals prevent shortages before they impact patient care.
          </p>
        </div>

        {/* Hospital Filter & Real-time Alert Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <Card className="flex-1 bg-background border-border">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-primary" />
                  <span className="font-medium text-foreground">Filter by Hospital</span>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <Select value={selectedHospital} onValueChange={setSelectedHospital}>
                    <SelectTrigger className="w-full sm:w-[220px] bg-card">
                      <SelectValue placeholder="All Hospitals" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {hospitals.map(h => (
                        <SelectItem key={h.id} value={h.id}>{h.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                  >
                    <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Real-time Alert Banner */}
          <Card className={`lg:w-[400px] border-border transition-all duration-300 ${
            currentAlert.type === 'critical' ? 'bg-destructive/10 border-destructive/50' :
            currentAlert.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500/50' :
            currentAlert.type === 'success' ? 'bg-green-500/10 border-green-500/50' :
            'bg-primary/10 border-primary/50'
          }`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Bell className={`h-5 w-5 animate-pulse ${
                  currentAlert.type === 'critical' ? 'text-destructive' :
                  currentAlert.type === 'warning' ? 'text-yellow-500' :
                  currentAlert.type === 'success' ? 'text-green-500' :
                  'text-primary'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{currentAlert.message}</p>
                  <p className="text-xs text-muted-foreground">{currentAlert.time}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Demand Forecasting */}
        <Card className="mb-8 bg-background border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              AI Demand Forecasting
              <Badge variant="secondary" className="ml-2">Machine Learning</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <p className="text-sm text-muted-foreground mb-4">
                  Predicting future medicine requirements based on historical consumption patterns and seasonal trends
                </p>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={forecastData}>
                    <defs>
                      <linearGradient id="predictedGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-muted-foreground" fontSize={12} />
                    <YAxis className="text-muted-foreground" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="predicted" 
                      stroke="hsl(var(--primary))" 
                      fill="url(#predictedGradient)" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="AI Predicted"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="actual" 
                      stroke="hsl(var(--chart-1))" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--chart-1))' }}
                      name="Actual"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="seasonal" 
                      stroke="hsl(var(--chart-2))" 
                      strokeWidth={1}
                      strokeDasharray="3 3"
                      dot={false}
                      name="Seasonal Avg"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <p className="text-sm font-medium text-foreground mb-2">Next Month Forecast</p>
                  <p className="text-3xl font-bold text-primary">+18%</p>
                  <p className="text-sm text-muted-foreground">Demand increase expected</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30">
                  <p className="text-sm font-medium text-foreground mb-2">Model Accuracy</p>
                  <p className="text-2xl font-bold text-foreground">94.8%</p>
                  <Progress value={94.8} className="mt-2 h-2" />
                </div>
                <div className="p-4 rounded-lg bg-muted/30">
                  <p className="text-sm font-medium text-foreground mb-2">Seasonal Factor</p>
                  <p className="text-sm text-muted-foreground">Flu season approaching - antibiotics demand will spike</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Early Alerts Section */}
        <Card className="mb-8 bg-background border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Early Warning Alerts
              <Badge variant="destructive" className="ml-2">4 Active</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-6">
              Alerts generated when stock is predicted to fall below safe levels
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {earlyAlerts.map((alert) => (
                <div 
                  key={alert.id} 
                  className={`p-4 rounded-lg border transition-all hover:shadow-md ${
                    alert.severity === 'critical' ? 'bg-destructive/5 border-destructive/30' :
                    alert.severity === 'warning' ? 'bg-yellow-500/5 border-yellow-500/30' :
                    'bg-muted/30 border-border'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-medium text-foreground">{alert.medicine}</p>
                      <p className="text-sm text-muted-foreground">
                        Shortage in ~{alert.predictedDays} days
                      </p>
                    </div>
                    <Badge variant={alert.severity === 'critical' ? 'destructive' : 'secondary'}>
                      {alert.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Current Stock</span>
                      <span className="font-medium text-foreground">{alert.currentStock} units</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Safe Level</span>
                      <span className="font-medium text-foreground">{alert.safeLevel} units</span>
                    </div>
                    <Progress 
                      value={(alert.currentStock / alert.safeLevel) * 100} 
                      className={`h-2 ${alert.severity === 'critical' ? '[&>div]:bg-destructive' : ''}`}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground pt-1">
                      <span>AI Confidence</span>
                      <span>{alert.confidence}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Smart Redistribution */}
        <Card className="mb-8 bg-background border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-primary" />
              Smart Redistribution Network
              <Badge variant="outline" className="ml-2">Auto-Matching</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-6">
              Nearby hospitals with surplus stock are automatically identified for smart redistribution
            </p>
            <div className="space-y-6">
              {redistributionData.map((item, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-muted/20 border border-border">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Needing Hospital */}
                    <div className="flex-1 p-3 rounded-lg bg-destructive/10 border border-destructive/30">
                      <p className="text-xs text-muted-foreground mb-1">Needs Stock</p>
                      <p className="font-medium text-foreground">{item.needingHospital}</p>
                      <p className="text-sm text-destructive">{item.medicine}: Only {item.needingStock} units</p>
                    </div>
                    
                    <ArrowRight className="h-6 w-6 text-primary hidden lg:block" />
                    
                    {/* Surplus Hospitals */}
                    <div className="flex-1 space-y-2">
                      {item.surplusHospitals.map((surplus, sIdx) => (
                        <div key={sIdx} className="flex items-center justify-between p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                          <div>
                            <p className="font-medium text-foreground text-sm">{surplus.name}</p>
                            <p className="text-xs text-muted-foreground">{surplus.distance} away</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-600 dark:text-green-400">+{surplus.surplus}</p>
                            <Button size="sm" variant="ghost" className="h-6 text-xs">
                              Request Transfer
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Predictive Planning Impact */}
        <Card className="mb-8 bg-background border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              From Reactive to Predictive Planning
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-6">
              Helping hospitals move from reactive handling to predictive planning, reducing shortages and saving lives
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {planningMetrics.map((metric, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-muted/30 text-center">
                  <metric.icon className="h-8 w-8 text-primary mx-auto mb-2 opacity-70" />
                  <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                  <Badge variant="secondary" className="mt-2 text-xs">
                    {metric.change} vs last year
                  </Badge>
                </div>
              ))}
            </div>
            
            {/* Before/After Comparison */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-lg bg-destructive/5 border border-destructive/30">
                <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-destructive"></span>
                  Before: Reactive Approach
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-destructive mt-0.5">✗</span>
                    Shortages discovered only when stock runs out
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive mt-0.5">✗</span>
                    Emergency orders at premium prices
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive mt-0.5">✗</span>
                    Patient care disruptions
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive mt-0.5">✗</span>
                    Manual inventory tracking prone to errors
                  </li>
                </ul>
              </div>
              <div className="p-6 rounded-lg bg-green-500/5 border border-green-500/30">
                <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-green-500"></span>
                  After: Predictive Planning
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    AI predicts shortages 2-3 weeks in advance
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    Smart redistribution between hospitals
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    Uninterrupted patient care
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    Real-time automated monitoring
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    Faster emergency response times
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    Reduced medicine wastage through smart distribution
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Real-time Alerts Feed */}
        <Card className="bg-background border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Real-Time Alert Feed
              <span className="ml-2 w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {realTimeAlerts.map((alert) => (
                <div 
                  key={alert.id} 
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                    alert.type === 'critical' ? 'bg-destructive/10 border border-destructive/30' :
                    alert.type === 'warning' ? 'bg-yellow-500/10 border border-yellow-500/30' :
                    alert.type === 'success' ? 'bg-green-500/10 border border-green-500/30' :
                    'bg-primary/5 border border-primary/20'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    alert.type === 'critical' ? 'bg-destructive' :
                    alert.type === 'warning' ? 'bg-yellow-500' :
                    alert.type === 'success' ? 'bg-green-500' :
                    'bg-primary'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{alert.message}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{alert.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default AIFeaturesSection;
