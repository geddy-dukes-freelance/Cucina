import heroPasta from "@/assets/hero-pasta.jpg";
import cucinaLogo from "@/assets/cucina-logo.png";
import foodPizza from "@/assets/food-pizza.jpg";
import foodBrussels from "@/assets/food-brussels.jpg";
import foodCocktail from "@/assets/food-cocktail.jpg";
import woodOven from "@/assets/wood-oven.jpg";
import SiteNav from "@/components/SiteNav";
import Footer from "@/components/Footer";

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
      <section className="relative w-full aspect-[16/9]" style={{ isolation: 'isolate' }}>
        <img
          src={heroPasta}
          alt="Cucina SA signature pasta dish"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "50% 60%" }}
        />
        <div className="absolute inset-0 bg-cucina-dark/30" />

        {/* Navigation */}
        <SiteNav variant="overlay" />

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

      <Footer />
    </div>
  );
};

export default Index;
