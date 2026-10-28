import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import BookingSummary from "./BookingSummary";
import DemoNotice from "./DemoNotice";

export default function BookingConfirmation({ booking, onBookAnother }) {
  return (
    <section aria-labelledby="confirmation-title" className="card mx-auto max-w-2xl p-6 sm:p-8">
      <div className="flex flex-col items-center text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-royal-light text-royal">
          <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
        </span>
        <h2 id="confirmation-title" className="mt-4 text-2xl font-bold sm:text-3xl">
          Demo booking saved
        </h2>
        <p className="mt-2 text-sm text-slate">
          Saved in this browser only, for {booking.name}. No business has received this booking.
        </p>
        <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-slate">Booking reference</p>
        <p className="mt-1 rounded-lg bg-mist px-5 py-2 font-mono text-2xl font-bold tracking-widest text-royal">
          {booking.reference}
        </p>
      </div>

      <div className="mt-6">
        <BookingSummary booking={booking} />
      </div>

      <div className="mt-6">
        <DemoNotice>
          This is a portfolio demo. Bookings are stored only in this browser&apos;s local storage,
          are not shared with other devices or customers, and no confirmation email or text is sent.
        </DemoNotice>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link href="/bookings" className="btn-primary">View My Bookings</Link>
        <button type="button" className="btn-secondary" onClick={onBookAnother}>
          Book Another Appointment
        </button>
      </div>
    </section>
  );
}
