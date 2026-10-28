export default function SectionHeading({ eyebrow, title, description, align = "center", as: Tag = "h2" }) {
  const alignment = align === "center" ? "mx-auto text-center" : "text-left";
  return (
    <div className={`mb-10 max-w-2xl sm:mb-12 ${alignment}`}>
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <Tag className="text-3xl font-bold leading-tight sm:text-4xl">{title}</Tag>
      {description && <p className="mt-4 text-base leading-relaxed text-slate sm:text-lg">{description}</p>}
    </div>
  );
}
