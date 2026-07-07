import Navbar from '../components/sections/Navbar';
import Hero from '../components/sections/Hero';
import { WhatWeDo, About, FeaturedSection, HowItWorks, Testimonials, CTABanner, Footer } from '../components/sections/HomeSections';

export const metadata = {
  title: 'unmapped — Escape the Ordinary',
  description: 'Curated weekend trips and treks across India for the next generation of travelers.',
};

export default function Home() {
  return (
    <main className="min-h-screen bg-um-black">
      <Navbar />
      <Hero />
      <WhatWeDo />
      <About />
      <FeaturedSection type="trip" />
      <FeaturedSection type="trek" />
      <HowItWorks />
      <Testimonials />
      <CTABanner />
      <Footer />
    </main>
  );
}
