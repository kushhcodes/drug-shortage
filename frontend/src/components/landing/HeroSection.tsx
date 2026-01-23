import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, TrendingUp, AlertTriangle } from 'lucide-react';
import heroImage from '@/assets/hero-healthcare.jpg';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-16">
      
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Healthcare professionals analyzing data"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/70" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-sm text-primary font-medium">Healthcare Innovation</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Predict Drug Shortages{' '}
            <span className="text-primary">Before They Happen</span>
          </h1>

          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            Advanced inventory monitoring and predictive analytics for hospital pharmacies. 
            Stay ahead of medicine shortages with real-time alerts and AI-powered predictions.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Link to="/dashboard">
              <Button size="lg" className="w-full sm:w-auto gap-2">
                Explore Dashboard
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a href="#demo">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                View Demo
              </Button>
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span className="text-2xl font-bold text-foreground">95%</span>
              </div>
              <p className="text-sm text-muted-foreground">Prediction Accuracy</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Shield className="h-5 w-5 text-primary" />
                <span className="text-2xl font-bold text-foreground">24/7</span>
              </div>
              <p className="text-sm text-muted-foreground">Real-time Monitoring</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-primary" />
                <span className="text-2xl font-bold text-foreground">3 Days</span>
              </div>
              <p className="text-sm text-muted-foreground">Early Warning</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
