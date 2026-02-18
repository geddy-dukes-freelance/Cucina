import heroPasta from "@/assets/hero-pasta.jpg";
import cucinaLogo from "@/assets/cucina-logo.png";
import foodPizza from "@/assets/food-pizza.jpg";
import foodBrussels from "@/assets/food-brussels.jpg";
import foodCocktail from "@/assets/food-cocktail.jpg";
import woodOven from "@/assets/wood-oven.jpg";
import SiteNav from "@/components/SiteNav";

const RESERVATIONS_URL = "https://resy.com/cities/san-anselmo-ca/venues/cucina-sa?date=2020-08-10&seats=2";

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

      {/* Footer */}
      <footer id="contact" className="relative w-full aspect-[13/9]">
        {/* Wood oven image as background */}
        <img
          src={woodOven}
          alt="Wood-fired oven"
          className="absolute inset-0 w-full h-full object-cover contrast-[1.25] sepia-[0.1] grayscale-[0.2] brightness-[1.1]"
          style={{ objectPosition: "50% 70%" }}
        />

        {/* Grain & Vintage Effects */}
        <div className="absolute inset-0 bg-white/20 mix-blend-screen pointer-events-none" />
        <div className="absolute inset-0 bg-noise opacity-5=70 mix-blend-hard-light pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.3)_100%)] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Content Layer */}
        <div className="absolute inset-0 p-6 md:p-12 lg:p-16">
          <div className="flex justify-between items-start w-full h-full">
            {/* Left Column: Reservations + Logo */}
            <div className="flex flex-col items-start gap-4 md:gap-8">
              <a
                href={RESERVATIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="relative overflow-hidden group border border-white/80 text-white rounded-[50%] px-5 py-1.5 md:px-7 md:py-2 text-sm md:text-base font-sans tracking-wide hover:bg-white/10 transition-all duration-300 uppercase"
              >
                <span className="relative z-10">Reservations</span>
              </a>

              <img
                src={cucinaLogo}
                alt="Cucina"
                className="w-[200px] md:w-[400px] lg:w-[500px] max-w-[50vw] mix-blend-screen contrast-150"
              />
            </div>

            {/* Right Column: Contact Info - Aligned Left Text */}
            <div className="flex flex-col items-start text-left text-white mt-1 md:mt-2">
              <p className="text-[10px] md:text-xs font-sans tracking-[0.2em] uppercase mb-1 md:mb-2 text-white/80">&gt; Phone</p>
              <p className="text-xl md:text-3xl lg:text-4xl font-serif mb-4 md:mb-8 tracking-wide">415.454.2942</p>

              <p className="text-[10px] md:text-xs font-sans tracking-[0.2em] uppercase mb-1 md:mb-2 text-white/80">&gt; Instagram</p>
              <a
                href="https://instagram.com/cucinasa"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xl md:text-3xl lg:text-4xl font-serif hover:opacity-80 transition-opacity tracking-wide block"
              >
                @cucinasa
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
