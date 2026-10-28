import PageHeader from "../../components/PageHeader";
import GalleryGrid from "../../components/GalleryGrid";

export const metadata = {
  title: "Gallery",
  description: "Modern fades, classic haircuts, beard grooming, styling and the barber studio.",
};

export default function GalleryPage() {
  return (
    <>
      <PageHeader
        eyebrow="Gallery"
        title="Our work and our studio"
        description="Browse by category and click any photo to enlarge. Use arrow keys to move and Escape to close."
      />
      <section className="section bg-white">
        <div className="container-x">
          <GalleryGrid />
        </div>
      </section>
    </>
  );
}
