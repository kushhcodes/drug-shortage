import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import analyticsVisual from '@/assets/analytics-visual.jpg';

const ArchitectureSection = () => {
  return (
    <section id="architecture" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            System Architecture
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Modern, decoupled architecture with React frontend and Django REST API backend.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Architecture Diagram */}
          <Card className="bg-card border-border overflow-hidden">
            <CardContent className="p-0">
              <img 
                src={analyticsVisual} 
                alt="Analytics visualization" 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex flex-col gap-4">
                  {/* Frontend */}
                  <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 rounded-full bg-primary" />
                      <span className="font-semibold text-foreground">Frontend Layer</span>
                    </div>
                    <div className="flex flex-wrap gap-2 ml-5">
                      <Badge variant="secondary">React 18</Badge>
                      <Badge variant="secondary">TypeScript</Badge>
                      <Badge variant="secondary">Tailwind CSS</Badge>
                      <Badge variant="secondary">React Query</Badge>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex justify-center">
                    <div className="w-0.5 h-8 bg-border relative">
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-border" />
                    </div>
                  </div>

                  {/* API */}
                  <div className="p-4 rounded-lg bg-chart-2/10 border border-chart-2/20">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 rounded-full bg-chart-2" />
                      <span className="font-semibold text-foreground">REST API</span>
                    </div>
                    <div className="flex flex-wrap gap-2 ml-5">
                      <Badge variant="secondary">JWT Auth</Badge>
                      <Badge variant="secondary">HTTPS</Badge>
                      <Badge variant="secondary">JSON</Badge>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex justify-center">
                    <div className="w-0.5 h-8 bg-border relative">
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-border" />
                    </div>
                  </div>

                  {/* Backend */}
                  <div className="p-4 rounded-lg bg-chart-4/10 border border-chart-4/20">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 rounded-full bg-chart-4" />
                      <span className="font-semibold text-foreground">Backend Layer</span>
                    </div>
                    <div className="flex flex-wrap gap-2 ml-5">
                      <Badge variant="secondary">Django 4</Badge>
                      <Badge variant="secondary">DRF</Badge>
                      <Badge variant="secondary">PostgreSQL</Badge>
                      <Badge variant="secondary">ML Models</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Frontend (React + TypeScript)
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Modern React application with TypeScript for type safety. 
                Uses React Query for efficient API data fetching and caching. 
                Tailwind CSS provides responsive, accessible UI components.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Backend (Django REST Framework)
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Robust Python backend with Django REST Framework. 
                JWT authentication secures all endpoints. 
                PostgreSQL database ensures reliable data storage.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Prediction Engine
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Machine learning models analyze historical consumption patterns 
                to predict potential drug shortages with confidence scores and risk levels.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArchitectureSection;
