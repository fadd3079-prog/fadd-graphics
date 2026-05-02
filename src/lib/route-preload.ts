import {
  getPortfolioGallerySources,
  getPortfolioImageSource,
  hasPortfolioGallery,
} from "../data/portfolio";
import { ensurePublishedPortfolioItemsLoaded } from "../hooks/usePublishedPortfolioItems";
import { ensureSiteDataLoaded } from "../hooks/useSiteData";
import { preloadImages } from "./image-preload";

const criticalPortfolioCount = 8;

export const loadAboutPage = () => import("../pages/AboutPage");
export const loadAdminRoutePage = () => import("../pages/AdminRoutePage");
export const loadPortfolioDetailPage = () => import("../pages/PortfolioDetailPage");
export const loadPortfolioPage = () => import("../pages/PortfolioPage");

function normalizeHref(href: string) {
  const url = new URL(href, window.location.href);

  return {
    path: url.pathname,
    hash: url.hash,
  };
}

async function preparePortfolioPage() {
  const [{ galleryItems }] = await Promise.all([
    ensurePublishedPortfolioItemsLoaded(),
    loadPortfolioPage(),
  ]);

  await preloadImages(galleryItems.slice(0, criticalPortfolioCount).map(getPortfolioImageSource), 1400);
}

async function preparePortfolioDetail(path: string) {
  const [{ detailItems }] = await Promise.all([
    ensurePublishedPortfolioItemsLoaded(),
    loadPortfolioDetailPage(),
  ]);
  const slug = path.split("/").filter(Boolean).pop();
  const item = detailItems.find((portfolioItem) => {
    const routeSlug = portfolioItem.detailPath?.split("/").filter(Boolean).pop();

    return portfolioItem.slug === slug || routeSlug === slug || portfolioItem.id === slug;
  });

  if (!item || !hasPortfolioGallery(item)) {
    return;
  }

  await preloadImages(
    [getPortfolioImageSource(item), ...getPortfolioGallerySources(item).slice(0, 2)],
    1400,
  );
}

async function prepareHome(hash: string) {
  const [{ homeItems, featuredItems, galleryItems }, siteData] = await Promise.all([
    ensurePublishedPortfolioItemsLoaded(),
    ensureSiteDataLoaded(),
  ]);
  const imageSources = homeItems.slice(0, 2).map(getPortfolioImageSource);

  if (hash === "#portfolio") {
    imageSources.push(...featuredItems.slice(0, 3).map(getPortfolioImageSource));
    imageSources.push(...galleryItems.slice(0, 4).map(getPortfolioImageSource));
  }

  if (hash === "#about") {
    const founderPhoto = siteData.assets.founder_photo?.url;

    if (founderPhoto) {
      imageSources.push(founderPhoto);
    }
  }

  await preloadImages(imageSources, 1200);
}

async function prepareAboutPage() {
  const [, siteData] = await Promise.all([loadAboutPage(), ensureSiteDataLoaded()]);
  const founderPhoto = siteData.assets.founder_photo?.url;

  if (founderPhoto) {
    await preloadImages([founderPhoto], 1200);
  }
}

export async function preparePublicRoute(href: string) {
  if (typeof window === "undefined") {
    return;
  }

  const { path, hash } = normalizeHref(href);

  if (path === "/portfolio") {
    await preparePortfolioPage();
    return;
  }

  if (path.startsWith("/portfolio/")) {
    await preparePortfolioDetail(path);
    return;
  }

  if (path === "/about") {
    await prepareAboutPage();
    return;
  }

  if (path === "/") {
    await prepareHome(hash);
  }
}
