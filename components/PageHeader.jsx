export default function PageHeader({ eyebrow, title, description }) {
  return (
    <section className="border-b border-line bg-mist">
      <div className="container-x py-14 sm:py-16">
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h1 className="max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">{title}</h1>
        {description && (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate sm:text-lg">{description}</p>
        )}
      </div>
    </section>
  );
}
