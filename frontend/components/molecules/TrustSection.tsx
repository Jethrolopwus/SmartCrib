"use client";

import { useTheme } from "@/app/theme-provider";

const TrustSection = () => {
  const { theme } = useTheme();

  return (
    <section
      className="py-20"
      style={{ backgroundColor: theme === "dark" ? "#1f2937" : "#f9fafb" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <div>
            <div className="mb-4">
              <span className="inline-block bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wide">
                Our Journey to Excellence
              </span>
            </div>
            <h2
              className="text-3xl sm:text-4xl font-bold mb-6 leading-tight"
              style={{ color: theme === "dark" ? "#ffffff" : "#000000" }}
            >
              Building Trust Through Experience, Integrity, and a Commitment to
              Your Success
            </h2>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <p
              className="text-lg leading-relaxed"
              style={{ color: theme === "dark" ? "#d1d5db" : "#4b5563" }}
            >
              At SmartCribs, our journey began with a simple goal: to make real
              estate transactions easier, more secure, and transparent for
              everyone. Founded by a group of passionate blockchain enthusiasts
              and real estate professionals, we saw an opportunity to transform
              the way people buy, sell, and invest in property using Web3
              technology.
            </p>
            <p
              className="text-lg leading-relaxed"
              style={{ color: theme === "dark" ? "#d1d5db" : "#4b5563" }}
            >
              From our humble beginnings, we've grown into a trusted name in
              decentralized real estate, serving countless clients and helping
              them achieve their property dreams. What sets us apart is our
              commitment to transparency, integrity, and innovation. We leverage
              the latest blockchain tools and smart contracts to provide a
              seamless experience, guiding you every step of the way with expert
              advice and support.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
