
export type MenuItem = {
    name: string;
    description: string;
    note?: string;
    price?: string; // Adding optional price field just in case
};

export type MenuCategory = {
    category: string;
    items: MenuItem[];
};

export const DINNER_MENU: MenuCategory[] = [
    {
        category: "ANTIPASTO",
        items: [
            { name: "Bruschetta", description: "Jane Bakery bread toasted & topped with chopped tomatoes, garlic & basil", note: "2 pieces" },
            { name: "Arancini", description: "Risotto balls, prosciutto, mozzarella, marinara, salsa verde" },
            { name: "Brussel Sprout Chips", description: "Brussel sprout leaves, lime, honey, sriracha" },
            { name: "Tartare di Tonno", description: "Ahi tuna, avocado, miso sauce, spicy aioli, served with house made chips" },
            { name: "Fritto Misto", description: "Calamari, small prawns, lemon, red onion, spicy aioli" },
            { name: "Polpettini", description: "Beef & pork meatballs, marinara sauce, crostini" },
            { name: "Carpaccio di Zucchini", description: "Zucchini, almonds, pecorino cheese" },
        ],
    },
    {
        category: "INSALATA",
        items: [
            { name: "Insalata di Verdura", description: "Mixed organic greens with sauteed veggies and our house garlic dressing" },
            { name: "Insalata con Bettole", description: "Roasted beets, avocado, arugula, goat cheese, almonds, shallot-mustard vinaigrette" },
            { name: "Insalata Azzuro", description: "Little gem greens, blue cheese dressing, crispy pancetta, fried shallot, cherry tomato" },
            { name: "Insalata di Cavolo", description: "Kale, shaved brussel sprouts, almonds, lemon, parmesan, meyer lemon oil" },
            { name: "Options", description: "add protein: roasted chicken, prawns, salmon, fried calamari" },
        ],
    },
    {
        category: "PIZZA",
        items: [
            { name: "Pizza Margherita", description: "Fresh buffala mozzarella, tomato, basil" },
            { name: "Pizza Bianco", description: "Assorted mixed mushrooms, fontina cheese, and truffle oil" },
            { name: "Pizza con Salsicce", description: "Italian sausage, portobellos, tomato, fontina" },
            { name: "Pizza Quattro Stagione", description: "four sections- prosciutto, artichokes, red onions & olives, mushrooms" },
            { name: "Pizza Casalinga", description: "mozzarella and white bean, topped with bruschetta mix and greens" },
            { name: "Calzone", description: "Calabrian Sausage, ricotta, mozzarella, tomato" },
            { name: "Options", description: "Miyoko’s Vegan mozzarella, Prosciutto, Farm fresh egg" },
        ],
    },
    {
        category: "PASTA",
        items: [
            { name: "Bombolotti al Sugo", description: "Rigatoni, diced steak, sausage, mushrooms, tomato sauce, mascarpone" },
            { name: "Linguine con Vongole", description: "Linguine with clams, chili flakes, garlic and white wine" },
            { name: "Ravioli di Piselli", description: "House made ravioli with English peas and ricotta, in lemon cream sauce" },
            { name: "Tortellini al Forno", description: "Pork-filled tortellini, mushrooms, prosciutto, cream, mozzarella" },
            { name: "Ravioli di Pollo", description: "House made ravioli with chicken and ricotta, in a chicken Bolognese" },
            { name: "Spaghetti Carbonara", description: "Spaghetti with the classic carbonara- egg yolk, pancetta, shallot, and parmesan cheese" },
            { name: "Gnocchi Primavera", description: "House made gnocchi, English peas, asparagus, swiss chard, crispy pancetta and touch of cream" },
            { name: "Option", description: "Gluten free pasta" },
        ],
    },
    {
        category: "SECONDI",
        items: [
            { name: "Orecchiette d’Elefante", description: "Boneless breast of chicken with breaded & fried, served over greens, with tomato & blue cheese, balsamic vinegar" },
            { name: "Salmone al Agro", description: "Fresh salmon with capers, olives, white wine and garlic" },
            { name: "Pesce Piccata", description: "Petrale sole sauteed with capers, lemon, olive oi, with risotto" },
            { name: "Gamberi Scampi", description: "Prawns sauteed with tomatoes, garlic and wine, served with asparagus" },
            { name: "Maiale Milanese", description: "Pork chop pounded, breaded and pan fried, with apple-frisee salad and mustard sauce" },
            { name: "Pollo Siciliana", description: "Boneless breast of chicken with prosciutto, capers, olives, garlic, and white wine, served with carrots & green beans" },
            { name: "Bistecca", description: "Marinated skirt steak served with smashed potatoes and green beans, salsa verde" },
        ],
    },
    {
        category: "CONTORNI",
        items: [
            { name: "Smashed Potatoes", description: "Sea salt, herbs" },
            { name: "Roasted Brussel Sprouts", description: "Pancetta, almonds, Extra Virgin Olive Oil" },
            { name: "Polenta Fries", description: "Marinara sauce" },
            { name: "Asparagus", description: "Sautéed with olive oil and garlic" },
        ],
    },
    {
        category: "MENU PER BAMBINI",
        items: [
            { name: "Polpettini", description: "Beef and pork meatballs in our housemade marinara sauce" },
            { name: "Pasta con Formaggio", description: "Penne pasta with butter and cheese" },
            { name: "Bombolotti Marinara", description: "Large pasta tubes with our marinara sauce" },
            { name: "Cotolette di Pollo", description: "Two chicken cutlets breaded and lightly fried" },
            { name: "Pizza con Formaggio", description: "Tomato pizza topped with fresh mozzarella" },
            { name: "Pasta con Polpettini", description: "Penne with marinara sauce and meatballs" },
        ],
    },
    {
        category: "DOLCI",
        items: [
            { name: "Tiramisu", description: "Ladyfingers dipped in espresso and rum, layered with mascarpone cheese & chocolate" },
            { name: "Tartuffo Nero", description: "Chocolate gelato rolled around Italian Morena cherries, covered in chopped Ghirardelli chocolate" },
            { name: "Zabaglione Classico", description: "A frothy mixture of egg, wine, and sugar, served warm from the stove" },
            { name: "Donna’s Amazing Almond Cake", description: "A light almond cake with berries and fresh cream" },
            { name: "Zabaglione Freddo", description: "Cold zabaglione layered with amaretto cookie crumbs and seasonal fruit" },
            { name: "Gelato", description: "Your choice of chocolate or vanilla bean gelato" },
            { name: "Fantasia di Cioccolato", description: "Flourless chocolate mousse cake with cold zabaglione, cherry sauce" },
        ],
    },
    {
        category: "NOTES",
        items: [
            { name: "", description: "20% gratuity added to parties of 6 or more people" },
            { name: "", description: "Corkage $25 per 750ml bottle" },
        ],
    },
];

