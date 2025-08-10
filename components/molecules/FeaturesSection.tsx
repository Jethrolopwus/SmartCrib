"use client";

import { useTheme } from '@/app/theme-provider';

const FeaturesSection = () => {
  const { theme } = useTheme();

  return (
    <section className="py-20" style={{ backgroundColor: theme === 'dark' ? '#111827' : '#ffffff' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}>
            Why Choose SmartCribs?
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: theme === 'dark' ? '#d1d5db' : '#4b5563' }}>
            Experience the future of real estate with our innovative blockchain-powered platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}>
              Secure Transactions
            </h3>
            <p style={{ color: theme === 'dark' ? '#d1d5db' : '#4b5563' }}>
              All transactions are executed through smart contracts, ensuring security and transparency.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}>
              Verified Reviews
            </h3>
            <p style={{ color: theme === 'dark' ? '#d1d5db' : '#4b5563' }}>
              On-chain reviews provide authentic feedback from real users, building trust in the community.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}>
              Instant Payments
            </h3>
            <p style={{ color: theme === 'dark' ? '#d1d5db' : '#4b5563' }}>
              Cryptocurrency payments enable instant, borderless transactions without intermediaries.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection; 