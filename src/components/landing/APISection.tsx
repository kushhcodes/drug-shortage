import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lock, User, Building2, Pill, TrendingUp } from 'lucide-react';

const apiEndpoints = [
  {
    category: 'Authentication',
    icon: Lock,
    color: 'text-chart-1',
    bgColor: 'bg-chart-1/10',
    endpoints: [
      { method: 'POST', path: '/api/auth/login/', description: 'User authentication with JWT' },
      { method: 'POST', path: '/api/auth/logout/', description: 'Secure session termination' },
      { method: 'GET', path: '/api/auth/profile/', description: 'Fetch user profile data' },
    ],
  },
  {
    category: 'Hospitals',
    icon: Building2,
    color: 'text-chart-2',
    bgColor: 'bg-chart-2/10',
    endpoints: [
      { method: 'GET', path: '/api/hospitals/', description: 'List all hospitals' },
      { method: 'GET', path: '/api/hospitals/{id}/inventory/', description: 'Hospital inventory data' },
      { method: 'GET', path: '/api/hospitals/{id}/low_stock/', description: 'Low stock alerts' },
    ],
  },
  {
    category: 'Medicines',
    icon: Pill,
    color: 'text-chart-3',
    bgColor: 'bg-chart-3/10',
    endpoints: [
      { method: 'GET', path: '/api/medicines/', description: 'Complete medicine list' },
      { method: 'GET', path: '/api/medicines/essential/', description: 'Essential medicines only' },
      { method: 'GET', path: '/api/medicines/by_category/', description: 'Filter by category' },
    ],
  },
  {
    category: 'Predictions',
    icon: TrendingUp,
    color: 'text-chart-4',
    bgColor: 'bg-chart-4/10',
    endpoints: [
      { method: 'GET', path: '/api/predictions/', description: 'Shortage predictions with risk levels' },
    ],
  },
];

const APISection = () => {
  return (
    <section id="api" className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            RESTful API Capabilities
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Secure, well-documented APIs built with Django REST Framework. 
            JWT authentication ensures data protection.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {apiEndpoints.map((group, index) => (
            <Card key={index} className="bg-background border-border">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${group.bgColor}`}>
                    <group.icon className={`h-5 w-5 ${group.color}`} />
                  </div>
                  <CardTitle className="text-lg">{group.category}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {group.endpoints.map((endpoint, endpointIndex) => (
                  <div
                    key={endpointIndex}
                    className="flex items-start gap-3 p-3 rounded-lg bg-card border border-border"
                  >
                    <Badge
                      variant="secondary"
                      className="text-xs font-mono shrink-0"
                    >
                      {endpoint.method}
                    </Badge>
                    <div className="min-w-0">
                      <code className="text-xs text-primary font-mono block truncate">
                        {endpoint.path}
                      </code>
                      <p className="text-xs text-muted-foreground mt-1">
                        {endpoint.description}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 p-6 rounded-xl bg-primary/5 border border-primary/20">
          <div className="flex items-center gap-3 mb-3">
            <Lock className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Security Note</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            All API endpoints (except login) require JWT Bearer token authentication. 
            Tokens expire after 24 hours for enhanced security. The API is read-only 
            to protect data integrity.
          </p>
        </div>
      </div>
    </section>
  );
};

export default APISection;
