import { useRef } from "react";
import { gsap } from "../../gsap/register";
import useGSAP from "../../hooks/useGSAP";

/**
 * Outer circle: 18 cards, 20deg apart.
 * Same ring/angles/z-index as the homepage GrowthSection — just without
 * any of the scroll-tied scale/zoom logic, and not pinned (sticky).
 */
const OUTER_ITEMS = [
  { deg: 0, z: 8 },
  { deg: 20, z: 7 },
  { deg: 40, z: 6 },
  { deg: 60, z: 5 },
  { deg: 80, z: 4 },
  { deg: 100, z: 3 },
  { deg: 120, z: 2 },
  { deg: 140, z: 1 },
  { deg: 160, z: undefined },
  { deg: 180, z: undefined },
  { deg: 200, z: undefined },
  { deg: 220, z: undefined },
  { deg: 240, z: undefined },
  { deg: 260, z: undefined },
  { deg: 280, z: undefined },
  { deg: 300, z: undefined },
  { deg: 320, z: undefined },
  { deg: 340, z: undefined },
];

// Swap these for your own product photography — keep 18 entries for the ring
// (repeats are fine).
const DEFAULT_OUTER_IMAGES = [
  "/images/jewellery/image_20_1.webp",
  "/images/jewellery/image_22.webp",
  "/images/jewellery/image_56.webp",
  "/images/jewellery/image_77.webp",
  "/images/jewellery/image_78.webp",
  "/images/jewellery/image_79.webp",
  "/images/jewellery/image_80.webp",
  "/images/jewellery/image_81.webp",
  "/images/jewellery/image_82.webp",
  "/images/jewellery/image_83.webp",
  "/images/jewellery/image_84.webp",
  "/images/jewellery/image_86.webp",
  "/images/jewellery/image_89.webp",
  "/images/jewellery/image_90.webp",
  "/images/jewellery/image_91.webp",
  "/images/jewellery/image_92.webp",
  "/images/jewellery/image_93.webp",
  "/images/jewellery/image_94.webp",
];

const DEFAULT_TICKER_ITEMS = ["Claricuts", "Luxifine", "Netram"];

// How long one full 360deg loop takes, in seconds. Lower = faster spin.
// Constant speed, always clockwise — nothing here reacts to scroll at all.
const OUTER_LOOP_SECONDS = 40;

/**
 * Reusable hero circle + ticker, used at the top of every page (not just
 * the homepage). Pass eyebrow/title/subtitle/cta text per page — the
 * circle, ticker, and all responsive behavior stay identical everywhere.
 *
 * Usage:
 *   <PageHeroCircle
 *     eyebrow="About"
 *     title="Promise Jewels"
 *     subtitle="Promise Jewels Private Limited delivers..."
 *     ctaText="Get Started"
 *     onCtaClick={() => navigate("/contact")}
 *   />
 */
