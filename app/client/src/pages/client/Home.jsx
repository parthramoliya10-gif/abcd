import HeroCircle from "../../Components/Homepage/Herocircle";
import BrandsSection from "../../Components/Homepage/BrandsSection";
import FeaturedCollections from "../../Components/Homepage/FeaturedCollections";
import OurPillars from "../../Components/Homepage/OurPillars";
import OurBrands from "../../Components/Homepage/OurBrands";
import Exhibition from "../../Components/Homepage/Exhibition";
import GrowthSection from "../../Components/Homepage/GrowthSection";
import Footer from "../../Components/common/Footer";
import { useSeoMeta } from "../../hooks/useSeoMeta";

export default function Home() {
  // Applies the "home" SeoPage's title/description/canonical/OG/Twitter/
  // schema (as configured in /admin/seo) to the document head. No-ops
  // quietly if that SEO record doesn't exist yet — see useSeoMeta.js.
  useSeoMeta("home");

  return (
    <>
      <HeroCircle />
      <BrandsSection />
      <FeaturedCollections />
      <OurPillars />
      <OurBrands />
      <Exhibition />
      <GrowthSection />
      <Footer />
    </>
  );
}
