import { ArrowUpRight, BadgeCheck } from "lucide-react";
import LoadingLink from "../components/LoadingLink";
import SectionHeading from "../components/SectionHeading";
import { useLanguage } from "../hooks/useLanguage";
import { useResolvedSiteAssets } from "../hooks/useSiteData";

function AboutSection() {
  const { copy } = useLanguage();
  const siteAssets = useResolvedSiteAssets();
  const about = copy.about;
  const featuredExperience = about.experiences.slice(0, 2);
  const featuredHighlights = about.highlights.slice(0, 3);

  return (
    <section id="about" className="section-shell section-space">
      <div className="section-frame overflow-hidden rounded-[2rem]">
        <div className="grid gap-0 xl:grid-cols-[0.82fr_1.18fr]">
          <div className="p-4 sm:p-5">
            <div className="relative overflow-hidden rounded-[1.55rem] border border-line/80 bg-surface">
              {siteAssets.founderPhoto?.url ? (
                <img
                  src={siteAssets.founderPhoto.url}
                  alt={siteAssets.founderPhoto.alt_text || about.portraitAlt}
                  className="aspect-[4/5] w-full object-cover xl:aspect-square"
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <div className="flex aspect-[4/5] w-full items-center justify-center bg-card px-8 text-center xl:aspect-square">
                  <p className="text-[0.95rem] leading-7 text-muted">Foto profil dapat ditambahkan dari dashboard admin.</p>
                </div>
              )}
              <div className="absolute inset-x-4 bottom-4 rounded-[1.1rem] border border-white/15 bg-black/62 px-4 py-3 text-white shadow-edge backdrop-blur-sm">
                <p className="text-[0.75rem] font-semibold uppercase tracking-[0.055em] text-white/68">
                  FADD GRAPHICS
                </p>
                <p className="mt-1 text-[0.98rem] font-semibold tracking-[-0.025em]">
                  Mufaddhol
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center p-6 sm:p-8 xl:p-10">
            <SectionHeading
              eyebrow={about.eyebrow}
              title={about.title}
              description={about.description}
            />

            <div className="mt-6 max-w-[48rem]">
              <p className="text-[1rem] leading-8 text-text">{about.body[0]}</p>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {featuredHighlights.map((highlight) => (
                <div
                  key={highlight}
                  className="rounded-[1.2rem] border border-line/80 bg-surface/80 p-4"
                >
                  <BadgeCheck className="h-4 w-4 text-accentStrong" />
                  <p className="mt-3 text-[0.9rem] leading-6 text-text">{highlight}</p>
                </div>
              ))}
            </div>

            <div className="mt-7 flex flex-col gap-3 border-t border-line/80 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="grid gap-1.5">
                {featuredExperience.map((experience) => (
                  <p key={experience.role} className="text-[0.9rem] leading-6 text-muted">
                    <span className="font-semibold text-text">{experience.role}</span> · {experience.period}
                  </p>
                ))}
              </div>
              <LoadingLink href="/about" className="button-primary self-start sm:self-auto">
                {about.readMore}
                <ArrowUpRight className="h-4 w-4" />
              </LoadingLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
