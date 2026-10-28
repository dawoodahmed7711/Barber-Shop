import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import Logo from "./Logo";
import HoursList from "./HoursList";
import SocialLinks from "./SocialLinks";
import { NAV_LINKS, SITE } from "../data/site";

export default function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="container-x grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Logo inverted />
          <p className="text-sm leading-relaxed text-slate-300">{SITE.description}</p>
          <p className="text-sm font-semibold text-blue-300">{SITE.tagline}</p>
        </div>

        <div>
          <h2 className="mb-4 font-sans text-sm font-semibold uppercase tracking-wider text-white">
            Quick Links
          </h2>
          <ul className="space-y-2 text-sm">
            {[...NAV_LINKS, { href: "/booking", label: "Book Appointment" }, { href: "/bookings", label: "My Bookings" }].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-slate-300 transition hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-4 font-sans text-sm font-semibold uppercase tracking-wider text-white">
            Opening Hours
          </h2>
          <HoursList inverted />
        </div>

        <div className="space-y-4">
          <h2 className="font-sans text-sm font-semibold uppercase tracking-wider text-white">
            Contact (demo)
          </h2>
          <ul className="space-y-3 text-sm text-slate-300">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-blue-300" aria-hidden="true" />
              {SITE.address}
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-blue-300" aria-hidden="true" />
              <a href={SITE.phoneHref} className="hover:text-white">{SITE.phone}</a>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-blue-300" aria-hidden="true" />
              <a href={`mailto:${SITE.email}`} className="break-all hover:text-white">{SITE.email}</a>
            </li>
          </ul>
          <SocialLinks inverted />
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-2 py-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {SITE.shortName}. Portfolio demo — not a real business.</p>
          <p>All names, prices, contact details and reviews are fictional sample content.</p>
        </div>
      </div>
    </footer>
  );
}
