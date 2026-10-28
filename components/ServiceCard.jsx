import Link from "next/link";
import { Scissors, Zap, Sparkles, Users, Droplets, Crown, Clock } from "lucide-react";
import SafeImage from "./SafeImage";

const ICONS = { scissors: Scissors, zap: Zap, sparkles: Sparkles, users: Users, droplets: Droplets, crown: Crown };

export default function ServiceCard({ service }) {
  const Icon = ICONS[service.icon] || Scissors;
  return (
    <article className="card group flex h-full flex-col overflow-hidden transition duration-200 hover:-translate-y-1 hover:shadow-lift">
      <div className="relative aspect-[4/3] overflow-hidden bg-mist">
        <SafeImage
          src={service.image}
          alt={`${service.name} service at The Gentleman's Club`}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="transition duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white text-royal shadow-card">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-xl font-bold">{service.name}</h3>
          <p className="text-2xl font-bold text-royal">${service.price}</p>
        </div>
        <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-slate">
          <Clock className="h-4 w-4" aria-hidden="true" />
          {service.duration} minutes
        </p>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-slate">{service.description}</p>
        <Link
          href={`/booking?service=${service.id}`}
          className="btn-primary mt-5 w-full"
          aria-label={`Book ${service.name}`}
        >
          Book This Service
        </Link>
      </div>
    </article>
  );
}
