import React, { useEffect, useLayoutEffect } from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Lenis from "lenis";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import DestinationExplorer from "./components/DestinationExplorer";
import TravelStories from "./components/TravelStories";
import Footer from "./components/Footer";

import DestinationDetails from "./pages/DestinationDetails";
import TripPlanner from "./pages/TripPlanner";
import MyTrips from "./pages/MyTrips";

if (
  typeof window !== "undefined" &&
  "scrollRestoration" in window.history
) {
  window.history.scrollRestoration = "manual";
}

const ScrollManager = () => {
  const location = useLocation();

  useLayoutEffect(() => {
    if (!location.hash) {
      window.scrollTo(0, 0);
      return;
    }

    const sectionId = decodeURIComponent(
      location.hash.slice(1)
    );

    const timer = window.setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 250);

    return () => window.clearTimeout(timer);
  }, [location.pathname, location.hash]);

  return null;
};

const SmoothScroll = () => {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
      wheelMultiplier: 0.9,
    });

    let frame;

    const animate = (time) => {
      lenis.raf(time);
      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return null;
};

const Home = () => {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <DestinationExplorer />
        <TravelStories />
      </main>
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <SmoothScroll />
      <ScrollManager />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/destination/:id"
          element={<DestinationDetails />}
        />

        <Route
          path="/plan-trip"
          element={<TripPlanner />}
        />

        <Route
          path="/my-trips"
          element={<MyTrips />}
        />

        <Route path="*" element={<Home />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
};

export default App;