import Link from "next/link";
import { Award } from "lucide-react";
import SafeImage from "./SafeImage";

export default function BarberCard({ barber }) {
  return (
    <article className="card group flex h-full flex-col overflow-hidden transition duration-200 hover:-translate-y-1 hover:shadow-lift">
      <div className="relative aspect-[4/5] overflow-hidden bg-mist">
        <SafeImage
          src={barber.image}
          alt={`Portrait of barber ${barber.name}`}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-xl font-bold">{barber.name}</h3>
        <p className="mt-1 text-sm font-medium text-royal">{barber.specialty}</p>
        <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-slate">
          <Award className="h-4 w-4" aria-hidden="true" />
          {barber.years} years experience
        </p>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-slate">{barber.bio}</p>
        {barber.socials?.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-2">
            {barber.socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-royal underline-offset-2 hover:underline"
                >
                  {s.label}
                  <span className="sr-only"> for {barber.name} (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        )}
        <Link href={`/booking?barber=${barber.id}`} className="btn-primary mt-5 w-full">
          Book with {barber.name.split(" ")[0]}
        </Link>
      </div>
    </article>
  );
}
