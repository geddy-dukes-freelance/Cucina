import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";
import MenuCategoryList from "@/components/MenuCategoryList";
import type { MenuCategory, MenuContent } from "@/types/content";

const cucinaLogo = "/assets/cucina-logo.png";

const RESERVATIONS_URL = "https://resy.com/cities/san-anselmo-ca/venues/cucina-sa?seats=2&date=2026-04-29";
const ORDER_ONLINE_URL = "https://order.toasttab.com/online/cucina-sa";
const GIFT_CARDS_URL = "https://order.toasttab.com/egiftcards/cucina-sa";

const TABS = [
  { key: "specials", label: "Specials" },
  { key: "dinner", label: "Dinner" },
  { key: "lunch", label: "Lunch & Brunch" },
  { key: "happy", label: "Happy Hour" },
] as const;

type TabKey = typeof TABS[number]["key"];

const EMPTY_MENUS: Record<TabKey, { title: string; data: MenuCategory[] }> = {
  specials: { title: "WEEKLY SPECIALS", data: [] },
  dinner: { title: "SEASONAL DINNER MENU", data: [] },
  lunch: { title: "LUNCH & BRUNCH MENU", data: [] },
  happy: { title: "HAPPY HOUR MENU", data: [] },
};

const MenuPage = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("specials");
  const [menus, setMenus] = useState(EMPTY_MENUS);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    const loadMenu = async () => {
      try {
        let content: MenuContent | null = null;
        try {
          const apiRes = await fetch("/api/content?path=public/content/menu.json", { cache: "no-store" });
          if (apiRes.ok) {
            content = (await apiRes.json()) as MenuContent;
          }
        } catch {
          // Fallback
        }

        if (!content) {
          const staticRes = await fetch("/content/menu.json", { cache: "no-store" });
          if (!staticRes.ok) {
            throw new Error("Could not load menu content.");
          }
          content = (await staticRes.json()) as MenuContent;
        }

        // Check if there is an explicit live specials override
        let specialsData = content.specials;
        try {
          const liveSpecialsRes = await fetch("/api/specials", { cache: "no-store" });
          if (liveSpecialsRes.ok) {
            const liveSpecials = (await liveSpecialsRes.json()) as MenuContent["specials"];
            if (liveSpecials && Array.isArray(liveSpecials.categories)) {
              specialsData = liveSpecials;
            }
          }
        } catch {
          // Fallback
        }

        setMenus({
          specials: { title: specialsData?.title || "WEEKLY SPECIALS", data: specialsData?.categories || [] },
          dinner: { title: content.menus?.dinner?.title || "SEASONAL DINNER MENU", data: content.menus?.dinner?.categories || [] },
          lunch: { title: content.menus?.lunch?.title || "LUNCH & BRUNCH MENU", data: content.menus?.lunch?.categories || [] },
          happy: { title: content.menus?.happy?.title || "HAPPY HOUR MENU", data: content.menus?.happy?.categories || [] },
        });
      } catch (error) {
        setLoadError(error instanceof Error ? error.message : "Could not load menu content.");
      }
    };

    void loadMenu();
  }, []);

  const currentMenu = menus[activeTab];

  return (
    <div className="min-h-screen bg-[#EDE4D7] text-[#3B2C27] selection:bg-[#3B2C27] selection:text-[#EDE4D7]">
      {/* Top Header Nav in Light Theme */}
      <header className="w-full bg-[#E3D7C5] border-b border-[#3B2C27]/20 px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={cucinaLogo} alt="Cucina" className="h-7 md:h-8" />
        </Link>

        <div className="flex items-center gap-6 text-xs font-display tracking-[0.18em] text-[#3B2C27]">
          <Link to="/" className="hover:opacity-75 transition-opacity font-semibold">HOME</Link>
          <a href={RESERVATIONS_URL} target="_blank" rel="noopener noreferrer" className="hover:opacity-75 transition-opacity font-semibold">RESERVATIONS</a>
          <a href={ORDER_ONLINE_URL} target="_blank" rel="noopener noreferrer" className="hover:opacity-75 transition-opacity font-semibold hidden sm:inline">ORDER ONLINE</a>
          <a href={GIFT_CARDS_URL} target="_blank" rel="noopener noreferrer" className="hover:opacity-75 transition-opacity font-semibold hidden sm:inline">GIFT CARDS</a>
        </div>
      </header>

      {/* Menu Tab Bar */}
      <div className="bg-[#DFD2BF] border-b border-[#3B2C27]/20">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-2 md:gap-6 px-4 py-3">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`font-display text-xs md:text-sm tracking-[0.15em] uppercase px-4 py-2 transition-all rounded-sm font-semibold ${
                activeTab === tab.key
                  ? "text-[#3B2C27] border-b-2 border-[#3B2C27] bg-[#3B2C27]/10"
                  : "text-[#3B2C27]/65 hover:text-[#3B2C27]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Menu Content */}
      <main className="max-w-5xl mx-auto px-6 py-12 md:py-16">
        <h1 className="font-display text-2xl md:text-3xl font-semibold tracking-[0.18em] text-center mb-2 uppercase text-[#3B2C27]">
          {currentMenu.title}
        </h1>
        <p className="text-center font-sans text-xs md:text-sm text-[#3B2C27]/75 italic mb-12">
          Seasonal, reflective of the freshest ingredients, and subject to change
        </p>

        {loadError ? (
          <p className="text-center font-sans text-sm text-[#3B2C27]/70">{loadError}</p>
        ) : (
          <MenuCategoryList data={currentMenu.data} theme="light" />
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MenuPage;
