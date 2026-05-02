import { useMemo, useState } from "react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import LoadingLink from "../components/LoadingLink";
import PortfolioMasonry from "../components/PortfolioMasonry";
import PortfolioModal from "../components/PortfolioModal";
import SectionHeading from "../components/SectionHeading";
import { getPortfolioImageSource, type PortfolioDisplayItem } from "../data/portfolio";
import { useCriticalImages } from "../hooks/useCriticalImages";
import { usePublishedPortfolioItems } from "../hooks/usePublishedPortfolioItems";
import { useLanguage } from "../hooks/useLanguage";

const priorityPortfolioImageCount = 8;

function PortfolioGallerySkeleton() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      {Array.from({ length: priorityPortfolioImageCount }).map((_, index) => (
        <div
          key={index}
          className="min-h-[12rem] animate-pulse rounded-[1.15rem] border border-line bg-surface"
        />
      ))}
    </div>
  );
}

function PortfolioPage() {
  const [selectedItem, setSelectedItem] = useState<PortfolioDisplayItem | null>(null);
  const { galleryItems, isLoading, error } = usePublishedPortfolioItems();
  const { copy } = useLanguage();
  const pageCopy = copy.portfolio.page;
  const criticalImageSources = useMemo(
    () => galleryItems.slice(0, priorityPortfolioImageCount).map(getPortfolioImageSource),
    [galleryItems],
  );
  const isGalleryReady = useCriticalImages(criticalImageSources, {
    enabled: !isLoading && galleryItems.length > 0,
    timeout: 1400,
  });
  const shouldShowGallery = !isLoading && isGalleryReady;

  return (
    <section className="section-shell portfolio-shell pb-16 pt-28 sm:pb-20 sm:pt-32 lg:pt-36">
      <div className="mx-auto flex max-w-[56rem] flex-col items-center gap-5 text-center">
        <SectionHeading
          eyebrow={pageCopy.eyebrow}
          title={pageCopy.title}
          description={pageCopy.description}
          align="center"
        />
        <div className="flex flex-wrap items-center justify-center gap-3">
          <LoadingLink href="/" className="button-secondary">
            <ArrowLeft className="h-4 w-4" />
            {pageCopy.backHome}
          </LoadingLink>
          <LoadingLink href="/#contact" className="button-primary">
            {pageCopy.startProject}
            <ArrowUpRight className="h-4 w-4" />
          </LoadingLink>
        </div>
      </div>

      <div className="mx-auto mt-9 max-w-[88rem] rounded-[1.45rem] border border-line bg-card px-3 py-4 shadow-soft sm:px-4 sm:py-5 lg:px-5 lg:py-5">
        {error ? (
          <p className="mb-4 rounded-[1rem] border border-line bg-surface px-4 py-3 text-[0.9rem] leading-6 text-muted">
            {pageCopy.fallbackNotice}
          </p>
        ) : null}
        {!shouldShowGallery ? (
          <PortfolioGallerySkeleton />
        ) : (
          <PortfolioMasonry
            items={galleryItems}
            onSelect={setSelectedItem}
            priorityCount={priorityPortfolioImageCount}
          />
        )}
      </div>

      <PortfolioModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </section>
  );
}

export default PortfolioPage;
