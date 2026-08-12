import { useEffect, useRef, useState } from "react";

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

// ---- dial geometry -------------------------------------------------------
// The dial is a circle whose centre sits off-screen to the left. Only a thin
// "sliver" of it is visible on the right, same as the reference site's
// year-line. The active pillar always sits at the circle's rightmost point
// (angle 0); everything else is placed relative to it, so when `active`
// changes the whole set glides around the dial instead of jump-cutting.
const RADIUS = 340;
const RADIUS_MOBILE = 175;
const ANGLE_STEP = 25; // degrees between neighbouring pillars on the dial
const ROTATE_STEP = 11; // degrees of text tilt per step (subtler than the position angle)
const DIAL_HEIGHT = 560;
const DIAL_HEIGHT_MOBILE = 340;
const BREAKPOINT = 860;
const VH_PER_PILLAR = 70; // scroll (in vh) it takes to move one pillar while pinned

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(true);
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= BREAKPOINT);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isDesktop;
}

export default function OurPillars() {
  const [active, setActive] = useState(0);
  const isDesktop = useIsDesktop();
  const sectionRef = useRef(null);
  const N = PILLARS.length;

  // The content pane shows exactly one pillar at a time (title + full
  // description) plus a low-opacity peek of the *next* one underneath —
  // never the full list of 5. `displayIndex` trails `active` by a short
  // fade so swapping the text doesn't jump-cut.
  const [displayIndex, setDisplayIndex] = useState(0);
  const [contentVisible, setContentVisible] = useState(true);

  // How far the scroll has moved from the current pillar's centre toward
  // the next one (0 = resting on the current pillar, 1 = about to flip to
  // the next). Drives the peek block's blur-to-clear transition, so it
  // visibly sharpens as you scroll toward it instead of just popping in.
  const [clearProgress, setClearProgress] = useState(0);

  useEffect(() => {
    if (active === displayIndex) return;
    setContentVisible(false);
    const t = setTimeout(() => {
      setDisplayIndex(active);
      setContentVisible(true);
    }, 220);
    return () => clearTimeout(t);
  }, [active, displayIndex]);

  // The whole component is pinned (via a tall wrapper + `sticky` child) for
  // as long as it takes to step through all 5 pillars. Once the user has
  // scrolled past that, the sticky element naturally releases and the page
  // continues on to whatever comes next — no extra code needed for that
  // part, it falls out of how `sticky` works with a tall parent.
  useEffect(() => {
    const handleScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total <= 0) return;
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      const progress = scrolled / total;
      const rawIndex = progress * (N - 1);
      const index = Math.round(rawIndex);
      setActive((prev) => (prev === index ? prev : index));

      // Distance scrolled past this pillar's centre, toward the next one,
      // normalised to 0–1 (clamped at 0 while moving toward a *previous*
      // pillar, since there's nothing to clear up in that direction).
      const localPhase = rawIndex - index;
      const clear = localPhase > 0 ? Math.min(localPhase / 0.5, 1) : 0;
      setClearProgress(clear);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [N]);

  const goTo = (index) => {
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const total = rect.height - window.innerHeight;
    const targetProgress = index / (N - 1);
    const targetScroll = window.scrollY + rect.top + targetProgress * total;
    window.scrollTo({ top: targetScroll, behavior: "smooth" });
  };

  const radius = isDesktop ? RADIUS : RADIUS_MOBILE;
  const dialHeight = isDesktop ? DIAL_HEIGHT : DIAL_HEIGHT_MOBILE;
  const centerY = dialHeight / 2;

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-white"
      style={{ height: `${N * VH_PER_PILLAR}vh` }}
    >
      <div className="sticky top-0 h-screen flex items-center overflow-hidden px-[6%]">
        <div className="max-w-[1180px] mx-auto w-full flex items-center gap-0 max-[860px]:flex-col max-[860px]:items-stretch">
          {/* VERTICAL LABEL */}
          <div className="shrink-0 flex items-center justify-center w-[40px] -mr-[6px] z-10 max-[860px]:hidden">
            <span className="font-ticker font-semibold text-[16px] tracking-[7px] text-[#01383B] whitespace-nowrap [writing-mode:vertical-rl] rotate-180">
              OUR&nbsp;PILLARS
            </span>
          </div>
          <span className="hidden max-[860px]:block font-ticker font-semibold text-[13px] tracking-[4px] text-[#01383B] mb-[18px]">
            OUR&nbsp;PILLARS
          </span>

          {/* DIAL (desktop) */}
          <div
            className="relative shrink-0 w-[230px] max-[860px]:hidden"
            style={{ height: dialHeight }}
          >
            {/* faint guide circle, clipped to a thin sliver */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div
                className="absolute rounded-full border border-[#01383B]/15"
                style={{
                  width: radius * 2,
                  height: radius * 2,
                  left: -radius * 2,
                  top: centerY - radius,
                }}
              />
            </div>

            {PILLARS.map((pillar, index) => {
              // Fixed, non-wrapping offset: index 0 is always "before" index 4.
              // (No modulo shortest-path here — that was what made the last
              // pillar and the first pillar swap places and look like a
              // repeat once you scrolled past the end.)
              const offset = index - active;

              const theta = (offset * ANGLE_STEP * Math.PI) / 180;
              const left = radius * (Math.cos(theta) - 1);
              const top = centerY + radius * Math.sin(theta) - 12;
              const rotate = offset * ROTATE_STEP;
              const dist = Math.abs(offset);
              const isActive = dist === 0;
              const tier =
                dist === 1
                  ? "text-[#5B7A7A] font-medium text-[14px] opacity-70"
                  : dist >= 2
                  ? "text-[#A9BEBE] font-normal text-[12px] opacity-45"
                  : "";

              return (
                <button
                  key={pillar.title}
                  onClick={() => goTo(index)}
                  className={`absolute origin-left flex items-center gap-[10px] whitespace-nowrap transition-[left,top,transform,color,opacity] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isActive
                      ? "text-[#01383B] font-bold text-[19px] opacity-100"
                      : tier
                  }`}
                  style={{ left, top, transform: `rotate(${rotate}deg)` }}
                >
                  <span
                    className={`rounded-full shrink-0 transition-all duration-700 ${
                      isActive
                        ? "w-[9px] h-[9px] bg-[#B69760] shadow-[0_0_10px_rgba(182,151,96,0.7)]"
                        : "w-[5px] h-[5px] bg-[#B7C6C6]"
                    }`}
                  />
                  {pillar.title}
                </button>
              );
            })}
          </div>

          {/* CONTENT — only the current pillar's title + description are
              shown in full. A single low-opacity peek of the *next* pillar
              sits underneath it, exactly like the reference: never a list
              of all 5 titles, and nothing repeats once the last one shows. */}
          <div className="flex-1 flex items-start gap-[60px] pl-[40px] max-[860px]:pl-0 max-[860px]:flex-col">
            <div className="flex-1 min-w-0">
              <div
                className="transition-all duration-200 ease-out"
                style={{
                  opacity: contentVisible ? 1 : 0,
                  transform: contentVisible ? "translateY(0)" : "translateY(10px)",
                }}
              >
                <h3 className="text-[#01383B] text-[32px] font-bold leading-tight mb-[18px] max-[900px]:text-[24px]">
                  {PILLARS[displayIndex].title}
                </h3>
                <p className="max-w-[560px] leading-[1.7] text-[17px] text-[#43605F] max-[900px]:text-[15px]">
                  {PILLARS[displayIndex].description}
                </p>

                {displayIndex < N - 1 && (
                  <button
                    onClick={() => goTo(displayIndex + 1)}
                    className="block w-full text-left mt-[48px] pt-[28px] border-t border-[#E7EDEC] transition-[filter,opacity] duration-150 ease-out"
                    style={{
                      opacity: 0.45 + clearProgress * 0.5,
                      filter: `blur(${(1 - clearProgress) * 5}px)`,
                    }}
                  >
                    <span className="block text-[#B9C6C6] text-[20px] font-medium mb-[8px] max-[900px]:text-[17px]">
                      {PILLARS[displayIndex + 1].title}
                    </span>
                    <span className="block max-w-[560px] leading-[1.6] text-[15px] text-[#B9C6C6] max-[900px]:text-[13px]">
                      {PILLARS[displayIndex + 1].description}
                    </span>
                  </button>
                )}
              </div>
            </div>

            <div className="w-[110px] h-[110px] rounded-[24px] bg-[linear-gradient(180deg,#01484C_0%,#2F6B6B_100%)] flex justify-center items-center shrink-0 shadow-[inset_0_1px_2px_rgba(255,255,255,0.08),0_12px_22px_rgba(0,0,0,0.18),0_0_24px_rgba(230,184,108,0.24)] max-[860px]:mx-auto max-[860px]:mt-[20px]">
              <img
                src={PILLARS[displayIndex].icon}
                alt={PILLARS[displayIndex].title}
                width={50}
                height={50}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
