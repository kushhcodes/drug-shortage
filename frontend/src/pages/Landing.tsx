import Header from '@/components/landing/Header';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import LiveDemoSection from '@/components/landing/LiveDemoSection';
import AIFeaturesSection from '@/components/landing/AIFeaturesSection';
import TechStackFooter from '@/components/landing/TechStackFooter';

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <AIFeaturesSection />
        <LiveDemoSection />
      </main>
      <TechStackFooter />
    </div>
  );
};

export default Landing;
