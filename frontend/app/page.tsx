import HeroSection from '@/components/molecules/HeroSection';
import PropertyShowcase from '@/components/molecules/PropertyShowcase';
import TrustSection from '@/components/molecules/TrustSection';
import FeaturesSection from '@/components/molecules/FeaturesSection';
import CTASection from '@/components/molecules/CTASection';

export default function Home() {
  return (
    <div className="min-h-screen">
      <main className="pt-16">
        <HeroSection />
        <PropertyShowcase />
        <TrustSection />
        <FeaturesSection />
        <CTASection />
      </main>
    </div>
  );
}
