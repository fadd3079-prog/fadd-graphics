import { useMemo } from "react";
import { ArrowUpRight, Send } from "lucide-react";
import LoadingLink from "../components/LoadingLink";
import { getPortfolioImageSource } from "../data/portfolio";
import { useCriticalImages } from "../hooks/useCriticalImages";
import { usePublishedPortfolioItems } from "../hooks/usePublishedPortfolioItems";
import { useLanguage } from "../hooks/useLanguage";
import { useResolvedSiteAssets } from "../hooks/useSiteData";

function HeroSection() {
  const { homeItems } = usePublishedPortfolioItems();
  const { copy } = useLanguage();
  const siteAssets = useResolvedSiteAssets();
  const hero = copy.hero;
  const [primaryItem, teaserItem] = homeItems.slice(0, 2);
  const criticalHeroSources = useMemo(
    () => [primaryItem, teaserItem].filter(Boolean).map((item) => getPortfolioImageSource(item)),
    [primaryItem, teaserItem],
  );
  const isHeroPreviewReady = useCriticalImages(criticalHeroSources, {
    enabled: criticalHeroSources.length > 0,
    timeout: 1000,
  });

  return (
    <section id="hero" className="section-shell pt-28 sm:pt-32 lg:pt-36">
      <div className="grid items-start gap-10 xl:grid-cols-[0.98fr_0.92fr] xl:gap-12">
        <div className="max-w-[44rem] motion-safe:animate-rise motion-safe:duration-700">
          <span className="eyebrow">{hero.eyebrow}</span>
          <h1 className="type-display mt-6 max-w-[12ch] text-balance text-text">
            {hero.title}
          </h1>
          <p className="mt-5 max-w-[38rem] text-[1rem] leading-[1.72] text-muted sm:text-[1.04rem]">
            {hero.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <LoadingLink href="#portfolio" className="button-primary">
              {hero.primaryCta}
              <ArrowUpRight className="h-4 w-4" />
            </LoadingLink>
            <LoadingLink href="/portfolio" className="button-secondary">
              {hero.archiveCta}
              <ArrowUpRight className="h-4 w-4" />
            </LoadingLink>
            <LoadingLink href="#contact" className="button-secondary" loadingDuration={280}>
              {hero.briefCta}
              <Send className="h-4 w-4" />
            </LoadingLink>
          </div>

          <div className="mt-10 grid gap-4 border-y border-line/80 py-5 sm:grid-cols-3">
            {hero.stats.map((stat, index) => (
              <div key={stat.label} className={index === 0 ? "" : "sm:border-l sm:border-line/80 sm:pl-5"}>
                <p className="text-[1.85rem] font-extrabold tracking-[-0.05em] text-text">{stat.value}</p>
                <p className="mt-1.5 text-[0.82rem] font-medium uppercase tracking-[0.045em] text-muted">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-7 max-w-[31rem] border-l border-lineStrong/70 pl-4">
            <p className="editorial-note">{hero.noteEyebrow}</p>
            <p className="mt-2 text-[0.98rem] leading-7 text-text">
              {hero.note}
            </p>
          </div>
        </div>

        <div className="max-w-[34rem] motion-safe:animate-rise motion-safe:duration-700 xl:ml-auto">
          <div className="section-frame overflow-hidden rounded-[1.85rem] p-4 shadow-edge">
            <div className="grid gap-4">
              {primaryItem ? (
                <article className="overflow-hidden rounded-[1.45rem] border border-line/80 bg-surface">
                  <div className="flex items-center justify-between border-b border-line/80 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-[0.9rem] border border-line/70 bg-card">
                        {siteAssets.headerLogoLight?.url ? (
                          <img src={siteAssets.headerLogoLight.url} alt={siteAssets.headerLogoLight.alt_text || "FADD GRAPHICS"} className="h-6 w-6 object-contain dark:hidden" />
                        ) : (
                          <span className="text-[0.68rem] font-extrabold tracking-[-0.06em] text-text dark:hidden">FG</span>
                        )}
                        {siteAssets.headerLogoDark?.url ? (
                          <img src={siteAssets.headerLogoDark.url} alt={siteAssets.headerLogoDark.alt_text || "FADD GRAPHICS"} className="hidden h-6 w-6 object-contain dark:block" />
                        ) : (
                          <span className="hidden text-[0.68rem] font-extrabold tracking-[-0.06em] text-text dark:block">FG</span>
                        )}
                      </span>
                      <div>
                        <p className="editorial-note">{hero.teaserEyebrow}</p>
                        <p className="text-[0.9rem] font-semibold tracking-[-0.02em] text-text">{hero.teaserTitle}</p>
                      </div>
                    </div>
                    <span className="rounded-full border border-lineStrong/70 px-3 py-1.5 text-[0.66rem] font-semibold uppercase tracking-[0.055em] text-muted">
                      {hero.teaserBadge}
                    </span>
                  </div>

                  <div className="aspect-[6/5] overflow-hidden border-b border-line/80 bg-card">
                    {isHeroPreviewReady ? (
                      <img
                        src={getPortfolioImageSource(primaryItem)}
                        alt={primaryItem.title}
                        className="h-full w-full object-cover"
                        decoding="async"
                      />
                    ) : (
                      <div className="h-full w-full animate-pulse bg-surface" />
                    )}
                  </div>

                  <div className="grid gap-4 p-4">
                    <div className="grid gap-2">
                      <p className="editorial-note">{primaryItem.deliverable ?? copy.portfolio.fallbackDeliverable}</p>
                      <h2 className="max-w-[15ch] text-[1.15rem] font-bold tracking-[-0.04em] text-text sm:text-[1.28rem]">
                        {primaryItem.title}
                      </h2>
                      {primaryItem.focus ? <p className="text-[0.9rem] leading-6 text-muted">{primaryItem.focus}</p> : null}
                    </div>

                    <div className="grid gap-3 rounded-[1.2rem] border border-line/80 bg-card p-3.5 sm:grid-cols-[78px_1fr] sm:items-center">
                      {teaserItem ? (
                        <>
                          <div className="overflow-hidden rounded-[0.9rem] border border-line/80">
                            {isHeroPreviewReady ? (
                              <img
                                src={getPortfolioImageSource(teaserItem)}
                                alt={teaserItem.title}
                                className="aspect-[4/5] w-full object-cover"
                                decoding="async"
                              />
                            ) : (
                              <div className="aspect-[4/5] w-full animate-pulse bg-surface" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="editorial-note">{hero.teaserOther}</p>
                            <p className="mt-1 truncate text-[0.92rem] font-semibold tracking-[-0.03em] text-text">
                              {teaserItem.title}
                            </p>
                          </div>
                        </>
                      ) : (
                        <p className="text-[0.9rem] leading-6 text-text">
                          {hero.teaserFallback}
                        </p>
                      )}
                    </div>

                    <div className="rounded-[1.2rem] border border-line/80 bg-surface p-4">
                      <p className="editorial-note">{hero.archiveEyebrow}</p>
                      <p className="mt-2 max-w-[28ch] text-[0.92rem] leading-6 text-text">
                        {hero.archiveDescription}
                      </p>
                      <LoadingLink href="/portfolio" className="button-primary mt-4 w-full justify-center">
                        {hero.archiveButton}
                        <ArrowUpRight className="h-4 w-4" />
                      </LoadingLink>
                    </div>
                  </div>
                </article>
              ) : (
                <article className="flex min-h-[26rem] items-center justify-center rounded-[1.45rem] border border-line/80 bg-surface px-6 text-center">
                  <div>
                    <p className="editorial-note">{hero.teaserEyebrow}</p>
                    <p className="mt-3 text-[1rem] leading-7 text-muted">
                      Portfolio pilihan akan tampil setelah item ditandai Home dari dashboard admin.
                    </p>
                    <LoadingLink href="/portfolio" className="button-primary mt-5 justify-center">
                      {hero.archiveButton}
                      <ArrowUpRight className="h-4 w-4" />
                    </LoadingLink>
                  </div>
                </article>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
