import Image from "next/image";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-10 opacity-90">
        <Image
          src="/road-city.jpg"
          alt="City road background"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-transparent"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
          Engaging... Real People With Real Experiences
        </h1>

        <p className="text-lg sm:text-xl text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed">
          SmartCribs connects renters with homeowners through secure,
          transparent blockchain-powered transactions. Experience the future of
          real estate with trustless interactions and verifiable reviews.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/Registrationform"
            className="bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Get Started
          </Link>
          <Link
            href="/step2review"
            className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors"
          >
            Leave Review
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
