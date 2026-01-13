import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code, Key, Server, Zap, CheckCircle2, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const codeExamples = {
  login: `// Step 1: Authentication
const login = async (email, password) => {
  const response = await fetch('http://localhost:8000/api/auth/login/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const { access, refresh } = await response.json();
  localStorage.setItem('access_token', access);
  return access;
};`,
  fetchData: `// Step 2: Fetch Hospitals with Auth Token
const getHospitals = async () => {
  const token = localStorage.getItem('access_token');
  const response = await fetch('http://localhost:8000/api/hospitals/', {
    headers: {
      'Authorization': \`Bearer \${token}\`,
      'Content-Type': 'application/json'
    }
  });
  return response.json();
};`,
  predictions: `// Step 3: Get Shortage Predictions
const getPredictions = async () => {
  const token = localStorage.getItem('access_token');
  const response = await fetch('http://localhost:8000/api/predictions/', {
    headers: {
      'Authorization': \`Bearer \${token}\`,
      'Content-Type': 'application/json'
    }
  });
  return response.json();
  // Returns: { medicine_name, predicted_shortage_date, 
  //            confidence, risk_level }
};`,
  reactQuery: `// Using React Query for Real-time Data
import { useQuery } from '@tanstack/react-query';
import { getHospitals, getPredictions } from './api';

function Dashboard() {
  const { data: hospitals, isLoading } = useQuery({
    queryKey: ['hospitals'],
    queryFn: getHospitals,
    refetchInterval: 30000 // Auto-refresh every 30s
  });

  const { data: predictions } = useQuery({
    queryKey: ['predictions'],
    queryFn: getPredictions
  });

  if (isLoading) return <Skeleton />;
  return <DashboardView data={hospitals} />;
}`
};

const endpoints = [
  { method: 'POST', path: '/api/auth/login/', desc: 'Get JWT access token' },
  { method: 'GET', path: '/api/hospitals/', desc: 'List all hospitals' },
  { method: 'GET', path: '/api/hospitals/{id}/inventory/', desc: 'Hospital inventory' },
  { method: 'GET', path: '/api/hospitals/{id}/low_stock/', desc: 'Low stock alerts' },
  { method: 'GET', path: '/api/medicines/', desc: 'All medicines' },
  { method: 'GET', path: '/api/medicines/essential/', desc: 'Essential medicines' },
  { method: 'GET', path: '/api/predictions/', desc: 'Shortage predictions' },
];

const APIGuideSection = () => {
  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard!');
  };

  return (
    <section id="api-guide" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">Developer Guide</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Connect to Live Data
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Integrate with our REST API to power your dashboard with real-time hospital 
            inventory data and AI-powered shortage predictions.
          </p>
        </div>

        {/* Quick Setup Steps */}
        <div className="grid md:grid-cols-4 gap-4 mb-12">
          {[
            { icon: Key, title: 'Authenticate', desc: 'Get JWT token via login endpoint' },
            { icon: Server, title: 'Connect', desc: 'API running on localhost:8000' },
            { icon: Code, title: 'Fetch Data', desc: 'Call REST endpoints with Bearer token' },
            { icon: Zap, title: 'Real-time', desc: 'Use React Query for auto-refresh' },
          ].map((step, i) => (
            <Card key={i} className="bg-card border-border text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <step.icon className="h-6 w-6 text-primary" />
                </div>
                <p className="font-semibold text-foreground mb-1">{step.title}</p>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Code Examples */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5 text-primary" />
                Code Examples
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="w-full justify-start mb-4 bg-muted/30 flex-wrap h-auto gap-1 p-1">
                  <TabsTrigger value="login" className="text-xs">Login</TabsTrigger>
                  <TabsTrigger value="fetchData" className="text-xs">Fetch Data</TabsTrigger>
                  <TabsTrigger value="predictions" className="text-xs">Predictions</TabsTrigger>
                  <TabsTrigger value="reactQuery" className="text-xs">React Query</TabsTrigger>
                </TabsList>
                {Object.entries(codeExamples).map(([key, code]) => (
                  <TabsContent key={key} value={key}>
                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8"
                        onClick={() => copyCode(code)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <pre className="bg-secondary/30 rounded-lg p-4 overflow-x-auto text-sm text-foreground">
                        <code>{code}</code>
                      </pre>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>

          {/* API Endpoints */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5 text-primary" />
                Available Endpoints
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {endpoints.map((ep, i) => (
                  <div 
                    key={i} 
                    className="flex items-center gap-3 p-3 rounded-lg bg-background border border-border hover:border-primary/50 transition-colors"
                  >
                    <Badge 
                      variant={ep.method === 'POST' ? 'default' : 'secondary'}
                      className="w-14 justify-center text-xs"
                    >
                      {ep.method}
                    </Badge>
                    <div className="flex-1 min-w-0">
                      <code className="text-sm text-primary font-mono truncate block">
                        {ep.path}
                      </code>
                      <p className="text-xs text-muted-foreground">{ep.desc}</p>
                    </div>
                    <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Base URL:</strong>{' '}
                  <code className="text-primary">http://127.0.0.1:8000</code>
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  <strong className="text-foreground">Auth Header:</strong>{' '}
                  <code className="text-primary">Authorization: Bearer {'<token>'}</code>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default APIGuideSection;
