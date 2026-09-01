import { useEffect, useState } from "react";

const woodOven = "/assets/wood-oven.jpg";

interface FooterProps {
    signoffText?: string;
}

const Footer = ({ signoffText: customSignoff }: FooterProps) => {
    const [signoffText, setSignoffText] = useState(customSignoff || "See you in San Anselmo.");

    useEffect(() => {
        if (customSignoff) {
            setSignoffText(customSignoff);
            return;
        }
        const loadSignoff = async () => {
            try {
                const response = await fetch("/content/home.json", { cache: "no-store" });
                if (response.ok) {
                    const data = await response.json();
                    if (data.signoff) {
                        setSignoffText(data.signoff);
                    }
                }
            } catch {
                // Default fallback is already set
            }
        };
        void loadSignoff();
    }, [customSignoff]);

    return (
        <footer id="contact" className="w-full bg-[#160F0D] pt-14 pb-8 px-6 text-center text-white">
            <div className="max-w-4xl mx-auto space-y-10">
                {/* Dramatic Sign-off in Light Golden Cream */}
                <h2 className="font-serif italic text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#F5E6C8] select-none drop-shadow-md">
                    {signoffText}
                </h2>

                {/* Centered Wood-Fired Oven Image */}
                <div className="w-full overflow-hidden shadow-2xl border border-white/10 rounded-sm">
                    <img
                        src={woodOven}
                        alt="Wood-fired pizza oven with roaring fire"
                        className="w-full h-[280px] sm:h-[360px] md:h-[480px] object-cover"
                    />
                </div>

                {/* Contact Information Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-[#3B2C27]/60 text-center text-[#EDE4D7]">
                    <div>
                        <p className="font-display text-[10px] md:text-xs tracking-[0.2em] uppercase text-[#F5E6C8]/80 mb-1">LOCATION</p>
                        <p className="font-sans text-sm text-white/90">518 San Anselmo Ave<br />San Anselmo, CA 94960</p>
                    </div>

                    <div>
                        <p className="font-display text-[10px] md:text-xs tracking-[0.2em] uppercase text-[#F5E6C8]/80 mb-1">PHONE</p>
                        <a href="tel:4154542942" className="font-serif text-xl md:text-2xl text-white hover:text-[#F5E6C8] transition-colors block">
                            415.454.2942
                        </a>
                    </div>

                    <div>
                        <p className="font-display text-[10px] md:text-xs tracking-[0.2em] uppercase text-[#F5E6C8]/80 mb-1">INSTAGRAM</p>
                        <a
                            href="https://instagram.com/cucina_sa"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-serif text-xl md:text-2xl text-white hover:text-[#F5E6C8] transition-colors block"
                        >
                            @cucina_sa
                        </a>
                    </div>
                </div>

                {/* Bottom Bar: Woman Owned & Operated */}
                <div className="w-full flex flex-col sm:flex-row justify-between items-center text-[10px] md:text-xs text-[#F5E6C8] font-display tracking-[0.2em] uppercase border-t border-[#3B2C27]/60 pt-6">
                    <span className="text-white/80">Cucina SA • San Anselmo, CA</span>
                    <span className="font-semibold text-[#F5E6C8] bg-black/40 px-3.5 py-1 rounded-full border border-[#F5E6C8]/30 mt-2 sm:mt-0">
                        Woman Owned & Operated
                    </span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
