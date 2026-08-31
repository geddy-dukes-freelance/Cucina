import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import SiteNav from "@/components/SiteNav";
import Footer from "@/components/Footer";
import type { HomeContent, HomeModal, MenuCategory, MenuContent, MenuItem } from "@/types/content";

const DEFAULT_HOME_CONTENT: HomeContent = {
  modals: [],
  about: { heading: "OUR STORY", paragraphs: [] },
};

const DEFAULT_MENU_CONTENT: MenuContent = {
  specials: { title: "WEEKLY SPECIALS", updatedAt: "", categories: [] },
  menus: {
    dinner: { title: "DINNER MENU", categories: [] },
    lunch: { title: "LUNCH & BRUNCH MENU", categories: [] },
    happy: { title: "HAPPY HOUR MENU", categories: [] },
  },
};

const SECTIONS = [
  { key: "modal", label: "Home Popup" },
  { key: "about", label: "About Us" },
  { key: "specials", label: "Weekly Specials" },
  { key: "dinner", label: "Dinner Menu" },
  { key: "lunch", label: "Lunch Menu" },
  { key: "happy", label: "Happy Hour" },
] as const;

type SectionKey = typeof SECTIONS[number]["key"];
type MenuKey = "dinner" | "lunch" | "happy";

const newModal = (): HomeModal => ({
  id: `popup-${Date.now()}`,
  active: false,
  title: "",
  body: "",
  buttonLabel: "",
  buttonUrl: "",
  startsAt: "",
  endsAt: "",
});

const newCategory = (): MenuCategory => ({
  category: "NEW SECTION",
  items: [newItem()],
});

const newItem = (): MenuItem => ({
  name: "",
  description: "",
  note: "",
  price: "",
});

const FieldLabel = ({ children }: { children: string }) => (
  <label className="block font-sans text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
    {children}
  </label>
);

