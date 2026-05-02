import { ArrowUpRight } from "lucide-react";
import {
  getPortfolioDetailPath,
  getPortfolioImageSource,
  type PortfolioDisplayItem,
} from "../data/portfolio";
import LoadingLink from "./LoadingLink";
import { useLanguage } from "../hooks/useLanguage";

type PortfolioMasonryProps = {
  items: PortfolioDisplayItem[];
  onSelect: (item: PortfolioDisplayItem) => void;
  priorityCount?: number;
};

function PortfolioMasonry({ items, onSelect, priorityCount = 0 }: PortfolioMasonryProps) {
  const { copy } = useLanguage();

  const renderCardContent = (item: PortfolioDisplayItem, index: number) => {
    const imageSource = getPortfolioImageSource(item);

    return (
      <>
        {imageSource ? (
          <img
            src={imageSource}
            alt={item.title}
            className="block h-auto w-full transition duration-300 ease-premium group-hover:scale-[1.01]"
            loading={index < priorityCount ? "eager" : "lazy"}
            decoding="async"
            sizes="(min-width: 1536px) 22vw, (min-width: 1024px) 30vw, (min-width: 640px) 46vw, 100vw"
          />
        ) : (
          <div className="flex min-h-[12rem] items-center justify-center bg-card px-4 text-center">
            <p className="text-[0.82rem] leading-6 text-muted">Gambar belum tersedia</p>
          </div>
        )}
      <div className="flex items-center justify-between gap-3 px-3 py-2.5">
        <span className="truncate text-[0.68rem] font-semibold uppercase tracking-[0.055em] text-muted">
          {item.ctaLabel ?? item.deliverable ?? copy.portfolio.cardFallback}
        </span>
        <ArrowUpRight className="h-4 w-4 shrink-0 text-muted transition group-hover:text-accent" />
      </div>
      </>
    );
  };

  const renderCard = (item: PortfolioDisplayItem, index: number) => {
    const cardClassName = "portfolio-masonry-card group";
    const detailPath = getPortfolioDetailPath(item);

    if (detailPath) {
      return (
        <LoadingLink key={item.id} href={detailPath} className={cardClassName}>
          {renderCardContent(item, index)}
        </LoadingLink>
      );
    }

    return (
      <button
        key={item.id}
        type="button"
        className={cardClassName}
        onClick={() => onSelect(item)}
      >
        {renderCardContent(item, index)}
      </button>
    );
  };

  return (
    <div className="portfolio-masonry">
      {items.map((item, index) => (
        <div key={item.id} className="portfolio-masonry-item">
          {renderCard(item, index)}
        </div>
      ))}
    </div>
  );
}

export default PortfolioMasonry;
