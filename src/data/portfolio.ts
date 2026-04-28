export type PortfolioCategory =
  | "logo"
  | "identity"
  | "campaign"
  | "editorial"
  | "event"
  | "promotion"
  | "announcement";

export type PortfolioLayout = "wide" | "tall" | "panoramic";

export type PortfolioItem = {
  id: string;
  imageName: string;
  slug?: string;
  title: string;
  category: PortfolioCategory;
  summary: string;
  deliverable: string;
  focus: string;
  tone: string;
  tags: string[];
  layout: PortfolioLayout;
  galleryImageNames?: string[];
  galleryImageUrls?: string[];
  imageUrl?: string;
  ctaLabel?: string;
  detailPath?: string;
  isFeatured?: boolean;
  isHome?: boolean;
};

export type PortfolioDisplayItem = Pick<PortfolioItem, "id" | "imageName" | "title" | "layout"> &
  Partial<Pick<PortfolioItem, "slug" | "category" | "summary" | "deliverable" | "focus" | "tone" | "tags" | "galleryImageNames" | "galleryImageUrls" | "imageUrl" | "ctaLabel" | "detailPath" | "isFeatured" | "isHome">>;

const portfolioImages = import.meta.glob<string>("../assets/portfolio/*.webp", {
  eager: true,
  import: "default",
});

const ruangUsahaBrandingImages = import.meta.glob<string>("../assets/portfolio/ruangusaha-branding/*.webp", {
  eager: true,
  import: "default",
});

const sortedImageEntries = Object.entries(portfolioImages).sort(([first], [second]) =>
  first.localeCompare(second, undefined, { numeric: true }),
);

const sortedRuangUsahaImageEntries = Object.entries(ruangUsahaBrandingImages).sort(([first], [second]) =>
  first.localeCompare(second, undefined, { numeric: true }),
);

const allPortfolioImageEntries = [...sortedImageEntries, ...sortedRuangUsahaImageEntries];

export const portfolioImageMap = Object.fromEntries(
  allPortfolioImageEntries.map(([path, source]) => [path.split("/").pop()!, source]),
) as Record<string, string>;

export function getPortfolioImageSource(item: Pick<PortfolioDisplayItem, "imageName" | "imageUrl">) {
  return item.imageUrl ?? portfolioImageMap[item.imageName] ?? item.imageName;
}

export function getPortfolioGallerySources(
  item: Pick<PortfolioDisplayItem, "galleryImageNames" | "galleryImageUrls">,
) {
  if (item.galleryImageUrls?.length) {
    return item.galleryImageUrls;
  }

  return item.galleryImageNames
    ?.map((imageName) => portfolioImageMap[imageName])
    .filter((source): source is string => Boolean(source)) ?? [];
}

export function hasPortfolioGallery(item: Pick<PortfolioDisplayItem, "galleryImageNames" | "galleryImageUrls">) {
  return getPortfolioGallerySources(item).length > 0;
}

export function getPortfolioDetailPath(item: PortfolioDisplayItem) {
  if (!hasPortfolioGallery(item)) {
    return undefined;
  }

  return item.detailPath ?? `/portfolio/${item.slug ?? item.id}`;
}

export const portfolioArchive = sortedImageEntries.map(([path, source]) => ({
  imageName: path.split("/").pop()!,
  source,
}));

const ruangUsahaBrandingImageNames = sortedRuangUsahaImageEntries.map(([path]) => path.split("/").pop()!);
const [ruangUsahaBrandingCoverImageName, ...ruangUsahaBrandingGalleryImageNames] = ruangUsahaBrandingImageNames;
export const ruangUsahaBrandingDetailPath = "/portfolio/ruangusaha-branding";

export const portfolioCategories = [
  { id: "all", label: "Semua" },
  { id: "logo", label: "Logo" },
  { id: "identity", label: "Identitas" },
  { id: "campaign", label: "Kampanye" },
  { id: "editorial", label: "Editorial" },
  { id: "event", label: "Event" },
  { id: "promotion", label: "Promosi" },
  { id: "announcement", label: "Pengumuman" },
] as const;

export const featuredPortfolioIds = [
  "anti-sexual-violence-campaign",
  "oppenheimer-collage-poster",
  "journey-editorial-collage",
];

