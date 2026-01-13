import Header from '@/components/landing/Header';
import HeroSection from '@/components/landing/HeroSection';
import ProblemSolution from '@/components/landing/ProblemSolution';
import FeaturesSection from '@/components/landing/FeaturesSection';
import APISection from '@/components/landing/APISection';
import ArchitectureSection from '@/components/landing/ArchitectureSection';
import DemoSection from '@/components/landing/DemoSection';
import TechStackFooter from '@/components/landing/TechStackFooter';

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <ProblemSolution />
        <FeaturesSection />
        <APISection />
        <ArchitectureSection />
        <DemoSection />
      </main>
      <TechStackFooter />
    </div>
  );
};

export default Landing;
