export type PortfolioCategory =
  | "logo"
  | "identity"
  | "campaign"
  | "editorial"
  | "event"
  | "promotion"
  | "announcement";

export type PortfolioLayout = "wide" | "tall" | "panoramic";

export type PortfolioDisplayItem = {
  id: string;
  imageName: string;
  title: string;
  layout: PortfolioLayout;
  slug?: string;
  category?: PortfolioCategory;
  summary?: string;
  deliverable?: string;
  focus?: string;
  tone?: string;
  tags?: string[];
  galleryImageUrls?: string[];
  imageUrl?: string;
  ctaLabel?: string;
  detailPath?: string;
  isFeatured?: boolean;
  isHome?: boolean;
  isPublished?: boolean;
};

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

export const emptyPortfolioItems: PortfolioDisplayItem[] = [];

export function getPortfolioImageSource(item: Pick<PortfolioDisplayItem, "imageName" | "imageUrl">) {
  return item.imageUrl || item.imageName || "";
}

export function getPortfolioGallerySources(item: Pick<PortfolioDisplayItem, "galleryImageUrls">) {
  return item.galleryImageUrls?.filter(Boolean) ?? [];
}

export function hasPortfolioGallery(item: Pick<PortfolioDisplayItem, "galleryImageUrls">) {
  return getPortfolioGallerySources(item).length > 0;
}

export function getPortfolioDetailPath(item: PortfolioDisplayItem) {
  if (!hasPortfolioGallery(item)) {
    return undefined;
  }

  return item.detailPath ?? `/portfolio/${item.slug ?? item.id}`;
}
