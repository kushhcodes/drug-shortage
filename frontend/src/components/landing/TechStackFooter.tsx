import { Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const frontendTech = ['React 18', 'TypeScript', 'Tailwind CSS', 'React Query', 'React Router'];
const backendTech = ['Django 4', 'Django REST Framework', 'JWT Auth', 'PostgreSQL'];

const TechStackFooter = () => {
  return (
    <footer className="py-16 bg-background text-foreground border-t border-border">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-primary">
                <Activity className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-lg">MedPredict</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Hospital Drug Shortage Prediction & Inventory Monitoring System.
              Built for healthcare professionals who need reliable supply chain insights.
            </p>
          </div>

          {/* Frontend Stack */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Frontend Stack</h3>
            <div className="flex flex-wrap gap-2">
              {frontendTech.map((tech) => (
                <Badge key={tech} variant="outline" className="border-border text-muted-foreground">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>

          {/* Backend Stack */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Backend Stack</h3>
            <div className="flex flex-wrap gap-2">
              {backendTech.map((tech) => (
                <Badge key={tech} variant="outline" className="border-border text-muted-foreground">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 MedPredict. Built for healthcare innovation hackathon.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#features" className="hover:text-foreground transition-colors">Features</a>
              <a href="#ai-features" className="hover:text-foreground transition-colors">AI Features</a>
              <a href="#demo" className="hover:text-foreground transition-colors">Demo</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default TechStackFooter;
