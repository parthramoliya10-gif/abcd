import { gsap } from "../../gsap/register";
import useGSAP from "../../hooks/useGSAP";
import { useEffect, useRef, useState } from "react";
import request from "../../services/api";

// const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:5000";
// const API_BASE = import.meta.env.VITE_API_URL ?? "https://promise-jewels-rjw4.onrender.com";
// Swap these for your real profile URLs.
const DEFAULT_SOCIAL_LINKS = {
  instagram: "https://instagram.com/",
  facebook: "https://facebook.com/",
  linkedin: "https://linkedin.com/",
};

// Matches the site's main navbar — keep these hrefs in sync with it.
const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Our Team", href: "/our-team" },
  { label: "Our Brand", href: "/our-brand" },
  { label: "Our Collection", href: "/our-collection" },
  { label: "Our Exhibition", href: "/our-exhibition" },
  { label: "Contact Us", href: "/contact" },
];

const DEFAULT_LOGO_URL = "/images/PROMISE_LOGO.webp";

const DEFAULT_CONTACT = {
  phone: "+91 95861 82900",
  email: "thepromisejewels@gmail.com",
  address:
    "Promise Jewels Pvt. Ltd. Laxmi Niwas, Sy No-31/5, Plot No-101, 1st Floor, Near Kiran Hospital, Vasta Devadi Road, Katargam.",
};

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="12" r="9" />
      <path d="M13.5 21v-6.5h2.2l.3-2.6h-2.5V10.2c0-.75.2-1.26 1.28-1.26h1.37V6.6c-.24-.03-1.05-.1-2-.1-1.98 0-3.33 1.2-3.33 3.42v1.98H8.5v2.6h2.27V21" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <line x1="7.5" y1="10" x2="7.5" y2="17" />
      <circle cx="7.5" cy="7" r="0.5" fill="currentColor" />
      <path d="M11.5 17v-4.2c0-1.5 1-2.3 2.2-2.3 1.2 0 2 .8 2 2.3V17" />
      <line x1="11.5" y1="10" x2="11.5" y2="17" />
    </svg>
  );
}

