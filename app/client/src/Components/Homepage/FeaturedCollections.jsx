import { useEffect, useState } from "react";

// Swap these for your real collection photos + names. Keep at least 5 items
// so there's always a full set of cards to show either side of the center.
const COLLECTIONS = [
  { name: "Eternal Bloom", image: "/images/Featured-collection/image_70.webp" },
  { name: "Golden Hour", image: "/images/Featured-collection/image_68.webp" },
  { name: "Soft Glam", image: "/images/Featured-collection/image_63.webp" },
  { name: "Midnight Sapphire", image: "/images/Featured-collection/image_71.webp" },
  { name: "Rose Whisper", image: "/images/Featured-collection/image_72.webp" },
];

// How long each card stays centered before auto-advancing, in ms.
const AUTOPLAY_INTERVAL = 3000;

// Common styles shared by every card, center or not.
const CARD_BASE =
  "absolute overflow-hidden [transition:transform_0.7s_ease,opacity_0.7s_ease]";

// Only ONE of these two ever applies to a given card at a time (never both),
// so there's no Tailwind class-conflict risk here.
const CARD_NORMAL =
  "w-[430px] h-[530px] rounded-[28px] shadow-[0_20px_45px_rgba(0,0,0,0.18)] " +
  "max-[991px]:w-[190px] max-[991px]:h-[280px] max-[991px]:rounded-[28px] " +
  "max-[479px]:w-[110px] max-[479px]:h-[180px] max-[479px]:rounded-[15px]";

const CARD_CENTER =
  "w-[400px] h-[560px] rounded-[32px] shadow-[0_25px_55px_rgba(0,0,0,0.28)] " +
  "max-[991px]:w-[230px] max-[991px]:h-[320px] max-[991px]:rounded-[28px] " +
  "max-[479px]:w-[140px] max-[479px]:h-[200px] max-[479px]:rounded-[15px]";

export default function FeaturedCollections() {
  const [centerIndex, setCenterIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCenterIndex((prev) => (prev + 1) % COLLECTIONS.length);
    }, AUTOPLAY_INTERVAL);
    return () => clearInterval(id);
  }, []);

  // Shortest signed distance from centerIndex, wrapping around the array
  // (so the carousel loops seamlessly instead of snapping at the ends).
  const getOffset = (index) => {
    const len = COLLECTIONS.length;
    let diff = index - centerIndex;
    if (diff > len / 2) diff -= len;
    if (diff < -len / 2) diff += len;
    return diff;
  };

  return (
    <section className="w-full pt-0 px-[8%] pb-[100px] bg-white text-center overflow-hidden max-[991px]:pt-[70px] max-[991px]:px-[40px] max-[991px]:pb-[120px] max-[991px]:overflow-visible max-[479px]:pt-[60px] max-[479px]:px-[20px] max-[479px]:pb-[100px] max-[479px]:overflow-visible">
      <h2 className="text-[4rem] font-light mt-0 mb-[50px] font-ticker bg-gradient-to-b from-[#01383B] to-[#286F6F] bg-clip-text text-transparent [-webkit-text-fill-color:transparent] max-[991px]:text-[3rem] max-[991px]:mb-[30px] max-[479px]:text-[2.2rem] max-[479px]:mb-[20px]">
  Featured{" "}
  <strong className="font-semibold font-ticker bg-gradient-to-b from-[#01383B] to-[#286F6F] bg-clip-text text-transparent [-webkit-text-fill-color:transparent]">
    Collections
  </strong>
</h2>

      <div className="relative h-[630px] flex items-center justify-center max-[991px]:h-[420px] max-[479px]:h-[300px]">
        {COLLECTIONS.map((item, i) => {
          const offset = getOffset(i);
          // Only render cards within 2 slots of center — anything further
          // out is invisible anyway, no need to keep it in the DOM/transition.
          if (Math.abs(offset) > 2) return null;

          const isCenter = offset === 0;

          return (
            <div
  key={item.name + i}
  className={`${CARD_BASE} ${isCenter ? CARD_CENTER : CARD_NORMAL}`}
  style={{
    transform: `translateX(${offset * 72}%) scale(${
      1 - Math.abs(offset) * 0.16
    })`,
    zIndex: 10 - Math.abs(offset),
  }}
>
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover block"
              />
            </div>
          );
        })}
      </div>

      <p className="mt-[30px] text-[1.7rem] text-[#333] transition-opacity duration-[400ms] ease-in-out max-[991px]:mt-[10px] max-[991px]:text-[2rem] max-[479px]:mt-[15px] max-[479px]:text-[1.2rem]">
        {COLLECTIONS[centerIndex].name}
      </p>
    </section>
  );
}
