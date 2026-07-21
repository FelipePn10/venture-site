import { Nav } from '@/components/Nav';
import { Hero } from '@/components/Hero';
import {
  Trust, SectorPicker, Problem, Modules, Testimonials, Workflow, Compliance, CTA, ContactSection, Footer
} from '@/components/Sections';
import { Verticals } from '@/components/Verticals';
import { FAQ } from '@/components/FAQ';
import { FloatingCTA, CookieBanner, RevealRoot } from '@/components/Extras';

/**
 * Home enxuta: o essencial para o visitante entender o problema, ver que o
 * sistema é do setor dele e converter. O aprofundamento por setor vive em
 * /metalurgicas e /moveleiras; preço não fica no site (proposta sai depois da
 * primeira reunião).
 */
export default function Home() {
  return (
    <RevealRoot>
      <main className="relative">
        <Nav />
        <Hero />
        <Trust />
        <SectorPicker />
        <Problem />
        <Modules />
        <Verticals />
        <Testimonials />
        <Workflow />
        <Compliance />
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
