import { Quote, ShieldCheck, Sparkles, Users } from "lucide-react";
import SectionHeading from "../components/SectionHeading";
import {
  founderHighlights,
  testimonialPlaceholders,
  trustSignals,
} from "../data/site-content";
import founderPortrait from "../assets/portrait/mufaddhol-portrait.webp";

const trustIcons = [ShieldCheck, Users, Sparkles];

function AboutSection() {
  return (
    <section id="about" className="section-shell section-space">
      <div className="grid gap-10 xl:grid-cols-[0.92fr_1.08fr]">
        <div className="section-frame overflow-hidden rounded-[2rem]">
          <div className="bg-[linear-gradient(180deg,rgba(41,92,118,0.08),transparent)] p-5">
            <div className="overflow-hidden rounded-[2rem]">
              <img
                src={founderPortrait}
                alt="Mufaddhol, founder FADD GRAPHICS"
                className="aspect-square w-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <SectionHeading
            eyebrow="About / Founder"
            title="Mufaddhol membangun FADD GRAPHICS sebagai studio yang lebih terarah."
            description="FADD GRAPHICS tumbuh dari pengalaman mengerjakan desain grafis, publikasi organisasi, materi event, dan kebutuhan konten visual yang menuntut hasil cepat tetapi tetap rapi."
          />

          <div className="section-frame rounded-[1.7rem] p-6 sm:p-7">
            <p className="text-[1rem] leading-8 text-text">
              Latar belakang di desain grafis, multimedia, dan studi informatika membentuk cara kerja yang
              lebih sistematis. Pendekatan ini membantu brief diterjemahkan menjadi output visual yang lebih jelas,
              lebih tenang, dan lebih mudah dikembangkan.
            </p>
            <p className="mt-4 text-[1rem] leading-8 text-text">
              Fokus utamanya bukan membuat tampilan yang ramai, tetapi membantu pesan terlihat lebih kuat melalui
              struktur komposisi, tipografi, dan ritme visual yang terkontrol.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {founderHighlights.map((highlight) => (
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

      <div className="mt-16 grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <SectionHeading
            eyebrow="Trust"
            title="Kepercayaan dibangun dari proses yang matang."
            description="Belum semua klien memiliki kutipan publik yang siap ditampilkan. Karena itu, bagian ini menonjolkan sinyal kerja yang nyata sekaligus menjaga ruang untuk testimoni terverifikasi."
          />

          <div className="grid gap-4">
            {trustSignals.map((signal, index) => {
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
          {testimonialPlaceholders.map((testimonial) => (
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
