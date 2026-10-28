import Link from "next/link";
import { Quote, MapPin, Phone, Clock } from "lucide-react";
import Hero from "../components/Hero";
import SectionHeading from "../components/SectionHeading";
import ServiceCard from "../components/ServiceCard";
import BarberCard from "../components/BarberCard";
import GalleryGrid from "../components/GalleryGrid";
import HoursList from "../components/HoursList";
import SafeImage from "../components/SafeImage";
import { SERVICES, FEATURED_SERVICE_IDS } from "../data/services";
import { BARBERS } from "../data/barbers";
import { GALLERY, GALLERY_PREVIEW_IDS } from "../data/gallery";
import { SITE, TESTIMONIALS } from "../data/site";

export const metadata = {
  title: `${SITE.shortName} — ${SITE.tagline}`,
};

export default function HomePage() {
  const featured = FEATURED_SERVICE_IDS.map((id) => SERVICES.find((s) => s.id === id)).filter(Boolean);
  const preview = GALLERY.filter((g) => GALLERY_PREVIEW_IDS.includes(g.id));

  return (
    <>
      <Hero />

      <section className="section bg-mist" aria-labelledby="featured-services">
        <div className="container-x">
          <SectionHeading
            eyebrow="Services"
            title="Grooming, done properly"
            description="Transparent demo pricing and clear timings for every service."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((s) => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/services" className="btn-secondary">View All Services</Link>
          </div>
        </div>
      </section>

      <section className="section bg-white" aria-labelledby="about-title">
        <div className="container-x grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-line bg-mist shadow-card">
            <SafeImage
              src="https://images.unsplash.com/photo-1532710093739-9470acff878f?auto=format&fit=crop&w=1200&q=70"
              alt="Inside the barber studio at The Gentleman's Club"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>
          <div>
            <p className="eyebrow mb-3">About the shop</p>
            <h2 id="about-title" className="text-3xl font-bold leading-tight sm:text-4xl">
              A modern studio built around the craft
            </h2>
            <p className="mt-4 leading-relaxed text-slate">
              The Gentleman&apos;s Club is a fictional demo barber shop. We pair classic technique with a
              clean, relaxed environment so every visit feels considered, from the first consultation to
              the final line-up.
            </p>
            <ul className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
              {["Precision fades and classic cuts", "Beard shaping and care", "Relaxed, hygienic studio", "Easy online booking (demo)"].map((t) => (
                <li key={t} className="flex items-center gap-2 font-medium">
                  <span className="h-2 w-2 rounded-full bg-royal" aria-hidden="true" />
                  {t}
                </li>
              ))}
            </ul>
            <Link href="/barbers" className="btn-primary mt-8">Meet the Barbers</Link>
          </div>
        </div>
      </section>

      <section className="section bg-mist" aria-labelledby="barbers-title">
        <div className="container-x">
          <SectionHeading eyebrow="Our barbers" title="Skilled hands, sharp eyes" description="Fictional demo profiles. Choose your barber when you book." />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {BARBERS.map((b) => (
              <BarberCard key={b.id} barber={b} />
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-white" aria-labelledby="gallery-title">
        <div className="container-x">
          <SectionHeading eyebrow="Gallery" title="Fresh from the chair" description="A look at recent styles and the studio." />
          <GalleryGrid items={preview} showFilters={false} />
          <div className="mt-10 text-center">
            <Link href="/gallery" className="btn-secondary">See Full Gallery</Link>
          </div>
        </div>
      </section>

      <section className="section bg-mist" aria-labelledby="testimonials-title">
        <div className="container-x">
          <SectionHeading eyebrow="Testimonials" title="What customers say (demo)" description="Sample testimonials for layout purposes only. They are not real customer reviews." />
          <div className="grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <figure key={t.name} className="card p-6">
                <Quote className="h-6 w-6 text-royal" aria-hidden="true" />
                <blockquote className="mt-3 text-sm leading-relaxed text-navy">{t.text}</blockquote>
                <figcaption className="mt-4 text-sm font-semibold text-slate">{t.name}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-white" aria-labelledby="visit-title">
        <div className="container-x grid gap-8 lg:grid-cols-2">
          <div>
            <p className="eyebrow mb-3">Visit us</p>
            <h2 id="visit-title" className="text-3xl font-bold sm:text-4xl">Opening hours &amp; location</h2>
            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex gap-3"><MapPin className="mt-0.5 h-5 w-5 shrink-0 text-royal" aria-hidden="true" />{SITE.address} (fictional)</li>
              <li className="flex gap-3"><Phone className="mt-0.5 h-5 w-5 shrink-0 text-royal" aria-hidden="true" /><a href={SITE.phoneHref} className="hover:text-royal">{SITE.phone}</a></li>
            </ul>
            <Link href="/contact" className="btn-secondary mt-6">Contact &amp; Directions</Link>
          </div>
          <div className="card p-6">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold"><Clock className="h-5 w-5 text-royal" aria-hidden="true" /> Opening hours</h3>
            <HoursList />
          </div>
        </div>
      </section>

      <section className="bg-royal py-16 text-white" aria-labelledby="cta-title">
        <div className="container-x text-center">
          <h2 id="cta-title" className="text-3xl font-bold !text-white sm:text-4xl">Ready for a fresh look?</h2>
          <p className="mx-auto mt-3 max-w-xl text-blue-100">
            Try the booking flow. It&apos;s a portfolio demo, so appointments are saved only in your browser.
          </p>
          <Link href="/booking" className="btn mt-8 bg-white text-royal hover:bg-mist">Book an Appointment</Link>
        </div>
      </section>
    </>
  );
}
