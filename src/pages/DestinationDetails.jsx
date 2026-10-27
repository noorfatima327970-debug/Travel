import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import {
  FiArrowLeft,
  FiCalendar,
  FiClock,
  FiMapPin,
  FiCompass,
  FiPlay,
  FiPause,
} from "react-icons/fi";

import Navbar from "../components/Navbar";
import { destinations } from "../data/destinations";

const travelInfo = {
  dubai: {
    bestTime: "November – March",
    duration: "5–7 Days",
    style: "City & Luxury",
    intro:
      "Explore an exciting city filled with modern architecture, desert adventures and unforgettable experiences.",
    experiences: [
      {
        title: "Burj Khalifa",
        description:
          "Enjoy incredible views of Dubai from one of the world's most famous buildings.",
      },
      {
        title: "Desert Safari",
        description:
          "Discover golden sand dunes and experience the beauty of the Arabian desert.",
      },
      {
        title: "Palm Jumeirah",
        description:
          "Visit Dubai's iconic island and explore its beautiful coastline.",
      },
    ],
  },

  switzerland: {
    bestTime: "June – September",
    duration: "7–10 Days",
    style: "Nature & Adventure",
    intro:
      "Discover beautiful mountains, peaceful lakes and charming villages surrounded by incredible scenery.",
    experiences: [
      {
        title: "Swiss Alps",
        description:
          "Explore breathtaking mountain landscapes and unforgettable alpine views.",
      },
      {
        title: "Lake Lucerne",
        description:
          "Enjoy peaceful lakeside scenery surrounded by beautiful mountains.",
      },
      {
        title: "Scenic Railways",
        description:
          "Travel through Switzerland's spectacular landscapes by train.",
      },
    ],
  },

  japan: {
    bestTime: "March – May",
    duration: "10–14 Days",
    style: "Culture & Discovery",
    intro:
      "Experience a fascinating country where peaceful traditions and exciting modern cities come together.",
    experiences: [
      {
        title: "Kyoto",
        description:
          "Discover traditional temples, beautiful gardens and historic streets.",
      },
      {
        title: "Mount Fuji",
        description:
          "Experience one of Japan's most recognizable natural landmarks.",
      },
      {
        title: "Tokyo",
        description:
          "Explore vibrant neighborhoods, exciting food and modern city life.",
      },
    ],
  },

  iceland: {
    bestTime: "June – August",
    duration: "7–10 Days",
    style: "Nature & Adventure",
    intro:
      "Discover dramatic waterfalls, glaciers and extraordinary landscapes unlike anywhere else.",
    experiences: [
      {
        title: "Waterfalls",
        description:
          "Visit powerful waterfalls surrounded by Iceland's wild scenery.",
      },
      {
        title: "Glaciers",
        description:
          "Discover breathtaking ice formations and incredible frozen landscapes.",
      },
      {
        title: "Northern Lights",
        description:
          "Experience the magical colors of the aurora during suitable seasons.",
      },
    ],
  },

  italy: {
    bestTime: "April – June",
    duration: "7–12 Days",
    style: "Culture & Discovery",
    intro:
      "Enjoy beautiful coastlines, historic cities, delicious food and the timeless charm of Italian culture.",
    experiences: [
      {
        title: "Amalfi Coast",
        description:
          "Discover colorful seaside towns and spectacular Mediterranean views.",
      },
      {
        title: "Rome",
        description:
          "Explore famous landmarks and thousands of years of fascinating history.",
      },
      {
        title: "Venice",
        description:
          "Enjoy charming canals, historic architecture and beautiful streets.",
      },
    ],
  },

  turkey: {
    bestTime: "April – October",
    duration: "7–10 Days",
    style: "Culture & Discovery",
    intro:
      "Explore a wonderful destination filled with rich history, beautiful landscapes and unforgettable culture.",
    experiences: [
      {
        title: "Cappadocia",
        description:
          "Discover unique rock formations and beautiful hot-air balloon views.",
      },
      {
        title: "Istanbul",
        description:
          "Explore fascinating architecture, lively markets and historic neighborhoods.",
      },
      {
        title: "Pamukkale",
        description:
          "Visit spectacular white terraces and beautiful natural surroundings.",
      },
    ],
  },
};

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 25,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const DestinationDetails = () => {
  const { id } = useParams();

  const heroRef = useRef(null);
  const videoRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);

  const destination = destinations.find(
    (item) => item.id === id
  );

  const info = travelInfo[id];

  useEffect(() => {
    setIsPlaying(false);
  }, [id]);

  useGSAP(
    () => {
      if (!destination) return;

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (reducedMotion) return;

      gsap.from(".detail-hero-content", {
        opacity: 0,
        y: 30,
        duration: 0.9,
        ease: "power3.out",
      });
    },
    {
      scope: heroRef,
      dependencies: [id],
    }
  );

  if (!destination || !info) {
    return (
      <>
        <Navbar />

        <main className="flex min-h-screen flex-col items-center justify-center bg-[#FAF8F3] px-6 text-center">
          <h1 className="text-3xl font-bold text-[#102C3C] sm:text-4xl">
            Destination Not Found
          </h1>

          <Link
            to="/#destinations"
            className="mt-8 rounded-full bg-[#102C3C] px-7 py-3 text-sm font-semibold text-white"
          >
            Back to Destinations
          </Link>
        </main>
      </>
    );
  }

  const toggleVideo = async () => {
    const video = videoRef.current;

    if (!video) return;

    if (video.paused) {
      try {
        await video.play();
      } catch {
        setIsPlaying(false);
      }
    } else {
      video.pause();
    }
  };

  return (
    <>
      <Navbar />

      <main className="overflow-hidden bg-[#FAF8F3]">

        {/* HERO */}

        <section
          ref={heroRef}
          className="relative flex min-h-115 items-end overflow-hidden bg-[#071923] pb-12 pt-32 sm:min-h-130 md:min-h-155 md:pb-20"
        >
          <video
            key={destination.id}
            ref={videoRef}
            src={`/videos/${destination.id}.mp4`}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={destination.image}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onError={() => setIsPlaying(false)}
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#04121D]/90 via-[#04121D]/30 to-[#04121D]/40" />

          <div className="voyage-container relative z-10">

            <div className="detail-hero-content max-w-4xl">

              <Link
                to="/#destinations"
                className="mb-7 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-white/85 transition-colors hover:text-[#FFB39F] sm:text-xs"
              >
                <FiArrowLeft size={15} />
                All Destinations
              </Link>

              <div className="mb-3 flex items-center gap-2 text-xs text-[#FFB39F] sm:text-sm">
                <FiMapPin size={15} />
                {destination.country}
              </div>

              <h1 className="wrap-break-word text-5xl leading-tight font-bold tracking-tight text-white min-[380px]:text-6xl sm:text-7xl md:text-8xl">
                {destination.name}
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-7 text-white/85 sm:text-base md:text-lg">
                {destination.tagline}
              </p>

              {/* VIDEO CONTROL */}

              <button
                type="button"
                onClick={toggleVideo}
                aria-label={isPlaying ? "Pause video" : "Play video"}
                className="mt-6 flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20 sm:h-12 sm:w-12"
              >
                {isPlaying ? <FiPause size={17} /> : <FiPlay size={17} />}
              </button>

            </div>
          </div>
        </section>

        {/* ABOUT */}

        <section
          id="discover"
          className="scroll-mt-20 py-14 sm:py-20 md:py-24"
        >
          <div className="voyage-container">

            <div className="grid items-center gap-9 lg:grid-cols-2 lg:gap-16">

              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
              >
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#FF7658]">
                  Discover {destination.name}
                </span>

                <h2 className="mt-4 text-3xl leading-tight font-bold tracking-tight text-[#102C3C] sm:text-4xl md:text-5xl">
                  Your Next
                  <br />

                  <span className="font-display font-normal italic text-[#287C91]">
                    Adventure Awaits.
                  </span>
                </h2>

                <p className="mt-5 max-w-lg text-sm leading-7 text-[#6B777B] sm:text-base sm:leading-8">
                  {info.intro}
                </p>

                <p className="mt-3 max-w-lg text-sm leading-7 text-[#6B777B]">
                  {destination.description}
                </p>
              </motion.div>

              {/* ROUNDED PICTURE */}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.6 }}
                className="mx-auto w-full max-w-sm md:max-w-md"
              >
                <div className="overflow-hidden rounded-3xl shadow-lg">
                  <img
                    src={destination.image}
                    alt={`Beautiful view of ${destination.name}`}
                    loading="lazy"
                    decoding="async"
                    className="aspect-5/4 w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* TRAVEL INFORMATION */}

        <section className="bg-white py-14 sm:py-16 md:py-20">
          <div className="voyage-container">

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mb-8 text-center"
            >
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#FF7658]">
                Helpful Information
              </span>

              <h2 className="mt-3 text-2xl font-bold text-[#102C3C] sm:text-3xl md:text-4xl">
                Plan Your Visit
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">

              {[
                {
                  icon: FiCalendar,
                  title: "Best Time to Visit",
                  value: info.bestTime,
                },
                {
                  icon: FiClock,
                  title: "Suggested Duration",
                  value: info.duration,
                },
                {
                  icon: FiCompass,
                  title: "Travel Style",
                  value: info.style,
                },
              ].map((item, index) => {
                const Icon = item.icon;

                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.08,
                    }}
                    className="flex items-center gap-4 rounded-2xl border border-[#EAE4D9] bg-[#FAF8F3] p-5 sm:flex-col sm:gap-3 sm:rounded-3xl sm:px-4 sm:py-7 sm:text-center"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#287C91]">
                      <Icon size={20} />
                    </div>

                    <div>
                      <p className="text-xs text-[#6B777B]">
                        {item.title}
                      </p>

                      <h3 className="mt-1 text-sm font-bold text-[#102C3C] sm:text-base">
                        {item.value}
                      </h3>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <p className="mt-6 text-center text-xs leading-5 text-[#6B777B]">
              Travel information is for inspiration only.
            </p>

          </div>
        </section>

        {/* TOP EXPERIENCES */}

        <section className="py-14 sm:py-20 md:py-24">
          <div className="voyage-container">

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mb-9 text-center"
            >
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#FF7658]">
                Things To Do
              </span>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#102C3C] sm:text-4xl">
                Top Experiences
              </h2>

              <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-[#6B777B]">
                Three memorable experiences to discover during your visit.
              </p>
            </motion.div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

              {info.experiences.map((experience, index) => (
                <motion.article
                  key={experience.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.08,
                  }}
                  className="rounded-2xl border border-[#EAE4D9] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:rounded-3xl"
                >
                  <span className="text-xs font-bold text-[#FF7658]">
                    0{index + 1}
                  </span>

                  <h3 className="mt-4 text-lg font-bold text-[#102C3C]">
                    {experience.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-[#6B777B]">
                    {experience.description}
                  </p>
                </motion.article>
              ))}

            </div>
          </div>
        </section>

      </main>
    </>
  );
};

export default DestinationDetails;