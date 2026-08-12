import { useEffect, useState } from "react";

const PILLARS = [
  {
    title: "Innovation",
    icon: "/images/icons/innovation.svg",
    description:
      "We continuously develop new jewelry designs, advanced manufacturing techniques, and modern production processes to meet evolving market trends.",
  },
  {
    title: "Customer Satisfaction",
    icon: "/images/icons/Customer satisfaction.svg",
    description:
      "Every piece of jewelry is crafted with precision to ensure superior quality, timely delivery, and complete customer satisfaction.",
  },
  {
    title: "Superior Quality",
    icon: "/images/icons/Superior Quality.svg",
    description:
      "As a trusted gold jewelry manufacturer, we maintain strict quality standards using premium materials, skilled craftsmanship, and advanced manufacturing technology.",
  },
  {
    title: "Transparency & Ethics",
    icon: "/images/icons/Transparency & Ethics.svg",
    description:
      "We believe in honest business practices, ethical sourcing, and long-term partnerships built on trust and integrity.",
  },
  {
    title: "Employee Well-being",
    icon: "/images/icons/Employee well-being.svg",
    description:
      "Our people are our greatest strength. We foster a safe, collaborative, and growth-oriented workplace that encourages innovation and excellence.",
  },
];

// Cards that aren't active share these; only ONE of SMALL_CARD_ACTIVE /
// SMALL_CARD_INACTIVE ever applies to a given card at once, so there's no
// Tailwind class-conflict risk combining them.
const SMALL_CARD_BASE =
  "w-[190px] h-[190px] rounded-[20px] border-0 flex flex-col justify-center items-center " +
  "cursor-pointer text-white " +
  "transition-[transform,box-shadow,border-color,background] duration-[350ms] ease " +
  "max-[900px]:w-[110px] max-[900px]:h-[110px] max-[600px]:w-[95px] max-[600px]:h-[95px]";

const SMALL_CARD_INACTIVE =
  "bg-[linear-gradient(180deg,#01484C_0%,#2F6B6B_100%)] " +
  "shadow-[0_12px_28px_rgba(1,72,76,0.20)] " +
  "hover:bg-[linear-gradient(180deg,#0B5B5D_0%,#2F6B6B_100%)] " +
  "hover:shadow-[0_15px_30px_rgba(1,72,76,0.28)]";

const SMALL_CARD_ACTIVE =
  "bg-[linear-gradient(180deg,#0B5B5D_0%,#2F6B6B_100%)] " +
  "shadow-[0_12px_28px_rgba(1,72,76,0.20)] " +
  "-translate-y-[13px] max-[600px]:-translate-y-[8px]";

const INDICATOR_BASE =
  "h-[2px] rounded-full bg-[#286F6F] transition-all duration-700 ease " +
  "max-[600px]:w-[28px]";

const INDICATOR_INACTIVE = "w-[44px]";
const INDICATOR_ACTIVE = "w-[70px] bg-[#B69760] max-[600px]:w-[46px]";

export default function OurPillars() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % PILLARS.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const activePillar = PILLARS[active];

  return (
    <section className="w-full pt-[60px] px-[8%] pb-[120px] bg-white flex flex-col items-center">
      <h2 className="text-center text-[4rem] mt-0 mb-[60px] font-light font-ticker bg-gradient-to-b from-[#01383B] to-[#286F6F] bg-clip-text text-transparent [-webkit-text-fill-color:transparent] max-[900px]:text-[3.7rem] max-[600px]:text-[2.7rem]">
        Our{" "}
        <strong className="font-semibold font-ticker bg-gradient-to-b from-[#01383B] to-[#286F6F] bg-clip-text text-transparent [-webkit-text-fill-color:transparent]">
          Pillars
        </strong>
      </h2>

      {/* BIG CARD */}
      <div className="w-[860px] min-h-[300px] bg-[linear-gradient(135deg,#01383B_0%,#01484C_55%,#2F6B6B_100%)] rounded-[30px] flex items-center gap-[35px] p-[42px] text-white shadow-[0_25px_55px_rgba(1,72,76,0.22)] transition-all duration-700 ease hover:shadow-[0_30px_60px_rgba(1,72,76,0.28)] max-[900px]:w-full max-[900px]:p-[32px] max-[900px]:flex-col max-[900px]:text-center">
        <div className="w-[95px] h-[95px] rounded-[22px] bg-[linear-gradient(180deg,#01484C_0%,#2F6B6B_100%)] flex justify-center items-center text-[#E6B86C] text-[36px] shrink-0 shadow-[inset_0_1px_2px_rgba(255,255,255,0.08),0_12px_22px_rgba(0,0,0,0.18),0_0_24px_rgba(230,184,108,0.24)]">
          <img
            src={activePillar.icon}
            alt={activePillar.title}
            width={52}
            height={52}
            loading="lazy"
          />
        </div>

        <div>
          <h3 className="m-0 text-[30px] text-[#E6B86C] tracking-[0.5px] font-bold max-[900px]:text-[26px]">
            {activePillar.title}
          </h3>
          <p className="mt-[14px] leading-[1.55] text-[18px] text-[#F4F4F4] max-[900px]:text-[17px]">
            {activePillar.description}
          </p>
        </div>
      </div>

      {/* SMALL CARDS */}
      <div className="mt-[80px] flex justify-center gap-[80px] flex-wrap max-[900px]:gap-[18px]">
        {PILLARS.map((pillar, index) => {
          const isActive = active === index;
          return (
            <button
              key={pillar.title}
              onClick={() => setActive(index)}
              className={`${SMALL_CARD_BASE} ${isActive ? SMALL_CARD_ACTIVE : SMALL_CARD_INACTIVE}`}
            >
              <div className="w-[90px] h-[90px] rounded-[16px] bg-[linear-gradient(180deg,#01484C_0%,#2F6B6B_100%)] flex justify-center items-center text-[#E6B86C] text-[24px] mb-[12px] shadow-[inset_0_1px_2px_rgba(255,255,255,0.08),0_12px_22px_rgba(0,0,0,0.18),0_0_24px_rgba(230,184,108,0.24)] max-[900px]:w-[45px] max-[900px]:h-[45px] max-[600px]:w-[44px] max-[600px]:h-[44px] max-[600px]:text-[20px]">
                <img
                  src={pillar.icon}
                  alt={pillar.title}
                  width={48}
                  height={48}
                  loading="lazy"
                />
              </div>

              <span className="text-white text-[14px] font-medium leading-[1.25] text-center px-[12px] max-[600px]:text-[11px]">
                {pillar.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* INDICATORS */}
      <div className="flex gap-[14px] mt-[50px]">
        {PILLARS.map((_, index) => {
          const isActive = active === index;
          return (
            <div
              key={index}
              className={`${INDICATOR_BASE} ${isActive ? INDICATOR_ACTIVE : INDICATOR_INACTIVE}`}
            />
          );
        })}
      </div>
    </section>
  );
}
