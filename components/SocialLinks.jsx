import { SITE } from "../data/site";

// Demo links to platform home pages (the business has no real accounts).
export default function SocialLinks({ inverted = false }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {SITE.socials.map((s) => (
        <li key={s.label}>
          <a
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex min-h-[40px] items-center rounded-full border px-4 text-sm font-medium transition ${
              inverted
                ? "border-white/20 text-white hover:border-royal hover:bg-royal"
                : "border-line text-navy hover:border-royal hover:text-royal"
            }`}
          >
            {s.label}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
