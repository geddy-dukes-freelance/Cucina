import { useState } from "react";
import SiteNav from "@/components/SiteNav";
import Footer from "@/components/Footer";
import MenuCategoryList from "@/components/MenuCategoryList";
import {
  MenuCategory,
  DINNER_MENU,
  LUNCH_MENU,
  HAPPY_HOUR_MENU
} from "@/data/menus";

const TABS = [
  { key: "dinner", label: "Dinner" },
  { key: "lunch", label: "Lunch & Brunch" },
  { key: "happy", label: "Happy Hour" },
] as const;

type TabKey = typeof TABS[number]["key"];

const MENUS: Record<TabKey, { title: string; data: MenuCategory[] }> = {
  dinner: { title: "DINNER MENU", data: DINNER_MENU },
  lunch: { title: "LUNCH & BRUNCH MENU", data: LUNCH_MENU },
  happy: { title: "HAPPY HOUR MENU", data: HAPPY_HOUR_MENU },
};

const MenuPage = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("dinner");
  const currentMenu = MENUS[activeTab];

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

        <MenuCategoryList data={currentMenu.data} />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MenuPage;