export const LUNCH_MENU: MenuCategory[] = [
    {
        category: "BRUNCH SPECIALS",
        items: [
            { name: "Available Saturday and Sunday", description: "" },
            { name: "Zeppoles", description: "Italian-style donuts with cinnamon & sugar" },
            { name: "Scrambled Eggs", description: "with smoked salmon and goat cheese GF" },
            { name: "French Toast", description: "thick sliced Texas Toast with ricotta, fresh strawberries and maple syrup" },
            { name: "Avocado Toast", description: "fresh sliced avocado on toasted MHBB bread, fried egg and crumbled pancetta" },
            { name: "Soft Polenta Poached Eggs", description: "with sauteed kale, tomato, basil and freshly grated parmesan" },
            { name: "Breakfast Pizza", description: "with fontina cheese, smoked ham, and two sunnyside up eggs baked in wood fired oven" },
        ],
    },
    {
        category: "STARTERS",
        items: [
            { name: "Carpaccio di Zucchini", description: "julienned zucchini, toasted almonds, pecorino GF" },
            { name: "Arancini", description: "risotto balls stuffed with mozzarella, prosciutto, marinara" },
            { name: "Fritto Misto", description: "lightly fried fresh calamari, small prawns, lemon, onion, & spicy aioli GF" },
            { name: "Brussel sprout chips", description: "brussel sprout leaves, honey, lime, sriracha GF" },
            { name: "Tonno Tartare", description: "ahi tuna tartare, avocado, miso, spicy aioli" },
            { name: "Zuppa", description: "soup of the day- AQ" },
            { name: "MHBB bread", description: "" },
        ],
    },
    {
        category: "SALADS",
        items: [
            { name: "Insalata Cucina", description: "crisp chopped salad with salami, ceci beans, mozzarella, egg, olives, tmato, mised greens and balsamic vinaigrette" },
            { name: "Insalata con Pollo", description: "roasted chicken, tomatoes, pesto, blue cheese, almonds, mixed greens (option of goat cheese instead of blue) GF" },
            { name: "Insalata di Cavolo Nero", description: "shredded kale, brussel sprouts, almonds, pecorino cheese, lemon vinaigrette" },
            { name: "Option", description: "add calamari, chicken, prawns, or salmon GF" },
        ],
    },
    {
        category: "ENTREES",
        items: [
            { name: "Cucina Burger", description: "smashed beef burger, fontina cheese, garlic aioli, caramelized onions on brioche bun with homemade fries" },
            { name: "Buttermilk Fried Chicken Sandwich", description: "fried chicken thigh, pickles, fontina, coleslaw, lemon aioli on brioche with homemade fries" },
            { name: "Fish and Chips", description: "fresh halibut lightly beer battered and fried, with homemade fries and tartar sauce" },
            { name: "Pollo “Katsu”", description: "chicken cutlets with spicy aioli and arugula on brioche with homemade chips" },
            { name: "Melanzane alla Parmigiana", description: "panko fried eggplant, marinara, basil, mozzarella on brioche with homemade chips" },
            { name: "Salmone al’Agro", description: "salmon, capers, lemon, garlic, wine, over penne or mixed greens" },
            { name: "Pollo alla Milanese", description: "Chicken cutlets breaded in panko and fried, serve with arugula salad" },
            { name: "Meatballs al Sugo", description: "house made beef meatballs in our house marinara, with fresh mozzarella" },
            { name: "Spaghetti all’Amalfi", description: "spaghetti with caramelized zucchini, lemon zest, ricotta and parmesan" },
            { name: "Penne alla Norma", description: "penne with fried eggplant, burrata, basil, and marinara" },
            { name: "Ravioli del Giorno", description: "house made ravioli prepared daily, as per the Chef" },
            { name: "Bombolotti al Sugo", description: "rigatoni, sausage, mushrooms, tomato sauce, mascarpone" },
        ],
    },
    {
        category: "WOOD FIRED PIZZA",
        items: [
            { name: "Pizza Margherita", description: "fresh buffala mozzarella, tomato sauce, basil" },
            { name: "Pizza con Salsicce", description: "spicy sausage, portobello mushrooms, tomato sauce fontina" },
            { name: "Pizza Bianco", description: "assorted wild mushrooms ,fontina cheese, Italian white truffle oil" },
            { name: "Pizza al Pesto", description: "basil pesto sauce, mozzarella, thinly sliced potato" },
            { name: "Calzone", description: "stuffed with ricotta, sausage, mozzarella, tomato" },
        ],
    },
];

