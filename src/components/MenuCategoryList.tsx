import type { MenuCategory } from "@/types/content";

interface MenuCategoryListProps {
    data: MenuCategory[];
    theme?: "dark" | "light";
}

const MenuCategoryList = ({ data, theme = "dark" }: MenuCategoryListProps) => {
    const isLight = theme === "light";

    return (
        <div className="space-y-12 max-w-3xl mx-auto">
            {data.map((cat) => {
                if (cat.category === "NOTES") {
                    return (
                        <div key={cat.category} className={`border-t ${isLight ? "border-[#3B2C27]/20" : "border-[#3B2C27]"} pt-6 text-center space-y-1.5`}>
                            {cat.items.map((item, index) => (
                                <p key={index} className={`font-sans text-xs md:text-sm italic ${isLight ? "text-[#3B2C27]/80" : "text-[#EDE4D7]/80"}`}>
                                    {item.description}
                                </p>
                            ))}
                        </div>
                    );
                }

                return (
                    <div key={cat.category} className="space-y-5">
                        <h2 className={`font-display text-sm md:text-base tracking-[0.2em] font-semibold uppercase border-b ${isLight ? "text-[#3B2C27] border-[#3B2C27]/20" : "text-[#EDE4D7] border-[#3B2C27]"} pb-2`}>
                            {cat.category}
                        </h2>

                        <div className="space-y-6">
                            {cat.items.map((item, idx) => (
                                <div key={`${item.name}-${idx}`} className="space-y-1 border-b border-transparent pb-1">
                                    <div className="flex justify-between items-baseline gap-4">
                                        <span className={`font-sans font-bold text-base md:text-lg ${isLight ? "text-[#3B2C27]" : "text-white"}`}>
                                            {item.name}
                                        </span>
                                        {item.price && (
                                            <span className={`font-sans font-semibold text-sm md:text-base ${isLight ? "text-[#3B2C27]" : "text-[#EDE4D7]"}`}>
                                                ${item.price}
                                            </span>
                                        )}
                                    </div>
                                    {item.description && (
                                        <p className={`font-sans text-xs md:text-sm leading-relaxed ${isLight ? "text-[#3B2C27]/85" : "text-white/80"}`}>
                                            {item.description}
                                        </p>
                                    )}
                                    {item.note && (
                                        <p className={`font-sans text-[11px] md:text-xs italic ${isLight ? "text-[#3B2C27]/65" : "text-[#EDE4D7]/65"}`}>
                                            {item.note}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default MenuCategoryList;
