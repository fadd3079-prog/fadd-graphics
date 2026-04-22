import { useEffect, useRef } from "react";
import { ArrowUpRight, X } from "lucide-react";
import type { PortfolioDisplayItem } from "../data/portfolio";
import { portfolioImageMap } from "../data/portfolio";

type PortfolioModalProps = {
  item: PortfolioDisplayItem | null;
  onClose: () => void;
};

function PortfolioModal({ item, onClose }: PortfolioModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!item) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [item, onClose]);

  if (!item) {
    return null;
  }

  const imageSource = portfolioImageMap[item.imageName];

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/80 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${item.id}-title`}
      onClick={onClose}
    >
      <div
        className="section-frame relative w-full max-w-[30rem] overflow-hidden rounded-[1.45rem] bg-surface sm:max-w-[32rem]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="border-b border-line/80 bg-card p-3">
          <img
            src={imageSource}
            alt={item.title}
            className="max-h-[22rem] w-full object-contain"
          />
        </div>

        <div className="flex flex-col gap-4 p-4 sm:p-5">
          <div className="flex items-start justify-between gap-5">
            <div>
              <span className="eyebrow">{item.deliverable ?? "Arsip visual"}</span>
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
              aria-label="Tutup detail karya"
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
                  <dt className="editorial-note">Fokus</dt>
                  <dd className="mt-2 text-[0.9rem] leading-6 text-text">{item.focus}</dd>
                </div>
              ) : null}
              {item.tone ? (
                <div className="rounded-[1rem] border border-line/80 bg-card p-3.5">
                  <dt className="editorial-note">Tone</dt>
                  <dd className="mt-2 text-[0.9rem] leading-6 text-text">{item.tone}</dd>
                </div>
              ) : null}
            </dl>
          ) : null}

          {item.tags?.length ? (
            <div>
              <p className="editorial-note">Tags</p>
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
            Diskusikan proyek serupa
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default PortfolioModal;
