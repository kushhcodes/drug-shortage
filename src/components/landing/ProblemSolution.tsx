import { AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';

const ProblemSolution = () => {
  const problems = [
    'Unexpected drug shortages disrupt patient care',
    'Manual inventory tracking leads to errors',
    'Delayed alerts result in emergency procurement',
    'Lack of visibility across hospital network',
  ];

  const solutions = [
    'AI-powered shortage predictions days in advance',
    'Automated real-time inventory monitoring',
    'Instant low-stock alerts to pharmacy teams',
    'Centralized dashboard for all hospitals',
  ];

  return (
    <section className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            From Reactive to Proactive
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Traditional inventory management leaves hospitals vulnerable. 
            Our system transforms how healthcare facilities handle drug supply.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Problem Column */}
          <div className="bg-destructive/5 rounded-2xl p-8 border border-destructive/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-destructive/10">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">The Problem</h3>
            </div>
            <ul className="space-y-4">
              {problems.map((problem, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-destructive mt-1">✕</span>
                  <span className="text-muted-foreground">{problem}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Arrow */}
          <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2">
            <ArrowRight className="h-8 w-8 text-primary" />
          </div>

          {/* Solution Column */}
          <div className="bg-primary/5 rounded-2xl p-8 border border-primary/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/10">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Our Solution</h3>
            </div>
            <ul className="space-y-4">
              {solutions.map((solution, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{solution}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolution;
