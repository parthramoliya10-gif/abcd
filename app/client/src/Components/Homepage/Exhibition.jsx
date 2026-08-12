import { useState } from "react";

// Swap "logo" for each exhibition's real logo image, and fill in the real
// date/venue/note text. Keep exactly 3 entries — this component is built
// specifically for a 3-card rotator, not a longer scrolling list.
const EXHIBITIONS = [
  {
    name: "ROOTZ",
    logo: "/images/Exhibition/Rootz.webp",
    eventName: "Rootz Gems & Jewellery Manufacturers Show",
    dates: "4 – 6 December 2026",
    venue: "Exhibition Centre, City",
    note: "Trade Only",
  },
  {
    name: "IIJS Bharat",
    logo: "/images/Exhibition/IIJS.webp",
    eventName: "IIJS Bharat - Premiere 2026",
    dates: "05 – 09 August 2026",
    venue: "Jio World Convention Centre (BKC) & Bombay Exhibition Centre (Goregaon)",
    note: "Mumbai, India",
  },
  {
    name: "GJS",
    logo: "/images/Exhibition/ggjs.webp",
    eventName: "Gujarat Gold Jewellery Show",
    dates: "12 – 15 January 2027",
    venue: "Exhibition Centre, Ahmedabad",
    note: "Gujarat, India",
  },
];

// Icon sizing classes shared by all three inline icons — base 34px, tablet
// 28px, mobile 18px, matching the same breakpoints as the rest of the section.
const ICON_CLASSES =
  "w-[34px] h-[34px] text-[#0a0a0a] " +
  "min-[768px]:max-[1024px]:w-[28px] min-[768px]:max-[1024px]:h-[28px] " +
  "max-[430px]:w-[18px] max-[430px]:h-[18px]";

