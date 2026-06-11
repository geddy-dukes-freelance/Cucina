import type { HomeContent } from "@/types/content";

interface OurStoryProps {
  about: HomeContent["about"];
}

const OurStory = ({ about }: OurStoryProps) => {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="font-display text-4xl md:text-5xl font-light tracking-[0.08em] mb-10 text-primary-foreground">
        {about.heading}
      </h1>
      <div className="space-y-[0.5em] font-sans text-[15px] md:text-base font-light leading-relaxed text-center text-primary-foreground/85">
        {about.paragraphs.map((paragraph) => (
          <p key={paragraph}>
            {paragraph.split("\n").map((line, index) => (
              <span key={`${line}-${index}`}>
                {index > 0 && <br />}
                {line}
              </span>
            ))}
          </p>
        ))}
      </div>
    </div>
  );
};

export default OurStory;
