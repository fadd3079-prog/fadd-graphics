import FaqAccordion from "../components/FaqAccordion";
import SectionHeading from "../components/SectionHeading";
import { useLanguage } from "../hooks/useLanguage";

function FaqSection() {
  const { copy } = useLanguage();

  return (
    <section className="section-shell section-space">
      <div className="grid gap-8 xl:grid-cols-[0.72fr_1.28fr]">
        <SectionHeading
          eyebrow={copy.faq.eyebrow}
          title={copy.faq.title}
          description={copy.faq.description}
        />

        <FaqAccordion items={copy.faq.items} />
      </div>
    </section>
  );
}

export default FaqSection;
