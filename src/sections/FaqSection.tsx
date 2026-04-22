import FaqAccordion from "../components/FaqAccordion";
import SectionHeading from "../components/SectionHeading";
import { faqs } from "../data/site-content";

function FaqSection() {
  return (
    <section className="section-shell section-space">
      <div className="grid gap-10 xl:grid-cols-[0.72fr_1.28fr]">
        <SectionHeading
          eyebrow="FAQ"
          title="Pertanyaan yang paling sering muncul sebelum proyek dimulai."
          description="Bagian ini membantu menyamakan ekspektasi dasar seputar jenis proyek, alur kerja, revisi, dan cara memulai percakapan."
        />

        <FaqAccordion items={faqs} />
      </div>
    </section>
  );
}

export default FaqSection;
