import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import LoadingLink from "../components/LoadingLink";
import { heroStats } from "../data/site-content";
import { heroPortfolioItems, portfolioImageMap } from "../data/portfolio";
import logoMark from "../assets/branding/fadd-mark-teal.png";

function HeroSection() {
  const [primaryItem, teaserItem] = heroPortfolioItems;

  return (
    <section id="hero" className="section-shell pt-28 sm:pt-32 lg:pt-36">
      <div className="grid items-start gap-10 xl:grid-cols-[0.98fr_0.92fr] xl:gap-12">
        <div className="max-w-[44rem] motion-safe:animate-rise motion-safe:duration-700">
          <span className="eyebrow">Graphic design portfolio</span>
          <h1 className="type-display mt-6 max-w-[12ch] text-balance text-text">
            Visual yang lebih tenang, presisi, dan layak dipercaya.
          </h1>
          <p className="mt-5 max-w-[38rem] text-[1rem] leading-[1.72] text-muted sm:text-[1.04rem]">
            FADD GRAPHICS membantu brand, organisasi, dan event tampil lebih kuat melalui desain yang
            terarah, komposisi yang rapi, dan keputusan visual yang tidak terasa generik.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#portfolio" className="button-primary">
              Lihat karya unggulan
              <ArrowUpRight className="h-4 w-4" />
            </a>
            <LoadingLink href="/portfolio" className="button-secondary">
              Buka arsip penuh
              <ArrowUpRight className="h-4 w-4" />
            </LoadingLink>
            <LoadingLink href="#contact" className="button-secondary" loadingDuration={280}>
              Kirim brief baru
              <ArrowDownRight className="h-4 w-4" />
            </LoadingLink>
          </div>

          <div className="mt-10 grid gap-4 border-y border-line/80 py-5 sm:grid-cols-3">
            {heroStats.map((stat, index) => (
              <div key={stat.label} className={index === 0 ? "" : "sm:border-l sm:border-line/80 sm:pl-5"}>
                <p className="text-[1.85rem] font-extrabold tracking-[-0.05em] text-text">{stat.value}</p>
                <p className="mt-1.5 text-[0.82rem] font-medium uppercase tracking-[0.08em] text-muted">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-7 max-w-[31rem] border-l border-lineStrong/70 pl-4">
            <p className="editorial-note">Studio note</p>
            <p className="mt-2 text-[0.98rem] leading-7 text-text">
              Fokus utama situs ini adalah menunjukkan rasa visual dan kedewasaan presentasi, bukan
              sekadar menumpuk efek yang sedang populer.
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
                        <img src={logoMark} alt="FADD GRAPHICS" className="h-6 w-6 dark:brightness-[1.35]" />
                      </span>
                      <div>
                        <p className="editorial-note">Portfolio teaser</p>
                        <p className="text-[0.9rem] font-semibold tracking-[-0.02em] text-text">Kurasi ringkas</p>
                      </div>
                    </div>
                    <span className="rounded-full border border-lineStrong/70 px-3 py-1.5 text-[0.66rem] font-semibold uppercase tracking-[0.12em] text-muted">
                      Pilihan
                    </span>
                  </div>

                  <div className="aspect-[6/5] overflow-hidden border-b border-line/80 bg-card">
                    <img
                      src={portfolioImageMap[primaryItem.imageName]}
                      alt={primaryItem.title}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="grid gap-4 p-4">
                    <div className="grid gap-2">
                      <p className="editorial-note">{primaryItem.deliverable}</p>
                      <h2 className="max-w-[15ch] text-[1.15rem] font-bold tracking-[-0.04em] text-text sm:text-[1.28rem]">
                        {primaryItem.title}
                      </h2>
                      <p className="text-[0.9rem] leading-6 text-muted">{primaryItem.focus}</p>
                    </div>

                    <div className="grid gap-3 rounded-[1.2rem] border border-line/80 bg-card p-3.5 sm:grid-cols-[78px_1fr] sm:items-center">
                      {teaserItem ? (
                        <>
                          <div className="overflow-hidden rounded-[0.9rem] border border-line/80">
                            <img
                              src={portfolioImageMap[teaserItem.imageName]}
                              alt={teaserItem.title}
                              className="aspect-[4/5] w-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="editorial-note">Teaser lain</p>
                            <p className="mt-1 truncate text-[0.92rem] font-semibold tracking-[-0.03em] text-text">
                              {teaserItem.title}
                            </p>
                          </div>
                        </>
                      ) : (
                        <p className="text-[0.9rem] leading-6 text-text">
                          Pilihan karya lain tersedia di halaman arsip lengkap.
                        </p>
                      )}
                    </div>

                    <div className="rounded-[1.2rem] border border-line/80 bg-surface p-4">
                      <p className="editorial-note">Lihat semua portofolio</p>
                      <p className="mt-2 max-w-[28ch] text-[0.92rem] leading-6 text-text">
                        Masuk ke arsip penuh untuk menjelajahi seluruh koleksi karya tanpa susunan yang padat di beranda.
                      </p>
                      <LoadingLink href="/portfolio" className="button-primary mt-4 w-full justify-center">
                        Lihat semua portofolio
                        <ArrowUpRight className="h-4 w-4" />
                      </LoadingLink>
                    </div>
                  </div>
                </article>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
