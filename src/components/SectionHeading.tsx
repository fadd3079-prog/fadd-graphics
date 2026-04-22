type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
  align?: "left" | "center";
};

function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionHeadingProps) {
  const alignment = align === "center" ? "mx-auto max-w-[54rem] text-center" : "max-w-[46rem] text-left";
  const titleClassName = align === "center" ? "mx-auto max-w-[17ch]" : "max-w-[18ch]";
  const descriptionClassName = align === "center" ? "mx-auto max-w-[66ch]" : "max-w-[62ch]";

  return (
    <div
      className={`${alignment} motion-safe:animate-rise motion-safe:duration-700`}
    >
      <span className="eyebrow">{eyebrow}</span>
      <h2 className={`type-section mt-4 text-balance text-text ${titleClassName}`}>
        {title}
      </h2>
      <p className={`type-subtitle mt-4 text-balance ${descriptionClassName}`}>
        {description}
      </p>
    </div>
  );
}

export default SectionHeading;
