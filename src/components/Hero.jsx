import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FiArrowUpRight, FiArrowDown } from "react-icons/fi";

import { destinations } from "../data/destinations";

const slides = destinations.flatMap((destination) => [
  {
    ...destination,
    video: `/videos/${destination.id}.mp4`,
  },
  {
    ...destination,
    video: `/videos/${destination.id}1.mp4`,
  },
]);

const SLIDE_DURATION = 7000;
const FADE_DURATION = 1000;

const Hero = () => {
  const videoRefs = useRef([null, null]);
  const activeIndexRef = useRef(0);
  const activeLayerRef = useRef(0);
  const pendingRef = useRef(null);
  const transitionTimerRef = useRef(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [activeLayer, setActiveLayer] = useState(0);
  const [layers, setLayers] = useState([0, null]);

  const [failedVideos, setFailedVideos] = useState({});

  const currentSlide = slides[activeIndex];

  const completeTransition = useCallback(
    (layerIndex, slideIndex) => {
      if (pendingRef.current !== slideIndex) return;

      pendingRef.current = null;

      const previousLayer = activeLayerRef.current;

      activeLayerRef.current = layerIndex;
      activeIndexRef.current = slideIndex;

      setActiveLayer(layerIndex);
      setActiveIndex(slideIndex);

      window.clearTimeout(transitionTimerRef.current);

      transitionTimerRef.current = window.setTimeout(() => {
        videoRefs.current[previousLayer]?.pause();
      }, FADE_DURATION + 100);
    },
    []
  );

  const activateSlide = useCallback(
    (layerIndex, slideIndex) => {
      if (pendingRef.current !== slideIndex) return;

      const video = videoRefs.current[layerIndex];

      if (!video || failedVideos[slideIndex]) {
        completeTransition(layerIndex, slideIndex);
        return;
      }

      video
        .play()
        .then(() => {
          completeTransition(layerIndex, slideIndex);
        })
        .catch(() => {
          completeTransition(layerIndex, slideIndex);
        });
    },
    [completeTransition, failedVideos]
  );

  const changeSlide = useCallback((index) => {
    const nextIndex =
      ((index % slides.length) + slides.length) % slides.length;

    if (
      nextIndex === activeIndexRef.current ||
      pendingRef.current !== null
    ) {
      return;
    }

    const nextLayer = 1 - activeLayerRef.current;

    pendingRef.current = nextIndex;

    setLayers((previous) => {
      const updated = [...previous];
      updated[nextLayer] = nextIndex;
      return updated;
    });
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      changeSlide(activeIndexRef.current + 1);
    }, SLIDE_DURATION);

    return () => {
      window.clearInterval(timer);
    };
  }, [changeSlide]);

  useEffect(() => {
    const firstVideo = videoRefs.current[0];

    if (firstVideo) {
      firstVideo.play().catch(() => {});
    }

    return () => {
      window.clearTimeout(transitionTimerRef.current);
    };
  }, []);

  const handleVideoError = (slideIndex, layerIndex) => {
    setFailedVideos((previous) => ({
      ...previous,
      [slideIndex]: true,
    }));

    if (pendingRef.current === slideIndex) {
      completeTransition(layerIndex, slideIndex);
    }
  };

  const activeDestinationIndex = Math.floor(activeIndex / 2);

  return (
    <section className="relative flex min-h-140 h-svh max-h-250 items-center justify-center overflow-hidden bg-[#071923]">

      {/* BACKGROUND VIDEOS */}

      {layers.map((slideIndex, layerIndex) => {
        if (slideIndex === null) return null;

        const slide = slides[slideIndex];

        return (
          <div
            key={layerIndex}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              activeLayer === layerIndex
                ? "opacity-100"
                : "opacity-0"
            }`}
          >
            {/* IMAGE FALLBACK */}

            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url("${slide.image}")`,
              }}
            />

            {!failedVideos[slideIndex] && (
              <video
                key={slideIndex}
                ref={(element) => {
                  videoRefs.current[layerIndex] = element;
                }}
                src={slide.video}
                muted
                loop
                playsInline
                preload={layerIndex === activeLayer ? "auto" : "metadata"}
                poster={slide.image}
                onCanPlay={() => {
                  if (pendingRef.current === slideIndex) {
                    activateSlide(layerIndex, slideIndex);
                  }
                }}
                onError={() => {
                  handleVideoError(slideIndex, layerIndex);
                }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}
          </div>
        );
      })}

      {/* OVERLAY */}

      <div className="pointer-events-none absolute inset-0 bg-[#04121D]/40" />

      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#04121D]/80 via-transparent to-[#04121D]/30" />

      {/* HERO CONTENT */}

      <div className="relative z-10 mx-auto w-full max-w-5xl px-5 pt-12 text-center sm:px-8">

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
          }}
        >
          <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/85 sm:text-xs">
            Discover the World
          </p>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -15,
              }}
              transition={{
                duration: 0.55,
                ease: "easeOut",
              }}
            >
              <h1 className="wrap-break-word text-5xl leading-tight font-bold tracking-tight text-white drop-shadow-lg min-[380px]:text-6xl sm:text-7xl md:text-8xl lg:text-9xl">
                {currentSlide.name}
              </h1>

              <p className="font-display mx-auto mt-4 max-w-xl px-2 text-lg leading-relaxed italic text-white/90 sm:text-xl md:text-2xl">
                {currentSlide.tagline}
              </p>

              <Link
                to={`/destination/${currentSlide.id}`}
                className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-[#FF7658] px-6 py-3.5 text-xs font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#E96549] sm:px-7 sm:text-sm"
              >
                Explore Destination
                <FiArrowUpRight size={17} />
              </Link>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* BOTTOM NAVIGATION */}

      <div className="absolute right-0 bottom-8 left-0 z-20 px-5 sm:px-8">

        <div className="mx-auto flex max-w-6xl items-center justify-center sm:justify-between">

          <a
            href="#destinations"
            className="hidden items-center gap-2 text-xs font-semibold uppercase tracking-widest text-white/80 transition-colors hover:text-white sm:flex"
          >
            <FiArrowDown size={15} />
            Scroll to Explore
          </a>

          <div className="flex items-center gap-3">
            {destinations.map((destination, index) => {
              const isActive = activeDestinationIndex === index;

              return (
                <button
                  key={destination.id}
                  type="button"
                  onClick={() => changeSlide(index * 2)}
                  aria-label={`Show ${destination.name}`}
                  aria-pressed={isActive}
                  className={`h-2.5 rounded-full transition-all duration-500 ${
                    isActive
                      ? "w-8 bg-[#FF7658]"
                      : "w-2.5 bg-white/50 hover:bg-white"
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>

    </section>
  );
};

export default Hero;