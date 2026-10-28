import PageHeader from "../../components/PageHeader";
import BarberCard from "../../components/BarberCard";
import { BARBERS } from "../../data/barbers";

export const metadata = {
  title: "Our Barbers",
  description: "Meet the (fictional demo) barbers of The Gentleman's Club and book with your favorite.",
};

export default function BarbersPage() {
  return (
    <>
      <PageHeader
        eyebrow="Our barbers"
        title="Meet the team"
        description="Fictional demo profiles. Choose a barber and we'll preselect them on the booking page."
      />
      <section className="section bg-white">
        <div className="container-x grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {BARBERS.map((b) => (
            <BarberCard key={b.id} barber={b} />
          ))}
        </div>
      </section>
    </>
  );
}
