import { startTransition, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import LoadingLink from "../components/LoadingLink";
import PortfolioMasonry from "../components/PortfolioMasonry";
import SectionHeading from "../components/SectionHeading";
import PortfolioModal from "../components/PortfolioModal";
import {
  featuredPortfolioItems,
  getPortfolioImageSource,
  portfolioArchivePreview,
  portfolioCategories,
  type PortfolioDisplayItem,
  type PortfolioCategory,
} from "../data/portfolio";
import { usePublishedPortfolioItems } from "../hooks/usePublishedPortfolioItems";
import { useLanguage } from "../hooks/useLanguage";

function PortfolioSection() {
  const [activeCategory, setActiveCategory] = useState<PortfolioCategory | "all">("all");
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const { curatedItems } = usePublishedPortfolioItems();
  const { copy } = useLanguage();
  const portfolioCopy = copy.portfolio;
  const featuredItems = curatedItems.filter((item) => item.isFeatured).slice(0, 3);
  const displayFeaturedItems = featuredItems.length ? featuredItems : featuredPortfolioItems;
  const [primaryFeaturedItem, ...secondaryFeaturedItems] = displayFeaturedItems;

  const filteredItems =
    activeCategory === "all"
      ? curatedItems
      : curatedItems.filter((item) => item.category === activeCategory);

  const selectedItem =
    selectedItemId === null
      ? null
      : curatedItems.find((item) => item.id === selectedItemId) ?? null;

  const getCategoryLabel = (categoryId: PortfolioCategory | "all") =>
    portfolioCopy.categories[categoryId] ?? portfolioCopy.categories.all;

  return (
    <section id="portfolio" className="section-shell portfolio-shell section-space">
      <div className="flex flex-col gap-10">
        <SectionHeading
          eyebrow={portfolioCopy.featuredEyebrow}
          title={portfolioCopy.featuredTitle}
          description={portfolioCopy.featuredDescription}
          align="center"
        />

        <div className="grid gap-4 lg:grid-cols-[1.06fr_0.94fr]">
          {primaryFeaturedItem ? (
            <article className="section-frame overflow-hidden rounded-[1.65rem]">
              <div className="aspect-[16/10] overflow-hidden border-b border-line/80">
                <img
                  src={getPortfolioImageSource(primaryFeaturedItem)}
                  alt={primaryFeaturedItem.title}
                  className="h-full w-full object-cover transition duration-500 ease-premium hover:scale-[1.02]"
                />
              </div>
              <div className="space-y-2.5 p-4 sm:p-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="editorial-note">{primaryFeaturedItem.deliverable ?? portfolioCopy.fallbackDeliverable}</span>
                  {primaryFeaturedItem.tone ? (
                    <span className="rounded-full border border-lineStrong/70 px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.055em] text-muted">
                      {primaryFeaturedItem.tone}
                    </span>
                  ) : null}
                </div>
                <h3 className="max-w-[18ch] text-[1.24rem] font-bold tracking-[-0.045em] text-text sm:text-[1.38rem]">
                  {primaryFeaturedItem.title}
                </h3>
                {primaryFeaturedItem.focus ? (
                  <p className="max-w-[44ch] text-[0.9rem] leading-6 text-muted">
                    {primaryFeaturedItem.focus}
                  </p>
                ) : null}
              </div>
            </article>
          ) : null}

          <div className="grid gap-4">
            {secondaryFeaturedItems.map((item) => (
              <article key={item.id} className="section-frame overflow-hidden rounded-[1.65rem]">
                <div className="aspect-[4/5] overflow-hidden border-b border-line/80">
                  <img
                    src={getPortfolioImageSource(item)}
                    alt={item.title}
                    className="h-full w-full object-cover transition duration-500 ease-premium hover:scale-[1.02]"
                  />
                </div>
                <div className="space-y-2.5 p-4">
                  <span className="editorial-note">{item.deliverable ?? portfolioCopy.fallbackDeliverable}</span>
                  <h3 className="max-w-[18ch] text-[1.1rem] font-bold tracking-[-0.045em] text-text">
                    {item.title}
                  </h3>
                  {item.focus ? <p className="text-[0.88rem] leading-6 text-muted">{item.focus}</p> : null}
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center gap-5">
          <SectionHeading
            eyebrow={portfolioCopy.galleryEyebrow}
            title={portfolioCopy.galleryTitle}
            description={portfolioCopy.galleryDescription}
            align="center"
          />

          <div className="section-frame flex w-full max-w-[68rem] flex-col gap-4 rounded-[1.7rem] p-5 sm:p-6">
            <div className="flex flex-wrap justify-center gap-2">
              {portfolioCategories.map((category) => {
                const isActive = activeCategory === category.id;

                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() =>
                      startTransition(() =>
                        setActiveCategory(category.id as PortfolioCategory | "all"),
                      )
                    }
                    className={`rounded-full px-4 py-2 text-[0.74rem] font-semibold uppercase tracking-[0.045em] ${
                      isActive
                        ? "bg-text text-bg"
                        : "border border-lineStrong/60 bg-surface text-text hover:border-accent/35 hover:text-accent"
                    }`}
                  >
                    {getCategoryLabel(category.id as PortfolioCategory | "all")}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col gap-3 border-t border-line/80 pt-4 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
              <p className="text-[0.92rem] leading-6 text-muted">
                {portfolioCopy.categorySummaryPrefix} {filteredItems.length} {portfolioCopy.categorySummaryMiddle}{" "}
                <span className="font-semibold text-text">
                  {getCategoryLabel(activeCategory)}
                </span>
                .
              </p>
              <LoadingLink href="/portfolio" className="button-secondary self-center sm:self-auto">
                {portfolioCopy.fullPortfolioCta}
                <ArrowUpRight className="h-4 w-4" />
              </LoadingLink>
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-[90rem]">
          <PortfolioMasonry items={filteredItems} onSelect={(item) => setSelectedItemId(item.id)} />
        </div>

        <div className="section-frame rounded-[1.75rem] p-5 sm:p-6">
          <div className="flex flex-col gap-5 border-b border-line/80 pb-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="editorial-note">{portfolioCopy.archiveEyebrow}</p>
              <h3 className="mt-3 max-w-[18ch] text-[1.28rem] font-bold tracking-[-0.045em] text-text sm:text-[1.48rem]">
                {portfolioCopy.archiveTitle}
              </h3>
              <p className="mt-3 text-[0.94rem] leading-7 text-muted">
                {portfolioCopy.archiveDescription}
              </p>
            </div>
            <LoadingLink href="/portfolio" className="inline-flex items-center gap-2 text-[0.82rem] font-semibold uppercase tracking-[0.045em] text-text hover:text-accent">
              {portfolioCopy.archiveCta}
              <ArrowUpRight className="h-4 w-4" />
            </LoadingLink>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-7">
            {portfolioArchivePreview.map((item) => (
              <div key={item.imageName} className="overflow-hidden rounded-[0.95rem] border border-line/80 bg-surface">
                <img
                  src={item.source}
                  alt=""
                  className="aspect-[4/5] w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <PortfolioModal item={selectedItem as PortfolioDisplayItem | null} onClose={() => setSelectedItemId(null)} />
    </section>
  );
}

export default PortfolioSection;
