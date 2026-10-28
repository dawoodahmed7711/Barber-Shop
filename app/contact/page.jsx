import { MapPin, Phone, Mail, Navigation } from "lucide-react";
import PageHeader from "../../components/PageHeader";
import ContactForm from "../../components/ContactForm";
import HoursList from "../../components/HoursList";
import SocialLinks from "../../components/SocialLinks";
import { SITE } from "../../data/site";

export const metadata = {
  title: "Contact",
  description: "Opening hours, demo contact details and a demo contact form.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Get in touch"
        description="All contact details below are fictional demo content you can edit in data/site.js."
      />
      <section className="section bg-white">
        <div className="container-x grid gap-8 lg:grid-cols-[1fr_380px]">
          <ContactForm />

          <div className="space-y-6">
            <div className="card p-6">
              <h2 className="mb-4 text-xl font-bold">Shop details (demo)</h2>
              <ul className="space-y-3 text-sm">
                <li className="flex gap-3"><MapPin className="mt-0.5 h-5 w-5 shrink-0 text-royal" aria-hidden="true" />{SITE.address}</li>
                <li className="flex gap-3"><Phone className="mt-0.5 h-5 w-5 shrink-0 text-royal" aria-hidden="true" /><a href={SITE.phoneHref} className="hover:text-royal">{SITE.phone}</a></li>
                <li className="flex gap-3"><Mail className="mt-0.5 h-5 w-5 shrink-0 text-royal" aria-hidden="true" /><a href={`mailto:${SITE.email}`} className="break-all hover:text-royal">{SITE.email}</a></li>
              </ul>
              <div className="mt-5"><SocialLinks /></div>
            </div>

            <div className="card p-6">
              <h2 className="mb-4 text-xl font-bold">Opening hours</h2>
              <HoursList />
            </div>

            <div className="card overflow-hidden">
              <div
                role="img"
                aria-label="Map placeholder"
                className="flex h-44 flex-col items-center justify-center gap-2 bg-royal-light text-royal"
              >
                <Navigation className="h-8 w-8" aria-hidden="true" />
                <span className="text-sm font-semibold">Map placeholder</span>
              </div>
              <p className="p-4 text-xs text-slate">
                Embed a real map (Google Maps, OpenStreetMap) here once the business address is final.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