function ArrowUpIcon(props) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      {...props}
    >
      <path d="M12 19V5M12 5L6 11M12 5l6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Footer() {
  const [contact, setContact] = useState(DEFAULT_CONTACT);
  const [social, setSocial] = useState(DEFAULT_SOCIAL_LINKS);
  const [logoUrl, setLogoUrl] = useState(DEFAULT_LOGO_URL);

  const tickerRef = useRef(null);

  useEffect(() => {
request("/settings/public")
  .then((data) => {
        if (!data) return;
        setLogoUrl(data.logoUrl || DEFAULT_LOGO_URL);

        setContact({
          phone: data.phone || DEFAULT_CONTACT.phone,
          email: data.email || DEFAULT_CONTACT.email,
          address: data.address || DEFAULT_CONTACT.address,
        });
        setSocial({
          instagram: data.instagramUrl || DEFAULT_SOCIAL_LINKS.instagram,
          facebook: data.facebookUrl || DEFAULT_SOCIAL_LINKS.facebook,
          linkedin: data.linkedinUrl || DEFAULT_SOCIAL_LINKS.linkedin,
        });
      })
      .catch(() => {
        // Fetch failed — fallback default values stay on screen, no crash.
      });
  }, []);

  // Infinite scrolling ticker — same GSAP pattern as Herocircle.jsx's
  // ticker, so the whole codebase uses one consistent approach for
  // repeating scroll animations instead of mixing in a raw CSS keyframe.
  useGSAP(
    () => {
      if (tickerRef.current) {
        gsap.to(tickerRef.current, {
          xPercent: -50,
          duration: 36,
          ease: "none",
          repeat: -1,
        });
      }
    },
    tickerRef,
    []
  );

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full bg-white pt-[64px] px-[1.7rem] pb-0 flex flex-col items-center text-center min-[768px]:max-[1024px]:pt-[48px] min-[768px]:max-[1024px]:px-[1.5rem] max-[430px]:pt-[40px] max-[430px]:px-[1.2rem]">
      {/* Logo */}
      <div className="flex flex-col items-center gap-[4px]">
        <img
          src={logoUrl}
          alt="Promise Jewels logo"
          width={210}
          height={210}
          className="min-[768px]:max-[1024px]:w-[150px] min-[768px]:max-[1024px]:h-[150px] max-[430px]:w-[110px] max-[430px]:h-[110px]"
        />
      </div>

      <p className="mt-[20px] text-[1rem] font-semibold tracking-[0.2em] uppercase text-[#0B5B5D] min-[768px]:max-[1024px]:text-[0.8rem] min-[768px]:max-[1024px]:mt-[16px] max-[430px]:text-[0.65rem] max-[430px]:mt-[14px] max-[430px]:tracking-[0.15em]">
        JEWELLERY MANUFACTURER &amp; WHOLESALE
      </p>

      {/* Social links */}
      <div className="flex gap-[25px] mt-[25px] min-[768px]:max-[1024px]:gap-[18px] min-[768px]:max-[1024px]:mt-[20px] max-[430px]:gap-[14px] max-[430px]:mt-[16px]">
        <a
          href={social.instagram}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="flex items-center justify-center w-[38px] h-[38px] border border-[#0B5B5D] rounded-full text-[#0B5B5D] no-underline min-[768px]:max-[1024px]:w-[34px] min-[768px]:max-[1024px]:h-[34px] max-[430px]:w-[30px] max-[430px]:h-[30px]"
        >
          <InstagramIcon />
        </a>
        <a
          href={social.facebook}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
          className="flex items-center justify-center w-[38px] h-[38px] border border-[#0B5B5D] rounded-full text-[#0B5B5D] no-underline min-[768px]:max-[1024px]:w-[34px] min-[768px]:max-[1024px]:h-[34px] max-[430px]:w-[30px] max-[430px]:h-[30px]"
        >
          <FacebookIcon />
        </a>
        <a
          href={social.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className="flex items-center justify-center w-[38px] h-[38px] border border-[#0B5B5D] rounded-full text-[#0B5B5D] no-underline min-[768px]:max-[1024px]:w-[34px] min-[768px]:max-[1024px]:h-[34px] max-[430px]:w-[30px] max-[430px]:h-[30px]"
        >
          <LinkedInIcon />
        </a>
      </div>

      {/* Nav links */}
      <nav className="flex flex-nowrap justify-center gap-[190px] mt-[55px] min-[768px]:max-[1024px]:gap-[30px] min-[768px]:max-[1024px]:mt-[40px] max-[430px]:flex-row max-[430px]:gap-x-[58px] max-[430px]:gap-y-[14px] max-[430px]:mt-[28px]">
        {NAV_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="whitespace-nowrap text-[1.3rem] text-[#1a1a1a] no-underline hover:text-[#0B5B5D] min-[768px]:max-[1024px]:text-[1rem] max-[430px]:text-[0.9rem] max-[430px]:flex-none"
          >
            {link.label}
          </a>
        ))}
      </nav>

      <div className="w-full max-w-[1800px] h-[2px] bg-[#080808] mt-[40px] max-[430px]:mt-[28px]" />

      {/* Back to top */}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Back to top"
        className="mt-[28px] w-[75px] h-[75px] rounded-[100px] border-2 border-dashed border-[#0B5B5D] bg-transparent text-[#0B5B5D] flex items-center justify-center cursor-pointer min-[768px]:max-[1024px]:w-[60px] min-[768px]:max-[1024px]:h-[60px] min-[768px]:max-[1024px]:mt-[24px] max-[430px]:w-[50px] max-[430px]:h-[50px] max-[430px]:mt-[20px]"
      >
        <ArrowUpIcon className="w-8 h-8 text-[#0B6A72]" />
      </button>

      {/* Contact info */}
      {/* Contact info */}
<div className="w-full max-w-[1800px] flex justify-between gap-[100px] mt-[24px] text-left min-[768px]:max-[1024px]:flex-col min-[768px]:max-[1024px]:gap-[20px] min-[768px]:max-[1024px]:mt-[20px] max-[430px]:flex-col max-[430px]:gap-[16px] max-[430px]:mt-[20px]">
  <div>
    <p className="mt-0 mb-[6px] flex items-center text-[1.2rem] leading-[1.5] text-[#1a1a1a] min-[768px]:max-[1024px]:text-[1rem] max-[430px]:text-[0.8rem] max-[430px]:leading-[1.4]">
      <img src="/Icons/hugeicons--telephone.svg" alt="" className="mr-[10px] w-[1em] h-[1em]" />
      {contact.phone}
    </p>
    <p className="mt-0 mb-[6px] flex items-center text-[1.2rem] leading-[1.5] text-[#1a1a1a] min-[768px]:max-[1024px]:text-[1rem] max-[430px]:text-[0.8rem] max-[430px]:leading-[1.4]">
      <img src="/Icons/ic--outline-email.svg" alt="" className="mr-[10px] w-[1em] h-[1em]" />
      {contact.email}
    </p>
  </div>
  <div className="w-[420px] text-left ml-auto min-[768px]:max-[1024px]:w-full min-[768px]:max-[1024px]:ml-0 max-[430px]:w-full max-[430px]:ml-0">
    <p className="mt-0 mb-[6px] flex items-center text-[1.2rem] leading-[1.5] text-[#1a1a1a] min-[768px]:max-[1024px]:text-[1rem] max-[430px]:text-[0.8rem] max-[430px]:leading-[1.4]">
      <img src="/Icons/boxicons--location.svg" alt="" className="mr-[10px] w-[1em] h-[1em] shrink-0" />
      {contact.address}
    </p>
  </div>
