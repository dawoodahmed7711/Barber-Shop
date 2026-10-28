import PageHeader from "../../components/PageHeader";
import ServicesList from "../../components/ServicesList";
import DemoNotice from "../../components/DemoNotice";

export const metadata = {
  title: "Services",
  description: "Haircuts, fades, beard trims and grooming packages with clear demo pricing and durations.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="Haircuts, fades and grooming"
        description="Pick a service and book it in a few clicks. Prices and durations are fictional and easy to edit."
      />
      <section className="section bg-white">
        <div className="container-x space-y-8">
          <DemoNotice>All prices are fictional demo values from data/services.js.</DemoNotice>
          <ServicesList />
        </div>
      </section>
    </>
  );
}
