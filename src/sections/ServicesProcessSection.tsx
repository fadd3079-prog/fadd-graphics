import {
  BadgeCheck,
  Clock,
  DraftingCompass,
  FileText,
  Image,
  MessageSquare,
  Megaphone,
  Package,
  Palette,
  PencilRuler,
  PenTool,
  RefreshCcw,
  Send,
  Shirt,
} from "lucide-react";
import SectionHeading from "../components/SectionHeading";
import { useLanguage } from "../hooks/useLanguage";

const serviceIcons = {
  identity: PenTool,
  campaign: Megaphone,
  social: Image,
  print: Package,
  merch: Shirt,
  custom: PencilRuler,
};

const processIcons = {
  consultation: MessageSquare,
  brief: FileText,
  concept: DraftingCompass,
  revision: RefreshCcw,
  delivery: Send,
};

const reasonIcons = {
  taste: Palette,
  communication: MessageSquare,
  flexibility: BadgeCheck,
  structure: Clock,
};

function ServicesProcessSection() {
  const { copy } = useLanguage();

  return (
    <>
      <section id="services" className="section-shell section-space">
        <div className="flex flex-col gap-10">
          <SectionHeading
            eyebrow={copy.services.eyebrow}
            title={copy.services.title}
            description={copy.services.description}
            align="center"
          />

          <div className="grid auto-rows-fr gap-4 md:grid-cols-2 xl:grid-cols-3">
            {copy.services.items.map((service) => {
              const Icon = serviceIcons[service.key as keyof typeof serviceIcons];

              return (
                <article
                  key={service.title}
                  className="section-frame flex h-full flex-col rounded-[1.45rem] p-5 hover:-translate-y-1 hover:border-lineStrong/80 sm:p-6"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-[0.95rem] border border-line/80 bg-surface text-accentStrong dark:text-accent">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 max-w-[20ch] text-[1.14rem] font-bold tracking-[-0.02em] text-text">
                    {service.title}
                  </h3>
                  <p className="mt-3 max-w-[38ch] text-[0.94rem] leading-7 text-muted">{service.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-shell section-space">
        <div className="flex flex-col gap-10">
          <SectionHeading
            eyebrow={copy.process.eyebrow}
            title={copy.process.title}
            description={copy.process.description}
            align="center"
          />

          <div className="grid auto-rows-fr gap-4 md:grid-cols-2 xl:grid-cols-3">
            {copy.process.steps.map((step, index) => {
              const Icon = processIcons[step.key as keyof typeof processIcons];

              return (
                <article key={step.title} className="section-frame flex h-full flex-col rounded-[1.45rem] p-5 sm:p-6">
                  <span className="text-[0.8rem] font-semibold uppercase tracking-[0.055em] text-accent">
                    {`0${index + 1}`}
                  </span>
                  <div className="mt-4 flex h-11 w-11 items-center justify-center rounded-[0.95rem] border border-line/80 bg-surface text-accentStrong dark:text-accent">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 max-w-[18ch] text-[1.06rem] font-bold tracking-[-0.02em] text-text">
                    {step.title}
                  </h3>
                  <p className="mt-3 max-w-[34ch] text-[0.94rem] leading-7 text-muted">{step.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-shell section-space">
        <div className="flex flex-col gap-10">
          <SectionHeading
            eyebrow={copy.reasons.eyebrow}
            title={copy.reasons.title}
            description={copy.reasons.description}
            align="center"
          />

          <div className="grid auto-rows-fr gap-4 md:grid-cols-2 xl:grid-cols-4">
            {copy.reasons.items.map((reason) => {
              const Icon = reasonIcons[reason.key as keyof typeof reasonIcons];

              return (
                <article key={reason.title} className="section-frame flex h-full flex-col rounded-[1.45rem] p-5 sm:p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-[0.95rem] border border-line/80 bg-surface text-accentStrong dark:text-accent">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 max-w-[20ch] text-[1.12rem] font-bold tracking-[-0.02em] text-text">
                    {reason.title}
                  </h3>
                  <p className="mt-3 max-w-[34ch] text-[0.95rem] leading-7 text-muted">{reason.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

export default ServicesProcessSection;
