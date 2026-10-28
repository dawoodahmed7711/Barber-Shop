import Link from "next/link";
import { Scissors } from "lucide-react";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <section className="bg-mist">
      <div className="container-x flex flex-col items-center py-24 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-royal text-white">
          <Scissors className="h-8 w-8 -rotate-45" aria-hidden="true" />
        </span>
        <p className="eyebrow mt-6">Error 404</p>
        <h1 className="mt-2 text-4xl font-bold sm:text-5xl">This page got a little too much off the top</h1>
        <p className="mt-4 max-w-md text-slate">
          We couldn&apos;t find the page you were looking for. Try one of the links below.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/" className="btn-primary">Back to Home</Link>
          <Link href="/booking" className="btn-secondary">Book an Appointment</Link>
        </div>
      </div>
    </section>
  );
}
