import heroPasta from "@/assets/hero-pasta.jpg";
import cucinaLogo from "@/assets/cucina-logo.png";
import foodPizza from "@/assets/food-pizza.jpg";
import foodBrussels from "@/assets/food-brussels.jpg";
import foodCocktail from "@/assets/food-cocktail.jpg";
import woodOven from "@/assets/wood-oven.jpg";

const RESERVATIONS_URL = "https://resy.com/cities/san-anselmo-ca/venues/cucina-sa?date=2020-08-10&seats=2";
const ORDER_ONLINE_URL = "https://order.toasttab.com/online/cucina-sa";
const GIFT_CARDS_URL = "https://order.toasttab.com/egiftcards/cucina-sa";

const Index = () => {
  const scrollToStory = () => {
    document.getElementById("story")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px]" style={{ isolation: 'isolate' }}>
        <div className="absolute inset-0">
          <img
            src={heroPasta}
            alt="Cucina SA signature pasta dish"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-cucina-dark/30" />
        </div>

        {/* Navigation */}
        <nav className="relative z-20 flex justify-end items-center px-8 py-6 gap-8">
          {[
            { label: "Home", href: "#" },
            { label: "Menu", href: "#" },
            { label: "Reservations", href: RESERVATIONS_URL },
            { label: "Order Online", href: ORDER_ONLINE_URL },
            { label: "Gift Cards", href: GIFT_CARDS_URL },
            { label: "Contact Us", href: "#contact" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="text-primary-foreground font-sans text-sm tracking-wide hover:opacity-70 transition-opacity italic"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Logo centered */}
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src={cucinaLogo}
            alt="Cucina"
            className="w-[500px] max-w-[70vw] mix-blend-screen"
          />
        </div>
      </section>

      {/* Our Story Section */}
      <section id="story" className="bg-cucina-dark py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-5xl font-light tracking-wide mb-10 text-primary-foreground">
            OUR STORY
          </h2>
          <div className="space-y-6 font-sans text-base leading-relaxed text-center text-primary-foreground/85">
            <p>
              A neighborhood is more than a place. It's the people who gather there, the familiar faces, the feeling of comfort when you walk through the door. It's where stories are shared, meals linger, and time slows just enough.
            </p>
            <p>We're grateful to call San Anselmo our home.</p>
            <p>
              Cucina has been part of this neighborhood since 1998, and while much has evolved over the years, the spirit remains the same. Today's Cucina SA is a refreshed take on a longtime favorite; warm, welcoming, and rooted in the simple joy of good food enjoyed together.
            </p>
            <p>
              Our wood-fired oven is lit each evening, the bar is always pouring thoughtfully chosen wine, beer, and cocktails, and there's usually a game on for those who want to stay awhile. Our Southern Italian–inspired dishes are made with care, with daily specials that keep things interesting and just a little unexpected.
            </p>
            <p>
              Whether you live just up the street or are joining us from across the bridge, we hope Cucina feels like a place you can settle into — for a quick bite, a long dinner, or anything in between. Plenty of smiles come standard.
            </p>
            <p>
              Owner Donna welcomes you back — or invites you in for the first time.<br />
              We're always here, and we hope to see you soon.
            </p>
          </div>
        </div>

        {/* Food Gallery */}
        <div className="max-w-3xl mx-auto mt-16 grid grid-cols-3 gap-1">
          <img src={foodPizza} alt="Wood-fired pizza" className="w-full h-64 object-cover" />
          <img src={foodBrussels} alt="Crispy brussels sprouts" className="w-full h-64 object-cover" />
          <img src={foodCocktail} alt="Craft cocktail" className="w-full h-64 object-cover" />
        </div>

        {/* Handwritten sign-off */}
        <div className="max-w-3xl mx-auto mt-12">
          <p className="font-script text-4xl text-primary-foreground/85">
            See you in<br />San Anselmo
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="relative bg-cucina-dark text-primary-foreground" style={{ isolation: 'isolate' }}>
        <div className="px-8 py-12">
          <div className="flex flex-col md:flex-row items-start justify-between max-w-6xl mx-auto">
            {/* Left: Reservations + Logo */}
            <div className="flex flex-col items-start">
              <a
                href={RESERVATIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-primary-foreground/60 rounded-full px-6 py-2 text-sm font-sans tracking-wide hover:bg-primary-foreground/10 transition-colors mb-6"
              >
                Reservations
              </a>
              <img src={cucinaLogo} alt="Cucina" className="w-[350px] max-w-[50vw] mix-blend-screen" />
            </div>

            {/* Right: Contact Info */}
            <div className="mt-8 md:mt-8 text-right">
              <p className="text-xs font-sans tracking-wider uppercase mb-1 text-primary-foreground/60">&gt; Phone</p>
              <p className="text-2xl font-serif mb-6">415.454.2942</p>
              <p className="text-xs font-sans tracking-wider uppercase mb-1 text-primary-foreground/60">&gt; Instagram</p>
              <a
                href="https://instagram.com/cucinasa"
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl font-serif hover:opacity-70 transition-opacity"
              >
                @cucinasa
              </a>
            </div>
          </div>
        </div>

        {/* Wood oven image at bottom */}
        <div className="w-full h-[300px] overflow-hidden">
          <img
            src={woodOven}
            alt="Wood-fired oven"
            className="w-full h-full object-cover object-center"
          />
        </div>
      </footer>
    </div>
  );
};

export default Index;
