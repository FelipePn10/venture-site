import { Nav } from '@/components/Nav';
import { Hero } from '@/components/Hero';
import {
  Trust, Problem, Pillars, Modules, Band, DemoBand, Compare, Stats, Workflow, Press, Testimonials, Compliance, CTA, ContactSection, Footer
} from '@/components/Sections';
import { Verticals } from '@/components/Verticals';
import { Pricing } from '@/components/Pricing';
import { FAQ } from '@/components/FAQ';
import { FloatingCTA, CookieBanner, RevealRoot } from '@/components/Extras';

export default function Home() {
  return (
    <RevealRoot>
      <main className="relative">
        <Nav />
        <Hero />
        <Trust />
        <Problem />
        <Pillars />
        <Modules />
        <Band />
        <Verticals />
        <DemoBand />
        <Compare />
        <Stats />
        <Workflow />
        <Press />
        <Testimonials />
        <Compliance />
        <Pricing />
        <FAQ />
        <CTA />
        <ContactSection />
        <Footer />
        <FloatingCTA />
        <CookieBanner />
      </main>
    </RevealRoot>
  );
}
