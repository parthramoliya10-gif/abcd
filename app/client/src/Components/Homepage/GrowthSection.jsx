import { useEffect, useRef } from "react";
import { gsap } from "../../gsap/register";
import useGSAP from "../../hooks/useGSAP";

/**
 * Outer circle: 18 cards, 20deg apart.
 * These angles + z-index pattern are copied 1:1 from the reference site's CSS.
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
// (repeats are fine, the reference site repeats too).
const OUTER_IMAGES = [
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

// How long one full 360deg loop takes at idle, in seconds. Lower = faster spin.
const OUTER_LOOP_SECONDS = 40;

// Scroll-reactive rotation/zoom tuning
const BASE_SPEED = 360 / (OUTER_LOOP_SECONDS * 60); // deg per frame at ~60fps idle
const SCROLL_SPEED_BOOST = 2; // how much faster it spins while actively scrolling
const ZOOM_ON_SCROLL_DOWN = 1.08; // extra zoom bump while scrolling down
const NORMAL_ZOOM = 1.1; // resting zoom (on top of the base 1.4 wrapper scale)
const SMOOTHING = 0.06; // lerp factor — lower = smoother/slower to react
const IDLE_REVERT_MS = 160; // time after scroll stops before reverting to idle clockwise

const CIRCLE_COMPONENT_VARS =
  "[--hero-height:clamp(100px,95vh,1000px)] " +
  "[--outer-ring-h:clamp(18rem,34vmin,28rem)] " +
  "[--outer-card-w:clamp(3.8rem,9vmin,7rem)] " +
  "[--outer-card-h:clamp(4.5rem,10vmin,8rem)] " +
  "[--outer-item-w:var(--outer-card-w)] " +
  "min-[768px]:max-[1024px]:[--hero-height:550px] " +
  "min-[768px]:max-[1024px]:[--outer-ring-h:11.5rem] " +
  "min-[768px]:max-[1024px]:[--outer-card-w:3rem] " +
  "min-[768px]:max-[1024px]:[--outer-card-h:3.5rem] " +
  "max-[430px]:[--hero-height:300px] " +
  "max-[430px]:[--outer-ring-h:6.5rem] " +
  "max-[430px]:[--outer-card-w:2rem] " +
  "max-[430px]:[--outer-card-h:2.3rem]";

export default function GrowthSection() {
  const sectionRef = useRef(null);
  const outerRef = useRef(null);
  const outerWrapperRef = useRef(null);

  // Scroll-reactive rotation + zoom bump — always spinning slowly clockwise;
  // speeds up and zooms in slightly while scrolling down, reverses to
  // anticlockwise and shrinks back while scrolling up, then resumes idle
  // clockwise drift once scrolling settles. Deliberately vanilla rAF, not
  // GSAP — this needs frame-by-frame lerp control that's easier to reason
  // about as a raw loop than as a tween.
  useEffect(() => {
    let rafId;
    let rotation = 0;
    let speed = BASE_SPEED;
    let targetSpeed = BASE_SPEED;
    let scale = NORMAL_ZOOM;
    let targetScale = NORMAL_ZOOM;

    let lastScrollY = window.scrollY;
    let revertTimeout = null;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const diff = currentY - lastScrollY;
      lastScrollY = currentY;

      if (diff > 0) {
        // Scrolling down: speed up (still clockwise) + zoom in slightly
        targetSpeed = BASE_SPEED * SCROLL_SPEED_BOOST;
        targetScale = ZOOM_ON_SCROLL_DOWN;
      } else if (diff < 0) {
        // Scrolling up: reverse to anticlockwise + return to normal size
        targetSpeed = -BASE_SPEED * SCROLL_SPEED_BOOST;
        targetScale = NORMAL_ZOOM;
      }

      if (revertTimeout) clearTimeout(revertTimeout);
      revertTimeout = setTimeout(() => {
        // Scrolling has settled — resume slow clockwise idle drift
        targetSpeed = BASE_SPEED;
        targetScale = NORMAL_ZOOM;
      }, IDLE_REVERT_MS);
    };

    const loop = () => {
      speed += (targetSpeed - speed) * SMOOTHING;
      scale += (targetScale - scale) * SMOOTHING;
      rotation += speed;

      if (outerRef.current) {
        outerRef.current.style.transform = `rotate(${rotation}deg) scale(${scale})`;
      }

      rafId = requestAnimationFrame(loop);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    rafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (revertTimeout) clearTimeout(revertTimeout);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Big cinematic zoom-through as the page scrolls past the hero — layered
  // on top of the reactive spin/zoom above, since it lives on the wrapper
  // element while the reactive loop drives the inner block.
  useGSAP(
    () => {
      if (outerWrapperRef.current && sectionRef.current) {
        gsap.fromTo(
          outerWrapperRef.current,
          { scale: 1.1 },
          {
            scale: 2,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: "+=3500",
              scrub: 1.5,
            },
          }
        );
      }
    },
    sectionRef,
    []
  );

  return (
    <section ref={sectionRef} className="relative overflow-clip bg-white">
      <div className={`h-[var(--hero-height)] sticky top-0 overflow-hidden ${CIRCLE_COMPONENT_VARS}`}>
        <div className="relative w-full h-full">
          {/* Outer circle */}
          <div className="absolute left-1/2 top-full z-[2]">
            <div
              ref={outerWrapperRef}
              className="relative z-[2] scale-[1.4] min-[768px]:max-[1024px]:scale-100 max-[430px]:scale-100"
            >
              <div
                ref={outerRef}
                className="relative flex items-center justify-center will-change-transform [backface-visibility:hidden]"
              >
                {OUTER_ITEMS.map((item, i) => (
                  <div
                    key={i}
                    className="absolute origin-center [perspective:1000px] rounded-full w-[var(--outer-item-w)] h-[var(--outer-ring-h)] will-change-transform [backface-visibility:hidden]"
                    style={{
                      transform: `rotate(${item.deg}deg)`,
                      zIndex: item.z,
                    }}
                  >
                    <div className="absolute w-[var(--outer-card-w)] h-[var(--outer-card-h)] [inset:-125%_auto_auto]">
                      <img
                        src={OUTER_IMAGES[i]}
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
          <div className="absolute left-1/2 top-[70%] -translate-x-1/2 -translate-y-1/2 z-[5] flex items-center justify-center w-full text-[2.3rem] min-[768px]:max-[1024px]:top-[78%] max-[430px]:top-[78%]">
            <div className="flex flex-col justify-start items-center relative z-[6] text-center px-[1rem] text-[2.3rem]">
              <p className="mt-0 mb-[40px] text-[12px] font-semibold tracking-[0.25em] uppercase text-[#0B5B5D] min-[768px]:max-[1024px]:text-[9px] min-[768px]:max-[1024px]:mb-[20px] max-[430px]:text-[4px] max-[430px]:mb-[16px]">
                JEWELLERY MANUFACTURER &amp; WHOLESALER
              </p>
              <h1 className="mt-0 mb-[16px] text-[4.25rem] leading-[1.1] font-medium text-[#0B5B5D] min-[768px]:max-[1024px]:text-[2.6rem] min-[768px]:max-[1024px]:mb-[12px] max-[430px]:text-[1.3rem] max-[430px]:mb-[10px]">
                Let&rsquo;s Drive <span className="text-[#C9A15A] font-semibold">Growth</span>
              </h1>
              <p className="mt-0 mb-[24px] max-w-[34rem] text-[1rem] leading-[1.6] text-[#0B5B5D] opacity-75 min-[768px]:max-[1024px]:text-[0.8rem] min-[768px]:max-[1024px]:max-w-[26rem] min-[768px]:max-[1024px]:mb-[20px] max-[430px]:text-[0.4rem] max-[430px]:max-w-[20rem] max-[430px]:mb-[16px]">
                From concept to craftsmanship, Promise Jewels Private Limited
                delivers premium-quality jewellery manufacturing and wholesale
                solutions tailored to your business needs.
              </p>
              <button className="text-white border-0 rounded-full px-[40px] py-[20px] mt-[20px] text-[1rem] font-semibold cursor-pointer bg-gradient-to-b from-[#01383B] to-[#286F6F] min-[768px]:max-[1024px]:px-[24px] min-[768px]:max-[1024px]:py-[10px] min-[768px]:max-[1024px]:text-[0.75rem] max-[430px]:px-[20px] max-[430px]:py-[8px] max-[430px]:text-[0.3rem]">
                Get Started
              </button>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 z-[2] h-[150%] bg-white/25" />

        <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-[min(95%,250rem)] h-[2px] bg-[#070707] z-[6]" />
      </div>
    </section>
  );
}
