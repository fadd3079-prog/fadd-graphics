import SectionHeading from "../components/SectionHeading";

function StudioIntroSection() {
  return (
    <section id="studio" className="section-shell section-space">
      <div className="grid gap-8 xl:grid-cols-[0.92fr_1.08fr]">
        <div className="space-y-6">
          <SectionHeading
            eyebrow="Studio overview"
            title="Desain yang profesional tidak harus terasa berat."
            description="FADD GRAPHICS menempatkan kejernihan visual, jarak baca, dan ritme komposisi sebagai dasar utama. Hasil akhirnya diharapkan terasa lebih dewasa, lebih nyaman dipandang, dan lebih mudah dipercaya."
          />
        </div>

        <div className="grid auto-rows-fr gap-4 sm:grid-cols-2">
          <article className="section-frame flex flex-col justify-between p-6 sm:col-span-2 sm:p-8">
            <p className="editorial-note">Brand intro</p>
            <p className="mt-4 max-w-[42rem] text-[1.04rem] leading-8 text-text">
              Cocok untuk brand, organisasi, dan event yang membutuhkan visual lebih rapi, pesan lebih jelas,
              serta proses revisi yang tidak melelahkan.
            </p>
          </article>

          <article className="section-frame flex flex-col justify-between p-6">
            <p className="editorial-note">Pendekatan</p>
            <p className="mt-4 text-[0.96rem] leading-7 text-text">
              Formal tetapi tetap natural, dengan aksen warna yang terkontrol dan layout yang lebih bernapas.
            </p>
          </article>

          <article className="section-frame flex flex-col justify-between p-6">
            <p className="editorial-note">Hasil yang dicari</p>
            <p className="mt-4 text-[0.96rem] leading-7 text-text">
              Brand terasa lebih serius, promosi lebih mudah terbaca, dan materi visual punya arah yang konsisten.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}

export default StudioIntroSection;
