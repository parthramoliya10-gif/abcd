import { useRef } from "react";
import { gsap } from "../../gsap/register";
import useGSAP from "../../hooks/useGSAP";


/**
 * Outer circle: 18 cards, 20deg apart, 4.5rem x 18rem items
 * Inner circle: 12 cards, 30deg apart, 3.5rem x 12rem items
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


const INNER_ITEMS = [
  { deg: 0, z: 8 },
  { deg: 30, z: 7 },
  { deg: 60, z: 6 },
  { deg: 90, z: 5 },
  { deg: 120, z: 4 },
  { deg: 150, z: 3 },
  { deg: 180, z: 2 },
  { deg: 210, z: 1 },
  { deg: 240, z: undefined },
  { deg: 270, z: undefined },
  { deg: 300, z: undefined },
  { deg: 330, z: undefined },
];


// Swap these for your own product photography — keep 18 for the outer ring
// and 12 for the inner ring (repeats are fine, the reference site repeats too).


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


const INNER_IMAGES = [
  "/images/jewellery/image_95.webp",
  "/images/jewellery/image_96.webp",
  "/images/jewellery/image_97.webp",
  "/images/jewellery/image_98.webp",
  "/images/jewellery/image_99.webp",
  "/images/jewellery/image_100.webp",
  "/images/jewellery/image_101.webp",
  "/images/jewellery/image_102.webp",
  "/images/jewellery/image_82.webp",
  "/images/jewellery/image_83.webp",
  "/images/jewellery/image_84.webp",
  "/images/jewellery/image_86.webp",
];


// How long one full 360deg loop takes, in seconds. Lower = faster spin.
const OUTER_LOOP_SECONDS = 40;
const INNER_LOOP_SECONDS = 32;


export default function HeroCircle() {
  const sectionRef = useRef(null);
  const outerRef = useRef(null);
  const innerRef = useRef(null);
  const innerWrapperRef = useRef(null);
  const outerWrapperRef = useRef(null);
  const tickerRef = useRef(null);


  useGSAP(
    () => {
      // Continuous idle rotation — always running, independent of scroll.
      if (outerRef.current) {
        gsap.to(outerRef.current, {
          rotation: "+=360",
          duration: OUTER_LOOP_SECONDS,
          ease: "none",
          repeat: -1,
        });
      }


      if (innerRef.current) {
        gsap.to(innerRef.current, {
          rotation: "-=360",
          duration: INNER_LOOP_SECONDS,
          ease: "none",
          repeat: -1,
        });
      }


      const mm = gsap.matchMedia();


      mm.add("(min-width: 992px)", () => {
        gsap.set(outerWrapperRef.current, { scale: 1.4 });
        gsap.set(innerWrapperRef.current, { scale: 1.4 });


        gsap.to(outerWrapperRef.current, {
          scale: 8,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=3500",
            scrub: 1.5,
          },
        });


        gsap.to(innerWrapperRef.current, {
          scale: 3,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=3500",
            scrub: 1.5,
          },
        });
      });


      mm.add("(max-width: 768px)", () => {
        gsap.set(outerWrapperRef.current, { scale: 1.3 });
        gsap.set(innerWrapperRef.current, { scale: 1 });


        gsap.to(outerWrapperRef.current, {
          scale: 5,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=2500",
            scrub: 1.5,
          },
        });


        gsap.to(innerWrapperRef.current, {
          scale: 3,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=2500",
            scrub: 1.5,
          },
        });
      });


      // Infinite brand ticker
      if (tickerRef.current) {
        gsap.to(tickerRef.current, {
          xPercent: -50,
          duration: 18,
          ease: "none",
          repeat: -1,
        });
      }
    },
    sectionRef,
    []
  );


  return (
    <>
      {/* container-fluid keeps this full-bleed section consistent with the
          rest of the Bootstrap-based page shell. Everything inside is
          Tailwind — the circular layout is absolute/transform positioned,
          not column-based, so Bootstrap's grid doesn't apply here. */}
      <section ref={sectionRef} className="container-fluid p-0 relative overflow-clip bg-white">
        <div
          className="
            h-[120vh] sticky top-0 overflow-hidden
            [--outer-ring-h:clamp(14rem,34vmin,28rem)]
            [--outer-card-w:clamp(3.8rem,9vmin,7rem)]
            [--outer-card-h:clamp(4.5rem,10vmin,8rem)]
            [--outer-item-w:var(--outer-card-w)]
            [--inner-ring-h:calc(var(--outer-ring-h)*0.667)]
            [--inner-card-w:calc(var(--outer-card-w)*0.878)]
            [--inner-card-h:calc(var(--outer-card-h)*0.85)]
            [--inner-item-w:var(--inner-card-w)]
            max-[1440px]:[--outer-ring-h:24rem]
            max-[1440px]:[--outer-card-w:5.8rem]
            max-[1440px]:[--outer-card-h:6.8rem]
            max-[1440px]:[--inner-ring-h:16rem]
            max-[1440px]:[--inner-card-w:5rem]
            max-[1440px]:[--inner-card-h:5.8rem]
            max-[991px]:[--outer-ring-h:14rem]
            max-[991px]:[--outer-card-w:4.1rem]
            max-[991px]:[--outer-card-h:4.6rem]
            max-[991px]:[--inner-ring-h:12rem]
            max-[991px]:[--inner-card-w:3.5rem]
            max-[991px]:[--inner-card-h:3.9rem]
            max-[479px]:[--outer-ring-h:9rem]
            max-[479px]:[--outer-card-w:2.3rem]
            max-[479px]:[--outer-card-h:2.5rem]
            max-[479px]:[--inner-ring-h:7.7rem]
            max-[479px]:[--inner-card-w:2.5rem]
            max-[479px]:[--inner-card-h:2.7rem]
          "
        >
          <div className="grid grid-cols-6 grid-rows-6 gap-4 w-full h-screen">
            {/* Outer circle */}
            <div className="[grid-area:1/1/7/7] place-self-center">
              <div
                ref={outerWrapperRef}
                className="relative z-[2] scale-[1.4] max-[991px]:scale-100 max-[479px]:scale-[0.92]"
              >
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


            {/* Inner circle */}
            <div className="[grid-area:1/1/7/7] place-self-center">
              <div ref={innerWrapperRef} className="relative z-[2] scale-[1.4] max-[991px]:scale-100 max-[479px]:scale-[0.92]">
                <div ref={innerRef} className="relative flex items-center justify-center">
                  {INNER_ITEMS.map((item, i) => (
                    <div
                      key={i}
                      className="absolute origin-center [perspective:1000px] rounded-full w-[var(--inner-item-w)] h-[var(--inner-ring-h)]"
                      style={{
                        transform: `rotate(${item.deg}deg)`,
                        zIndex: item.z,
                      }}
                    >
                      <div className="absolute w-[var(--inner-card-w)] h-[var(--inner-card-h)] [inset:-100%_auto_auto]">
                        <img
                          src={INNER_IMAGES[i]}
                          alt=""
                          loading="lazy"
                          className="block w-full h-full object-cover rounded-[8px]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>


            {/* Center logo */}
            <div className="[grid-area:1/1/7/7] relative z-[5] flex items-center justify-center">
              <div className="relative z-[6] flex flex-col items-center justify-center gap-4">
                <div className="flex flex-col items-center justify-center text-center font-heading">
                  <h1
                    className="
                      m-0 uppercase leading-none font-extralight text-[#0B5B5D]
                      text-[72px] tracking-[8px]
                      max-[1440px]:text-[64px]
                      max-[991px]:text-[50px] max-[991px]:tracking-[5px]
                      max-[479px]:text-[34px] max-[479px]:tracking-[3px]
                    "
                  >
                    Promise
                  </h1>
                  <span
                    className="
                      mt-3 font-semibold text-[#0B5B5D]
                      text-[25px] tracking-[14px]
                      max-[1440px]:text-[22px] max-[1440px]:tracking-[12px]
                      max-[991px]:text-[15px] max-[991px]:tracking-[8px]
                      max-[479px]:text-[10px] max-[479px]:tracking-[5px]
                    "
                  >
                    JEWELS
                  </span>
                </div>
              </div>
            </div>
          </div>


          <div className="pointer-events-none absolute inset-0 z-[2] h-[150%] bg-white/25" />
        </div>
      </section>


      <div className="w-full overflow-clip whitespace-nowrap bg-white pb-2">
        <div ref={tickerRef} className="flex w-max items-center [will-change:transform]">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center">
              <span className="mr-[60px] text-[10rem] font-normal font-ticker bg-clip-text text-transparent [-webkit-text-fill-color:transparent] bg-gradient-to-b from-[#01383B] to-[#286F6F]">
                Claricuts
              </span>
              <span className="mr-[60px] text-[10rem] font-normal font-ticker bg-clip-text text-transparent [-webkit-text-fill-color:transparent] bg-[linear-gradient(180deg,#00373F_0%,#13464e_30%,#5cc8d4_60%,#21C5D8_100%)]">
                ✦
              </span>


              <span className="mr-[60px] text-[10rem] font-normal font-ticker bg-clip-text text-transparent [-webkit-text-fill-color:transparent] bg-gradient-to-b from-[#01383B] to-[#286F6F]">
                Luxifine
              </span>
              <span className="mr-[60px] text-[10rem] font-normal font-ticker bg-clip-text text-transparent [-webkit-text-fill-color:transparent] bg-[linear-gradient(180deg,#00373F_0%,#13464e_30%,#5cc8d4_60%,#21C5D8_100%)]">
                ✦
              </span>


              <span className="mr-[60px] text-[10rem] font-normal font-ticker bg-clip-text text-transparent [-webkit-text-fill-color:transparent] bg-gradient-to-b from-[#01383B] to-[#286F6F]">
                Netram
              </span>
              <span className="mr-[60px] text-[10rem] font-normal font-ticker bg-clip-text text-transparent [-webkit-text-fill-color:transparent] bg-[linear-gradient(180deg,#00373F_0%,#13464e_30%,#5cc8d4_60%,#21C5D8_100%)]">
                ✦
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
