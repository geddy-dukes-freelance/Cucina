import type { MenuCategory } from "@/types/content";

interface MenuCategoryListProps {
    data: MenuCategory[];
}

const MenuCategoryList = ({ data }: MenuCategoryListProps) => {
    return (
        <div className="space-y-16">
            {data.map((cat) => {
                if (cat.category === "NOTES") {
                    return (
                        <div key={cat.category} className="flex flex-col items-center space-y-2 mt-8">
                            {cat.items.map((item, index) => (
                                <p key={index} className="font-sans text-foreground/80 text-center italic">
                                    {item.description}
                                </p>
                            ))}
                        </div>
                    );
                }

                return (
                    <div key={cat.category} className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-y-6 gap-x-12">
                        {/* Category Name */}
                        <h2 className="font-sans text-lg md:text-xl tracking-[0.15em] text-muted-foreground font-semibold uppercase">
                            {cat.category}
                        </h2>

                        {/* Items */}
                        <div className="space-y-5">
                            {cat.items.map((item) => (
                                <div key={item.name}>
                                    <span className="font-sans font-bold text-foreground">{item.name}</span>
                                    {"  "}
                                    <span className="font-sans text-foreground/80">{item.description}</span>
                                    {item.note && (
                                        <span className="font-sans text-foreground/60 ml-3">{item.note}</span>
                                    )}
                                    {item.price && (
                                        <span className="font-sans text-foreground ml-3">${item.price}</span>
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
