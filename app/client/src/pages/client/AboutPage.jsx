import Footer from "../../Components/common/Footer";
import PageHeroCircle from "../../Components/common/PageHeroCircle";
import Ours from "../../Components/AboutPage/Ours";
import GrowthSection from "../../Components/Homepage/GrowthSection";


export default function OurBrandsPage() {
  // Applies the "our-brand" SeoPage's title/description/canonical/OG/
  // Twitter/schema (as configured in /admin/seo) to the document head.
  // No-ops quietly if that SEO record doesn't exist yet — see useSeoMeta.js.
 

  return (
    <>
      <PageHeroCircle
  eyebrow="About Us"
  title="Crafting Trust, One Piece at a Time"
  subtitle="Promise Jewels has spent over two decades turning gold and precision into pieces that businesses and families trust. From our first workshop to a name recognized across the industry, our story is one of craftsmanship, integrity, and an unwavering promise to deliver quality that speaks for itself."
  ctaText="Explore Our Story"
/>
      <Ours />
      <GrowthSection />

      <Footer />
    </>
  );
}