// Small inline icons so this component has no external icon dependency.
function CalendarIcon() {
  return (
    <svg className={ICON_CLASSES} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 9h18" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="13" r="1" fill="currentColor" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg className={ICON_CLASSES} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="9.5" r="2.4" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function BanIcon() {
  return (
    <svg className={ICON_CLASSES} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5.5 5.5l13 13" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

// Shared by every card. Shadow/cursor live in the side/center variants below
// instead of here, since center and side cards each need a DIFFERENT shadow
// — keeping them out of the shared base avoids two conflicting shadow
// utilities ever landing on the same element at once.
const CARD_BASE =
  "absolute w-[650px] h-[670px] bg-white rounded-[24px] border-4 border-[#0B5B5D] " +
  "p-[28px] flex items-center justify-center " +
  "[transition:transform_0.55s_ease,opacity_0.4s_ease] " +
  "max-[640px]:w-[250px] max-[640px]:h-[250px] " +
  "min-[768px]:max-[1024px]:w-[300px] min-[768px]:max-[1024px]:h-[300px] min-[768px]:max-[1024px]:p-[18px] " +
  "max-[430px]:w-[165px] max-[430px]:h-[165px] max-[430px]:p-[12px] max-[430px]:rounded-[14px]";

const CARD_SIDE =
  "shadow-[0_20px_45px_rgba(0,0,0,0.15)] cursor-pointer hover:shadow-[0_25px_50px_rgba(0,0,0,0.2)]";

const CARD_CENTER = "shadow-[0_30px_60px_rgba(0,0,0,0.22)] cursor-default";

export default function Exhibition() {
  // Which exhibition is currently in the CENTER slot.
  const [centerIndex, setCenterIndex] = useState(1);

  // Shortest signed distance from centerIndex, wrapping around (so with
  // exactly 3 items this always resolves to -1, 0, or 1).
  const getOffset = (index) => {
    const len = EXHIBITIONS.length;
    let diff = index - centerIndex;
    if (diff > len / 2) diff -= len;
    if (diff < -len / 2) diff += len;
    return diff;
  };

  const current = EXHIBITIONS[centerIndex];

  return (
    <section className="w-full py-[90px] px-[8%] bg-white text-center">
      <h2 className="text-[4rem] font-normal my-[50px] font-ticker bg-gradient-to-b from-[#01383B] to-[#286F6F] bg-clip-text text-transparent [-webkit-text-fill-color:transparent] min-[768px]:max-[1024px]:text-[3.7rem] min-[768px]:max-[1024px]:mt-0 min-[768px]:max-[1024px]:mb-[50px] max-[430px]:text-[3rem] max-[430px]:mt-0 max-[430px]:mb-[40px]">
        Exhibition <strong className="font-semibold font-ticker">Highlights</strong>
      </h2>
      <p className="[font-family:cursive] text-[2.5rem] text-[#0B5B5D] mt-0 mb-[220px] min-[768px]:max-[1024px]:text-[2.7rem] min-[768px]:max-[1024px]:mb-[70px] max-[430px]:text-[1.7rem] max-[430px]:mb-[40px]">
        Upcoming Event
      </p>

      <div className="relative h-[420px] flex items-center justify-center [perspective:1200px] mb-[250px] max-[640px]:h-[700px] min-[768px]:max-[1024px]:h-[320px] min-[768px]:max-[1024px]:mb-[1px] max-[430px]:h-[190px] max-[430px]:mb-[70px]">
        {EXHIBITIONS.map((item, i) => {
          const offset = getOffset(i);
          const isCenter = offset === 0;

          return (
            <button
              key={item.name}
              type="button"
              className={`${CARD_BASE} ${isCenter ? CARD_CENTER : CARD_SIDE}`}
              onClick={() => setCenterIndex(i)}
              style={{
                transform: `translateX(${offset * 62}%) scale(${
                  isCenter ? 1 : 0.82
                }) rotateY(${offset * -18}deg)`,
                zIndex: isCenter ? 3 : 2,
                opacity: Math.abs(offset) > 1 ? 0 : 1,
                pointerEvents: Math.abs(offset) > 1 ? "none" : "auto",
              }}
              aria-label={`Show ${item.name}`}
            >
              <img
                src={item.logo}
                alt={item.name}
                className="w-full h-full object-contain"
              />
            </button>
          );
        })}
      </div>

      <div className="max-w-[700px] mx-auto min-[768px]:max-[1024px]:max-w-[640px] max-[430px]:max-w-full">
        <p className="text-[1.8rem] text-[#111] mt-0 mb-[34px] min-[768px]:max-[1024px]:text-[1.5rem] min-[768px]:max-[1024px]:mb-[28px] max-[430px]:text-[1.05rem] max-[430px]:mb-[18px]">
          {current.eventName}
        </p>

        <div className="flex justify-center items-start gap-[200px] flex-nowrap w-full max-w-[1200px] mx-auto max-[640px]:flex-col max-[640px]:items-center min-[768px]:max-[1024px]:gap-[26px] min-[768px]:max-[1024px]:max-w-full max-[430px]:flex-row max-[430px]:flex-nowrap max-[430px]:justify-between max-[430px]:gap-[10px] max-[430px]:max-w-full">
          <div className="flex-none flex flex-col items-center gap-[10px] text-center min-[768px]:max-[1024px]:max-w-[190px] max-[430px]:max-w-none max-[430px]:flex-1 max-[430px]:min-w-0">
            <CalendarIcon />
            <span className="text-[1.2rem] text-[#333] leading-[1.5] min-[768px]:max-[1024px]:text-[1rem] max-[430px]:text-[0.68rem] max-[430px]:leading-[1.3]">
              {current.dates}
            </span>
          </div>
          <div className="flex-none flex flex-col items-center gap-[10px] text-center min-[768px]:max-[1024px]:max-w-[190px] max-[430px]:max-w-none max-[430px]:flex-1 max-[430px]:min-w-0">
            <PinIcon />
            <span className="text-[1.2rem] text-[#333] leading-[1.5] min-[768px]:max-[1024px]:text-[1rem] max-[430px]:text-[0.68rem] max-[430px]:leading-[1.3]">
              {current.venue}
            </span>
          </div>
          <div className="flex-none flex flex-col items-center gap-[10px] text-center min-[768px]:max-[1024px]:max-w-[190px] max-[430px]:max-w-none max-[430px]:flex-1 max-[430px]:min-w-0">
            <BanIcon />
            <span className="text-[1.2rem] text-[#333] leading-[1.5] min-[768px]:max-[1024px]:text-[1rem] max-[430px]:text-[0.68rem] max-[430px]:leading-[1.3]">
              {current.note}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
