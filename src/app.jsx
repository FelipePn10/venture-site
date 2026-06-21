// Root App — composes all sections.

const App = () => {
  useReveal();
  return (
    <main className="relative">
      <Nav />
      <Hero />
      <Trust />
      <Pillars />
      <Modules />
      <Compare />
      <Band />
      <Verticals />
      <Stats />
      <Workflow />
      <Press />
      <Testimonials />
      <Compliance />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
      <FloatingCTA />
      <CookieBanner />
    </main>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
