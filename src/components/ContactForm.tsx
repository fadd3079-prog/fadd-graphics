import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Send } from "lucide-react";
import SocialIcon from "./SocialIcon";
import { useLanguage } from "../hooks/useLanguage";
import { useContactLinks } from "../hooks/useSiteData";

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

function validate(values: FormValues, errors: ReturnType<typeof useLanguage>["copy"]["contact"]["form"]["errors"]): FormErrors {
  const nextErrors: FormErrors = {};

  if (!values.name.trim()) {
    nextErrors.name = errors.name;
  }

  if (!values.email.trim()) {
    nextErrors.email = errors.emailRequired;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    nextErrors.email = errors.emailInvalid;
  }

  if (!values.service) {
    nextErrors.service = errors.service;
  }

  if (!values.message.trim()) {
    nextErrors.message = errors.messageRequired;
  } else if (values.message.trim().length < 24) {
    nextErrors.message = errors.messageLength;
  }

  return nextErrors;
}

function ContactForm() {
  const { copy, language } = useLanguage();
  const contactLinks = useContactLinks(language);
  const formCopy = copy.contact.form;
  const whatsappLink = contactLinks.find((link) => link.type === "whatsapp");
  const emailLink = contactLinks.find((link) => link.type === "email");
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<FormStatus>({
    type: "idle",
    message: formCopy.idle,
  });

  useEffect(() => {
    setStatus((currentStatus) =>
      currentStatus.type === "idle"
        ? {
            type: "idle",
            message: formCopy.idle,
          }
        : currentStatus,
    );
  }, [formCopy.idle]);

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

    const nextErrors = validate(values, formCopy.errors);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setStatus({
        type: "error",
        message: formCopy.error,
      });
      return;
    }

    const whatsappMessage = [
      formCopy.whatsappIntro,
      "",
      `${formCopy.whatsappLabels.name}: ${values.name}`,
      `${formCopy.whatsappLabels.email}: ${values.email}`,
      `${formCopy.whatsappLabels.service}: ${values.service}`,
      `${formCopy.whatsappLabels.timeline}: ${values.timeline || formCopy.whatsappLabels.fallbackTimeline}`,
      "",
      formCopy.whatsappLabels.summary,
      values.message,
    ].join("\n");

    const baseWhatsappHref = whatsappLink?.href ?? "https://wa.me/6283150964050";
    const href = `${baseWhatsappHref}${baseWhatsappHref.includes("?") ? "&" : "?"}text=${encodeURIComponent(whatsappMessage)}`;

    window.open(href, "_blank", "noopener,noreferrer");

    setStatus({
      type: "success",
      message: formCopy.success,
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
        <label className="space-y-2.5 text-[0.82rem] font-semibold uppercase tracking-[0.045em] text-text">
          <span>{formCopy.fields.name}</span>
          <input
            type="text"
            value={values.name}
            onChange={updateField("name")}
            className={fieldClassName}
            placeholder={formCopy.placeholders.name}
            autoComplete="name"
          />
          {errors.name ? <span className="text-sm text-accentStrong">{errors.name}</span> : null}
        </label>

        <label className="space-y-2.5 text-[0.82rem] font-semibold uppercase tracking-[0.045em] text-text">
          <span>{formCopy.fields.email}</span>
          <input
            type="email"
            value={values.email}
            onChange={updateField("email")}
            className={fieldClassName}
            placeholder={formCopy.placeholders.email}
            autoComplete="email"
          />
          {errors.email ? <span className="text-sm text-accentStrong">{errors.email}</span> : null}
        </label>

        <label className="space-y-2.5 text-[0.82rem] font-semibold uppercase tracking-[0.045em] text-text">
          <span>{formCopy.fields.service}</span>
          <select value={values.service} onChange={updateField("service")} className={fieldClassName}>
            <option value="">{formCopy.placeholders.service}</option>
            {copy.services.items.map((service) => (
              <option key={service.key} value={service.title}>
                {service.title}
              </option>
            ))}
          </select>
          {errors.service ? (
            <span className="text-sm text-accentStrong">{errors.service}</span>
          ) : null}
        </label>

        <label className="space-y-2.5 text-[0.82rem] font-semibold uppercase tracking-[0.045em] text-text">
          <span>{formCopy.fields.timeline}</span>
          <select value={values.timeline} onChange={updateField("timeline")} className={fieldClassName}>
            <option value="">{formCopy.placeholders.timeline}</option>
            {formCopy.timelineOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="mt-5 block space-y-2.5 text-[0.82rem] font-semibold uppercase tracking-[0.045em] text-text">
        <span>{formCopy.fields.message}</span>
        <textarea
          value={values.message}
          onChange={updateField("message")}
          className={`${fieldClassName} min-h-[180px] resize-none`}
          placeholder={formCopy.placeholders.message}
        />
        {errors.message ? (
          <span className="text-sm text-accentStrong">{errors.message}</span>
        ) : null}
      </label>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div aria-live="polite" className="max-w-xl text-[0.92rem] leading-6 text-muted">
          {status.message}
        </div>

        <div className="flex flex-wrap gap-3 sm:shrink-0">
          {status.type === "success" ? (
            <>
              <a
                href={status.href}
                target="_blank"
                rel="noreferrer"
                className="button-primary"
              >
                <SocialIcon name="whatsapp" className="h-4 w-4" />
                {formCopy.openWhatsapp}
              </a>
              <a
                href={emailLink?.href ?? "mailto:faddgraphics@gmail.com"}
                className="button-secondary"
              >
                <SocialIcon name="email" className="h-4 w-4" />
                {formCopy.sendEmail}
              </a>
            </>
          ) : (
            <button
              type="submit"
              className="button-primary whitespace-nowrap"
            >
              <Send className="h-4 w-4" />
              {formCopy.submit}
            </button>
          )}
        </div>
      </div>
    </form>
  );
}

export default ContactForm;
