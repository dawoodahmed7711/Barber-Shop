import { Suspense } from "react";
import PageHeader from "../../components/PageHeader";
import BookingForm from "../../components/BookingForm";

export const metadata = {
  title: "Book an Appointment",
  description: "Choose a service, barber, date and time. Portfolio demo: bookings are saved only in your browser.",
};

export default function BookingPage() {
  return (
    <>
      <PageHeader
        eyebrow="Booking"
        title="Book an appointment"
        description="Pick a service, barber and date to see live available times."
      />
      <section className="section bg-white">
        <div className="container-x">
          <Suspense fallback={<p className="text-sm text-slate" role="status">Loading booking form…</p>}>
            <BookingForm />
          </Suspense>
        </div>
      </section>
    </>
  );
}