export const HAPPY_HOUR_MENU: MenuCategory[] = [
    {
        category: "$10 COCKTAIL SPECIALS",
        items: [
            { name: "HUGO GIRL", description: "elderflower, mint, lime, prosecco" },
            { name: "GILDED LILIES", description: "gin, citrus, prosecco, mint" },
            { name: "DO-RE-MI", description: "vodka, house midori, lime, lemon" },
            { name: "MT DIABLO", description: "tequila, mezcal, lime, ginger beer, cocchi rosa" },
            { name: "BEGGAR'S BANQUET", description: "bourbon, lemon, sassafras bitters, ale" },
            { name: "SIXTH BOROUGH", description: "bourbon, amaro di lago maggiore, grapefruit" },
        ],
    },
    {
        category: "$6 BEER DRAFTS",
        items: [
            { name: "PILSNER", description: "north coast brewing" },
            { name: "PALE ALE", description: "faction" },
            { name: "IPA", description: "hen house" },
            { name: "HAZY IPA", description: "hen house" },
        ],
    },
    {
        category: "$9 WINE",
        items: [
            { name: "PROSECCO", description: "veneto" },
            { name: "SAUVIGNON BLANC", description: "napa" },
            { name: "ROSÉ", description: "puglia" },
            { name: "BARBERA", description: "piemonte" },
        ],
    },
    {
        category: "HAPPY HOUR BITES",
        items: [
            { name: "BUFFALO CAULIFLOWER", description: "tabasco tempura, blue cheese dressing", price: "10" },
            { name: "POLENTA CAKES", description: "wild mushrooms, marinara, mascarpone", price: "10" },
            { name: "CROSTINI", description: "salmon salad, chopped greens", price: "10" },
            { name: "SOUP DU JOUR", description: "ask your server", price: "8" },
            { name: "POLPETTINI", description: "pork and beef meatballs, marinara, bread", price: "10" },
            { name: "FRITTO MISTO", description: "calamari, prawn, lemon, onions, spicy aioli", price: "12" },
        ],
    },
    {
        category: "NOTES",
        items: [
            { name: "", description: "AVAILABLE TUESDAY - SUNDAY 3PM - 5PM" },
        ],
    },
];
