import { useEffect, useState } from "react";
import SiteNav from "@/components/SiteNav";
import Footer from "@/components/Footer";
import OurStory from "@/components/OurStory";
import type { HomeContent } from "@/types/content";

const DEFAULT_HOME_CONTENT: HomeContent = {
  modals: [],
  about: {
    heading: "OUR STORY",
    paragraphs: [],
  },
};

const AboutUs = () => {
  const [homeContent, setHomeContent] = useState(DEFAULT_HOME_CONTENT);

  useEffect(() => {
    const loadHomeContent = async () => {
      try {
        const response = await fetch("/content/home.json", { cache: "no-store" });
        if (!response.ok) return;
        setHomeContent((await response.json()) as HomeContent);
      } catch {
        setHomeContent(DEFAULT_HOME_CONTENT);
      }
    };

    void loadHomeContent();
  }, []);

  return (
    <div className="min-h-screen bg-cucina-dark">
      <SiteNav variant="solid" />
      <main className="px-6 py-20">
        <OurStory about={homeContent.about} />
      </main>
      <Footer />
    </div>
  );
};

export default AboutUs;
