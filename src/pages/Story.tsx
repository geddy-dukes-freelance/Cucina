import { useEffect, useState } from "react";
import SiteNav from "@/components/SiteNav";
import Footer from "@/components/Footer";
import type { HomeContent } from "@/types/content";

const cucinaIllustration = "/assets/cucina-illustration.png";

const DEFAULT_STORY_PARAGRAPHS = [
  "At Cucina, modern Italian cuisine meets the freshness and abundance of California's seasonal ingredients.",
  "Our menu brings together Italian inspiration, thoughtfully prepared dishes, and a curated selection of Italian and California wines—all served in a warm, vibrant setting in the heart of San Anselmo.",
  "Whether you're joining us for a casual dinner, a celebration with family and friends, or an evening over great food and wine, we're committed to creating an experience that is welcoming, memorable, and worth returning for.",
  "Proudly woman-owned and operated, Cucina has been serving the Marin community for more than 27 years while continuing to evolve with the seasons, our community, and a passion for exceptional hospitality.",
];

const Story = () => {
  const [paragraphs, setParagraphs] = useState<string[]>(DEFAULT_STORY_PARAGRAPHS);

  useEffect(() => {
    window.scrollTo(0, 0);
    const loadContent = async () => {
      try {
        let data: HomeContent | null = null;
        try {
          const apiRes = await fetch("/api/content?path=public/content/home.json", { cache: "no-store" });
          if (apiRes.ok) {
            data = (await apiRes.json()) as HomeContent;
          }
        } catch {
          // Fallback
        }

        if (!data) {
          const staticRes = await fetch("/content/home.json", { cache: "no-store" });
          if (staticRes.ok) {
            data = (await staticRes.json()) as HomeContent;
          }
        }

        if (data?.about?.paragraphs && data.about.paragraphs.length > 0) {
          setParagraphs(data.about.paragraphs);
        }
      } catch {
        // Fallback to defaults
      }
    };

    void loadContent();
  }, []);

  return (
    <div className="min-h-screen bg-[#160F0D] text-white selection:bg-[#EDE4D7] selection:text-[#160F0D] flex flex-col justify-between">
      <SiteNav variant="solid" />

      <main className="flex-grow max-w-6xl mx-auto px-6 py-12 md:py-20 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Left Column: Story Text */}
          <div className="md:col-span-7 space-y-6 text-left">
            <h1 className="font-serif italic text-4xl sm:text-5xl md:text-6xl text-[#F5C86C] drop-shadow-md">
              Our Story
            </h1>

            <div className="space-y-5 text-white/90 font-sans text-sm md:text-base leading-relaxed font-light">
              {paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>

          {/* Right Column: Architectural Drawing Illustration */}
          <div className="md:col-span-5 flex justify-center items-center">
            <div className="relative max-w-md w-full p-2">
              <img
                src={cucinaIllustration}
                alt="Architectural drawing of Cucina SA storefront"
                className="w-full h-auto object-contain filter brightness-110 contrast-105 opacity-90"
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Story;
