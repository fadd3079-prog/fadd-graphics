import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import {
  portfolioImageMap,
  type PortfolioDisplayItem,
  type PortfolioLayout,
} from "../data/portfolio";

type PortfolioMasonryProps = {
  items: PortfolioDisplayItem[];
  onSelect: (item: PortfolioDisplayItem) => void;
};

const fallbackRatios: Record<PortfolioLayout, number> = {
  wide: 1.28,
  tall: 1.46,
  panoramic: 0.72,
};

function PortfolioMasonry({ items, onSelect }: PortfolioMasonryProps) {
  const [imageRatios, setImageRatios] = useState<Record<string, number>>({});

  useEffect(() => {
    let isCancelled = false;

    Promise.all(
      items.map(
        (item) =>
          new Promise<[string, number]>((resolve) => {
            const image = new Image();
            const source = portfolioImageMap[item.imageName];
            const fallbackRatio = fallbackRatios[item.layout];

            const resolveRatio = () => {
              if (image.naturalWidth > 0 && image.naturalHeight > 0) {
                resolve([item.id, image.naturalHeight / image.naturalWidth]);
                return;
              }

              resolve([item.id, fallbackRatio]);
            };

            image.onload = resolveRatio;
            image.onerror = resolveRatio;
            image.src = source;

            if (image.complete) {
              resolveRatio();
            }
          }),
      ),
    ).then((entries) => {
      if (!isCancelled) {
        setImageRatios(Object.fromEntries(entries));
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [items]);

  const desktopColumns = useMemo(() => {
    const columns = Array.from({ length: 3 }, () => ({
      height: 0,
      items: [] as PortfolioDisplayItem[],
    }));

    items.forEach((item) => {
      const ratio = imageRatios[item.id] ?? fallbackRatios[item.layout];
      const estimatedHeight = ratio * 100 + 18;
      const shortestColumnIndex = columns.reduce(
        (shortestIndex, column, index) =>
          column.height < columns[shortestIndex].height ? index : shortestIndex,
        0,
      );

      columns[shortestColumnIndex].items.push(item);
      columns[shortestColumnIndex].height += estimatedHeight;
    });

    return columns.map((column) => column.items);
  }, [imageRatios, items]);

  const renderCard = (item: PortfolioDisplayItem) => (
    <button
      key={item.id}
      type="button"
      className="group block w-full overflow-hidden rounded-[1.2rem] border border-line bg-surface text-left shadow-soft"
      onClick={() => onSelect(item)}
    >
      <img
        src={portfolioImageMap[item.imageName]}
        alt={item.title}
        className="block h-auto w-full transition duration-300 ease-premium group-hover:scale-[1.01]"
        loading="lazy"
      />
      <div className="flex items-center justify-between gap-3 px-3 py-2.5">
        <span className="truncate text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-muted">
          {item.deliverable ?? "Arsip visual"}
        </span>
        <ArrowUpRight className="h-4 w-4 shrink-0 text-muted transition group-hover:text-accent" />
      </div>
    </button>
  );

  return (
    <>
      <div className="columns-2 gap-3 lg:hidden">
        {items.map((item) => (
          <div key={item.id} className="mb-3 break-inside-avoid">
            {renderCard(item)}
          </div>
        ))}
      </div>

      <div className="hidden gap-4 lg:grid lg:grid-cols-3">
        {desktopColumns.map((column, columnIndex) => (
          <div key={columnIndex} className="flex flex-col gap-4">
            {column.map((item) => renderCard(item))}
          </div>
        ))}
      </div>
    </>
  );
}

export default PortfolioMasonry;
