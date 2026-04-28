import { Quote, ShieldCheck, Sparkles, Users } from "lucide-react";
import SectionHeading from "../components/SectionHeading";
import { useLanguage } from "../hooks/useLanguage";
import founderPortrait from "../assets/portrait/mufaddhol-portrait.webp";

const trustIcons = [ShieldCheck, Users, Sparkles];

function AboutSection() {
  const { copy } = useLanguage();
  const about = copy.about;

  return (
    <section id="about" className="section-shell section-space">
      <div className="grid gap-10 xl:grid-cols-[0.92fr_1.08fr]">
        <div className="section-frame overflow-hidden rounded-[2rem]">
          <div className="bg-[linear-gradient(180deg,rgba(41,92,118,0.08),transparent)] p-5">
            <div className="overflow-hidden rounded-[2rem]">
              <img
                src={founderPortrait}
                alt={about.portraitAlt}
                className="aspect-square w-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <SectionHeading
            eyebrow={about.eyebrow}
            title={about.title}
            description={about.description}
          />

          <div className="section-frame rounded-[1.7rem] p-6 sm:p-7">
            {about.body.map((paragraph, index) => (
              <p key={paragraph} className={`${index === 0 ? "" : "mt-4"} text-[1rem] leading-8 text-text`}>
                {paragraph}
              </p>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {about.highlights.map((highlight) => (
              <div
                key={highlight}
                className="section-frame rounded-[1.35rem] p-4 text-[0.92rem] leading-7 text-text"
              >
                {highlight}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-16 grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="section-frame rounded-[1.7rem] p-5 sm:p-6">
          <p className="editorial-note">{about.experienceEyebrow}</p>
          <div className="mt-5 grid gap-4">
            {about.experiences.map((experience) => (
              <article key={`${experience.role}-${experience.period}`} className="border-b border-line/80 pb-4 last:border-b-0 last:pb-0">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                  <h3 className="text-[1rem] font-bold tracking-[-0.035em] text-text">{experience.role}</h3>
                  <span className="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-muted">{experience.period}</span>
                </div>
                <p className="mt-2 text-[0.92rem] leading-7 text-muted">{experience.description}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="grid gap-4">
          <div className="section-frame rounded-[1.7rem] p-5 sm:p-6">
            <p className="editorial-note">{about.educationEyebrow}</p>
            <div className="mt-5 grid gap-3">
              {about.education.map((item) => (
                <article key={item.title} className="rounded-[1.1rem] border border-line/80 bg-surface p-4">
                  <h3 className="text-[0.98rem] font-bold tracking-[-0.035em] text-text">{item.title}</h3>
                  <p className="mt-1 text-[0.78rem] font-semibold uppercase tracking-[0.1em] text-muted">{item.period}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="section-frame rounded-[1.7rem] p-5 sm:p-6">
            <p className="editorial-note">{about.skillsEyebrow}</p>
            <p className="mt-3 text-[0.92rem] leading-7 text-muted">{about.skillNote}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {about.skills.map((skill) => (
                <span key={skill} className="rounded-full border border-lineStrong/65 bg-surface px-3 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-text">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <SectionHeading
            eyebrow={copy.trust.eyebrow}
            title={copy.trust.title}
            description={copy.trust.description}
          />

          <div className="grid gap-4">
            {copy.trust.signals.map((signal, index) => {
              const Icon = trustIcons[index];

              return (
                <article key={signal.title} className="section-frame rounded-[1.55rem] p-5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-[0.95rem] border border-line/80 bg-surface text-accentStrong dark:text-accent">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="text-[1.05rem] font-bold tracking-[-0.04em] text-text">{signal.title}</h3>
                  </div>
                  <p className="mt-4 text-[0.94rem] leading-7 text-muted">{signal.description}</p>
                </article>
              );
            })}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3 xl:grid-cols-2">
          {copy.trust.testimonials.map((testimonial) => (
            <article
              key={testimonial.slot}
              className="section-frame flex h-full flex-col rounded-[1.65rem] p-5"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-[0.95rem] border border-line/80 bg-surface text-accentStrong dark:text-accent">
                <Quote className="h-5 w-5" />
              </span>
              <p className="mt-5 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-muted">
                {testimonial.slot}
              </p>
              <p className="mt-4 text-[0.96rem] leading-7 text-text">{testimonial.quote}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