export const heroPortfolioIds = [
  "journey-editorial-collage",
  "anti-sexual-violence-campaign",
];

export const portfolioItems: PortfolioItem[] = [
  {
    id: "ruangusahakita-logo-utama",
    slug: "ruangusaha-branding",
    imageName: ruangUsahaBrandingCoverImageName,
    title: "RuangUsahaKita (logo utama)",
    category: "logo",
    summary:
      "Koleksi preview identitas RuangUsahaKita yang menampilkan aplikasi mark dalam beberapa konteks visual.",
    deliverable: "Logo",
    focus: "Logo utama dan aplikasi branding",
    tone: "Profesional",
    tags: ["Logo", "Branding", "RuangUsahaKita"],
    layout: "wide",
    galleryImageNames: ruangUsahaBrandingGalleryImageNames,
    ctaLabel: "Lihat selengkapnya",
    detailPath: ruangUsahaBrandingDetailPath,
    isHome: true,
  },
  {
    id: "senyap-short-film",
    imageName: "work-01.webp",
    title: "Poster film pendek Senyap",
    category: "editorial",
    summary:
      "Key visual bernuansa tenang dan misterius untuk memperkuat atmosfer film pendek.",
    deliverable: "Poster utama",
    focus: "Mood sinematik dan hierarki judul",
    tone: "Dramatis",
    tags: ["Poster", "Film", "Moodboard"],
    layout: "wide",
  },
  {
    id: "rakorwil-binawil",
    imageName: "work-10.webp",
    title: "Banner Rakorwil Binawil",
    category: "event",
    summary:
      "Materi publikasi event dengan headline besar, warna hangat, dan struktur informasi yang langsung terbaca.",
    deliverable: "Banner event",
    focus: "Skala teks dan penekanan agenda",
    tone: "Enerjik",
    tags: ["Event", "Banner", "Informasi"],
    layout: "wide",
  },
  {
    id: "temu-kangen-buka-puasa",
    imageName: "work-12.webp",
    title: "Poster temu kangen & buka puasa",
    category: "event",
    summary:
      "Visual promosi acara dengan suasana hangat dan elemen yang diarahkan untuk kebutuhan publikasi komunitas.",
    deliverable: "Poster publikasi",
    focus: "Nuansa ramah dan keterbacaan informasi",
    tone: "Hangat",
    tags: ["Poster", "Komunitas", "Acara"],
    layout: "wide",
  },
  {
    id: "journey-editorial-collage",
    imageName: "work-17.webp",
    title: "Editorial collage personal journey",
    category: "editorial",
    summary:
      "Eksplorasi tata letak editorial dengan komposisi foto, shape, dan tipografi yang lebih eksperimental.",
    deliverable: "Kolase editorial",
    focus: "Komposisi modular dan ritme visual",
    tone: "Reflektif",
    tags: ["Editorial", "Kolase", "Tipografi"],
    layout: "panoramic",
    isHome: true,
  },
  {
    id: "cahaya-di-ujung-jalan",
    imageName: "work-18.webp",
    title: "Poster Cahaya di Ujung Jalan",
    category: "event",
    summary:
      "Materi poster untuk karya audiovisual dengan pencahayaan kuat dan tipografi yang dominan.",
    deliverable: "Poster film pendek",
    focus: "Headline bercahaya dan suasana adegan",
    tone: "Emosional",
    tags: ["Poster", "Film", "Typographic"],
    layout: "wide",
  },
  {
    id: "oppenheimer-collage-poster",
    imageName: "work-24.webp",
    title: "Poster editorial Oppenheimer",
    category: "editorial",
    summary:
      "Eksplorasi poster editorial berbasis foto hitam putih dengan ritme komposisi yang padat namun tetap tertata.",
    deliverable: "Poster editorial",
    focus: "Kolase visual dan kontras editorial",
    tone: "Tajam",
    tags: ["Editorial", "Kolase", "Monokrom"],
    layout: "tall",
  },
  {
    id: "fadd-brand-mockup",
    imageName: "work-29.webp",
    title: "Mockup identitas FADD GRAPHICS",
    category: "identity",
    summary:
      "Presentasi identitas dalam mockup sederhana untuk menonjolkan bentuk mark secara lebih bersih.",
    deliverable: "Brand mockup",
    focus: "Kejelasan mark dan presentasi brand",
    tone: "Minimal",
    tags: ["Logo", "Identity", "Mockup"],
    layout: "wide",
  },
  {
    id: "satdwima-brand-identity",
    imageName: "work-30.webp",
    title: "Satdwima brand identity mockup",
    category: "identity",
    summary:
      "Aplikasi identitas dengan pendekatan material dan bayangan halus agar logo terasa lebih solid dan premium.",
    deliverable: "Logo mockup",
    focus: "Presentasi mark dan detail emboss",
    tone: "Premium",
    tags: ["Branding", "Logo", "Mockup"],
    layout: "wide",
  },
  {
    id: "fadd-service-promo",
    imageName: "work-33.webp",
    title: "Poster promosi layanan desain",
    category: "promotion",
    summary:
      "Materi promosi layanan dengan warna tegas, hierarki kuat, dan informasi layanan yang mudah dipindai.",
    deliverable: "Poster promo",
    focus: "Penawaran layanan dan CTA",
    tone: "Langsung",
    tags: ["Promosi", "Layanan", "Poster"],
    layout: "tall",
  },
  {
    id: "anti-sexual-violence-campaign",
    imageName: "work-36.webp",
    title: "Kampanye anti kekerasan seksual",
    category: "campaign",
    summary:
      "Poster kampanye dengan pendekatan editorial agar isu sosial terasa lebih serius dan tidak klise secara visual.",
    deliverable: "Poster kampanye",
    focus: "Pesan sosial dan framing kuat",
    tone: "Urgent",
    tags: ["Campaign", "Awareness", "Editorial"],
    layout: "tall",
    isHome: true,
  },
  {
    id: "microplastic-awareness-poster",
    imageName: "work-40.webp",
    title: "Poster jejak mikro plastik",
    category: "campaign",
    summary:
      "Visual edukatif yang memadukan ilustrasi foto, headline besar, dan alur informasi yang lebih mudah dicerna.",
    deliverable: "Poster edukasi",
    focus: "Ilustrasi utama dan penyusunan fakta",
    tone: "Informatif",
    tags: ["Edukasi", "Campaign", "Infografik"],
    layout: "tall",
  },
  {
    id: "khaira-hasna-announcement",
    imageName: "work-41.webp",
    title: "Kartu pengumuman kelahiran",
    category: "announcement",
    summary:
      "Desain pengumuman keluarga dengan nuansa lembut, ruang kosong yang cukup, dan fokus utama pada informasi inti.",
    deliverable: "Announcement card",
    focus: "Nuansa lembut dan informasi personal",
    tone: "Hangat",
    tags: ["Announcement", "Family", "Layout"],
    layout: "wide",
  },
];

