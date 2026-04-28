import { useEffect, useRef } from "react";
import { ArrowUpRight, X } from "lucide-react";
import { getPortfolioImageSource, portfolioImageMap, type PortfolioDisplayItem } from "../data/portfolio";
import { useBodyScrollLock } from "../hooks/useBodyScrollLock";
import { useLanguage } from "../hooks/useLanguage";

type PortfolioModalProps = {
  item: PortfolioDisplayItem | null;
  onClose: () => void;
};

function PortfolioModal({ item, onClose }: PortfolioModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const { copy } = useLanguage();
  const modalCopy = copy.portfolio.modal;

  useBodyScrollLock(Boolean(item));

  useEffect(() => {
    if (!item) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    const animationFrame = window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [item, onClose]);

  if (!item) {
    return null;
  }

  const imageSource = getPortfolioImageSource(item);
  const galleryImageNames = item.galleryImageNames?.length ? item.galleryImageNames : [item.imageName];
  const localGalleryImages = galleryImageNames
    .map((imageName) => ({
      imageName,
      source: portfolioImageMap[imageName],
    }))
    .filter((image): image is { imageName: string; source: string } => Boolean(image.source));
  const remoteGalleryImages = item.galleryImageUrls?.map((source, index) => ({
    imageName: `${item.id}-${index}`,
    source,
  })) ?? [];
  const galleryImages = remoteGalleryImages.length ? remoteGalleryImages : localGalleryImages;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/80 p-4 transition-opacity duration-200 ease-premium motion-safe:animate-rise"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${item.id}-title`}
      onClick={onClose}
    >
      <div
        className="section-frame relative max-h-[86vh] w-full max-w-[28rem] overflow-y-auto rounded-[1.35rem] bg-surface shadow-edge sm:max-w-[29rem]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="border-b border-line/80 bg-card p-3">
          <img
            src={imageSource}
            alt={item.title}
            className="max-h-[19rem] w-full object-contain"
          />
          {galleryImages.length > 1 ? (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {galleryImages.map((image, index) => (
                <img
                  key={image.imageName}
                  src={image.source}
                  alt={`${item.title} ${modalCopy.preview} ${index + 1}`}
                  className="h-16 w-28 shrink-0 rounded-[0.75rem] border border-line/80 bg-surface object-cover"
                  loading="lazy"
                />
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-4 p-4 sm:p-5">
          <div className="flex items-start justify-between gap-5">
            <div>
              <span className="eyebrow">{item.deliverable ?? modalCopy.fallbackLabel}</span>
              <h3
                id={`${item.id}-title`}
                className="mt-3 max-w-[15ch] text-[1.35rem] leading-[1.03] text-text sm:text-[1.55rem]"
              >
                {item.title}
              </h3>
            </div>

            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label={modalCopy.close}
              className="surface-panel flex h-11 w-11 items-center justify-center rounded-full bg-card shadow-none hover:border-accent/35 hover:text-accent"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {item.summary ? <p className="text-[0.9rem] leading-6 text-muted">{item.summary}</p> : null}

          {item.focus || item.tone ? (
            <dl className="grid gap-3 sm:grid-cols-2">
              {item.focus ? (
                <div className="rounded-[1rem] border border-line/80 bg-card p-3.5">
                  <dt className="editorial-note">{modalCopy.focus}</dt>
                  <dd className="mt-2 text-[0.9rem] leading-6 text-text">{item.focus}</dd>
                </div>
              ) : null}
              {item.tone ? (
                <div className="rounded-[1rem] border border-line/80 bg-card p-3.5">
                  <dt className="editorial-note">{modalCopy.tone}</dt>
                  <dd className="mt-2 text-[0.9rem] leading-6 text-text">{item.tone}</dd>
                </div>
              ) : null}
            </dl>
          ) : null}

          {item.tags?.length ? (
            <div>
              <p className="editorial-note">{modalCopy.tags}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-lineStrong/65 bg-card px-2.5 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-text"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          <a
            href="/#contact"
            onClick={onClose}
            className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-text hover:text-accent"
          >
            {modalCopy.discuss}
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default PortfolioModal;
