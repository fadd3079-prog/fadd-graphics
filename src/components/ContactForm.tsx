import { useState, type ChangeEvent, type FormEvent } from "react";

type FormValues = {
  name: string;
  email: string;
  service: string;
  timeline: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

type FormStatus =
  | { type: "idle"; message: string; href?: undefined }
  | { type: "error"; message: string; href?: undefined }
  | { type: "success"; message: string; href: string };

const initialValues: FormValues = {
  name: "",
  email: "",
  service: "",
  timeline: "",
  message: "",
};

const fieldClassName = "input-shell";

function validate(values: FormValues): FormErrors {
  const nextErrors: FormErrors = {};

  if (!values.name.trim()) {
    nextErrors.name = "Nama perlu diisi.";
  }

  if (!values.email.trim()) {
    nextErrors.email = "Email perlu diisi.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    nextErrors.email = "Gunakan format email yang valid.";
  }

  if (!values.service) {
    nextErrors.service = "Pilih jenis proyek yang paling mendekati kebutuhan Anda.";
  }

  if (!values.message.trim()) {
    nextErrors.message = "Ceritakan kebutuhan proyek secara singkat.";
  } else if (values.message.trim().length < 24) {
    nextErrors.message = "Agar briefing lebih jelas, tulis setidaknya 24 karakter.";
  }

  return nextErrors;
}

function ContactForm() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<FormStatus>({
    type: "idle",
    message: "Isi detail singkat, lalu lanjutkan ke WhatsApp dengan brief yang sudah dirapikan.",
  });

  const updateField =
    (field: keyof FormValues) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const nextValue = event.target.value;

      setValues((currentValues) => ({
        ...currentValues,
        [field]: nextValue,
      }));

      setErrors((currentErrors) => ({
        ...currentErrors,
        [field]: undefined,
      }));
    };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validate(values);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setStatus({
        type: "error",
        message: "Masih ada informasi yang perlu dirapikan sebelum brief dikirim.",
      });
      return;
    }

    const whatsappMessage = [
      "Halo FADD GRAPHICS, saya ingin mendiskusikan proyek baru.",
      "",
      `Nama: ${values.name}`,
      `Email: ${values.email}`,
      `Jenis proyek: ${values.service}`,
      `Timeline: ${values.timeline || "Belum ditentukan"}`,
      "",
      "Ringkasan kebutuhan:",
      values.message,
    ].join("\n");

    const href = `https://wa.me/6283150964050?text=${encodeURIComponent(whatsappMessage)}`;

    window.open(href, "_blank", "noopener,noreferrer");

    setStatus({
      type: "success",
      message:
        "Brief sudah disusun. Lanjutkan percakapan lewat WhatsApp atau gunakan email jika lebih nyaman.",
      href,
    });
    setValues(initialValues);
    setErrors({});
  };

  return (
    <form
      className="section-frame rounded-[1.85rem] p-5 sm:p-7"
      onSubmit={handleSubmit}
      noValidate
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="space-y-2.5 text-[0.82rem] font-semibold uppercase tracking-[0.08em] text-text">
          <span>Nama</span>
          <input
            type="text"
            value={values.name}
            onChange={updateField("name")}
            className={fieldClassName}
            placeholder="Nama lengkap"
            autoComplete="name"
          />
          {errors.name ? <span className="text-sm text-accentStrong">{errors.name}</span> : null}
        </label>

        <label className="space-y-2.5 text-[0.82rem] font-semibold uppercase tracking-[0.08em] text-text">
          <span>Email</span>
          <input
            type="email"
            value={values.email}
            onChange={updateField("email")}
            className={fieldClassName}
            placeholder="nama@email.com"
            autoComplete="email"
          />
          {errors.email ? <span className="text-sm text-accentStrong">{errors.email}</span> : null}
        </label>

        <label className="space-y-2.5 text-[0.82rem] font-semibold uppercase tracking-[0.08em] text-text">
          <span>Jenis proyek</span>
          <select value={values.service} onChange={updateField("service")} className={fieldClassName}>
            <option value="">Pilih layanan</option>
            <option value="Logo & identitas visual">Logo & identitas visual</option>
            <option value="Poster & materi kampanye">Poster & materi kampanye</option>
            <option value="Konten sosial media">Konten sosial media</option>
            <option value="Banner & materi cetak">Banner & materi cetak</option>
            <option value="Apparel & merchandise">Apparel & merchandise</option>
            <option value="Permintaan desain khusus">Permintaan desain khusus</option>
          </select>
          {errors.service ? (
            <span className="text-sm text-accentStrong">{errors.service}</span>
          ) : null}
        </label>

        <label className="space-y-2.5 text-[0.82rem] font-semibold uppercase tracking-[0.08em] text-text">
          <span>Timeline</span>
          <select value={values.timeline} onChange={updateField("timeline")} className={fieldClassName}>
            <option value="">Belum ditentukan</option>
            <option value="Secepatnya">Secepatnya</option>
            <option value="1-2 minggu">1-2 minggu</option>
            <option value="2-4 minggu">2-4 minggu</option>
            <option value="Lebih dari 1 bulan">Lebih dari 1 bulan</option>
          </select>
        </label>
      </div>

      <label className="mt-5 block space-y-2.5 text-[0.82rem] font-semibold uppercase tracking-[0.08em] text-text">
        <span>Ringkasan kebutuhan</span>
        <textarea
          value={values.message}
          onChange={updateField("message")}
          className={`${fieldClassName} min-h-[180px] resize-none`}
          placeholder="Ceritakan tujuan proyek, jenis deliverable, gaya visual yang diinginkan, dan hal penting lain yang perlu diketahui."
        />
        {errors.message ? (
          <span className="text-sm text-accentStrong">{errors.message}</span>
        ) : null}
      </label>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div aria-live="polite" className="max-w-xl text-[0.92rem] leading-6 text-muted">
          {status.message}
        </div>

        <div className="flex flex-wrap gap-3">
          {status.type === "success" ? (
            <>
              <a
                href={status.href}
                target="_blank"
                rel="noreferrer"
                className="button-primary"
              >
                Buka WhatsApp
              </a>
              <a
                href="mailto:fadd3079@gmail.com"
                className="button-secondary"
              >
                Kirim via email
              </a>
            </>
          ) : (
            <button
              type="submit"
              className="button-primary"
            >
              Siapkan brief
            </button>
          )}
        </div>
      </div>
    </form>
  );
}

export default ContactForm;
