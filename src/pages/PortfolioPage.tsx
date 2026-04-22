import { useState } from "react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import PortfolioMasonry from "../components/PortfolioMasonry";
import PortfolioModal from "../components/PortfolioModal";
import SectionHeading from "../components/SectionHeading";
import { portfolioGalleryItems, type PortfolioDisplayItem } from "../data/portfolio";

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
        <PortfolioMasonry items={portfolioGalleryItems} onSelect={setSelectedItem} />
      </div>

      <PortfolioModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </section>
  );
}

export default PortfolioPage;
