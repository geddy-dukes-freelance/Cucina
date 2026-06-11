import { useEffect, useState } from "react";
import SiteNav from "@/components/SiteNav";
import Footer from "@/components/Footer";
import MenuCategoryList from "@/components/MenuCategoryList";
import type { MenuCategory, MenuContent } from "@/types/content";

const TABS = [
  { key: "specials", label: "Specials" },
  { key: "dinner", label: "Dinner" },
  { key: "lunch", label: "Lunch & Brunch" },
  { key: "happy", label: "Happy Hour" },
] as const;

type TabKey = typeof TABS[number]["key"];

const EMPTY_MENUS: Record<TabKey, { title: string; data: MenuCategory[] }> = {
  specials: { title: "WEEKLY SPECIALS", data: [] },
  dinner: { title: "DINNER MENU", data: [] },
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
        const response = await fetch("/content/menu.json", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Could not load menu content.");
        }
        const content = (await response.json()) as MenuContent;
        setMenus({
          specials: { title: content.specials.title, data: content.specials.categories },
          dinner: { title: content.menus.dinner.title, data: content.menus.dinner.categories },
          lunch: { title: content.menus.lunch.title, data: content.menus.lunch.categories },
          happy: { title: content.menus.happy.title, data: content.menus.happy.categories },
        });
      } catch (error) {
        setLoadError(error instanceof Error ? error.message : "Could not load menu content.");
      }
    };

    void loadMenu();
  }, []);

  const currentMenu = menus[activeTab];

  return (
    <div className="min-h-screen bg-background">
      {/* Top Nav */}
      <SiteNav variant="solid" />

      {/* Menu Tab Bar */}
      <div className="bg-background border-t border-border">
        <div className="max-w-5xl mx-auto flex justify-center gap-2 md:gap-8 px-4 py-3">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`font-sans text-sm md:text-base tracking-wide px-4 py-2 transition-all rounded-sm ${activeTab === tab.key
                  ? "text-cucina-dark font-bold border-b-2 border-cucina-dark"
                  : "text-muted-foreground hover:text-foreground"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Content */}
      <main className="max-w-5xl mx-auto px-6 py-12 md:py-16">
        <h1 className="font-serif text-4xl md:text-5xl tracking-wide text-center mb-3" style={{ color: "hsl(30, 60%, 50%)" }}>
          {currentMenu.title}
        </h1>
        <p className="text-center font-sans text-sm italic mb-12" style={{ color: "hsl(30, 60%, 50%)" }}>
          Seasonal, reflective of the freshest ingredients, and subject to change
        </p>

        {loadError ? (
          <p className="text-center font-sans text-sm text-muted-foreground">{loadError}</p>
        ) : (
          <MenuCategoryList data={currentMenu.data} />
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MenuPage;
