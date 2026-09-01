import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
const cucinaLogo = "/assets/cucina-sa-logo-gold.png";

const RESERVATIONS_URL = "https://resy.com/cities/san-anselmo-ca/venues/cucina-sa?seats=2&date=2026-04-29";
const ORDER_ONLINE_URL = "https://order.toasttab.com/online/cucina-sa";
const GIFT_CARDS_URL = "https://order.toasttab.com/egiftcards/cucina-sa";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Menus", href: "/menu" },
  { label: "Our Story", href: "/story" },
  { label: "Reservations", href: RESERVATIONS_URL },
  { label: "Order Online", href: ORDER_ONLINE_URL },
  { label: "Gift Cards", href: GIFT_CARDS_URL },
  { label: "Contact Us", href: "#contact" },
];

interface SiteNavProps {
  variant?: "overlay" | "solid";
}

const SiteNav = ({ variant = "overlay" }: SiteNavProps) => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const isExternal = (href: string) => href.startsWith("http");
  const isHash = (href: string) => href.startsWith("#");

  const bgClass = variant === "solid" ? "bg-cucina-dark" : "";
  const textClass = variant === "solid" ? "text-primary-foreground" : "text-white";

  return (
    <nav className={`${variant === "overlay" ? "absolute top-0 left-0 z-20" : "relative z-20"} w-full flex justify-between items-center px-6 md:px-8 py-3 md:py-4 ${bgClass}`}>
      {/* Logo - visible on solid nav */}
      {variant === "solid" && (
        <Link to="/" className="flex items-center gap-2">
          <img src={cucinaLogo} alt="Cucina SA" className="h-8 md:h-10 w-auto" />
        </Link>
      )}

      {/* Desktop Nav */}
      <div className={`hidden md:flex ${variant === "overlay" ? "ml-auto" : ""} items-center gap-6`}>
        {NAV_ITEMS.map((item) =>
          isExternal(item.href) ? (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`${textClass} font-nav text-base font-light tracking-wide hover:opacity-70 transition-opacity italic`}
            >
              {item.label}
            </a>
          ) : isHash(item.href) ? (
            <a
              key={item.label}
              href={item.href}
              className={`${textClass} font-nav text-base font-light tracking-wide hover:opacity-70 transition-opacity italic`}
            >
              {item.label}
            </a>
          ) : (
            <Link
              key={item.label}
              to={item.href}
              className={`${textClass} font-nav text-base font-light tracking-wide hover:opacity-70 transition-opacity italic ${location.pathname === item.href ? "font-normal" : ""}`}
            >
              {item.label}
            </Link>
          )
        )}
      </div>

      {/* Mobile Hamburger */}
      <div className={`md:hidden ${variant === "overlay" ? "ml-auto" : ""}`}>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button className="text-white p-2" aria-label="Open menu">
              <Menu className="h-7 w-7" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-cucina-dark border-cucina-brown w-[280px]">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <div className="flex flex-col gap-6 mt-8">
              {NAV_ITEMS.map((item) =>
                isExternal(item.href) ? (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                    className="text-primary-foreground font-nav text-2xl font-light tracking-wide hover:opacity-70 transition-opacity italic"
                  >
                    {item.label}
                  </a>
                ) : isHash(item.href) ? (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="text-primary-foreground font-nav text-2xl font-light tracking-wide hover:opacity-70 transition-opacity italic"
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={item.label}
                    to={item.href}
                    onClick={() => setOpen(false)}
                    className={`text-primary-foreground font-nav text-2xl font-light tracking-wide hover:opacity-70 transition-opacity italic ${location.pathname === item.href ? "font-normal" : ""}`}
                  >
                    {item.label}
                  </Link>
                )
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default SiteNav;
