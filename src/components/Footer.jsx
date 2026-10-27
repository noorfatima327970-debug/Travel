import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FiArrowUpRight, FiGlobe } from "react-icons/fi";

gsap.registerPlugin(ScrollTrigger);

const footerLinks = [
  { label: "Home", path: "/" },
  { label: "Destinations", path: "/#destinations" },
  { label: "Experiences", path: "/#experiences" },
  { label: "Plan Your Trip", path: "/plan-trip" },
];

const Footer = () => {
  const footerRef = useRef(null);

  useGSAP(
    () => {
      gsap.from(".footer-content", {
        opacity: 0,
        y: 25,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 90%",
          once: true,
        },
      });
    },
    { scope: footerRef }
  );

  return (
    <footer
      ref={footerRef}
      className="bg-[#071923] text-white"
    >
      <div className="voyage-container">

        <div className="footer-content flex flex-col gap-10 border-b border-white/10 py-14 md:flex-row md:items-start md:justify-between md:py-16">

          {/* BRAND */}

          <div className="max-w-sm">
            <Link
              to="/"
              className="inline-flex items-center gap-3"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#FF7658] text-[#FF7658]">
                <FiGlobe size={20} />
              </span>

              <span className="text-2xl font-bold tracking-widest">
                VOYAGE<span className="text-[#FF7658]">.</span>
              </span>
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-7 text-white/55">
              The world, beautifully discovered.
              Find inspiration for your next unforgettable journey.
            </p>
          </div>

          {/* NAVIGATION */}

          <div>
            <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-[#FFB39F]">
              Explore
            </h3>

            <nav
              aria-label="Footer navigation"
              className="grid grid-cols-2 gap-x-10 gap-y-4 sm:gap-x-16"
            >
              {footerLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.path}
                  className="text-sm text-white/65 transition-colors duration-300 hover:text-[#FF7658]"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* CTA */}

          <div>
            <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-[#FFB39F]">
              Your Next Journey
            </h3>

            <Link
              to="/plan-trip"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:border-[#FF7658] hover:bg-[#FF7658]"
            >
              Plan Your Trip
              <FiArrowUpRight size={17} />
            </Link>
          </div>

        </div>

        {/* COPYRIGHT */}

        <div className="flex flex-col items-center justify-between gap-3 py-6 text-center sm:flex-row sm:text-left">

          <p className="text-xs text-white/45">
            © {new Date().getFullYear()} VOYAGE. All rights reserved.
          </p>

          <p className="text-xs text-white/45">
            Made for explorers, dreamers & travelers.
          </p>

        </div>

      </div>
    </footer>
  );
};

export default Footer;