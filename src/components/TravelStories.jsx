import React, { useRef } from "react";
import { motion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TravelStories = () => {
  const sectionRef = useRef(null);

  useGSAP(
    () => {
      gsap.from(".story-content", {
        opacity: 0,
        y: 35,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="experiences"
      className="scroll-mt-20 bg-[#102C3C] px-6 py-20 text-center md:py-24"
    >
      <div className="story-content mx-auto max-w-3xl">

        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#FFB39F]">
          The Voyage Experience
        </span>

        <h2 className="mt-5 text-3xl font-bold tracking-tight text-white md:text-4xl">
          Every Journey Tells a Story.
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-sm leading-8 text-white/70 md:text-base">
          Travel is more than visiting new places.
          It's about discovering different cultures,
          experiencing unforgettable moments and
          seeing the world from a new perspective.
          At VOYAGE, we believe every journey should
          inspire a story worth remembering.
        </p>

        <div className="mx-auto mt-8 h-0.5 w-12 rounded-full bg-[#FF7658]" />

      </div>
    </section>
  );
};

export default TravelStories;