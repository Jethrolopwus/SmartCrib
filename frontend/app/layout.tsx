import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ThemeProvider from './theme-provider';
import { Providers } from '../components/providers'
import { Navbar } from "@/components";
import {Footer} from "@/components";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "SmartCribs - Decentralized Real Estate Platform",
  description: "SmartCribs is a decentralized Web3 platform that connects renters with homeowners, enabling secure, transparent property transactions through blockchain technology.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased`}
      >
        <Providers>
          <ThemeProvider>
            <Navbar />
            {children}
             <Footer />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
