import { 
  Activity, 
  Bell, 
  BarChart3, 
  Building2, 
  Pill, 
  TrendingUp 
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  {
    icon: Building2,
    title: 'Hospital Management',
    description: 'Monitor multiple hospitals from a single dashboard. Track inventory across your entire healthcare network.',
  },
  {
    icon: Activity,
    title: 'Real-time Inventory',
    description: 'Live tracking of medicine stock levels with automatic updates. Know your inventory status at any moment.',
  },
  {
    icon: Bell,
    title: 'Low Stock Alerts',
    description: 'Instant notifications when medicines fall below threshold. Never miss a critical shortage warning.',
  },
  {
    icon: Pill,
    title: 'Medicine Database',
    description: 'Comprehensive medicine catalog with categories and essential medicine tracking for compliance.',
  },
  {
    icon: TrendingUp,
    title: 'Shortage Predictions',
    description: 'AI-powered analytics predict potential shortages days in advance with confidence scores.',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Visual charts and insights to understand consumption patterns and optimize procurement.',
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Comprehensive Feature Set
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to monitor, predict, and manage hospital drug inventory effectively.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-lg transition-shadow duration-300 bg-card border-border">
              <CardContent className="p-6">
                <div className="p-3 rounded-xl bg-primary/10 w-fit mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
