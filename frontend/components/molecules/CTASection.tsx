import Link from "next/link";

const CTASection = () => {
  return (
    <section className="py-20 bg-blue-900">
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
          Ready to Experience the Future of Real Estate?
        </h2>
        <p className="text-xl text-blue-100 mb-8">
          Join thousands of users who are already benefiting from our
          decentralized platform
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/properties"
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Start Browsing
          </Link>
          <Link
            href="/register"
            className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
          >
            Create Account
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
