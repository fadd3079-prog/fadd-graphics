import {
  BadgeCheck,
  Clock3,
  FileText,
  Image,
  Lightbulb,
  MessageSquare,
  Megaphone,
  Package,
  Palette,
  PenTool,
  RefreshCcw,
  Send,
  Shirt,
  Sparkles,
} from "lucide-react";
import SectionHeading from "../components/SectionHeading";
import { processSteps, reasons, services } from "../data/site-content";

const serviceIcons = {
  identity: PenTool,
  campaign: Megaphone,
  social: Image,
  print: Package,
  merch: Shirt,
  custom: Sparkles,
};

const processIcons = {
  consultation: MessageSquare,
  brief: FileText,
  concept: Lightbulb,
  revision: RefreshCcw,
  delivery: Send,
};

const reasonIcons = {
  taste: Palette,
  communication: MessageSquare,
  flexibility: BadgeCheck,
  structure: Clock3,
};

function StudioSection() {
  return (
    <>
      <section id="services" className="section-shell section-space">
        <div className="flex flex-col gap-10">
          <SectionHeading
            eyebrow="Services"
            title="Layanan yang relevan untuk studio desain grafis independen."
            description="Fokus layanan dibangun dari kebutuhan yang paling sering muncul pada brand, organisasi, kampanye, dan kebutuhan publikasi."
            align="center"
          />

          <div className="grid auto-rows-fr gap-4 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => {
              const Icon = serviceIcons[service.key as keyof typeof serviceIcons];

              return (
                <article
                  key={service.title}
                  className="section-frame flex h-full flex-col rounded-[1.7rem] p-6 hover:-translate-y-1 hover:border-lineStrong/80"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-[0.95rem] border border-line/80 bg-surface text-accentStrong dark:text-accent">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 max-w-[18ch] text-[1.18rem] font-bold tracking-[-0.04em] text-text">
                    {service.title}
                  </h3>
                  <p className="mt-3 max-w-[36ch] text-[0.95rem] leading-7 text-muted">{service.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-shell section-space">
        <div className="flex flex-col gap-10">
          <SectionHeading
            eyebrow="Process"
            title="Alur kerja dibuat singkat, jelas, dan tetap fleksibel."
            description="Proses dibangun untuk mengurangi kebingungan sejak awal, menjaga fokus desain, dan mempermudah revisi yang benar-benar diperlukan."
            align="center"
          />

          <div className="grid auto-rows-fr gap-4 md:grid-cols-2 xl:grid-cols-3">
            {processSteps.map((step, index) => {
              const Icon = processIcons[step.key as keyof typeof processIcons];

              return (
                <article key={step.title} className="section-frame flex h-full flex-col rounded-[1.65rem] p-6">
                  <span className="text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-accent">
                    {`0${index + 1}`}
                  </span>
                  <div className="mt-4 flex h-11 w-11 items-center justify-center rounded-[0.95rem] border border-line/80 bg-surface text-accentStrong dark:text-accent">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 max-w-[16ch] text-[1.08rem] font-bold tracking-[-0.04em] text-text">
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
            eyebrow="Why choose FADD GRAPHICS"
            title="Nilai utamanya ada pada rasa visual, komunikasi, dan ketepatan eksekusi."
            description="Desain yang baik bukan hanya terlihat menarik, tetapi juga membuat pesan lebih terstruktur dan hasil akhirnya lebih mudah dipakai."
            align="center"
          />

          <div className="grid auto-rows-fr gap-4 lg:grid-cols-2 2xl:grid-cols-4">
            {reasons.map((reason) => {
              const Icon = reasonIcons[reason.key as keyof typeof reasonIcons];

              return (
                <article key={reason.title} className="section-frame flex h-full flex-col rounded-[1.75rem] p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-[0.95rem] border border-line/80 bg-surface text-accentStrong dark:text-accent">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 max-w-[18ch] text-[1.16rem] font-bold tracking-[-0.04em] text-text">
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

export default StudioSection;
