import React, { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import {
  FiSearch,
  FiArrowUpRight,
  FiMapPin,
  FiX,
} from "react-icons/fi";

import {
  destinations,
  categories,
} from "../data/destinations";

gsap.registerPlugin(ScrollTrigger);

const DestinationExplorer = () => {
  const sectionRef = useRef(null);

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(
    "All Destinations"
  );

  const filteredDestinations = useMemo(() => {
    return destinations.filter((destination) => {
      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        destination.name.toLowerCase().includes(searchText) ||
        destination.country.toLowerCase().includes(searchText) ||
        destination.region.toLowerCase().includes(searchText);

      const matchesCategory =
        activeCategory === "All Destinations" ||
        destination.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  useGSAP(
    () => {
      gsap.from(".destination-heading", {
        y: 35,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".destination-heading",
          start: "top 85%",
          once: true,
        },
      });

      gsap.from(".destination-controls", {
        y: 20,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".destination-controls",
          start: "top 90%",
          once: true,
        },
      });
    },
    { scope: sectionRef }
  );

  const resetFilters = () => {
    setSearch("");
    setActiveCategory("All Destinations");
  };

  return (
    <section
      ref={sectionRef}
      id="destinations"
      className="scroll-mt-20 bg-[#FAF8F3] py-16 md:py-24"
    >
      <div className="voyage-container">

        {/* HEADING */}

        <div className="destination-heading mx-auto mb-10 max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#FF7658]">
            Explore The World
          </span>

          <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#102C3C] sm:text-4xl md:text-5xl">
            Where Would You{" "}
            <span className="font-display font-normal italic text-[#287C91]">
              Like to Go?
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-[#6B777B] md:text-base">
            Discover beautiful places around the world.
            Choose a destination and start exploring.
          </p>
        </div>

        {/* SEARCH */}

        <div className="destination-controls mb-10">
          <div className="mx-auto mb-6 max-w-md">
            <div className="flex items-center gap-3 rounded-2xl border border-[#EAE4D9] bg-white px-4 py-3.5 shadow-sm focus-within:border-[#287C91]">
              <FiSearch
                size={19}
                className="shrink-0 text-[#287C91]"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search destinations..."
                aria-label="Search destinations"
                className="w-full bg-transparent text-sm text-[#102C3C] outline-none placeholder:text-[#9CA5A8]"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                  className="text-[#6B777B] hover:text-[#FF7658]"
                >
                  <FiX size={18} />
                </button>
              )}
            </div>
          </div>

          {/* FILTERS */}

          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                aria-pressed={activeCategory === category}
                className={`rounded-full border px-3 py-2 text-xs font-semibold transition-colors sm:px-5 sm:text-sm ${
                  activeCategory === category
                    ? "border-[#102C3C] bg-[#102C3C] text-white"
                    : "border-[#EAE4D9] bg-white text-[#6B777B] hover:border-[#287C91]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* RESULTS */}

        <div className="mb-6 flex items-center justify-between border-b border-[#EAE4D9] pb-4">
          <p className="text-xs text-[#6B777B] sm:text-sm">
            Showing{" "}
            <span className="font-bold text-[#102C3C]">
              {filteredDestinations.length}
            </span>{" "}
            destinations
          </p>

          {(search || activeCategory !== "All Destinations") && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs font-bold text-[#FF7658]"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* CARDS */}

        <motion.div
          layout
          className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filteredDestinations.map((destination, index) => (
              <motion.article
                layout
                key={destination.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.95,
                }}
                viewport={{
                  once: true,
                  amount: 0.1,
                }}
                transition={{
                  duration: 0.5,
                  delay: Math.min(index * 0.06, 0.25),
                }}
                className="group min-w-0 overflow-hidden rounded-2xl border border-[#EAE4D9] bg-white p-2 shadow-sm transition-shadow duration-300 hover:shadow-lg sm:rounded-3xl sm:p-4"
              >
                {/* IMAGE */}

                <Link
                  to={`/destination/${destination.id}`}
                  aria-label={`Explore ${destination.name}`}
                  className="relative block aspect-4/3 overflow-hidden rounded-xl bg-[#EAE4D9] sm:rounded-2xl"
                >
                  <img
                    src={destination.image}
                    alt={destination.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#071923]/30 to-transparent" />

                  {/* ARROW */}

                  <span className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#102C3C] shadow-sm transition-colors group-hover:bg-[#FF7658] group-hover:text-white sm:h-10 sm:w-10">
                    <FiArrowUpRight size={17} />
                  </span>
                </Link>

                {/* CONTENT */}

                <div className="px-1 pb-2 pt-3 sm:px-2 sm:pt-5">

                  <div className="flex items-center gap-1 text-[#287C91]">
                    <FiMapPin size={12} className="shrink-0" />

                    <span className="truncate text-[10px] font-medium sm:text-xs">
                      {destination.country}
                    </span>
                  </div>

                  <h3 className="mt-1.5 truncate text-base font-bold tracking-tight text-[#102C3C] sm:text-2xl">
                    {destination.name}
                  </h3>

                  {/* DESCRIPTION HIDDEN ON SMALL MOBILE */}

                  <p className="mt-2 hidden min-h-12 text-sm leading-6 text-[#6B777B] sm:line-clamp-2">
                    {destination.description}
                  </p>

                  {/* HIGHLIGHTS HIDDEN ON MOBILE */}

                  <div className="mt-4 hidden flex-wrap gap-2 sm:flex">
                    {destination.highlights
                      .slice(0, 2)
                      .map((highlight) => (
                        <span
                          key={highlight}
                          className="rounded-full bg-[#F4F3EF] px-3 py-1.5 text-[10px] font-medium text-[#6B777B]"
                        >
                          {highlight}
                        </span>
                      ))}
                  </div>

                  {/* BUTTON */}

                  <Link
                    to={`/destination/${destination.id}`}
                    className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#102C3C] px-2 py-2.5 text-[10px] font-semibold text-white transition-colors hover:bg-[#287C91] sm:mt-6 sm:gap-2 sm:rounded-xl sm:px-5 sm:py-3.5 sm:text-sm"
                  >
                    <span className="sm:hidden">Explore</span>
                    <span className="hidden sm:inline">
                      Explore Destination
                    </span>

                    <FiArrowUpRight size={15} />
                  </Link>

                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* EMPTY STATE */}

        {filteredDestinations.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-[#EAE4D9] bg-white px-6 py-14 text-center"
          >
            <FiSearch
              size={26}
              className="mx-auto text-[#287C91]"
            />

            <h3 className="mt-5 text-xl font-bold text-[#102C3C]">
              No destinations found
            </h3>

            <p className="mt-3 text-sm text-[#6B777B]">
              Try searching for another destination.
            </p>

            <button
              type="button"
              onClick={resetFilters}
              className="mt-6 rounded-full bg-[#FF7658] px-7 py-3 text-sm font-bold text-white"
            >
              Show All Destinations
            </button>
          </motion.div>
        )}

      </div>
    </section>
  );
};

export default DestinationExplorer;