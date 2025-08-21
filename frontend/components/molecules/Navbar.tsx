"use client";

import Link from "next/link";
import { useState } from "react";
import { useTheme } from "@/app/theme-provider";
import { ConnectWallet } from "@/components";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm shadow-sm"
      style={{
        backgroundColor:
          theme === "dark"
            ? "rgba(17, 24, 39, 0.95)"
            : "rgba(255, 255, 255, 0.95)",
        borderBottom:
          theme === "dark" ? "1px solid #374151" : "1px solid #f3f4f6",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600  rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span
                className="text-xl font-bold"
                style={{ color: theme === "dark" ? "#ffffff" : "#000000" }}
              >
                SmartCribs
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="font-medium  text-sm tracking-wide transition-colors hover:text-blue-600"
              style={{
                color: theme === "dark" ? "#ffffff" : "#000000",
              }}
            >
              Home
            </Link>
            <Link
              href="/pagedetails"
              className="font-medium  text-sm tracking-wide transition-colors hover:text-blue-600"
              style={{
                color: theme === "dark" ? "#ffffff" : "#000000",
              }}
            >
              Properties
            </Link>
            <Link
              href="/about"
              className="font-medium  text-sm tracking-wide transition-colors hover:text-blue-600"
              style={{
                color: theme === "dark" ? "#ffffff" : "#000000",
              }}
            >
              About
            </Link>
            <Link
              href="/reviewform"
              className="font-medium  text-sm tracking-wide transition-colors hover:text-blue-600"
              style={{
                color: theme === "dark" ? "#ffffff" : "#000000",
              }}
            >
              Contact
            </Link>
            <Link
              href="/blog"
              className="font-medium  text-sm tracking-wide transition-colors hover:text-blue-600"
              style={{
                color: theme === "dark" ? "#ffffff" : "#000000",
              }}
            >
              Blog
            </Link>
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              className="px-8 py-2 rounded-lg font-medium transition-colors border"
              style={{
                backgroundColor: "#ffffff",
                color: "#000000",
                borderColor: "#000000",
              }}
            >
              Add Property
            </button>
            <div className="flex  items-center">
              <ConnectWallet />
            </div>
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg transition-colors cursor-pointer"
              style={{
                backgroundColor: theme === "dark" ? "#374151" : "#f3f4f6",
                color: theme === "dark" ? "#ffffff" : "#000000",
              }}
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Theme Toggle Button for Mobile */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg transition-colors"
              style={{
                backgroundColor: theme === "dark" ? "#374151" : "#f3f4f6",
                color: theme === "dark" ? "#ffffff" : "#000000",
              }}
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              )}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="focus:outline-none"
              style={{ color: theme === "dark" ? "#ffffff" : "#000000" }}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div
              className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t"
              style={{
                backgroundColor: theme === "dark" ? "#111827" : "#ffffff",
                borderColor: theme === "dark" ? "#374151" : "#f3f4f6",
              }}
            >
              <Link
                href="/"
                className="block px-3 py-2 font-medium  text-sm"
                style={{
                  color: theme === "dark" ? "#ffffff" : "#000000",
                }}
              >
                Home
              </Link>
              <Link
                href="/properties"
                className="block px-3 py-2 font-medium  text-sm"
                style={{
                  color: theme === "dark" ? "#ffffff" : "#000000",
                }}
              >
                Properties
              </Link>
              <Link
                href="/about"
                className="block px-3 py-2 font-medium  text-sm"
                style={{
                  color: theme === "dark" ? "#ffffff" : "#000000",
                }}
              >
                About
              </Link>
              <Link
                href="/reviewform"
                className="block px-3 py-2 font-medium  text-sm"
                style={{
                  color: theme === "dark" ? "#ffffff" : "#000000",
                }}
              >
                Contact
              </Link>
              <Link
                href="/blog"
                className="block px-3 py-2 font-medium  text-sm"
                style={{
                  color: theme === "dark" ? "#ffffff" : "#000000",
                }}
              >
                Blog
              </Link>
              <div className="pt-4 space-y-2">
                <button
                  className="w-full px-6 py-2 rounded-lg font-medium transition-colors border"
                  style={{
                    backgroundColor: "#ffffff",
                    color: "#000000",
                    borderColor: "#000000",
                  }}
                >
                  Add Property
                </button>
                <div className="w-full">
                  <ConnectWallet />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
