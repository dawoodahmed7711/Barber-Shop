import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import SafeImage from "./SafeImage";
import { SITE, TRUST_STATS } from "../data/site";

export default function Hero() {
  return (
    <section className="bg-white">
      <div className="container-x grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-2 lg:gap-14 lg:py-24">
        <div>
          <p className="eyebrow mb-4">Premium barber studio</p>
          <h1 className="text-4xl font-bold leading-[1.1] sm:text-5xl lg:text-6xl">
            Your Style.
            <span className="block text-royal">Your Statement.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-slate sm:text-lg">
            Expert haircuts, precision fades and meticulous beard grooming from barbers who
            take pride in every detail.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/booking" className="btn-primary">
              Book an Appointment <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/services" className="btn-secondary">
              Explore Services
            </Link>
          </div>

          <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-line pt-6">
            {TRUST_STATS.map((s) => (
              <div key={s.label}>
                <dd className="text-2xl font-bold text-navy">{s.value}</dd>
                <dt className="text-xs text-slate">{s.label}</dt>
              </div>
            ))}
          </dl>
          <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-slate">
            <ShieldCheck className="h-4 w-4 text-royal" aria-hidden="true" />
            Figures are fictional demo content.
          </p>
        </div>

        <div className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-line bg-mist shadow-lift sm:aspect-[5/4] lg:aspect-[4/5]">
            <SafeImage
              src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1200&q=75"
              alt={`Barber at work inside ${SITE.shortName}`}
              sizes="(min-width: 1024px) 50vw, 100vw"
              priority
            />
          </div>
          <div className="absolute -bottom-4 left-4 rounded-2xl border border-line bg-white px-5 py-3 shadow-card sm:-left-4">
            <p className="text-xs text-slate">Walk-ins welcome, booking recommended</p>
            <p className="text-sm font-semibold text-navy">Mon–Sat · Closed Sundays</p>
          </div>
        </div>
      </div>
    </section>
  );
}
