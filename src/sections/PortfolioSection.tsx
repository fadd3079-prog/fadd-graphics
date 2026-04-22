import { startTransition, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import LoadingLink from "../components/LoadingLink";
import SectionHeading from "../components/SectionHeading";
import PortfolioModal from "../components/PortfolioModal";
import {
  featuredPortfolioItems,
  portfolioArchivePreview,
  portfolioCategories,
  portfolioImageMap,
  portfolioItems,
  type PortfolioCategory,
} from "../data/portfolio";

const [primaryFeaturedItem, ...secondaryFeaturedItems] = featuredPortfolioItems;

const imageAspectMap = {
  wide: "aspect-[4/3]",
  tall: "aspect-[4/5]",
  panoramic: "aspect-[16/9]",
};

function PortfolioSection() {
  const [activeCategory, setActiveCategory] = useState<PortfolioCategory | "all">("all");
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const filteredItems =
    activeCategory === "all"
      ? portfolioItems
      : portfolioItems.filter((item) => item.category === activeCategory);

  const selectedItem =
    selectedItemId === null
      ? null
      : portfolioItems.find((item) => item.id === selectedItemId) ?? null;

  return (
    <section id="portfolio" className="section-shell section-space">
      <div className="flex flex-col gap-10">
        <SectionHeading
          eyebrow="Featured works"
          title="Kurasi karya ditampilkan lebih ringkas agar gambar tetap memimpin."
          description="Landing page ini menampilkan pilihan karya secara lebih padat, sementara arsip lengkap tersedia pada halaman portofolio terpisah untuk browsing visual yang lebih fokus."
          align="center"
        />

        <div className="grid gap-4 lg:grid-cols-[1.06fr_0.94fr]">
          {primaryFeaturedItem ? (
            <article className="section-frame overflow-hidden rounded-[1.65rem]">
              <div className="aspect-[16/10] overflow-hidden border-b border-line/80">
                <img
                  src={portfolioImageMap[primaryFeaturedItem.imageName]}
                  alt={primaryFeaturedItem.title}
                  className="h-full w-full object-cover transition duration-500 ease-premium hover:scale-[1.02]"
                />
              </div>
              <div className="space-y-2.5 p-4 sm:p-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="editorial-note">{primaryFeaturedItem.deliverable}</span>
                  <span className="rounded-full border border-lineStrong/70 px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-muted">
                    {primaryFeaturedItem.tone}
                  </span>
                </div>
                <h3 className="max-w-[18ch] text-[1.24rem] font-bold tracking-[-0.045em] text-text sm:text-[1.38rem]">
                  {primaryFeaturedItem.title}
                </h3>
                <p className="max-w-[44ch] text-[0.9rem] leading-6 text-muted">{primaryFeaturedItem.focus}</p>
              </div>
            </article>
          ) : null}

          <div className="grid gap-4">
            {secondaryFeaturedItems.map((item) => (
              <article key={item.id} className="section-frame overflow-hidden rounded-[1.65rem]">
                <div className="aspect-[4/5] overflow-hidden border-b border-line/80">
                  <img
                    src={portfolioImageMap[item.imageName]}
                    alt={item.title}
                    className="h-full w-full object-cover transition duration-500 ease-premium hover:scale-[1.02]"
                  />
                </div>
                <div className="space-y-2.5 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="editorial-note">{item.deliverable}</span>
                    <span className="rounded-full border border-lineStrong/70 px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-muted">
                      {item.tone}
                    </span>
                  </div>
                  <h3 className="max-w-[18ch] text-[1.1rem] font-bold tracking-[-0.045em] text-text">
                    {item.title}
                  </h3>
                  <p className="text-[0.88rem] leading-6 text-muted">{item.focus}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center gap-5">
          <SectionHeading
            eyebrow="Portfolio gallery"
            title="Galeri ringkas untuk memilih karya secara cepat."
            description="Preview di landing page dibuat lebih kecil dan lebih padat agar gambar tetap terlihat rapi. Jika ingin melihat seluruh arsip, lanjutkan ke halaman portofolio penuh."
            align="center"
          />

          <div className="section-frame flex w-full max-w-[58rem] flex-col gap-4 rounded-[1.7rem] p-5 sm:p-6">
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
                    className={`rounded-full px-4 py-2 text-[0.74rem] font-semibold uppercase tracking-[0.08em] ${
                      isActive
                        ? "bg-text text-bg"
                        : "border border-lineStrong/60 bg-surface text-text hover:border-accent/35 hover:text-accent"
                    }`}
                  >
                    {category.label}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col gap-3 border-t border-line/80 pt-4 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
              <p className="text-[0.92rem] leading-6 text-muted">
                {filteredItems.length} karya tampil dalam kurasi utama untuk kategori{" "}
                <span className="font-semibold text-text">
                  {portfolioCategories.find((category) => category.id === activeCategory)?.label}
                </span>
                .
              </p>
              <LoadingLink href="/portfolio" className="button-secondary self-center sm:self-auto">
                Buka portofolio penuh
                <ArrowUpRight className="h-4 w-4" />
              </LoadingLink>
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filteredItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className="section-frame group overflow-hidden rounded-[1.45rem] text-left"
              onClick={() => setSelectedItemId(item.id)}
            >
              <div className={`overflow-hidden border-b border-line/80 ${imageAspectMap[item.layout]}`}>
                <img
                  src={portfolioImageMap[item.imageName]}
                  alt={item.title}
                  className="h-full w-full object-cover transition duration-500 ease-premium group-hover:scale-[1.02]"
                />
              </div>
              <div className="flex items-center justify-between gap-4 p-4">
                <div className="min-w-0">
                  <span className="editorial-note">{item.deliverable}</span>
                  <h3 className="mt-1 truncate text-[0.98rem] font-bold tracking-[-0.04em] text-text">
                    {item.title}
                  </h3>
                </div>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-muted transition group-hover:text-accent" />
              </div>
            </button>
          ))}
        </div>

        <div className="section-frame rounded-[1.75rem] p-5 sm:p-6">
          <div className="flex flex-col gap-5 border-b border-line/80 pb-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="editorial-note">Archive preview</p>
              <h3 className="mt-3 max-w-[18ch] text-[1.28rem] font-bold tracking-[-0.045em] text-text sm:text-[1.48rem]">
                Arsip lengkap kini tersedia dalam halaman galeri tersendiri.
              </h3>
              <p className="mt-3 text-[0.94rem] leading-7 text-muted">
                Masuk ke halaman portofolio penuh untuk melihat seluruh koleksi dalam susunan yang lebih rapat dan lebih visual.
              </p>
            </div>
            <LoadingLink href="/portfolio" className="inline-flex items-center gap-2 text-[0.82rem] font-semibold uppercase tracking-[0.08em] text-text hover:text-accent">
              Lihat seluruh koleksi
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

      <PortfolioModal item={selectedItem} onClose={() => setSelectedItemId(null)} />
    </section>
  );
}

export default PortfolioSection;