export default function PageHeroCircle({
  eyebrow,
  title,
  subtitle,
  ctaText = "Get Started",
  onCtaClick,
  outerImages = DEFAULT_OUTER_IMAGES,
  tickerItems = DEFAULT_TICKER_ITEMS,
}) {
  const outerRef = useRef(null);
  const tickerRef = useRef(null);

  // Just a plain infinite rotation — no scroll listener, no speed changes,
  // no scale changes. The circle spins at a constant rate and otherwise
  // behaves like any other content on the page (scrolls normally with it).
  useGSAP(
    () => {
      if (outerRef.current) {
        gsap.to(outerRef.current, {
          rotation: "+=360",
          duration: OUTER_LOOP_SECONDS,
          ease: "none",
          repeat: -1,
        });
      }

      // Infinite scrolling brand ticker — same technique as the homepage:
      // the track holds the text TWICE back to back, then slides left by
      // exactly 50% of its own width on a loop, so the moment it finishes
      // it looks identical to the start — a seamless, endless scroll.
      if (tickerRef.current) {
        gsap.to(tickerRef.current, {
          xPercent: -50,
          duration: 18,
          ease: "none",
          repeat: -1,
        });
      }
    },
    outerRef,
    []
  );

  const tickerBlock = (i) => (
    <div key={i} className="flex items-center">
      {tickerItems.map((item, idx) => (
        <span key={idx} className="flex items-center">
          <span className="mr-[60px] text-[10rem] font-normal font-ticker bg-clip-text text-transparent [-webkit-text-fill-color:transparent] bg-gradient-to-b from-[#01383B] to-[#286F6F]">
            {item}
          </span>
          <span className="mr-[60px] text-[10rem] font-normal font-ticker bg-clip-text text-transparent [-webkit-text-fill-color:transparent] bg-[linear-gradient(180deg,#00373F_0%,#13464e_30%,#5cc8d4_60%,#21C5D8_100%)]">
            ✦
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <section className="relative overflow-clip bg-white">
      <div
        className="
          relative overflow-hidden
          h-[var(--hero-height)]
          [--hero-height:clamp(820px,95vh,1000px)]
          [--outer-ring-h:clamp(14rem,34vmin,28rem)]
          [--outer-card-w:clamp(3.8rem,9vmin,7rem)]
          [--outer-card-h:clamp(4.5rem,10vmin,8rem)]
          [--outer-item-w:var(--outer-card-w)]
          min-[768px]:max-[1024px]:[--hero-height:600px]
          min-[768px]:max-[1024px]:[--outer-ring-h:17.5rem]
          min-[768px]:max-[1024px]:[--outer-card-w:5rem]
          min-[768px]:max-[1024px]:[--outer-card-h:5.5rem]
          max-[430px]:[--hero-height:750px]
          max-[430px]:[--outer-ring-h:10.7rem]
          max-[430px]:[--outer-card-w:2.6rem]
          max-[430px]:[--outer-card-h:3rem]
        "
      >
        <div className="relative w-full h-full">
          {/* Outer circle */}
          <div className="absolute left-1/2 top-full z-[2] max-[430px]:top-1/2 max-[430px]:[transform:translateY(-50%)]">
            <div className="relative z-[2] scale-[1.4] min-[768px]:max-[1024px]:scale-100 max-[430px]:scale-100">
              <div ref={outerRef} className="relative flex items-center justify-center">
                {OUTER_ITEMS.map((item, i) => (
                  <div
                    key={i}
                    className="absolute origin-center [perspective:1000px] rounded-full w-[var(--outer-item-w)] h-[var(--outer-ring-h)]"
                    style={{
                      transform: `rotate(${item.deg}deg)`,
                      zIndex: item.z,
                    }}
                  >
                    <div className="absolute w-[var(--outer-card-w)] h-[var(--outer-card-h)] [inset:-125%_auto_auto]">
                      <img
                        src={outerImages[i]}
                        alt=""
                        loading="lazy"
                        className="block w-full h-full object-cover rounded-[10px]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Center content */}
          <div className="absolute left-1/2 top-[70%] -translate-x-1/2 -translate-y-1/2 z-[5] flex items-center justify-center w-full text-[2.3rem] min-[768px]:max-[1024px]:top-[65%] max-[430px]:top-1/2">
            <div className="flex flex-col justify-start items-center relative z-[6] text-center px-[1rem] text-[2.3rem]">
              <p className="mt-0 mb-[40px] text-[25px] font-[350] tracking-[0.1em] uppercase font-ticker bg-gradient-to-b from-[#01383B] to-[#286F6F] bg-clip-text text-transparent [-webkit-text-fill-color:transparent] min-[768px]:max-[1024px]:text-[20px] min-[768px]:max-[1024px]:mb-[20px] max-[430px]:text-[18px] max-[430px]:mb-[15px]">
                {eyebrow}
              </p>
              <h1 className="mt-0 mb-[16px] text-[3.5rem] leading-[1.1] font-semibold font-ticker bg-gradient-to-b from-[#01383B] to-[#286F6F] bg-clip-text text-transparent [-webkit-text-fill-color:transparent] min-[768px]:max-[1024px]:text-[3rem] min-[768px]:max-[1024px]:mb-[20px] max-[430px]:text-[2.5rem] max-[430px]:mb-[10px]">
                {title}
              </h1>
              <p className="mt-0 mb-[24px] max-w-[54rem] text-[1.1rem] leading-[29px] text-[#2F6B6B] opacity-100 font-ticker font-extralight min-[768px]:max-[1024px]:text-[0.8rem] min-[768px]:max-[1024px]:max-w-[37rem] min-[768px]:max-[1024px]:mb-[25px] min-[768px]:max-[1024px]:leading-[1rem] max-[430px]:text-[0.6rem] max-[430px]:max-w-[30.7rem] max-[430px]:mb-[13px] max-[430px]:leading-[1rem]">
                {subtitle}
              </p>
              <button
                onClick={onCtaClick}
                className="text-white border-0 rounded-full px-[55px] py-[22px] mt-[50px] text-[1rem] font-semibold cursor-pointer bg-gradient-to-b from-[#01383B] to-[#286F6F] min-[768px]:max-[1024px]:px-[30px] min-[768px]:max-[1024px]:py-[13px] min-[768px]:max-[1024px]:text-[0.75rem] min-[768px]:max-[1024px]:mt-[6px] max-[430px]:px-[27px] max-[430px]:py-[12px] max-[430px]:text-[0.6rem] max-[430px]:mt-[8px]"
              >
                {ctaText}
              </button>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 z-[2] h-[150%] bg-white/25" />
      </div>

      <div className="w-full overflow-clip whitespace-nowrap bg-white pb-2">
        <div ref={tickerRef} className="flex w-max items-center [will-change:transform]">
          {[...Array(4)].map((_, i) => tickerBlock(i))}
        </div>
      </div>
    </section>
  );
}
