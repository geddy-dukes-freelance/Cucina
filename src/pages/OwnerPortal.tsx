
import { useState } from "react";
import SiteNav from "@/components/SiteNav";
import Footer from "@/components/Footer";

import { DINNER_MENU, LUNCH_MENU, HAPPY_HOUR_MENU } from "@/data/menus";

const TABS = [
    { key: "home", label: "Home Page Updates" },
    { key: "menu", label: "Menu Updates" },
] as const;

type SectionType = "hero" | "story" | "footer";
type MenuType = "dinner" | "lunch" | "happy_hour";

const OwnerPortal = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [passwordInput, setPasswordInput] = useState("");
    const [authError, setAuthError] = useState(false);

    const [activeTab, setActiveTab] = useState<typeof TABS[number]["key"]>("home");

    // Home Form State
    const [homeSection, setHomeSection] = useState<SectionType>("hero");
    const [homeText, setHomeText] = useState("");
    const [homeImage, setHomeImage] = useState<File | null>(null);

    // Menu Form State
    const [menuType, setMenuType] = useState<MenuType>("dinner");
    const [menuCategory, setMenuCategory] = useState("");
    const [itemName, setItemName] = useState("");
    const [itemDescription, setItemDescription] = useState("");
    const [itemPrice, setItemPrice] = useState("");

    // Derive categories based on selected menuType
    const currentCategories = {
        dinner: DINNER_MENU,
        lunch: LUNCH_MENU,
        happy_hour: HAPPY_HOUR_MENU
    }[menuType].map(c => c.category);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordInput === "cucinasa2026") {
            setIsAuthenticated(true);
            setAuthError(false);
        } else {
            setAuthError(true);
        }
    };

    const handleHomeSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const mailtoLink = `mailto:youremail@example.com?subject=Home Page Update Request: ${homeSection}&body=Section: ${homeSection}%0D%0AChange Request: ${encodeURIComponent(homeText)}%0D%0A(Image attached if any)`;
        window.location.href = mailtoLink;
    };

    const handleMenuSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const mailtoLink = `mailto:youremail@example.com?subject=Menu Update Request: ${menuType}&body=Menu: ${menuType}%0D%0ACategory: ${encodeURIComponent(menuCategory || "Unspecified")}%0D%0AItem Name: ${encodeURIComponent(itemName)}%0D%0ADescription: ${encodeURIComponent(itemDescription)}%0D%0APrice: ${encodeURIComponent(itemPrice)}`;
        window.location.href = mailtoLink;
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <SiteNav variant="solid" />
                <main className="flex-grow flex items-center justify-center p-6">
                    <form onSubmit={handleLogin} className="w-full max-w-md bg-white p-8 rounded-lg shadow-sm border border-border">
                        <h1 className="font-serif text-3xl mb-6 text-center text-cucina-dark">Owner Access</h1>

                        <div className="space-y-4">
                            <div>
                                <label className="block font-sans text-sm font-bold mb-2 text-foreground">Access Code</label>
                                <input
                                    type="password"
                                    value={passwordInput}
                                    onChange={(e) => setPasswordInput(e.target.value)}
                                    className="w-full p-2 border border-input rounded font-sans"
                                    placeholder="Enter access code"
                                    required
                                />
                            </div>

                            {authError && (
                                <p className="text-red-500 font-sans text-sm font-bold">Incorrect access code. Please try again.</p>
                            )}

                            <button type="submit" className="w-full bg-cucina-dark text-white font-sans py-3 rounded hover:opacity-90 transition-opacity">
                                Enter Portal
                            </button>
                        </div>
                    </form>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <SiteNav variant="solid" />

            <main className="max-w-3xl mx-auto px-6 py-12">
                <h1 className="font-serif text-4xl mb-8 text-center text-cucina-dark">Owner Change Request Portal</h1>

                {/* Tab Navigation */}
                <div className="flex justify-center gap-4 mb-8 border-b border-border pb-4">
                    {TABS.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`px-4 py-2 font-sans text-lg transition-colors ${activeTab === tab.key
                                ? "text-cucina-dark font-bold border-b-2 border-cucina-dark"
                                : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Home Updates Form */}
                {activeTab === "home" && (
                    <form onSubmit={handleHomeSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-sm border border-border">
                        <div>
                            <label className="block font-sans text-sm font-bold mb-2 text-foreground">Select Section</label>
                            <select
                                value={homeSection}
                                onChange={(e) => setHomeSection(e.target.value as SectionType)}
                                className="w-full p-2 border border-input rounded font-sans"
                            >
                                <option value="hero">Hero Section (Top Image/Text)</option>
                                <option value="story">Our Story Section</option>
                                <option value="footer">Footer Section</option>
                            </select>
                        </div>

                        <div>
                            <label className="block font-sans text-sm font-bold mb-2 text-foreground">Describe Changes (Text/Content)</label>
                            <textarea
                                value={homeText}
                                onChange={(e) => setHomeText(e.target.value)}
                                className="w-full p-2 border border-input rounded font-sans h-32"
                                placeholder="Enter the new text or describe the changes..."
                                required
                            />
                        </div>

                        <div>
                            <label className="block font-sans text-sm font-bold mb-2 text-foreground">Upload New Image (Optional)</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setHomeImage(e.target.files ? e.target.files[0] : null)}
                                className="w-full p-2 border border-input rounded font-sans"
                            />
                            <p className="text-xs text-muted-foreground mt-1 italic">Note: File upload will need to be sent separately via email.</p>
                        </div>

                        <button type="submit" className="w-full bg-cucina-dark text-white font-sans py-3 rounded hover:opacity-90 transition-opacity">
                            Send Change Request
                        </button>
                    </form>
                )}

                {/* Menu Updates Form */}
                {activeTab === "menu" && (
                    <form onSubmit={handleMenuSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-sm border border-border">
                        <div>
                            <label className="block font-sans text-sm font-bold mb-2 text-foreground">Select Menu</label>
                            <select
                                value={menuType}
                                onChange={(e) => {
                                    setMenuType(e.target.value as MenuType);
                                    setMenuCategory(""); // Reset category when menu changes
                                }}
                                className="w-full p-2 border border-input rounded font-sans"
                            >
                                <option value="dinner">Dinner Menu</option>
                                <option value="lunch">Lunch & Brunch Menu</option>
                                <option value="happy_hour">Happy Hour Menu</option>
                            </select>
                        </div>

                        <div>
                            <label className="block font-sans text-sm font-bold mb-2 text-foreground">Select Category</label>
                            <select
                                value={menuCategory}
                                onChange={(e) => setMenuCategory(e.target.value)}
                                className="w-full p-2 border border-input rounded font-sans"
                            >
                                <option value="">-- Choose a Category --</option>
                                {currentCategories.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block font-sans text-sm font-bold mb-2 text-foreground">Item Name</label>
                            <input
                                type="text"
                                value={itemName}
                                onChange={(e) => setItemName(e.target.value)}
                                className="w-full p-2 border border-input rounded font-sans"
                                placeholder="e.g. Bruschetta"
                                required
                            />
                        </div>

                        <div>
                            <label className="block font-sans text-sm font-bold mb-2 text-foreground">Description/Details</label>
                            <textarea
                                value={itemDescription}
                                onChange={(e) => setItemDescription(e.target.value)}
                                className="w-full p-2 border border-input rounded font-sans h-32"
                                placeholder="e.g. Toasted bread with tomatoes, garlic & basil..."
                                required
                            />
                        </div>

                        <div>
                            <label className="block font-sans text-sm font-bold mb-2 text-foreground">Price (Optional)</label>
                            <input
                                type="text"
                                value={itemPrice}
                                onChange={(e) => setItemPrice(e.target.value)}
                                className="w-full p-2 border border-input rounded font-sans"
                                placeholder="e.g. $14"
                            />
                        </div>

                        <button type="submit" className="w-full bg-cucina-dark text-white font-sans py-3 rounded hover:opacity-90 transition-opacity">
                            Send Change Request
                        </button>
                    </form>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default OwnerPortal;
