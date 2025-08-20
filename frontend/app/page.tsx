import HeroSection from '@/components/molecules/HeroSection';
import PropertyShowcase from '@/components/molecules/PropertyShowcase';
import TrustSection from '@/components/molecules/TrustSection';
import FeaturesSection from '@/components/molecules/FeaturesSection';
import CTASection from '@/components/molecules/CTASection';
import ReviewsPage from '@/components/molecules/ReviewPage';

export default function Home() {
  return (
    <div className="min-h-screen">
      <main className="pt-16">
        <HeroSection />
        <PropertyShowcase />
        <ReviewsPage />
        <TrustSection />
        <FeaturesSection />
        <CTASection />
      </main>
    </div>
  );
}
