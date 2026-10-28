"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";
import { NAV_LINKS } from "../data/site";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);

  // Close the menu whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Escape closes the menu and returns focus to the toggle.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
      <div className="container-x flex h-16 items-center justify-between lg:h-20">
        <Logo />

        <nav aria-label="Main navigation" className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isActive(l.href) ? "page" : undefined}
              className={`rounded-lg px-3.5 py-2 text-sm font-medium transition ${
                isActive(l.href)
                  ? "bg-royal-light text-royal"
                  : "text-navy hover:bg-mist hover:text-royal"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/booking" className="btn-primary hidden sm:inline-flex">
            Book Appointment
          </Link>
          <button
            ref={buttonRef}
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-line text-navy transition hover:border-royal hover:text-royal lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      <div id="mobile-menu" hidden={!open} className="border-t border-line bg-white lg:hidden">
        <nav aria-label="Mobile navigation" className="container-x flex flex-col gap-1 py-4">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              aria-current={isActive(l.href) ? "page" : undefined}
              className={`rounded-lg px-3 py-3 text-base font-medium ${
                isActive(l.href) ? "bg-royal-light text-royal" : "text-navy hover:bg-mist"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link href="/bookings" onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 text-base font-medium text-navy hover:bg-mist">
            My Bookings
          </Link>
          <Link href="/booking" onClick={() => setOpen(false)} className="btn-primary mt-2">
            Book Appointment
          </Link>
        </nav>
      </div>
    </header>
  );
}
