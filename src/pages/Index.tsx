import { useEffect, useState } from "react";
import cucinaLogo from "@/assets/cucina-logo-transparent.png";
import cucinaHeroVideo from "@/assets/cucina-hero.mov";
import cucinaStorefront from "@/assets/cucina-storefront.jpeg";
import cucinaPasta from "@/assets/cucina-pasta.jpeg";
import cucinaWine from "@/assets/cucina-wine.jpeg";
import cucinaSalad from "@/assets/cucina-salad.jpeg";
import SiteNav from "@/components/SiteNav";
import Footer from "@/components/Footer";
import type { HomeContent, HomeModal } from "@/types/content";

const DEFAULT_HOME_CONTENT: HomeContent = {
  modals: [],
  about: { heading: "OUR STORY", paragraphs: [] },
};

const isModalInDateWindow = (modal: HomeModal) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (modal.startsAt) {
    const startsAt = new Date(`${modal.startsAt}T00:00:00`);
    if (today < startsAt) return false;
  }

  if (modal.endsAt) {
    const endsAt = new Date(`${modal.endsAt}T00:00:00`);
    if (today > endsAt) return false;
  }

  return true;
};

const Index = () => {
  const [homeContent, setHomeContent] = useState(DEFAULT_HOME_CONTENT);

  useEffect(() => {
    const loadHomeContent = async () => {
      try {
        const response = await fetch("/content/home.json", { cache: "no-store" });
        if (!response.ok) return;
        setHomeContent((await response.json()) as HomeContent);
      } catch {
        setHomeContent(DEFAULT_HOME_CONTENT);
      }
    };

    void loadHomeContent();
  }, []);

  const activeModal: HomeModal | undefined = homeContent.modals.find(
    (modal) => modal.active && isModalInDateWindow(modal),
  );

  return (
    <div className="min-h-screen">
      {activeModal && (
        <div data-home-modal className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4">
          <div className="w-full max-w-md bg-cucina-cream p-7 text-center shadow-xl">
            <h2 className="font-display text-2xl tracking-[0.08em] text-cucina-dark">
              {activeModal.title}
            </h2>
            <p className="mt-4 font-sans text-sm leading-relaxed text-foreground/80">
              {activeModal.body}
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              {activeModal.buttonLabel && activeModal.buttonUrl && (
                <a
                  href={activeModal.buttonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-cucina-dark px-5 py-2 font-sans text-sm text-white transition-opacity hover:opacity-85"
                >
                  {activeModal.buttonLabel}
                </a>
              )}
              <button
                type="button"
                onClick={(event) => {
                  event.currentTarget.closest("[data-home-modal]")?.remove();
                }}
                className="border border-cucina-dark px-5 py-2 font-sans text-sm text-cucina-dark transition-opacity hover:opacity-70"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Hero Section */}
      <section className="relative w-full aspect-[16/9]" style={{ isolation: 'isolate' }}>
        <video
          src={cucinaHeroVideo}
          poster={cucinaStorefront}
          aria-label="Cucina San Anselmo storefront"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "50% 52%" }}
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-cucina-dark/30" />

        {/* Navigation */}
        <SiteNav variant="overlay" />

        {/* Logo centered */}
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src={cucinaLogo}
            alt="Cucina"
            className="w-[500px] max-w-[70vw] drop-shadow-[0_4px_18px_rgba(0,0,0,0.45)]"
          />
        </div>
      </section>

      <section id="about" className="bg-cucina-dark py-20 px-6">
        {/* Story Text (Without title) */}
        {homeContent.about.paragraphs.length > 0 && (
          <div className="max-w-3xl mx-auto space-y-6 text-center font-sans text-base md:text-lg font-light leading-relaxed text-primary-foreground/85">
            {homeContent.about.paragraphs.map((paragraph, idx) => (
              <p key={idx}>
                {paragraph.split("\n").map((line, index) => (
                  <span key={`${line}-${index}`}>
                    {index > 0 && <br />}
                    {line}
                  </span>
                ))}
              </p>
            ))}
          </div>
        )}

        {/* Food Gallery */}
        <div className="max-w-3xl mx-auto mt-16 grid grid-cols-3 gap-1">
          <img src={cucinaSalad} alt="Seasonal salad with citrus and burrata" className="w-full h-64 object-cover" />
          <img src={cucinaWine} alt="Bottle of wine with a glass" className="w-full h-64 object-cover" />
          <img src={cucinaPasta} alt="Spaghetti with tomato sauce" className="w-full h-64 object-cover" />
        </div>

        {/* Handwritten sign-off with La Belle Aurore font on the left side at a 25° upward angle */}
        <div className="max-w-3xl mx-auto mt-20 mb-12 px-0 flex justify-start overflow-visible">
          <p
            className="font-script text-[clamp(2.2rem,6vw,3.5rem)] font-normal leading-[1.1] text-primary-foreground/90 text-left select-none origin-bottom-left"
            style={{ transform: "rotate(-25deg) translateX(-4.5rem) translateY(0.5rem)" }}
          >
            See you in<br />San Anselmo
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
