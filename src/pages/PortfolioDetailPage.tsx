import { useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type SyntheticEvent } from "react";
import { ArrowLeft } from "lucide-react";
import { Navigate, useParams } from "react-router-dom";
import LoadingLink from "../components/LoadingLink";
import PageLoadingGate from "../components/PageLoadingGate";
import SectionHeading from "../components/SectionHeading";
import {
  getPortfolioGallerySources,
  getPortfolioImageSource,
  hasPortfolioGallery,
} from "../data/portfolio";
import { useCriticalImages } from "../hooks/useCriticalImages";
import { usePublishedPortfolioItems } from "../hooks/usePublishedPortfolioItems";
import { useLanguage } from "../hooks/useLanguage";

type DetailGalleryImage = {
  id: string;
  source: string;
  alt: string;
  featured: boolean;
};

type DetailGalleryPosition = {
  id: string;
  width: number;
  x: number;
  y: number;
};

function getDetailColumnCount(width: number) {
  if (width >= 1024) {
    return 3;
  }

  if (width >= 640) {
    return 2;
  }

  return 1;
}

function getDetailGalleryGap(width: number) {
  if (width >= 1024) {
    return 16;
  }

  return 12;
}

function PortfolioDetailBentoGallery({
  mainSource,
  title,
  gallerySources,
}: {
  mainSource: string;
  title: string;
  gallerySources: string[];
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [imageRatios, setImageRatios] = useState<Record<string, number>>({});

  useLayoutEffect(() => {
    const element = containerRef.current;

    if (!element) {
      return undefined;
    }

    const updateWidth = () => {
      setContainerWidth(element.clientWidth);
    };
    const observer = new ResizeObserver(updateWidth);

    updateWidth();
    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  const images = useMemo<DetailGalleryImage[]>(
    () => [
      {
        id: "main",
        source: mainSource,
        alt: title,
        featured: true,
      },
      ...gallerySources.map((source, index) => ({
        id: `${source}-${index}`,
        source,
        alt: `${title} gallery ${index + 1}`,
        featured: false,
      })),
    ],
    [gallerySources, mainSource, title],
  );

  const columnCount = getDetailColumnCount(containerWidth);
  const gap = getDetailGalleryGap(containerWidth);
  const columnWidth =
    containerWidth > 0 ? (containerWidth - gap * (columnCount - 1)) / columnCount : 0;
  const columnHeights = Array.from({ length: columnCount }, () => 0);
  const positions: DetailGalleryPosition[] = [];

  images.forEach((image, index) => {
    const span = index === 0 ? Math.min(2, columnCount) : 1;
    const width = columnWidth * span + gap * (span - 1);
    const ratio = imageRatios[image.id] ?? (image.featured ? 0.72 : 1.18);
    const height = width * ratio;
    let columnIndex = 0;

    if (index !== 0) {
      columnIndex = columnHeights.reduce(
        (shortestIndex, columnHeight, currentIndex) =>
          columnHeight < columnHeights[shortestIndex] ? currentIndex : shortestIndex,
        0,
      );
    }

    const x = columnIndex * (columnWidth + gap);
    const y = columnHeights[columnIndex];

    positions.push({
      id: image.id,
      width,
      x,
      y,
    });

    for (let offset = 0; offset < span; offset += 1) {
      columnHeights[columnIndex + offset] = y + height + gap;
    }
  });

  const galleryHeight = Math.max(...columnHeights, 0) - gap;
  const positionMap = Object.fromEntries(positions.map((position) => [position.id, position]));

  const handleImageLoad = (image: DetailGalleryImage) => (event: SyntheticEvent<HTMLImageElement>) => {
    const element = event.currentTarget;
    const nextRatio = element.naturalHeight / element.naturalWidth;

    if (!Number.isFinite(nextRatio) || nextRatio <= 0) {
      return;
    }

    setImageRatios((currentRatios) => {
      if (Math.abs((currentRatios[image.id] ?? 0) - nextRatio) < 0.001) {
        return currentRatios;
      }

      return {
        ...currentRatios,
        [image.id]: nextRatio,
      };
    });
  };

  return (
    <div
      ref={containerRef}
      className="relative mx-auto w-full max-w-[94rem]"
      style={{ height: containerWidth > 0 ? galleryHeight : undefined }}
    >
      {images.map((image, index) => {
        const position = positionMap[image.id];
        const itemStyle: CSSProperties =
          containerWidth > 0 && position
            ? {
                left: 0,
                position: "absolute",
                top: 0,
                transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
                width: position.width,
              }
            : {};

        return (
          <article
            key={image.id}
            className="portfolio-detail-bento-item"
            style={itemStyle}
          >
            <div className="portfolio-masonry-card">
              <img
                src={image.source}
                alt={image.alt}
                className="block h-auto w-full"
                loading={index < 3 ? "eager" : "lazy"}
                onLoad={handleImageLoad(image)}
              />
            </div>
          </article>
        );
      })}
    </div>
  );
}

function PortfolioDetailSkeleton() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="min-h-[24rem] animate-pulse rounded-[1.15rem] border border-line bg-surface lg:col-span-2" />
      <div className="grid gap-4">
        <div className="min-h-[11rem] animate-pulse rounded-[1.15rem] border border-line bg-surface" />
        <div className="min-h-[11rem] animate-pulse rounded-[1.15rem] border border-line bg-surface" />
      </div>
    </div>
  );
}

function PortfolioDetailPage() {
  const { portfolioSlug } = useParams();
  const { detailItems, isLoading } = usePublishedPortfolioItems();
  const { copy } = useLanguage();
  const detailCopy = copy.portfolio.detail;
  const item = detailItems.find((portfolioItem) => {
    const routeSlug = portfolioItem.detailPath?.split("/").filter(Boolean).pop();

    return portfolioItem.slug === portfolioSlug || routeSlug === portfolioSlug || portfolioItem.id === portfolioSlug;
  });
  const hasDetailGallery = item ? hasPortfolioGallery(item) : false;
  const gallerySources = useMemo(
    () => (item && hasDetailGallery ? getPortfolioGallerySources(item) : []),
    [hasDetailGallery, item],
  );
  const mainSource = useMemo(
    () => (item && hasDetailGallery ? getPortfolioImageSource(item) : ""),
    [hasDetailGallery, item],
  );
  const criticalImageSources = useMemo(
    () => [mainSource, ...gallerySources.slice(0, 2)].filter(Boolean),
    [gallerySources, mainSource],
  );
  const isDetailReady = useCriticalImages(criticalImageSources, {
    enabled: !isLoading && Boolean(item && hasDetailGallery),
    timeout: 1400,
  });

  if (isLoading) {
    return <PageLoadingGate />;
  }

  if (!item || !hasDetailGallery) {
    return <Navigate to="/portfolio" replace />;
  }

  return (
    <section className="section-shell portfolio-shell pb-16 pt-28 sm:pb-20 sm:pt-32 lg:pt-36">
      <div className="mx-auto flex max-w-[58rem] flex-col items-center gap-5 text-center">
        <SectionHeading
          eyebrow={item.deliverable ?? item.category ?? copy.portfolio.fallbackDeliverable}
          title={item.title}
          description={item.summary ?? item.focus ?? detailCopy.fallbackDescription}
          align="center"
        />
        <LoadingLink href="/portfolio" className="button-secondary">
          <ArrowLeft className="h-4 w-4" />
          {detailCopy.back}
        </LoadingLink>
      </div>

      <div className="mx-auto mt-10 grid max-w-[94rem] gap-5">
        {isDetailReady ? (
          <PortfolioDetailBentoGallery
            mainSource={mainSource}
            title={item.title}
            gallerySources={gallerySources}
          />
        ) : (
          <PortfolioDetailSkeleton />
        )}

        <aside className="section-frame grid gap-4 rounded-[1.35rem] p-5 sm:grid-cols-3 sm:p-6">
          <div>
            <p className="editorial-note">{detailCopy.category}</p>
            <p className="mt-2 text-[0.95rem] font-semibold text-text">
              {item.category ?? copy.portfolio.fallbackDeliverable}
            </p>
          </div>
          {item.focus ? (
            <div>
              <p className="editorial-note">{detailCopy.focus}</p>
              <p className="mt-2 text-[0.95rem] font-semibold text-text">{item.focus}</p>
            </div>
          ) : null}
          {item.tone ? (
            <div>
              <p className="editorial-note">{detailCopy.tone}</p>
              <p className="mt-2 text-[0.95rem] font-semibold text-text">{item.tone}</p>
            </div>
          ) : null}
        </aside>
      </div>
    </section>
  );
}

export default PortfolioDetailPage;
