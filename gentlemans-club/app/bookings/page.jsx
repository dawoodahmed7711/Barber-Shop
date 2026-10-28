import PageHeader from "../../components/PageHeader";
import BookingsManager from "../../components/BookingsManager";

export const metadata = {
  title: "My Bookings",
  description: "View and cancel demo appointments saved in this browser.",
};

export default function BookingsPage() {
  return (
    <>
      <PageHeader
        eyebrow="My bookings"
        title="Your demo appointments"
        description="Search by reference, review details or cancel. Everything here is stored locally in this browser."
      />
      <section className="section bg-white">
        <div className="container-x">
          <BookingsManager />
        </div>
      </section>
    </>
  );
}
