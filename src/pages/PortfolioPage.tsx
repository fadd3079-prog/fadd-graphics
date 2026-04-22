import { useState } from "react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import PortfolioModal from "../components/PortfolioModal";
import SectionHeading from "../components/SectionHeading";
import { portfolioGalleryItems, portfolioImageMap, type PortfolioDisplayItem } from "../data/portfolio";

function PortfolioPage() {
  const [selectedItem, setSelectedItem] = useState<PortfolioDisplayItem | null>(null);

  return (
    <section className="section-shell pb-16 pt-28 sm:pb-20 sm:pt-32 lg:pt-36">
      <div className="mx-auto flex max-w-[56rem] flex-col items-center gap-5 text-center">
        <SectionHeading
          eyebrow="Full portfolio archive"
          title="Seluruh arsip karya ditampilkan sebagai galeri visual yang lebih fokus."
          description="Halaman ini memprioritaskan browsing gambar dengan ritme yang rapi, thumbnail yang terkendali, dan preview yang tetap modest agar kualitas aset lama tetap terjaga."
          align="center"
        />
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link to="/" className="button-secondary">
            <ArrowLeft className="h-4 w-4" />
            Kembali ke beranda
          </Link>
          <a href="/#contact" className="button-primary">
            Mulai proyek baru
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-[80rem] rounded-[2rem] border border-line bg-card px-4 py-5 shadow-soft sm:px-5 sm:py-6">
        <div className="columns-2 gap-3 lg:columns-3 xl:gap-4">
          {portfolioGalleryItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className="group mb-3 block w-full break-inside-avoid overflow-hidden rounded-[1.25rem] border border-line bg-surface text-left shadow-soft xl:mb-4"
              onClick={() => setSelectedItem(item)}
            >
              <img
                src={portfolioImageMap[item.imageName]}
                alt={item.title}
                className="block h-auto w-full transition duration-300 ease-premium group-hover:scale-[1.01]"
                loading="lazy"
              />
              <div className="flex items-center justify-between gap-3 px-3.5 py-2.5">
                <span className="truncate text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-muted">
                  {item.deliverable ?? "Arsip visual"}
                </span>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-muted transition group-hover:text-accent" />
              </div>
            </button>
          ))}
        </div>
      </div>

      <PortfolioModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </section>
  );
}

export default PortfolioPage;
