import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, MapPin, Clock, Phone, Instagram } from "lucide-react";

import Footer from "@/components/Footer";
import MenuCategoryList from "@/components/MenuCategoryList";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { HomeContent, HomeModal, MenuCategory, MenuContent } from "@/types/content";

const cucinaLogo = "/assets/cucina-sa-logo-gold.png";
const cucinaIllustration = "/assets/cucina-illustration-transparent.png";
const cucinaStorefrontNew = "/assets/cucina-storefront-new.jpg";
const cucinaPasta = "/assets/cucina-pasta.jpeg";
const cucinaWine = "/assets/cucina-wine.jpeg";
const cucinaSalad = "/assets/cucina-salad.jpeg";
const woodOven = "/assets/wood-oven.jpg";

const RESERVATIONS_URL = "https://resy.com/cities/san-anselmo-ca/venues/cucina-sa?seats=2&date=2026-04-29";
const ORDER_ONLINE_URL = "https://order.toasttab.com/online/cucina-sa";
const GIFT_CARDS_URL = "https://order.toasttab.com/egiftcards/cucina-sa";

const DEFAULT_HOME_CONTENT: HomeContent = {
  modals: [],
  hero: {
    headline: "At Cucina, modern Italian cuisine meets the freshness and abundance of California's seasonal ingredients.",
    scriptSubtitle: "Italian at heart:\nSan Anselmo through and through.",
    paragraph: "Our menu brings together Italian inspiration, thoughtfully prepared dishes, and a curated selection of Italian and California wines—all served in a warm, vibrant setting in the heart of San Anselmo.",
  },
  community: {
    heading: "IN SAN ANSELMO SINCE 1998",
    paragraph: "For more than 27 years, Cucina has been a neighborhood gathering place for celebrations big and small. From weeknight dinners to birthday toasts, we're grateful to grow with the community we call home.",
  },
  signoff: "See you in San Anselmo",
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
  const [menuContent, setMenuContent] = useState<MenuContent | null>(null);
  const [showHoursModal, setShowHoursModal] = useState(false);
  const [activeMenuModal, setActiveMenuModal] = useState<"happy" | "seasonal" | null>(null);
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    const loadContent = async () => {
      try {
        // Load Home content (modals, community, hero) from live /api/content or fallback
        try {
          const homeApiRes = await fetch("/api/content?path=public/content/home.json", { cache: "no-store" });
          if (homeApiRes.ok) {
            const data = (await homeApiRes.json()) as HomeContent;
            setHomeContent((prev) => ({
              ...prev,
              ...data,
              hero: { ...prev.hero, ...data.hero },
              community: { ...prev.community, ...data.community },
            }));
          } else {
            const homeRes = await fetch("/content/home.json", { cache: "no-store" });
            if (homeRes.ok) {
              const data = (await homeRes.json()) as HomeContent;
              setHomeContent((prev) => ({
                ...prev,
                ...data,
                hero: { ...prev.hero, ...data.hero },
                community: { ...prev.community, ...data.community },
              }));
            }
          }
        } catch {
          // Fallback
        }

        // Load Menu content (dinner, lunch, happy, specials) from live /api/content or fallback
        try {
          const menuApiRes = await fetch("/api/content?path=public/content/menu.json", { cache: "no-store" });
          if (menuApiRes.ok) {
            const menuData = (await menuApiRes.json()) as MenuContent;
            setMenuContent(menuData);
          } else {
            const menuRes = await fetch("/content/menu.json", { cache: "no-store" });
            if (menuRes.ok) {
              const menuData = (await menuRes.json()) as MenuContent;
              setMenuContent(menuData);
            }
          }
        } catch {
          // Fallback
        }

        // Check for live specials override
        try {
          const liveSpecialsRes = await fetch("/api/specials", { cache: "no-store" });
          if (liveSpecialsRes.ok) {
            const liveSpecials = (await liveSpecialsRes.json()) as MenuContent["specials"];
            if (liveSpecials && Array.isArray(liveSpecials.categories)) {
              setMenuContent((prev) => prev ? { ...prev, specials: liveSpecials } : prev);
            }
          }
        } catch {
          // Fallback
        }
      } catch {
        setHomeContent(DEFAULT_HOME_CONTENT);
      }
    };

    void loadContent();
  }, []);

  const activeModal: HomeModal | undefined = homeContent.modals?.find(
    (modal) => modal.active && isModalInDateWindow(modal),
  );

  const heroData = homeContent.hero ?? DEFAULT_HOME_CONTENT.hero!;
  const communityData = homeContent.community ?? DEFAULT_HOME_CONTENT.community!;
  const signoffText = homeContent.signoff || DEFAULT_HOME_CONTENT.signoff!;

  const getMenuCategories = (): { title: string; categories: MenuCategory[] } => {
    if (!menuContent) return { title: "", categories: [] };
    if (activeMenuModal === "happy") {
      return {
        title: menuContent.menus.happy.title || "HAPPY HOUR MENU",
        categories: menuContent.menus.happy.categories,
      };
    }
    if (activeMenuModal === "seasonal") {
      return {
        title: menuContent.specials.title || "SEASONAL SPECIALS",
        categories: menuContent.specials.categories,
      };
    }
    return { title: "", categories: [] };
  };

  const modalMenuData = getMenuCategories();

  return (
    <div className="min-h-screen bg-[#160F0D] text-white selection:bg-[#EDE4D7] selection:text-[#160F0D]">
      {/* Promotional Popup Modal */}
      {activeModal && (
        <div data-home-modal className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#EDE4D7] p-7 text-center shadow-2xl border border-white/20">
            <h2 className="font-display text-2xl tracking-[0.08em] text-[#160F0D] uppercase font-semibold">
              {activeModal.title}
            </h2>
            <p className="mt-4 font-sans text-sm leading-relaxed text-[#160F0D]/80">
              {activeModal.body}
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              {activeModal.buttonLabel && activeModal.buttonUrl && (
                <a
                  href={activeModal.buttonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#160F0D] px-5 py-2.5 font-display text-xs tracking-widest text-[#EDE4D7] transition-opacity hover:opacity-90 uppercase"
                >
                  {activeModal.buttonLabel}
                </a>
              )}
              <button
                type="button"
                onClick={(event) => {
                  event.currentTarget.closest("[data-home-modal]")?.remove();
                }}
                className="border border-[#160F0D] px-5 py-2.5 font-display text-xs tracking-widest text-[#160F0D] transition-opacity hover:opacity-70 uppercase"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Menu Modal (Happy Hour / Seasonal) */}
      {activeMenuModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 md:p-6 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-3xl my-auto bg-[#160F0D] border border-[#3B2C27] p-6 md:p-10 relative text-white shadow-2xl max-h-[85vh] overflow-y-auto rounded-sm">
            <button
              onClick={() => setActiveMenuModal(null)}
              className="absolute top-4 right-4 text-[#EDE4D7]/70 hover:text-[#EDE4D7] p-2"
              aria-label="Close menu modal"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="font-display text-2xl md:text-3xl tracking-[0.18em] text-[#EDE4D7] uppercase font-semibold text-center mb-2">
              {modalMenuData.title}
            </h3>
            <p className="text-center font-sans text-xs md:text-sm text-white/70 italic mb-8">
              {activeMenuModal === "happy" ? "Available Tuesday – Sunday 3PM – 5PM" : "Seasonal, reflective of the freshest ingredients"}
            </p>

            <div className="space-y-10">
              <MenuCategoryList data={modalMenuData.categories} theme="dark" />
            </div>

            <div className="mt-10 pt-6 border-t border-[#3B2C27] flex justify-center gap-4">
              <Link
                to="/menu"
                onClick={() => setActiveMenuModal(null)}
                className="bg-[#EDE4D7] text-[#160F0D] font-display text-xs tracking-widest py-3 px-6 uppercase font-semibold hover:opacity-90 transition-opacity"
              >
                View Full Menu Page
              </Link>
              <button
                onClick={() => setActiveMenuModal(null)}
                className="border border-[#3B2C27] text-[#EDE4D7] font-display text-xs tracking-widest py-3 px-6 uppercase hover:bg-white/5 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hours & Location Modal */}
      {showHoursModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#160F0D] border border-[#3B2C27] p-6 md:p-8 relative text-center text-white shadow-2xl">
            <button
              onClick={() => setShowHoursModal(false)}
              className="absolute top-4 right-4 text-[#EDE4D7]/70 hover:text-[#EDE4D7] p-1"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="font-display text-xl tracking-[0.15em] text-[#EDE4D7] uppercase font-semibold mb-6">
              Contact Us • Hours + Location
            </h3>

            <div className="space-y-6 text-left">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#EDE4D7] shrink-0 mt-1" />
                <div>
                  <h4 className="font-display text-xs tracking-widest text-[#EDE4D7] uppercase mb-1">Address</h4>
                  <p className="font-sans text-sm text-white/90">518 San Anselmo Ave, San Anselmo, CA 94960</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#EDE4D7] shrink-0 mt-1" />
                <div>
                  <h4 className="font-display text-xs tracking-widest text-[#EDE4D7] uppercase mb-1">Hours</h4>
                  <p className="font-sans text-sm text-white/90"><span className="text-[#EDE4D7] font-medium">Dinner:</span> Sun – Thu 5:00 PM – 9:00 PM</p>
                  <p className="font-sans text-sm text-white/90"><span className="text-[#EDE4D7] font-medium">Dinner:</span> Fri – Sat 5:00 PM – 9:30 PM</p>
                  <p className="font-sans text-sm text-white/90 mt-1"><span className="text-[#EDE4D7] font-medium">Happy Hour:</span> Daily 4:30 PM – 5:30 PM</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#EDE4D7] shrink-0 mt-1" />
                <div>
                  <h4 className="font-display text-xs tracking-widest text-[#EDE4D7] uppercase mb-1">Phone</h4>
                  <a href="tel:4154542942" className="font-sans text-sm text-white/90 hover:text-[#EDE4D7] transition-colors">
                    (415) 454-2942
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Instagram className="w-5 h-5 text-[#EDE4D7] shrink-0 mt-1" />
                <div>
                  <h4 className="font-display text-xs tracking-widest text-[#EDE4D7] uppercase mb-1">Instagram</h4>
                  <a
                    href="https://instagram.com/cucina_sa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans text-sm text-white/90 hover:text-[#EDE4D7] transition-colors"
                  >
                    @cucina_sa
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[#3B2C27] flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://maps.google.com/?q=518+San+Anselmo+Ave,+San+Anselmo,+CA+94960"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#EDE4D7] text-[#160F0D] font-display text-xs tracking-widest py-3 px-6 uppercase font-semibold hover:opacity-90 transition-opacity text-center"
              >
                Get Directions
              </a>
              <button
                onClick={() => setShowHoursModal(false)}
                className="border border-[#3B2C27] text-[#EDE4D7] font-display text-xs tracking-widest py-3 px-6 uppercase hover:bg-white/5 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOP VIDEO HERO SECTION */}
      <section className="relative w-full h-[65vh] md:h-[80vh] min-h-[480px] overflow-hidden bg-[#160F0D]">
        <video
          src="/cucina-hero.mov"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#160F0D] via-black/35 to-black/65" />

        {/* Top Floating Header Links over Video */}
        <div className="absolute top-4 left-6 right-6 z-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={cucinaLogo} alt="Cucina SA" className="h-8 md:h-10 w-auto drop-shadow-md" />
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-5 bg-black/40 backdrop-blur-md px-5 py-2 rounded-full border border-white/15 shadow-xl">
              <a
                href={ORDER_ONLINE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-display text-[11px] tracking-[0.2em] text-[#F5E6C8] hover:text-white transition-colors uppercase font-semibold drop-shadow"
              >
                ORDER ONLINE
              </a>
              <span className="text-[#F5E6C8]/40 font-light">•</span>
              <a
                href={GIFT_CARDS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-display text-[11px] tracking-[0.2em] text-[#F5E6C8] hover:text-white transition-colors uppercase font-semibold drop-shadow"
              >
                GIFT CARDS
              </a>
            </div>

            {/* Mobile Navigation Drawer Trigger */}
            <div className="md:hidden">
              <Sheet open={navOpen} onOpenChange={setNavOpen}>
                <SheetTrigger asChild>
                  <button className="bg-black/50 backdrop-blur-md border border-white/20 text-[#EDE4D7] p-2 rounded-full hover:opacity-80 transition-opacity" aria-label="Open menu">
                    <Menu className="h-6 w-6" />
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-[#160F0D] border-[#3B2C27] text-white w-[280px]">
                  <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                  <div className="flex flex-col gap-6 mt-8">
                    <a href={ORDER_ONLINE_URL} target="_blank" rel="noopener noreferrer" onClick={() => setNavOpen(false)} className="font-display text-sm tracking-[0.2em] text-[#EDE4D7] uppercase hover:opacity-70">
                      Order Online
                    </a>
                    <a href={GIFT_CARDS_URL} target="_blank" rel="noopener noreferrer" onClick={() => setNavOpen(false)} className="font-display text-sm tracking-[0.2em] text-[#EDE4D7] uppercase hover:opacity-70">
                      Gift Cards
                    </a>
                    <button onClick={() => { setNavOpen(false); setShowHoursModal(true); }} className="font-display text-sm tracking-[0.2em] text-[#EDE4D7] uppercase text-left hover:opacity-70">
                      Hours + Location
                    </button>
                    <Link to="/story" onClick={() => setNavOpen(false)} className="font-display text-sm tracking-[0.2em] text-[#EDE4D7] uppercase text-left hover:opacity-70">
                      Our Story
                    </Link>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        {/* Centered Hero Branding on Video */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center">
          <img
            src={cucinaLogo}
            alt="Cucina SA"
            className="h-16 sm:h-24 md:h-28 w-auto drop-shadow-2xl mb-1"
          />
          <p className="font-serif italic text-base sm:text-xl md:text-2xl text-[#F5C86C] tracking-widest uppercase font-light drop-shadow-lg -mt-1">
            San Anselmo, California
          </p>
        </div>
      </section>

      {/* TOP ACTION NAV BAR (5 ITEMS) */}
      <div className="w-full bg-[#130D0C] border-y border-[#3B2C27] grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 text-center divide-x divide-y sm:divide-y-0 divide-[#3B2C27]">
        <a
          href={RESERVATIONS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="py-4 md:py-5 font-display text-[10px] sm:text-xs font-semibold tracking-[0.2em] text-[#EDE4D7] hover:bg-white/5 hover:text-[#F5C86C] transition-colors uppercase flex items-center justify-center px-2"
        >
          RESERVATIONS
        </a>
        <Link
          to="/menu"
          className="py-4 md:py-5 font-display text-[10px] sm:text-xs font-semibold tracking-[0.2em] text-[#EDE4D7] hover:bg-white/5 hover:text-[#F5C86C] transition-colors uppercase flex items-center justify-center px-2"
        >
          VIEW MENU
        </Link>
        <button
          onClick={() => setActiveMenuModal("happy")}
          className="py-4 md:py-5 font-display text-[10px] sm:text-xs font-semibold tracking-[0.2em] text-[#EDE4D7] hover:bg-white/5 hover:text-[#F5C86C] transition-colors uppercase flex items-center justify-center px-2"
        >
          HAPPY HOUR MENU
        </button>
        <button
          onClick={() => setShowHoursModal(true)}
          className="py-4 md:py-5 font-display text-[10px] sm:text-xs font-semibold tracking-[0.2em] text-[#EDE4D7] hover:bg-white/5 hover:text-[#F5C86C] transition-colors uppercase flex items-center justify-center px-2"
        >
          HOURS + LOCATION
        </button>
        <Link
          to="/story"
          className="py-4 md:py-5 font-display text-[10px] sm:text-xs font-semibold tracking-[0.2em] text-[#EDE4D7] hover:bg-white/5 hover:text-[#F5C86C] transition-colors uppercase flex items-center justify-center px-2 col-span-2 sm:col-span-1"
        >
          OUR STORY
        </Link>
      </div>

      <main>
        {/* HERO SECTION 1 - Split text & storefront photo */}
        <section className="max-w-6xl mx-auto px-6 py-12 md:py-16 lg:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left Column Text */}
            <div className="flex flex-col justify-center">
              {/* Header / Important Lead Text in Creamy Color */}
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-[2.2rem] font-normal leading-[1.3] text-[#EDE4D7] tracking-tight">
                {heroData.headline}
              </h1>

              {/* Subtitle Line in 2 Dramatic Lines with Vibrant Yellow/Gold */}
              <div className="font-serif italic text-2xl sm:text-3xl lg:text-[2.1rem] my-6 text-[#F5C86C] leading-tight drop-shadow-sm space-y-1">
                <p className="block">Italian at heart.</p>
                <p className="block">San Anselmo through and through.</p>
              </div>

              {/* Body Text in Pure White */}
              <p className="font-sans text-sm md:text-base leading-relaxed text-white/90 font-light">
                {heroData.paragraph}
              </p>
            </div>

            {/* Right Column Photo (Storefront Image uploaded by user) */}
            <div className="w-full flex justify-center">
              <div className="w-full max-w-md lg:max-w-none overflow-hidden shadow-2xl border border-white/10">
                <img
                  src={cucinaStorefrontNew}
                  alt="Cucina San Anselmo storefront at night"
                  className="w-full h-auto max-h-[600px] object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* COMMUNITY SECTION - Featuring 3 Photos Grid on Right (Matching Photo 1) */}
        <section id="community" className="w-full border-y border-[#3B2C27] bg-[#130D0C] py-14 md:py-20 px-6">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column: Community Text & Links */}
            <div className="md:col-span-6 flex flex-col justify-center text-left space-y-5">
              <h2 className="font-display text-base sm:text-lg md:text-xl tracking-[0.22em] font-semibold text-[#EDE4D7] uppercase leading-relaxed">
                {communityData.heading}
              </h2>

              <p className="font-sans text-sm md:text-base leading-relaxed text-white/90 font-light">
                {communityData.paragraph}
              </p>

              {/* Italicized Script Link in Vibrant Yellow Gold */}
              <div className="pt-2">
                <a
                  href="mailto:info@cucina-sa.com?subject=Private%20Event%20Inquiry"
                  className="font-serif italic text-2xl sm:text-3xl md:text-4xl text-[#F5C86C] hover:text-white transition-colors block"
                >
                  Book us for your next celebration
                </a>
              </div>

              {/* Navigation CTA Links */}
              <div className="pt-3 flex flex-wrap items-center gap-6">
                <a
                  href={RESERVATIONS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-display text-xs tracking-[0.2em] font-semibold text-[#EDE4D7] hover:text-[#F5C86C] transition-colors uppercase border-b border-[#EDE4D7] pb-0.5"
                >
                  RESERVATIONS
                </a>
                <button
                  onClick={() => setShowHoursModal(true)}
                  className="font-display text-xs tracking-[0.2em] font-semibold text-[#EDE4D7] hover:text-[#F5C86C] transition-colors uppercase border-b border-[#EDE4D7] pb-0.5"
                >
                  CONTACT US
                </button>
                <Link
                  to="/story"
                  className="font-display text-xs tracking-[0.2em] font-semibold text-[#EDE4D7] hover:text-[#F5C86C] transition-colors uppercase border-b border-[#EDE4D7] pb-0.5"
                >
                  OUR STORY
                </Link>
              </div>
            </div>

            {/* Right Column: 3 Vertical Photos Grid (Matching Photo 1) */}
            <div className="md:col-span-6">
              <div className="grid grid-cols-3 gap-1.5 md:gap-3 border border-white/10 p-1.5 bg-[#160F0D] shadow-2xl">
                <img
                  src={cucinaSalad}
                  alt="Seasonal salad with citrus and burrata"
                  className="w-full h-64 sm:h-72 md:h-80 object-cover"
                />
                <img
                  src={cucinaWine}
                  alt="Bottle of wine with a glass"
                  className="w-full h-64 sm:h-72 md:h-80 object-cover"
                />
                <img
                  src={cucinaPasta}
                  alt="Spaghetti with tomato sauce"
                  className="w-full h-64 sm:h-72 md:h-80 object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3 - Food & Wine Photos Gallery */}
        <section className="max-w-6xl mx-auto px-6 pt-12 md:pt-16 pb-4">
          <div className="grid grid-cols-3 gap-1.5 md:gap-3 border border-white/10 p-1.5 bg-[#130D0C] shadow-2xl">
            <img
              src={cucinaSalad}
              alt="Seasonal salad with citrus and burrata"
              className="w-full h-64 sm:h-72 md:h-80 object-cover"
            />
            <img
              src={cucinaWine}
              alt="Bottle of wine with a glass"
              className="w-full h-64 sm:h-72 md:h-80 object-cover"
            />
            <img
              src={cucinaPasta}
              alt="Spaghetti with tomato sauce"
              className="w-full h-64 sm:h-72 md:h-80 object-cover"
            />
          </div>
        </section>

      </main>

      {/* Footer */}
      <Footer signoffText={signoffText} />
    </div>
  );
};

export default Index;
