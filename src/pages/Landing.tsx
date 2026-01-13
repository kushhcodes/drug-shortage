import Header from '@/components/landing/Header';
import HeroSection from '@/components/landing/HeroSection';
import ProblemSolution from '@/components/landing/ProblemSolution';
import FeaturesSection from '@/components/landing/FeaturesSection';
import LiveDemoSection from '@/components/landing/LiveDemoSection';
import APIGuideSection from '@/components/landing/APIGuideSection';
import TechStackFooter from '@/components/landing/TechStackFooter';

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <ProblemSolution />
        <FeaturesSection />
        <LiveDemoSection />
        <APIGuideSection />
      </main>
      <TechStackFooter />
    </div>
  );
};

export default Landing;
