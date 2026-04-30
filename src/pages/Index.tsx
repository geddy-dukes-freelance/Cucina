import cucinaLogo from "@/assets/cucina-logo.png";
import cucinaHeroVideo from "@/assets/cucina-hero.mov";
import cucinaStorefront from "@/assets/cucina-storefront.jpeg";
import cucinaPasta from "@/assets/cucina-pasta.jpeg";
import cucinaWine from "@/assets/cucina-wine.jpeg";
import cucinaSalad from "@/assets/cucina-salad.jpeg";
import SiteNav from "@/components/SiteNav";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full aspect-[16/9]" style={{ isolation: 'isolate' }}>
        <video
          src={cucinaHeroVideo}
          poster={cucinaStorefront}
          aria-label="Cucina San Anselmo storefront"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "50% 52%" }}
          autoPlay
          muted
          loop
          playsInline
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
          <h2 className="font-display text-4xl md:text-5xl font-light tracking-[0.08em] mb-10 text-primary-foreground">
            OUR STORY
          </h2>
          <div className="space-y-[0.5em] font-sans text-[15px] md:text-base font-light leading-relaxed text-center text-primary-foreground/85">
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
          <img src={cucinaSalad} alt="Seasonal salad with citrus and burrata" className="w-full h-64 object-cover" />
          <img src={cucinaWine} alt="Bottle of wine with a glass" className="w-full h-64 object-cover" />
          <img src={cucinaPasta} alt="Spaghetti with tomato sauce" className="w-full h-64 object-cover" />
        </div>

        {/* Handwritten sign-off */}
        <div className="max-w-3xl mx-auto mt-12 px-6 overflow-visible">
          <p
            className="font-script text-[clamp(1.85rem,6vw,3.25rem)] font-normal leading-[0.92] text-primary-foreground/85 origin-left max-w-full"
            style={{ transform: "translateX(clamp(-2.5rem, -5vw, -0.5rem)) rotate(-3deg)" }}
          >
            See you in<br />San Anselmo
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
