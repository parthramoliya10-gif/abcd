import { useRef } from "react";
import { gsap } from "../../gsap/register";
import useGSAP from "../../hooks/useGSAP";

// Both cards have equal room above and below their resting spot (the
// second card is offset with margin-top instead of being pinned flush
// to the bottom), so both can safely do the FULL up-down swing, not
// just a partial one. 70px keeps them fully inside their container at
// every screen size, including the mobile layout.
//
// fromTo + yoyo: true makes this a genuine continuous loop: up, down,
// up, down, forever — never resetting/jumping back to a start position.
// ease: "none" keeps the speed constant so it never looks like it
// pauses or stops at the top/bottom.
//
// The two cards use MIRRORED start/end values (one starts at -70 going
// to +70, the other starts at +70 going to -70) — that's what makes
// them move in opposite directions the whole time: when one is at its
// highest point, the other is at its lowest, and vice versa.
const AMPLITUDE = 70;

export default function BrandsSection() {
  const sectionRef = useRef(null);
  const luxifineRef = useRef(null);
  const claricutsRef = useRef(null);

  useGSAP(
    () => {
      gsap.fromTo(
        luxifineRef.current,
        { y: -AMPLITUDE },
        { y: AMPLITUDE, duration: 4, ease: "none", repeat: -1, yoyo: true }
      );

      gsap.fromTo(
        claricutsRef.current,
        { y: AMPLITUDE },
        { y: -AMPLITUDE, duration: 4, ease: "none", repeat: -1, yoyo: true }
      );
    },
    sectionRef,
    []
  );

  return (
    <section
      ref={sectionRef}
      className="
        w-full min-h-fit bg-white
        flex justify-between items-center
        pt-[60px] px-[8%] pb-[80px]
        max-[991px]:flex-col max-[991px]:justify-center max-[991px]:items-center
        max-[991px]:px-[40px] max-[991px]:py-[80px] max-[991px]:gap-[60px]
        max-[479px]:px-[20px] max-[479px]:py-[60px] max-[479px]:gap-[45px]
      "
    >
      <div
        className="
          w-[950px]
          mr-[70px]
          max-[991px]:w-full max-[991px]:max-w-[700px] max-[991px]:mr-0 max-[991px]:text-center
        "
      >
        <p
          className="
            font-ticker font-normal text-[32px] leading-[58px] text-[#111]
            max-[991px]:text-[24px] max-[991px]:leading-[42px]
            max-[479px]:text-[18px] max-[479px]:leading-[32px]
          "
        >
          Welcome to <strong className="font-semibold font-ticker">Promise Group of Companies</strong>, a
          leading name in the jewelry industry, where craftsmanship meets
          innovation. With a legacy rooted in excellence and a vision aimed
          at national prominence,{" "}
          <strong className="font-semibold font-ticker">
            Promise Group encompasses three distinctive sub-brands: CLARICUTS
            AND LUXIFINE.
          </strong>
        </p>
      </div>

      <div
        className="
          w-[42%] h-[520px]
          flex justify-end items-center gap-[25px]
          overflow-hidden
          max-[991px]:w-full max-[991px]:justify-center max-[991px]:h-[350px] max-[991px]:gap-[45px]
          max-[479px]:w-full max-[479px]:justify-center max-[479px]:gap-[16px] max-[479px]:h-[320px]
        "
      >
        {/* Each card lives in its own column, side by side — this horizontal
            separation is what guarantees the two cards can never physically
            collide with each other no matter how far they move up or down. */}
        <div className="w-[210px] h-full flex justify-center items-center overflow-hidden relative max-[991px]:w-[170px] max-[479px]:w-[135px]">
          <div
            ref={luxifineRef}
            className="
              w-[200px] h-[200px] bg-white rounded-[30px] border-4 border-[#0B5B5D]
              flex justify-center items-center
              text-[30px] font-medium text-[#0B5B5D]
              relative will-change-transform
              max-[991px]:w-[170px] max-[991px]:h-[170px] max-[991px]:text-[24px]
              max-[479px]:w-[125px] max-[479px]:h-[125px] max-[479px]:rounded-[20px] max-[479px]:text-[18px]
            "
          >
            Luxifine
          </div>
        </div>

        <div className="w-[210px] h-full flex justify-center items-center overflow-hidden relative max-[991px]:w-[170px] max-[479px]:w-[135px]">
          <div
            ref={claricutsRef}
            className="
              mt-[30px]
              w-[200px] h-[200px] bg-white rounded-[30px] border-4 border-[#0B5B5D]
              flex justify-center items-center
              text-[30px] font-medium text-[#0B5B5D]
              relative will-change-transform
              max-[991px]:w-[170px] max-[991px]:h-[170px] max-[991px]:text-[24px]
              max-[479px]:w-[125px] max-[479px]:h-[125px] max-[479px]:rounded-[20px] max-[479px]:text-[18px]
            "
          >
            Claricuts
          </div>
        </div>
      </div>
    </section>
  );
}
