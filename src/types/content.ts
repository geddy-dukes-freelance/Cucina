export type MenuItem = {
  name: string;
  description: string;
  note?: string;
  price?: string;
};

export type MenuCategory = {
  category: string;
  items: MenuItem[];
};

export type MenuSection = {
  title: string;
  updatedAt?: string;
  categories: MenuCategory[];
};

export type MenuContent = {
  specials: MenuSection;
  menus: {
    dinner: MenuSection;
    lunch: MenuSection;
    happy: MenuSection;
  };
};

export type HomeModal = {
  id: string;
  active: boolean;
  title: string;
  body: string;
  buttonLabel?: string;
  buttonUrl?: string;
  startsAt?: string;
  endsAt?: string;
};

export type HomeContent = {
  modals: HomeModal[];
  hero?: {
    headline: string;
    scriptSubtitle: string;
    paragraph: string;
  };
  community?: {
    heading: string;
    paragraph: string;
  };
  signoff?: string;
  about?: {
    heading: string;
    paragraphs: string[];
  };
};