</div>
    

      {/* Scrolling ticker */}
{/* Scrolling ticker */}
<div className="w-[calc(100%+3.4rem)] -mx-[1.7rem] h-[230px] overflow-hidden whitespace-nowrap mt-[32px] flex items-start min-[768px]:max-[1024px]:w-[calc(100%+3rem)] min-[768px]:max-[1024px]:-mx-[1.5rem] min-[768px]:max-[1024px]:h-[100px] min-[768px]:max-[1024px]:mt-[24px] max-[430px]:w-[calc(100%+2.4rem)] max-[430px]:-mx-[1.2rem] max-[430px]:h-[50px] max-[430px]:mt-[20px]">
  <div ref={tickerRef} className="inline-flex w-max will-change-transform leading-none">
          {[...Array(2)].map((_, i) => (
            <div className="flex items-center" key={i} aria-hidden={i === 1}>
              <span className="font-ticker text-[18rem] mr-[60px] bg-clip-text text-transparent [-webkit-text-fill-color:transparent] bg-gradient-to-b from-[#01383B] to-[#286F6F] min-[768px]:max-[1024px]:text-[6rem] min-[768px]:max-[1024px]:mr-[40px] max-[430px]:text-[2.8rem] max-[430px]:mr-[24px]">
                Promise
              </span>
              <span className="font-ticker text-[18rem] mr-[60px] bg-clip-text text-transparent [-webkit-text-fill-color:transparent] bg-[linear-gradient(180deg,#00373F_0%,#13464e_30%,#5cc8d4_60%,#21C5D8_100%)] min-[768px]:max-[1024px]:text-[6rem] min-[768px]:max-[1024px]:mr-[40px] max-[430px]:text-[2.8rem] max-[430px]:mr-[24px]">
                ✦
              </span>

              <span className="font-ticker text-[18rem] mr-[60px] bg-clip-text text-transparent [-webkit-text-fill-color:transparent] bg-gradient-to-b from-[#01383B] to-[#286F6F] min-[768px]:max-[1024px]:text-[6rem] min-[768px]:max-[1024px]:mr-[40px] max-[430px]:text-[2.8rem] max-[430px]:mr-[24px]">
                Jewels
              </span>
              <span className="font-ticker text-[18rem] mr-[60px] bg-clip-text text-transparent [-webkit-text-fill-color:transparent] bg-[linear-gradient(180deg,#00373F_0%,#13464e_30%,#5cc8d4_60%,#21C5D8_100%)] min-[768px]:max-[1024px]:text-[6rem] min-[768px]:max-[1024px]:mr-[40px] max-[430px]:text-[2.8rem] max-[430px]:mr-[24px]">
                ✦
              </span>

              <span className="font-ticker text-[18rem] mr-[60px] bg-clip-text text-transparent [-webkit-text-fill-color:transparent] bg-gradient-to-b from-[#01383B] to-[#286F6F] min-[768px]:max-[1024px]:text-[6rem] min-[768px]:max-[1024px]:mr-[40px] max-[430px]:text-[2.8rem] max-[430px]:mr-[24px]">
                Promise
              </span>
              <span className="font-ticker text-[18rem] mr-[60px] bg-clip-text text-transparent [-webkit-text-fill-color:transparent] bg-[linear-gradient(180deg,#00373F_0%,#13464e_30%,#5cc8d4_60%,#21C5D8_100%)] min-[768px]:max-[1024px]:text-[6rem] min-[768px]:max-[1024px]:mr-[40px] max-[430px]:text-[2.8rem] max-[430px]:mr-[24px]">
                ✦
              </span>

              <span className="font-ticker text-[18rem] mr-[60px] bg-clip-text text-transparent [-webkit-text-fill-color:transparent] bg-gradient-to-b from-[#01383B] to-[#286F6F] min-[768px]:max-[1024px]:text-[6rem] min-[768px]:max-[1024px]:mr-[40px] max-[430px]:text-[2.8rem] max-[430px]:mr-[24px]">
                Jewels
              </span>
              <span className="font-ticker text-[18rem] mr-[60px] bg-clip-text text-transparent [-webkit-text-fill-color:transparent] bg-[linear-gradient(180deg,#00373F_0%,#13464e_30%,#5cc8d4_60%,#21C5D8_100%)] min-[768px]:max-[1024px]:text-[6rem] min-[768px]:max-[1024px]:mr-[40px] max-[430px]:text-[2.8rem] max-[430px]:mr-[24px]">
                ✦
              </span>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