const OwnerPortal = () => {
  const [passwordInput, setPasswordInput] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionKey>("modal");
  const [homeContent, setHomeContent] = useState<HomeContent>(DEFAULT_HOME_CONTENT);
  const [menuContent, setMenuContent] = useState<MenuContent>(DEFAULT_MENU_CONTENT);
  const [status, setStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const activeMenuKey = useMemo<MenuKey | null>(() => {
    if (activeSection === "dinner" || activeSection === "lunch" || activeSection === "happy") return activeSection;
    return null;
  }, [activeSection]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadContent = async () => {
      setStatus("Loading content...");
      try {
        const [homeResponse, menuResponse] = await Promise.all([
          fetch("/content/home.json", { cache: "no-store" }),
          fetch("/content/menu.json", { cache: "no-store" }),
        ]);

        if (!homeResponse.ok || !menuResponse.ok) {
          throw new Error("Could not load site content.");
        }

        setHomeContent((await homeResponse.json()) as HomeContent);
        setMenuContent((await menuResponse.json()) as MenuContent);
        setStatus("Content loaded.");
      } catch (error) {
        setStatus(error instanceof Error ? error.message : "Could not load content.");
      }
    };

    void loadContent();
  }, [isAuthenticated]);

  const saveContentFile = async (path: string, content: HomeContent | MenuContent) => {
    let response: Response | null = null;
    try {
      response = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: passwordInput, path, content }),
      });
    } catch {
      // Local dev server without API function running
    }

    if (!response || response.status === 404) {
      try {
        response = await fetch("/.netlify/functions/content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: passwordInput, path, content }),
        });
      } catch {
        // Local dev fallback
      }
    }

    if (!response || response.status === 404) {
      if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
        return; // Simulated save in local dev environment
      }
      throw new Error("Save endpoint not reachable. Ensure serverless functions or Vercel are deployed.");
    }

    const result = (await response.json().catch(() => ({}))) as { error?: string };

    if (!response.ok) {
      throw new Error(result.error ?? "Save failed.");
    }
  };

  const handleLogin = (event: FormEvent) => {
    event.preventDefault();
    if (!passwordInput.trim()) {
      setStatus("Enter the admin password.");
      return;
    }
    setIsAuthenticated(true);
    setStatus("");
  };

  const handleSave = async (event: FormEvent) => {
    event.preventDefault();
    setIsSaving(true);
    setStatus("Saving changes...");

    try {
      const savingHome = activeSection === "modal" || activeSection === "about";
      await saveContentFile(
        savingHome ? "public/content/home.json" : "public/content/menu.json",
        savingHome ? homeContent : menuContent,
      );
      setStatus("Saved. The live site will update after the next deploy.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Save failed.");
    } finally {
      setIsSaving(false);
    }
  };

  const updateModal = (index: number, patch: Partial<HomeModal>) => {
    setHomeContent((current) => ({
      ...current,
      modals: current.modals.map((modal, modalIndex) =>
        modalIndex === index ? { ...modal, ...patch } : modal,
      ),
    }));
  };

  const updateSpecials = (patch: Partial<MenuContent["specials"]>) => {
    setMenuContent((current) => ({
      ...current,
      specials: { ...current.specials, ...patch },
    }));
  };

  const updateMenuSection = (menuKey: MenuKey, patch: Partial<MenuContent["menus"][MenuKey]>) => {
    setMenuContent((current) => ({
      ...current,
      menus: {
        ...current.menus,
        [menuKey]: { ...current.menus[menuKey], ...patch },
      },
    }));
  };

  const updateCategory = (
    section: "specials" | MenuKey,
    categoryIndex: number,
    patch: Partial<MenuCategory>,
  ) => {
    if (section === "specials") {
      updateSpecials({
        categories: menuContent.specials.categories.map((category, index) =>
          index === categoryIndex ? { ...category, ...patch } : category,
        ),
      });
      return;
    }

    updateMenuSection(section, {
      categories: menuContent.menus[section].categories.map((category, index) =>
        index === categoryIndex ? { ...category, ...patch } : category,
      ),
    });
  };

  const updateItem = (
    section: "specials" | MenuKey,
    categoryIndex: number,
    itemIndex: number,
    patch: Partial<MenuItem>,
  ) => {
    const categories = section === "specials" ? menuContent.specials.categories : menuContent.menus[section].categories;
    const updatedCategories = categories.map((category, index) =>
      index === categoryIndex
        ? {
          ...category,
          items: category.items.map((item, currentItemIndex) =>
            currentItemIndex === itemIndex ? { ...item, ...patch } : item,
          ),
        }
        : category,
    );

    if (section === "specials") updateSpecials({ categories: updatedCategories });
    else updateMenuSection(section, { categories: updatedCategories });
  };

  const addCategory = (section: "specials" | MenuKey) => {
    if (section === "specials") {
      updateSpecials({ categories: [...menuContent.specials.categories, newCategory()] });
    } else {
      updateMenuSection(section, { categories: [...menuContent.menus[section].categories, newCategory()] });
    }
  };

  const removeCategory = (section: "specials" | MenuKey, categoryIndex: number) => {
    const categories = section === "specials" ? menuContent.specials.categories : menuContent.menus[section].categories;
    const updatedCategories = categories.filter((_, index) => index !== categoryIndex);
    if (section === "specials") updateSpecials({ categories: updatedCategories });
    else updateMenuSection(section, { categories: updatedCategories });
  };

  const addItem = (section: "specials" | MenuKey, categoryIndex: number) => {
    const categories = section === "specials" ? menuContent.specials.categories : menuContent.menus[section].categories;
    const updatedCategories = categories.map((category, index) =>
      index === categoryIndex ? { ...category, items: [...category.items, newItem()] } : category,
    );
    if (section === "specials") updateSpecials({ categories: updatedCategories });
    else updateMenuSection(section, { categories: updatedCategories });
  };

  const removeItem = (section: "specials" | MenuKey, categoryIndex: number, itemIndex: number) => {
    const categories = section === "specials" ? menuContent.specials.categories : menuContent.menus[section].categories;
    const updatedCategories = categories.map((category, index) =>
      index === categoryIndex
        ? { ...category, items: category.items.filter((_, currentItemIndex) => currentItemIndex !== itemIndex) }
        : category,
    );
    if (section === "specials") updateSpecials({ categories: updatedCategories });
    else updateMenuSection(section, { categories: updatedCategories });
  };

  const renderMenuEditor = (section: "specials" | MenuKey) => {
    const menuSection = section === "specials" ? menuContent.specials : menuContent.menus[section];

    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <FieldLabel>Menu title</FieldLabel>
            <input
              value={menuSection.title}
              onChange={(event) => {
                if (section === "specials") updateSpecials({ title: event.target.value });
                else updateMenuSection(section, { title: event.target.value });
              }}
              className="mt-1 w-full rounded border border-input p-2 font-sans"
            />
          </div>
          {section === "specials" && (
            <div>
              <FieldLabel>Last updated</FieldLabel>
              <input
                type="date"
                value={menuContent.specials.updatedAt ?? ""}
                onChange={(event) => updateSpecials({ updatedAt: event.target.value })}
                className="mt-1 w-full rounded border border-input p-2 font-sans"
              />
            </div>
          )}
        </div>

        {menuSection.categories.map((category, categoryIndex) => (
          <div key={`cat-${categoryIndex}`} className="rounded border border-border p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div className="flex-1">
                <FieldLabel>Section name</FieldLabel>
                <input
                  value={category.category}
                  onChange={(event) => updateCategory(section, categoryIndex, { category: event.target.value })}
                  className="mt-1 w-full rounded border border-input p-2 font-sans"
                />
              </div>
              <button
                type="button"
                onClick={() => removeCategory(section, categoryIndex)}
                className="rounded border border-red-200 px-3 py-2 font-sans text-sm text-red-700"
              >
                Remove section
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {category.items.map((item, itemIndex) => (
                <div key={`item-${categoryIndex}-${itemIndex}`} className="grid gap-3 rounded bg-cucina-warm/60 p-3 md:grid-cols-[1fr_2fr_0.7fr_0.7fr_auto]">
                  <div>
                    <FieldLabel>Item</FieldLabel>
                    <input
                      value={item.name}
                      onChange={(event) => updateItem(section, categoryIndex, itemIndex, { name: event.target.value })}
                      className="mt-1 w-full rounded border border-input p-2 font-sans"
                    />
                  </div>
                  <div>
                    <FieldLabel>Description</FieldLabel>
                    <textarea
                      value={item.description}
                      onChange={(event) => updateItem(section, categoryIndex, itemIndex, { description: event.target.value })}
                      className="mt-1 min-h-20 w-full rounded border border-input p-2 font-sans"
                    />
                  </div>
                  <div>
                    <FieldLabel>Note</FieldLabel>
                    <input
                      value={item.note ?? ""}
                      onChange={(event) => updateItem(section, categoryIndex, itemIndex, { note: event.target.value })}
                      className="mt-1 w-full rounded border border-input p-2 font-sans"
                    />
                  </div>
                  <div>
                    <FieldLabel>Price</FieldLabel>
                    <input
                      value={item.price ?? ""}
                      onChange={(event) => updateItem(section, categoryIndex, itemIndex, { price: event.target.value })}
                      className="mt-1 w-full rounded border border-input p-2 font-sans"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(section, categoryIndex, itemIndex)}
                    className="self-end rounded border border-red-200 px-3 py-2 font-sans text-sm text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => addItem(section, categoryIndex)}
              className="mt-4 rounded border border-cucina-dark px-4 py-2 font-sans text-sm text-cucina-dark"
            >
              Add item
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => addCategory(section)}
          className="rounded bg-cucina-dark px-4 py-2 font-sans text-sm text-white"
        >
          Add section
        </button>
      </div>
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <SiteNav variant="solid" />
        <main className="flex-grow flex items-center justify-center p-6">
          <form onSubmit={handleLogin} className="w-full max-w-md bg-white p-8 rounded-lg shadow-sm border border-border">
            <h1 className="font-serif text-3xl mb-6 text-center text-cucina-dark">Owner Access</h1>
            <FieldLabel>Admin password</FieldLabel>
            <input
              type="password"
              value={passwordInput}
              onChange={(event) => setPasswordInput(event.target.value)}
              className="mt-1 w-full rounded border border-input p-2 font-sans"
              placeholder="Enter admin password"
              required
            />
            {status && <p className="mt-3 text-sm text-red-600">{status}</p>}
            <button type="submit" className="mt-6 w-full rounded bg-cucina-dark py-3 font-sans text-white hover:opacity-90">
              Enter Portal
            </button>
          </form>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteNav variant="solid" />
      <main className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="font-serif text-4xl mb-3 text-center text-cucina-dark">Owner Content Portal</h1>
        <p className="max-w-2xl mx-auto text-center font-sans text-sm text-muted-foreground">
          Make changes in the fields below, then save. Menu and popup updates are stored in GitHub so there is no monthly database bill.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[220px_1fr]">
          <nav className="flex gap-2 overflow-x-auto border-b border-border pb-3 lg:block lg:space-y-2 lg:border-b-0 lg:border-r lg:pr-4">
            {SECTIONS.map((section) => (
              <button
                key={section.key}
                type="button"
                onClick={() => setActiveSection(section.key)}
                className={`whitespace-nowrap rounded px-4 py-2 text-left font-sans text-sm transition-colors lg:w-full ${activeSection === section.key
                  ? "bg-cucina-dark text-white"
                  : "text-muted-foreground hover:bg-cucina-warm"
                  }`}
              >
                {section.label}
              </button>
            ))}
          </nav>

          <form onSubmit={handleSave} className="rounded-lg border border-border bg-white p-5 md:p-8">
            {activeSection === "modal" && (
              <div className="space-y-5">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="font-serif text-2xl text-cucina-dark">Home Popup</h2>
                  <button
                    type="button"
                    onClick={() => setHomeContent((current) => ({ ...current, modals: [...current.modals, newModal()] }))}
                    className="rounded bg-cucina-dark px-4 py-2 font-sans text-sm text-white"
                  >
                    Add popup
                  </button>
                </div>

                {homeContent.modals.map((modal, index) => (
                  <div key={modal.id} className="rounded border border-border p-4">
                    <label className="flex items-center gap-2 font-sans text-sm text-foreground">
                      <input
                        type="checkbox"
                        checked={modal.active}
                        onChange={(event) => updateModal(index, { active: event.target.checked })}
                      />
                      Show this popup on the home page
                    </label>
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <div>
                        <FieldLabel>Title</FieldLabel>
                        <input value={modal.title} onChange={(event) => updateModal(index, { title: event.target.value })} className="mt-1 w-full rounded border border-input p-2 font-sans" />
                      </div>
                      <div>
                        <FieldLabel>Button text</FieldLabel>
                        <input value={modal.buttonLabel ?? ""} onChange={(event) => updateModal(index, { buttonLabel: event.target.value })} className="mt-1 w-full rounded border border-input p-2 font-sans" />
                      </div>
                      <div>
                        <FieldLabel>Start showing</FieldLabel>
                        <input
                          type="date"
                          value={modal.startsAt ?? ""}
                          onChange={(event) => updateModal(index, { startsAt: event.target.value })}
                          className="mt-1 w-full rounded border border-input p-2 font-sans"
                        />
                      </div>
                      <div>
                        <FieldLabel>Stop showing</FieldLabel>
                        <input
                          type="date"
                          value={modal.endsAt ?? ""}
                          onChange={(event) => updateModal(index, { endsAt: event.target.value })}
                          className="mt-1 w-full rounded border border-input p-2 font-sans"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <FieldLabel>Message</FieldLabel>
                        <textarea value={modal.body} onChange={(event) => updateModal(index, { body: event.target.value })} className="mt-1 min-h-28 w-full rounded border border-input p-2 font-sans" />
                      </div>
                      <div className="md:col-span-2">
                        <FieldLabel>Button link</FieldLabel>
                        <input value={modal.buttonUrl ?? ""} onChange={(event) => updateModal(index, { buttonUrl: event.target.value })} className="mt-1 w-full rounded border border-input p-2 font-sans" />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setHomeContent((current) => ({ ...current, modals: current.modals.filter((_, modalIndex) => modalIndex !== index) }))}
                      className="mt-4 rounded border border-red-200 px-3 py-2 font-sans text-sm text-red-700"
                    >
                      Remove popup
                    </button>
                  </div>
                ))}
              </div>
            )}

            {activeSection === "about" && (
              <div className="space-y-5">
                <h2 className="font-serif text-2xl text-cucina-dark">Our Story / About Us</h2>
                <div>
                  <FieldLabel>Heading</FieldLabel>
                  <input
                    value={homeContent.community?.heading ?? homeContent.about?.heading ?? "IN SAN ANSELMO SINCE 1998"}
                    onChange={(event) => setHomeContent((current) => ({
                      ...current,
                      community: {
                        heading: event.target.value,
                        paragraph: current.community?.paragraph ?? "",
                      },
                    }))}
                    className="mt-1 w-full rounded border border-input p-2 font-sans"
                  />
                </div>
                <div>
                  <FieldLabel>Story text</FieldLabel>
                  <textarea
                    value={
                      homeContent.community?.paragraph ??
                      (homeContent.about?.paragraphs ? homeContent.about.paragraphs.join("\n\n") : "")
                    }
                    onChange={(event) => setHomeContent((current) => ({
                      ...current,
                      community: {
                        heading: current.community?.heading ?? "IN SAN ANSELMO SINCE 1998",
                        paragraph: event.target.value,
                      },
                    }))}
                    className="mt-1 min-h-[220px] w-full rounded border border-input p-3 font-sans leading-relaxed"
                  />
                </div>
              </div>
            )}

            {activeSection === "specials" && renderMenuEditor("specials")}
            {activeMenuKey && renderMenuEditor(activeMenuKey)}

            <div className="mt-8 flex flex-col gap-3 border-t border-border pt-5 md:flex-row md:items-center md:justify-between">
              <p className="font-sans text-sm text-muted-foreground">{status}</p>
              <button
                type="submit"
                disabled={isSaving}
                className="rounded bg-cucina-dark px-6 py-3 font-sans text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OwnerPortal;
