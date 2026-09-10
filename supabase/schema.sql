-- ==============================================================================
-- Cucina SA: Supabase Database Setup & Initial Seed
-- ==============================================================================
-- Run this SQL in your Supabase project (SQL Editor -> New Query -> Run).

-- 1. Create the site_content table
create table if not exists public.site_content (
  key text primary key,
  content jsonb not null,
  updated_at timestamptz default now() not null
);

-- 2. Enable Row Level Security (RLS)
alter table public.site_content enable row level security;

-- Drop existing policies if re-running
drop policy if exists "Allow public read access" on public.site_content;
drop policy if exists "Allow service role full access" on public.site_content;
drop policy if exists "Allow authenticated update access" on public.site_content;

-- 3. Create security policies
-- Anyone can view the menu, home content, and specials
create policy "Allow public read access"
  on public.site_content
  for select
  to public
  using (true);

-- Backend API and service role can insert and update
create policy "Allow service role full access"
  on public.site_content
  for all
  to service_role
  using (true)
  with check (true);

-- 4. Seed initial content pre-populated with current live data
insert into public.site_content (key, content, updated_at)
values
  ('home', $$
{
  "modals": [
    {
      "id": "welcome",
      "active": false,
      "title": "Welcome to Cucina",
      "body": "Join us for seasonal Southern Italian cooking in San Anselmo.",
      "buttonLabel": "Make a Reservation",
      "buttonUrl": "https://resy.com/cities/san-anselmo-ca/venues/cucina-sa?seats=2&date=2026-04-29",
      "startsAt": "",
      "endsAt": ""
    }
  ],
  "hero": {
    "headline": "At Cucina, modern Italian cuisine meets the freshness and abundance of California's seasonal ingredients.",
    "scriptSubtitle": "Italian at heart: San Anselmo through and through.",
    "paragraph": "Our menu brings together Italian inspiration, thoughtfully prepared dishes, craft cocktails, and a curated selection of Italian and California wines—all served in a warm, vibrant setting in the heart of San Anselmo."
  },
  "community": {
    "heading": "IN SAN ANSELMO SINCE 1998",
    "paragraph": "Since 1998, Cucina has been a neighborhood gathering place for celebrations big and small. From weeknight dinners to birthday toasts, we're grateful to grow with the community we call home."
  },
  "signoff": "See you in San Anselmo"
}
$$::jsonb, now()),
  ('menu', $$
{
  "specials": {
    "title": "WEEKLY SPECIALS",
    "updatedAt": "2026-05-28",
    "categories": [
      {
        "category": "THIS WEEK",
        "items": [
          {
            "name": "Chef's Special",
            "description": "Updated weekly by the Cucina team",
            "price": ""
          }
        ]
      }
    ]
  },
  "menus": {
    "dinner": {
      "title": "DINNER MENU",
      "categories": [
        {
          "category": "ANTIPASTO",
          "items": [
            {
              "name": "Bruschetta",
              "description": "Jane Bakery bread toasted & topped with chopped tomatoes, garlic & basil",
              "note": "2 pieces"
            },
            {
              "name": "Arancini",
              "description": "Risotto balls, prosciutto, mozzarella, marinara, salsa verde"
            },
            {
              "name": "Brussel Sprout Chips",
              "description": "Brussel sprout leaves, lime, honey, sriracha"
            },
            {
              "name": "Tartare di Tonno",
              "description": "Ahi tuna, avocado, miso sauce, spicy aioli, served with house made chips"
            },
            {
              "name": "Fritto Misto",
              "description": "Calamari, small prawns, lemon, red onion, spicy aioli"
            },
            {
              "name": "Polpettini",
              "description": "Beef & pork meatballs, marinara sauce, crostini"
            },
            {
              "name": "Carpaccio di Zucchini",
              "description": "Zucchini, almonds, pecorino cheese"
            }
          ]
        },
        {
          "category": "INSALATA",
          "items": [
            {
              "name": "Insalata di Verdura",
              "description": "Mixed organic greens with sauteed veggies and our house garlic dressing"
            },
            {
              "name": "Insalata con Bettole",
              "description": "Roasted beets, avocado, arugula, goat cheese, almonds, shallot-mustard vinaigrette"
            },
            {
              "name": "Insalata Azzuro",
              "description": "Little gem greens, blue cheese dressing, crispy pancetta, fried shallot, cherry tomato"
            },
            {
              "name": "Insalata di Cavolo",
              "description": "Kale, shaved brussel sprouts, almonds, lemon, parmesan, meyer lemon oil"
            },
            {
              "name": "Options",
              "description": "add protein: roasted chicken, prawns, salmon, fried calamari"
            }
          ]
        },
        {
          "category": "PIZZA",
          "items": [
            {
              "name": "Pizza Margherita",
              "description": "Fresh buffala mozzarella, tomato, basil"
            },
            {
              "name": "Pizza Bianco",
              "description": "Assorted mixed mushrooms, fontina cheese, and truffle oil"
            },
            {
              "name": "Pizza con Salsicce",
              "description": "Italian sausage, portobellos, tomato, fontina"
            },
            {
              "name": "Pizza Quattro Stagione",
              "description": "four sections- prosciutto, artichokes, red onions & olives, mushrooms"
            },
            {
              "name": "Pizza Casalinga",
              "description": "mozzarella and white bean, topped with bruschetta mix and greens"
            },
            {
              "name": "Calzone",
              "description": "Calabrian Sausage, ricotta, mozzarella, tomato"
            },
            {
              "name": "Options",
              "description": "Miyoko’s Vegan mozzarella, Prosciutto, Farm fresh egg"
            }
          ]
        },
        {
          "category": "PASTA",
          "items": [
            {
              "name": "Bombolotti al Sugo",
              "description": "Rigatoni, diced steak, sausage, mushrooms, tomato sauce, mascarpone"
            },
            {
              "name": "Linguine con Vongole",
              "description": "Linguine with clams, chili flakes, garlic and white wine"
            },
            {
              "name": "Ravioli di Piselli",
              "description": "House made ravioli with English peas and ricotta, in lemon cream sauce"
            },
            {
              "name": "Tortellini al Forno",
              "description": "Pork-filled tortellini, mushrooms, prosciutto, cream, mozzarella"
            },
            {
              "name": "Ravioli di Pollo",
              "description": "House made ravioli with chicken and ricotta, in a chicken Bolognese"
            },
            {
              "name": "Spaghetti Carbonara",
              "description": "Spaghetti with the classic carbonara- egg yolk, pancetta, shallot, and parmesan cheese"
            },
            {
              "name": "Gnocchi Primavera",
              "description": "House made gnocchi, English peas, asparagus, swiss chard, crispy pancetta and touch of cream"
            },
            {
              "name": "Option",
              "description": "Gluten free pasta"
            }
          ]
        },
        {
          "category": "SECONDI",
          "items": [
            {
              "name": "Orecchiette d’Elefante",
              "description": "Boneless breast of chicken with breaded & fried, served over greens, with tomato & blue cheese, balsamic vinegar"
            },
            {
              "name": "Salmone al Agro",
              "description": "Fresh salmon with capers, olives, white wine and garlic"
            },
            {
              "name": "Pesce Piccata",
              "description": "Petrale sole sauteed with capers, lemon, olive oi, with risotto"
            },
            {
              "name": "Gamberi Scampi",
              "description": "Prawns sauteed with tomatoes, garlic and wine, served with asparagus"
            },
            {
              "name": "Maiale Milanese",
              "description": "Pork chop pounded, breaded and pan fried, with apple-frisee salad and mustard sauce"
            },
            {
              "name": "Pollo Siciliana",
              "description": "Boneless breast of chicken with prosciutto, capers, olives, garlic, and white wine, served with carrots & green beans"
            },
            {
              "name": "Bistecca",
              "description": "Marinated skirt steak served with smashed potatoes and green beans, salsa verde"
            }
          ]
        },
        {
          "category": "CONTORNI",
          "items": [
            {
              "name": "Smashed Potatoes",
              "description": "Sea salt, herbs"
            },
            {
              "name": "Roasted Brussel Sprouts",
              "description": "Pancetta, almonds, Extra Virgin Olive Oil"
            },
            {
              "name": "Polenta Fries",
              "description": "Marinara sauce"
            },
            {
              "name": "Asparagus",
              "description": "Sautéed with olive oil and garlic"
            }
          ]
        },
        {
          "category": "MENU PER BAMBINI",
          "items": [
            {
              "name": "Polpettini",
              "description": "Beef and pork meatballs in our housemade marinara sauce"
            },
            {
              "name": "Pasta con Formaggio",
              "description": "Penne pasta with butter and cheese"
            },
            {
              "name": "Bombolotti Marinara",
              "description": "Large pasta tubes with our marinara sauce"
            },
            {
              "name": "Cotolette di Pollo",
              "description": "Two chicken cutlets breaded and lightly fried"
            },
            {
              "name": "Pizza con Formaggio",
              "description": "Tomato pizza topped with fresh mozzarella"
            },
            {
              "name": "Pasta con Polpettini",
              "description": "Penne with marinara sauce and meatballs"
            }
          ]
        },
        {
          "category": "DOLCI",
          "items": [
            {
              "name": "Tiramisu",
              "description": "Ladyfingers dipped in espresso and rum, layered with mascarpone cheese & chocolate"
            },
            {
              "name": "Tartuffo Nero",
              "description": "Chocolate gelato rolled around Italian Morena cherries, covered in chopped Ghirardelli chocolate"
            },
            {
              "name": "Zabaglione Classico",
              "description": "A frothy mixture of egg, wine, and sugar, served warm from the stove"
            },
            {
              "name": "Donna’s Amazing Almond Cake",
              "description": "A light almond cake with berries and fresh cream"
            },
            {
              "name": "Zabaglione Freddo",
              "description": "Cold zabaglione layered with amaretto cookie crumbs and seasonal fruit"
            },
            {
              "name": "Gelato",
              "description": "Your choice of chocolate or vanilla bean gelato"
            },
            {
              "name": "Fantasia di Cioccolato",
              "description": "Flourless chocolate mousse cake with cold zabaglione, cherry sauce"
            }
          ]
        },
        {
          "category": "NOTES",
          "items": [
            {
              "name": "",
              "description": "20% gratuity added to parties of 6 or more people"
            },
            {
              "name": "",
              "description": "Corkage $25 per 750ml bottle"
            }
          ]
        }
      ]
    },
    "lunch": {
      "title": "LUNCH & BRUNCH MENU",
      "categories": [
        {
          "category": "BRUNCH SPECIALS",
          "items": [
            {
              "name": "Available Saturday and Sunday",
              "description": ""
            },
            {
              "name": "Zeppoles",
              "description": "Italian-style donuts with cinnamon & sugar"
            },
            {
              "name": "Scrambled Eggs",
              "description": "with smoked salmon and goat cheese GF"
            },
            {
              "name": "French Toast",
              "description": "thick sliced Texas Toast with ricotta, fresh strawberries and maple syrup"
            },
            {
              "name": "Avocado Toast",
              "description": "fresh sliced avocado on toasted MHBB bread, fried egg and crumbled pancetta"
            },
            {
              "name": "Soft Polenta Poached Eggs",
              "description": "with sauteed kale, tomato, basil and freshly grated parmesan"
            },
            {
              "name": "Breakfast Pizza",
              "description": "with fontina cheese, smoked ham, and two sunnyside up eggs baked in wood fired oven"
            }
          ]
        },
        {
          "category": "STARTERS",
          "items": [
            {
              "name": "Carpaccio di Zucchini",
              "description": "julienned zucchini, toasted almonds, pecorino GF"
            },
            {
              "name": "Arancini",
              "description": "risotto balls stuffed with mozzarella, prosciutto, marinara"
            },
            {
              "name": "Fritto Misto",
              "description": "lightly fried fresh calamari, small prawns, lemon, onion, & spicy aioli GF"
            },
            {
              "name": "Brussel sprout chips",
              "description": "brussel sprout leaves, honey, lime, sriracha GF"
            },
            {
              "name": "Tonno Tartare",
              "description": "ahi tuna tartare, avocado, miso, spicy aioli"
            },
            {
              "name": "Zuppa",
              "description": "soup of the day- AQ"
            },
            {
              "name": "MHBB bread",
              "description": ""
            }
          ]
        },
        {
          "category": "SALADS",
          "items": [
            {
              "name": "Insalata Cucina",
              "description": "crisp chopped salad with salami, ceci beans, mozzarella, egg, olives, tmato, mised greens and balsamic vinaigrette"
            },
            {
              "name": "Insalata con Pollo",
              "description": "roasted chicken, tomatoes, pesto, blue cheese, almonds, mixed greens (option of goat cheese instead of blue) GF"
            },
            {
              "name": "Insalata di Cavolo Nero",
              "description": "shredded kale, brussel sprouts, almonds, pecorino cheese, lemon vinaigrette"
            },
            {
              "name": "Option",
              "description": "add calamari, chicken, prawns, or salmon GF"
            }
          ]
        },
        {
          "category": "ENTREES",
          "items": [
            {
              "name": "Cucina Burger",
              "description": "smashed beef burger, fontina cheese, garlic aioli, caramelized onions on brioche bun with homemade fries"
            },
            {
              "name": "Buttermilk Fried Chicken Sandwich",
              "description": "fried chicken thigh, pickles, fontina, coleslaw, lemon aioli on brioche with homemade fries"
            },
            {
              "name": "Fish and Chips",
              "description": "fresh halibut lightly beer battered and fried, with homemade fries and tartar sauce"
            },
            {
              "name": "Pollo “Katsu”",
              "description": "chicken cutlets with spicy aioli and arugula on brioche with homemade chips"
            },
            {
              "name": "Melanzane alla Parmigiana",
              "description": "panko fried eggplant, marinara, basil, mozzarella on brioche with homemade chips"
            },
            {
              "name": "Salmone al’Agro",
              "description": "salmon, capers, lemon, garlic, wine, over penne or mixed greens"
            },
            {
              "name": "Pollo alla Milanese",
              "description": "Chicken cutlets breaded in panko and fried, serve with arugula salad"
            },
            {
              "name": "Meatballs al Sugo",
              "description": "house made beef meatballs in our house marinara, with fresh mozzarella"
            },
            {
              "name": "Spaghetti all’Amalfi",
              "description": "spaghetti with caramelized zucchini, lemon zest, ricotta and parmesan"
            },
            {
              "name": "Penne alla Norma",
              "description": "penne with fried eggplant, burrata, basil, and marinara"
            },
            {
              "name": "Ravioli del Giorno",
              "description": "house made ravioli prepared daily, as per the Chef"
            },
            {
              "name": "Bombolotti al Sugo",
              "description": "rigatoni, sausage, mushrooms, tomato sauce, mascarpone"
            }
          ]
        },
        {
          "category": "WOOD FIRED PIZZA",
          "items": [
            {
              "name": "Pizza Margherita",
              "description": "fresh buffala mozzarella, tomato sauce, basil"
            },
            {
              "name": "Pizza con Salsicce",
              "description": "spicy sausage, portobello mushrooms, tomato sauce fontina"
            },
            {
              "name": "Pizza Bianco",
              "description": "assorted wild mushrooms ,fontina cheese, Italian white truffle oil"
            },
            {
              "name": "Pizza al Pesto",
              "description": "basil pesto sauce, mozzarella, thinly sliced potato"
            },
            {
              "name": "Calzone",
              "description": "stuffed with ricotta, sausage, mozzarella, tomato"
            }
          ]
        }
      ]
    },
    "happy": {
      "title": "HAPPY HOUR MENU",
      "categories": [
        {
          "category": "$10 COCKTAIL SPECIALS",
          "items": [
            {
              "name": "HUGO GIRL",
              "description": "elderflower, mint, lime, prosecco"
            },
            {
              "name": "GILDED LILIES",
              "description": "gin, citrus, prosecco, mint"
            },
            {
              "name": "DO-RE-MI",
              "description": "vodka, house midori, lime, lemon"
            },
            {
              "name": "MT DIABLO",
              "description": "tequila, mezcal, lime, ginger beer, cocchi rosa"
            },
            {
              "name": "BEGGAR'S BANQUET",
              "description": "bourbon, lemon, sassafras bitters, ale"
            },
            {
              "name": "SIXTH BOROUGH",
              "description": "bourbon, amaro di lago maggiore, grapefruit"
            }
          ]
        },
        {
          "category": "$6 BEER DRAFTS",
          "items": [
            {
              "name": "PILSNER",
              "description": "north coast brewing"
            },
            {
              "name": "PALE ALE",
              "description": "faction"
            },
            {
              "name": "IPA",
              "description": "hen house"
            },
            {
              "name": "HAZY IPA",
              "description": "hen house"
            }
          ]
        },
        {
          "category": "$9 WINE",
          "items": [
            {
              "name": "PROSECCO",
              "description": "veneto"
            },
            {
              "name": "SAUVIGNON BLANC",
              "description": "napa"
            },
            {
              "name": "ROSÉ",
              "description": "puglia"
            },
            {
              "name": "BARBERA",
              "description": "piemonte"
            }
          ]
        },
        {
          "category": "HAPPY HOUR BITES",
          "items": [
            {
              "name": "BUFFALO CAULIFLOWER",
              "description": "tabasco tempura, blue cheese dressing",
              "price": "10"
            },
            {
              "name": "POLENTA CAKES",
              "description": "wild mushrooms, marinara, mascarpone",
              "price": "10"
            },
            {
              "name": "CROSTINI",
              "description": "salmon salad, chopped greens",
              "price": "10"
            },
            {
              "name": "SOUP DU JOUR",
              "description": "ask your server",
              "price": "8"
            },
            {
              "name": "POLPETTINI",
              "description": "pork and beef meatballs, marinara, bread",
              "price": "10"
            },
            {
              "name": "FRITTO MISTO",
              "description": "calamari, prawn, lemon, onions, spicy aioli",
              "price": "12"
            }
          ]
        },
        {
          "category": "NOTES",
          "items": [
            {
              "name": "",
              "description": "AVAILABLE TUESDAY - SUNDAY 3PM - 5PM"
            }
          ]
        }
      ]
    },
    "cocktails": {
      "title": "SPECIALTY COCKTAILS",
      "categories": [
        {
          "category": "SIGNATURE CUCINA COCKTAILS",
          "items": [
            {
              "name": "Cucina Cosmo",
              "description": "st george citrus vodka, aperol, lemon juice",
              "price": "14"
            },
            {
              "name": "20/20",
              "description": "marin coastal gin, orgeat, lemon juice, absinthe",
              "price": "15"
            },
            {
              "name": "Amaro Sour",
              "description": "averna, bourbon, egg white, lemon juice",
              "price": "15"
            },
            {
              "name": "S.S.B.",
              "description": "st. george chile vodka, lillet blanc, grapefruit, lemon",
              "price": "15"
            },
            {
              "name": "Honey Do!",
              "description": "tulamore dew honey whiskey, cointreau, lemon, amaro sibona",
              "price": "14"
            },
            {
              "name": "Yaa! Calexico",
              "description": "catedral mezcal, gran classico, triple sec, lemon, averna",
              "price": "15"
            },
            {
              "name": "Pale Fire",
              "description": "cucina midori, serrano-infused tequila, cointreau, pineapple, lime",
              "price": "15"
            }
          ]
        }
      ]
    }
  }
}
$$::jsonb, now()),
  ('specials', $$
{
  "title": "WEEKLY SPECIALS",
  "updatedAt": "2026-05-28",
  "categories": [
    {
      "category": "THIS WEEK",
      "items": [
        {
          "name": "Chef's Special",
          "description": "Updated weekly by the Cucina team",
          "price": ""
        }
      ]
    }
  ]
}
$$::jsonb, now())
on conflict (key) do update
set
  content = excluded.content,
  updated_at = now();

-- 5. Optional: Ping helper function
create or replace function public.ping_database()
returns jsonb
language sql
security definer
as $$
  select jsonb_build_object(
    'status', 'active',
    'timestamp', now()
  );
$$;

grant execute on function public.ping_database() to public, anon, authenticated;
