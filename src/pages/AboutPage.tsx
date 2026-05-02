import { ArrowLeft, BadgeCheck, BookOpen, BriefcaseBusiness, Layers3, Quote, RefreshCcw } from "lucide-react";
import LoadingLink from "../components/LoadingLink";
import SectionHeading from "../components/SectionHeading";
import { useLanguage } from "../hooks/useLanguage";
import founderPortrait from "../assets/portrait/mufaddhol-portrait.webp";

const trustIcons = [Layers3, RefreshCcw, Quote];

function AboutPage() {
  const { copy } = useLanguage();
  const about = copy.about;

  return (
    <section className="section-shell pb-16 pt-28 sm:pb-20 sm:pt-32 lg:pt-36">
      <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr] xl:items-end">
        <div>
          <SectionHeading
            eyebrow={about.detailEyebrow}
            title={about.detailTitle}
            description={about.detailDescription}
          />
          <LoadingLink href="/" className="button-secondary mt-7">
            <ArrowLeft className="h-4 w-4" />
            {about.backHome}
          </LoadingLink>
        </div>

        <div className="section-frame grid gap-5 rounded-[2rem] p-5 sm:grid-cols-[0.86fr_1.14fr] sm:p-6">
          <div className="overflow-hidden rounded-[1.45rem] border border-line/80 bg-surface">
            <img
              src={founderPortrait}
              alt={about.portraitAlt}
              className="aspect-[4/5] w-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-center">
            <p className="editorial-note">FADD GRAPHICS</p>
            <h1 className="mt-3 text-[2.05rem] font-extrabold leading-[0.98] tracking-[-0.05em] text-text sm:text-[2.6rem]">
              Mufaddhol
            </h1>
            <p className="mt-3 text-[1rem] leading-7 text-muted">{about.description}</p>
            <div className="mt-5 grid gap-3">
              {about.body.map((paragraph) => (
                <p key={paragraph} className="text-[0.96rem] leading-7 text-text">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {about.highlights.map((highlight) => (
          <article key={highlight} className="section-frame rounded-[1.45rem] p-5">
            <BadgeCheck className="h-5 w-5 text-accentStrong" />
            <p className="mt-4 text-[0.94rem] leading-7 text-text">{highlight}</p>
          </article>
        ))}
      </div>

      <div className="mt-12 grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="section-frame rounded-[1.8rem] p-5 sm:p-7">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-[1rem] border border-line/80 bg-surface text-accentStrong">
              <BriefcaseBusiness className="h-5 w-5" />
            </span>
            <div>
              <p className="editorial-note">{about.experienceEyebrow}</p>
              <h2 className="mt-1 text-[1.35rem] font-bold tracking-[-0.04em] text-text">
                {about.experienceTitle}
              </h2>
            </div>
          </div>

          <div className="mt-7 grid gap-4">
            {about.experiences.map((experience) => (
              <article
                key={`${experience.role}-${experience.period}`}
                className="rounded-[1.25rem] border border-line/80 bg-surface/80 p-4 sm:p-5"
              >
                <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                  <h3 className="text-[1rem] font-bold tracking-[-0.035em] text-text">
                    {experience.role}
                  </h3>
                  <span className="text-[0.74rem] font-semibold uppercase tracking-[0.055em] text-muted">
                    {experience.period}
                  </span>
                </div>
                <p className="mt-2 text-[0.92rem] leading-7 text-muted">{experience.description}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="grid gap-5">
          <div className="section-frame rounded-[1.8rem] p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-[1rem] border border-line/80 bg-surface text-accentStrong">
                <BookOpen className="h-5 w-5" />
              </span>
              <p className="editorial-note">{about.educationEyebrow}</p>
            </div>
            <div className="mt-5 grid gap-3">
              {about.education.map((item) => (
                <article key={item.title} className="rounded-[1.15rem] border border-line/80 bg-surface/80 p-4">
                  <h3 className="text-[0.98rem] font-bold tracking-[-0.035em] text-text">{item.title}</h3>
                  <p className="mt-1 text-[0.78rem] font-semibold uppercase tracking-[0.055em] text-muted">{item.period}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="section-frame rounded-[1.8rem] p-5 sm:p-6">
            <p className="editorial-note">{about.skillsEyebrow}</p>
            <p className="mt-3 text-[0.92rem] leading-7 text-muted">{about.skillNote}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {about.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-lineStrong/65 bg-surface px-3 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.045em] text-text"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 grid gap-8 xl:grid-cols-[0.78fr_1.22fr]">
        <SectionHeading
          eyebrow={copy.trust.eyebrow}
          title={copy.trust.title}
          description={copy.trust.description}
        />
        <div className="grid gap-4 md:grid-cols-3">
          {copy.trust.signals.map((signal, index) => {
            const Icon = trustIcons[index];

            return (
              <article key={signal.title} className="section-frame rounded-[1.45rem] p-5">
                <span className="flex h-11 w-11 items-center justify-center rounded-[0.95rem] border border-line/80 bg-surface text-accentStrong">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-[1.02rem] font-bold tracking-[-0.035em] text-text">{signal.title}</h3>
                <p className="mt-3 text-[0.92rem] leading-7 text-muted">{signal.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default AboutPage;
