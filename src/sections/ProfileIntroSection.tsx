import SectionHeading from "../components/SectionHeading";
import { useLanguage } from "../hooks/useLanguage";

function ProfileIntroSection() {
  const { copy } = useLanguage();
  const profileIntro = copy.profileIntro;

  return (
    <section id="profile" className="section-shell section-space">
      <div className="grid gap-8 xl:grid-cols-[0.92fr_1.08fr]">
        <div className="space-y-6">
          <SectionHeading
            eyebrow={profileIntro.eyebrow}
            title={profileIntro.title}
            description={profileIntro.description}
          />
        </div>

        <div className="grid auto-rows-fr gap-4 sm:grid-cols-2">
          <article className="section-frame flex flex-col justify-between p-6 sm:col-span-2 sm:p-8">
            <p className="editorial-note">{profileIntro.cards[0].eyebrow}</p>
            <p className="mt-4 max-w-[42rem] text-[1.04rem] leading-8 text-text">
              {profileIntro.cards[0].text}
            </p>
          </article>

          <article className="section-frame flex flex-col justify-between p-6">
            <p className="editorial-note">{profileIntro.cards[1].eyebrow}</p>
            <p className="mt-4 text-[0.96rem] leading-7 text-text">
              {profileIntro.cards[1].text}
            </p>
          </article>

          <article className="section-frame flex flex-col justify-between p-6">
            <p className="editorial-note">{profileIntro.cards[2].eyebrow}</p>
            <p className="mt-4 text-[0.96rem] leading-7 text-text">
              {profileIntro.cards[2].text}
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}

export default ProfileIntroSection;
