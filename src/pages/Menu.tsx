import { useState } from "react";
import SiteNav from "@/components/SiteNav";
import woodOven from "@/assets/wood-oven.jpg";
import cucinaLogo from "@/assets/cucina-logo.png";

const RESERVATIONS_URL = "https://resy.com/cities/san-anselmo-ca/venues/cucina-sa?date=2020-08-10&seats=2";

type MenuItem = {
  name: string;
  description: string;
  note?: string;
};

type MenuCategory = {
  category: string;
  items: MenuItem[];
};

const DINNER_MENU: MenuCategory[] = [
  {
    category: "ANTIPASTO",
    items: [
      { name: "Bruschetta", description: "Jane Bakery bread toasted & topped with chopped tomatoes, garlic & basil", note: "2 pieces" },
      { name: "Arancini", description: "Risotto balls, prosciutto, mozzarella, marinara, salsa verde" },
      { name: "Brussel Sprout Chips", description: "Brussel sprout leaves, lime, honey, sriracha" },
      { name: "Tartare di Tonno", description: "Ahi tuna, avocado, miso sauce, spicy aioli, served with house made chips" },
      { name: "Fritto Misto", description: "Calamari, small prawns, lemon, red onion, spicy aioli" },
      { name: "Polpettini", description: "Beef & pork meatballs, marinara sauce, crostini" },
      { name: "Carpaccio di Zucchini", description: "Zucchini, almonds, pecorino cheese" },
    ],
  },
  {
    category: "INSALATA",
    items: [
      { name: "Insalata di Verdura", description: "Mixed organic greens with sauteed veggies and our house garlic dressing" },
      { name: "Insalata con Bettole", description: "Roasted beets, avocado, arugula, goat cheese, almonds, shallot-mustard vinaigrette" },
      { name: "Insalata Azzuro", description: "Little gem greens, blue cheese dressing, crispy pancetta, fried shallot, cherry tomato" },
      { name: "Insalata di Cavolo", description: "Kale, shaved brussel sprouts, almonds, lemon, parmesan, meyer lemon oil" },
    ],
  },
];

const LUNCH_MENU: MenuCategory[] = [
  {
    category: "COMING SOON",
    items: [
      { name: "Menu items coming soon", description: "Check back for our lunch & brunch offerings" },
    ],
  },
];

const HAPPY_HOUR_MENU: MenuCategory[] = [
  {
    category: "COMING SOON",
    items: [
      { name: "Menu items coming soon", description: "Check back for our happy hour specials" },
    ],
  },
];

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

const Menu = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("dinner");
  const currentMenu = MENUS[activeTab];

  return (
    <div className="min-h-screen bg-background">
      {/* Top Nav */}
      <SiteNav variant="solid" />

      {/* Menu Tab Bar */}
      <div className="bg-cucina-dark border-t border-cucina-brown/30">
        <div className="max-w-5xl mx-auto flex justify-center gap-2 md:gap-8 px-4 py-3">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`font-sans text-sm md:text-base tracking-wide px-4 py-2 transition-all rounded-sm ${
                activeTab === tab.key
                  ? "text-accent-foreground bg-accent font-bold"
                  : "text-primary-foreground/70 hover:text-primary-foreground"
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

        <div className="space-y-16">
          {currentMenu.data.map((cat) => (
            <div key={cat.category} className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-y-6 gap-x-12">
              {/* Category Name */}
              <h2 className="font-serif text-xl md:text-2xl tracking-[0.15em] text-muted-foreground font-light">
                {cat.category}
              </h2>

              {/* Items */}
              <div className="space-y-5">
                {cat.items.map((item) => (
                  <div key={item.name}>
                    <span className="font-sans font-bold text-foreground">{item.name}</span>
                    {"  "}
                    <span className="font-sans text-foreground/80">{item.description}</span>
                    {item.note && (
                      <span className="font-sans text-foreground/60 ml-3">{item.note}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer matching Index */}
      <footer id="contact" className="relative w-full aspect-[16/10]">
        <img
          src={woodOven}
          alt="Wood-fired oven"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "50% 70%" }}
        />
        <div className="absolute inset-0 bg-cucina-dark/40" />
        <div className="absolute inset-0 z-10 px-8 py-10 md:py-16 flex flex-col md:flex-row justify-between items-start">
          <div className="flex flex-col items-start gap-4 md:gap-8">
            <a
              href={RESERVATIONS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-primary-foreground/80 text-primary-foreground rounded-[50%] px-5 py-1.5 md:px-7 md:py-2 text-sm md:text-base font-sans tracking-wide hover:bg-primary-foreground/10 transition-all uppercase"
            >
              Reservations
            </a>
            <img
              src={cucinaLogo}
              alt="Cucina"
              className="w-[200px] md:w-[400px] lg:w-[500px] max-w-[50vw] mix-blend-screen"
            />
          </div>
          <div className="flex flex-col items-start text-left text-primary-foreground mt-6 md:mt-2">
            <p className="text-[10px] md:text-xs font-sans tracking-[0.2em] uppercase mb-1 md:mb-2 text-primary-foreground/80">&gt; Phone</p>
            <p className="text-xl md:text-3xl lg:text-4xl font-serif mb-4 md:mb-8 tracking-wide">415.454.2942</p>
            <p className="text-[10px] md:text-xs font-sans tracking-[0.2em] uppercase mb-1 md:mb-2 text-primary-foreground/80">&gt; Instagram</p>
            <a
              href="https://instagram.com/cucinasa"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xl md:text-3xl lg:text-4xl font-serif hover:opacity-80 transition-opacity tracking-wide"
            >
              @cucinasa
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Menu;
