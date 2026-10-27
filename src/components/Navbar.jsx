import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import {
  FiGlobe,
  FiMenu,
  FiX,
  FiArrowUpRight,
} from "react-icons/fi";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Destinations", path: "/#destinations" },
  { label: "Experiences", path: "/#experiences" },
  { label: "My Trips", path: "/my-trips" },
];

const Navbar = () => {
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const destinationId = location.pathname.startsWith("/destination/")
    ? location.pathname.split("/")[2]
    : null;

  const plannerPath = destinationId
    ? `/plan-trip?destination=${destinationId}`
    : "/plan-trip";

  const isPlanner = location.pathname === "/plan-trip";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.hash, location.search]);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  const solidNavbar = scrolled || menuOpen;

  const handleNavigation = (path) => {
    setMenuOpen(false);

    if (path === "/" && location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    if (
      path.startsWith("/#") &&
      location.pathname === "/"
    ) {
      const sectionId = path.split("#")[1];

      window.setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 50);
    }
  };

  return (
    <>
      <header
        className={`fixed left-0 top-0 z-50 w-full transition-all duration-500 ${
          solidNavbar
            ? "border-b border-[#EAE4D9] bg-[#FAF8F3]/95 shadow-sm backdrop-blur-xl"
            : "bg-transparent"
        }`}
      >
        <nav className="voyage-container flex h-20 items-center justify-between gap-6">

          {/* LOGO */}

          <Link
            to="/"
            onClick={() => handleNavigation("/")}
            className="relative z-50 flex shrink-0 items-center gap-3"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#FF7658] text-[#FF7658]">
              <FiGlobe size={20} />
            </span>

            <span
              className={`text-xl font-bold tracking-[0.15em] transition-colors sm:text-2xl ${
                solidNavbar ? "text-[#102C3C]" : "text-white"
              }`}
            >
              VOYAGE<span className="text-[#FF7658]">.</span>
            </span>
          </Link>

          {/* DESKTOP LINKS */}

          <div className="hidden items-center gap-7 lg:flex">
            {navLinks.map((link) => {
              const isActive =
                link.path === "/"
                  ? location.pathname === "/" && !location.hash
                  : link.path.startsWith("/#")
                    ? location.pathname === "/" &&
                      location.hash === link.path.slice(1)
                    : location.pathname === link.path;

              return (
                <Link
                  key={link.label}
                  to={link.path}
                  onClick={() => handleNavigation(link.path)}
                  className={`relative py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "text-[#FF7658]"
                      : solidNavbar
                        ? "text-[#102C3C] hover:text-[#FF7658]"
                        : "text-white/85 hover:text-white"
                  }`}
                >
                  {link.label}

                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-[#FF7658]"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* PLAN TRIP */}

          <Link
            to={plannerPath}
            className={`hidden items-center gap-2 rounded-full px-6 py-3 text-xs font-bold uppercase tracking-wider transition-all lg:inline-flex ${
              isPlanner
                ? "bg-[#FF7658] text-white"
                : solidNavbar
                  ? "bg-[#102C3C] text-white hover:bg-[#287C91]"
                  : "border border-white/60 bg-white/10 text-white backdrop-blur-md hover:bg-white hover:text-[#102C3C]"
            }`}
          >
            Plan Your Escape
            <FiArrowUpRight size={17} />
          </Link>

          {/* MOBILE BUTTON */}

          <button
            type="button"
            onClick={() => setMenuOpen((previous) => !previous)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            className={`relative z-50 flex h-11 w-11 items-center justify-center rounded-full border lg:hidden ${
              solidNavbar
                ? "border-[#EAE4D9] text-[#102C3C]"
                : "border-white/40 text-white"
            }`}
          >
            {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>

        </nav>
      </header>

      {/* MOBILE MENU */}

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-navigation"
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 flex flex-col bg-[#FAF8F3] px-6 pt-32 lg:hidden"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.07 }}
                >
                  <Link
                    to={link.path}
                    onClick={() => handleNavigation(link.path)}
                    className="block border-b border-[#EAE4D9] py-5 text-2xl font-semibold text-[#102C3C] transition-colors hover:text-[#FF7658]"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <Link
                to={plannerPath}
                onClick={() => setMenuOpen(false)}
                className="mt-8 flex items-center justify-center gap-3 rounded-2xl bg-[#FF7658] px-6 py-4 text-sm font-bold text-white"
              >
                Plan Your Escape
                <FiArrowUpRight size={19} />
              </Link>
            </div>

            <p className="mt-auto pb-10 text-center text-xs tracking-widest text-[#6B777B]">
              THE WORLD, BEAUTIFULLY DISCOVERED.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;