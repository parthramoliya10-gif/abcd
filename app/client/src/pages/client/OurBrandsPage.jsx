import Footer from "../../Components/common/Footer";
import PageHeroCircle from "../../Components/common/PageHeroCircle";
import GrowthSection from "../../Components/Homepage/GrowthSection";
import OurBrands from "../../Components/Homepage/OurBrands";
import { useSeoMeta } from "../../hooks/useSeoMeta";

export default function OurBrandsPage() {
  // Applies the "our-brand" SeoPage's title/description/canonical/OG/
  // Twitter/schema (as configured in /admin/seo) to the document head.
  // No-ops quietly if that SEO record doesn't exist yet — see useSeoMeta.js.
  useSeoMeta("our-brand");

  return (
    <>
      <PageHeroCircle
        eyebrow="Our Brands"
        title="Three Brands, One Promise"
        subtitle="From CLARICUTS to Luxifine to Netram Jewels, every brand under Promise Jewels carries the same commitment to craftsmanship, quality, and trust — built for businesses that expect nothing less."
        ctaText="Explore Collections"
      />

      <div className="mt-[80px] max-[767px]:mt-[50px]"></div>
      <OurBrands />
      <GrowthSection />

      <Footer />
    </>
  );
}