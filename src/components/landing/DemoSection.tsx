import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, MonitorPlay, Key, LayoutDashboard } from 'lucide-react';

const DemoSection = () => {
  return (
    <section id="demo" className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Try the Demo
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore the dashboard interface and see how the system works. 
            Connect to the backend API to view real data.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-background border-border">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Key className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Step 1: Login</h3>
              <p className="text-sm text-muted-foreground">
                Sign in with your credentials to access the dashboard
              </p>
            </CardContent>
          </Card>

          <Card className="bg-background border-border">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <LayoutDashboard className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Step 2: Explore</h3>
              <p className="text-sm text-muted-foreground">
                Navigate through hospitals, inventory, and predictions
              </p>
            </CardContent>
          </Card>

          <Card className="bg-background border-border">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <MonitorPlay className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Step 3: Analyze</h3>
              <p className="text-sm text-muted-foreground">
                View real-time data and shortage predictions
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Link to="/login">
            <Button size="lg" className="gap-2">
              Access Dashboard Demo
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <p className="text-sm text-muted-foreground mt-4">
            Note: Requires backend server running at localhost:8000
          </p>
        </div>
      </div>
    </section>
  );
};

export default DemoSection;
