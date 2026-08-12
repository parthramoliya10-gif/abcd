const brands = [
  {
    name: "CLARICUTS",
    backgroundImage: "/images/brands/claricuts-bg.webp",
    logoImage: "/images/brands/claricuts-logo.webp",
  },
  {
    name: "Luxifine",
    backgroundImage: "/images/brands/luxifine-bg.webp",
    logoImage: "/images/brands/luxifine-logo.webp",
  },
  {
    name: "Netram Jewels",
    backgroundImage: "/images/brands/netram-bg.webp",
    logoImage: "/images/brands/netram-logo.webp",
  },
];

export default function OurBrands() {
  return (
    <section className="w-full pt-0 pb-[8px] mt-[10px] bg-white overflow-hidden">
      <h1 className="text-center text-[4rem] leading-none font-light mb-[4rem] font-ticker bg-gradient-to-b from-[#01383B] to-[#286F6F] bg-clip-text text-transparent [-webkit-text-fill-color:transparent] min-[768px]:max-[1024px]:text-[3.8rem] min-[768px]:max-[1024px]:mb-[50px] max-[767px]:text-[3rem] max-[767px]:mb-[40px]">
        Our <span className="font-semibold font-ticker">Brands</span>
      </h1>

      {/* Outer teal frame: ONE rounded container. Its padding acts as the
          "border" around the whole group, and the rounding here is the only
          rounding on the outside of the group. */}
      <div
        className="
          w-[90vw] max-w-[1750px] mx-auto
          bg-[#2F6B6B] rounded-[40px] p-[25px]
          flex flex-col gap-[25px]
          min-[768px]:max-[1024px]:rounded-[30px] min-[768px]:max-[1024px]:p-[18px] min-[768px]:max-[1024px]:gap-[18px]
          max-[767px]:rounded-[26px] max-[767px]:p-[18px] max-[767px]:gap-[18px]
          max-[480px]:rounded-[20px] max-[480px]:p-[14px] max-[480px]:gap-[14px]
        "
      >
        {brands.map((brand) => {
          return (
            <div
              key={brand.name}
              className={`
                relative flex items-center justify-center overflow-hidden
                shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)]
                w-full
                h-[850px] min-[768px]:max-[1024px]:h-[560px] max-[767px]:h-[380px] max-[480px]:h-[340px]
                rounded-[24px]
                min-[768px]:max-[1024px]:rounded-[18px] max-[767px]:rounded-[16px] max-[480px]:rounded-[12px]
              `}
            >
              {/* Background image — has to stay inline since the URL is
                  different per brand; Tailwind can't generate a class for
                  a value only known at runtime. */}
              <div
                className="absolute inset-0 [background-attachment:fixed] bg-center bg-cover"
                style={{ backgroundImage: `url(${brand.backgroundImage})` }}
              />

              <div className="absolute inset-0 bg-black/10" />

              <div
                className="
                  relative w-[60%] max-w-[600px] p-[16px] rounded-[20px]
                  [aspect-ratio:382/246]
                  shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]
                  bg-[linear-gradient(135deg,#e8caa0_0%,#c9a15a_45%,#a97c35_100%)]
                  min-[768px]:max-[1024px]:w-[66%] min-[768px]:max-[1024px]:max-w-[460px] min-[768px]:max-[1024px]:p-[12px] min-[768px]:max-[1024px]:rounded-[18px]
                  max-[767px]:w-[70%] max-[767px]:max-w-[250px] max-[767px]:p-[10px]
                  max-[480px]:w-[82%] max-[480px]:max-w-[260px] max-[480px]:p-[6px]
                "
              >
                <div className="flex items-center gap-[0.5rem] w-full pb-[12px] min-[768px]:max-[1024px]:pb-[10px]">
                  <span className="flex-1 [border-top:1px_dotted_rgba(0,0,0,0.5)]" />
                  <p className="text-[11px] tracking-[0.3em] uppercase text-[#111827] whitespace-nowrap min-[768px]:max-[1024px]:text-[10px] min-[768px]:max-[1024px]:tracking-[0.22em] max-[767px]:text-[9px] max-[767px]:tracking-[0.18em] max-[480px]:text-[8px] max-[480px]:tracking-[0.15em]">
                    {brand.name}
                  </p>
                  <span className="flex-1 [border-top:1px_dotted_rgba(0,0,0,0.5)]" />
                </div>

                <div className="relative bg-white flex items-center justify-center shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.05)] w-full h-[calc(100%-32px)] rounded-[14px] max-[767px]:rounded-[12px]">
                  <div className="relative w-[550px] h-[320px] min-[768px]:max-[1024px]:w-[300px] min-[768px]:max-[1024px]:h-[150px] max-[767px]:w-[190px] max-[767px]:h-[85px] max-[480px]:w-[160px] max-[480px]:h-[70px]">
                    <img
                      src={brand.logoImage}
                      alt={brand.name}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
