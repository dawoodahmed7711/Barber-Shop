import Link from "next/link";
import { Scissors } from "lucide-react";

export default function Logo({ inverted = false }) {
  return (
    <Link
      href="/"
      className="group inline-flex items-center gap-2.5"
      aria-label="The Gentleman's Club — home"
    >
      <span
        className={`flex h-10 w-10 items-center justify-center rounded-lg ${
          inverted ? "bg-royal text-white" : "bg-royal text-white"
        } transition group-hover:scale-105`}
      >
        <Scissors className="h-5 w-5 -rotate-45" aria-hidden="true" />
      </span>
      <span className="leading-none">
        <span
          className={`block font-display text-lg font-bold tracking-wide ${
            inverted ? "text-white" : "text-navy"
          }`}
        >
          THE GENTLEMAN&apos;S
        </span>
        <span
          className={`block text-[10px] font-semibold uppercase tracking-[0.42em] ${
            inverted ? "text-blue-300" : "text-royal"
          }`}
        >
          Club
        </span>
      </span>
    </Link>
  );
}
