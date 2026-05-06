import woodOven from "@/assets/wood-oven.jpg";
import cucinaLogo from "@/assets/cucina-logo-transparent.png";

const RESERVATIONS_URL = "https://resy.com/cities/san-anselmo-ca/venues/cucina-sa?seats=2&date=2026-04-29";

const Footer = () => {
    return (
        <footer id="contact" className="relative w-full aspect-[15/9]">
            {/* Wood oven image as background */}
            <img
                src={woodOven}
                alt="Wood-fired oven"
                className="absolute inset-0 w-full h-full object-cover contrast-[1.25] sepia-[0.1] grayscale-[0.2] brightness-[1.1]"
                style={{ objectPosition: "50% 65%" }}
            />

            {/* Grain & Vintage Effects */}
            <div className="absolute inset-0 bg-white/20 mix-blend-screen pointer-events-none" />
            <div className="absolute inset-0 bg-noise opacity-[0.07] mix-blend-hard-light pointer-events-none" />
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
                            className="relative overflow-hidden group border border-white/80 text-white rounded-[50%] px-5 py-1.5 md:px-7 md:py-2 text-sm md:text-base font-body font-light tracking-wide hover:bg-white/10 transition-all duration-300"
                        >
                            <span className="relative z-10">Reservations</span>
                        </a>

                        <img
                            src={cucinaLogo}
                            alt="Cucina"
                            className="w-[200px] md:w-[400px] lg:w-[500px] max-w-[50vw] contrast-150"
                        />
                    </div>

                    {/* Right Column: Contact Info - Aligned Left Text */}
                    <div className="flex flex-col items-start text-left text-white mt-1 md:mt-2">
                        <p className="text-[10px] md:text-xs font-sans tracking-[0.2em] uppercase mb-1 md:mb-2 text-white/80">&gt; Phone</p>
                        <p className="text-xl md:text-3xl lg:text-4xl font-serif mb-3 md:mb-5 tracking-wide">415.454.2942</p>

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
    );
};

export default Footer;