const portfolioItemMap = new Map(portfolioItems.map((item) => [item.id, item]));
const portfolioItemByImageName = new Map(portfolioItems.map((item) => [item.imageName, item]));
const selectPortfolioItems = (ids: readonly string[]) =>
  ids.flatMap((id) => {
    const item = portfolioItemMap.get(id);

    return item ? [item] : [];
  });

export const featuredPortfolioItems = selectPortfolioItems(featuredPortfolioIds);
export const heroPortfolioItems = selectPortfolioItems(heroPortfolioIds);
export const portfolioArchivePreview = portfolioArchive.slice(0, 7);
const collectionPortfolioItems = portfolioItems.filter((item) => item.galleryImageNames?.length);

const archiveGalleryItems: PortfolioDisplayItem[] = portfolioArchive.map(({ imageName }, index) => {
  const curatedItem = portfolioItemByImageName.get(imageName);

  if (curatedItem) {
    return curatedItem;
  }

  const fallbackNumber = String(index + 1).padStart(2, "0");

  return {
    id: `archive-${imageName.replace(".webp", "")}`,
    imageName,
    title: `Koleksi visual ${fallbackNumber}`,
    deliverable: "Arsip visual",
    layout: "tall",
  };
});

export const portfolioGalleryItems: PortfolioDisplayItem[] = [
  ...collectionPortfolioItems,
  ...archiveGalleryItems,
];
