import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import {
  FiArrowRight,
  FiCalendar,
  FiMapPin,
  FiTrash2,
  FiUsers,
} from "react-icons/fi";

import Navbar from "../components/Navbar";
import { destinations } from "../data/destinations";

const STORAGE_KEY = "voyage-planned-trips";

const loadTrips = () => {
  try {
    const stored = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]"
    );

    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
};

const formatDate = (date) => {
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const MyTrips = () => {
  const [trips, setTrips] = useState(loadTrips);

  useEffect(() => {
    const handleStorage = () => {
      setTrips(loadTrips());
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const deleteTrip = (tripId) => {
    const updatedTrips = trips.filter(
      (trip) => trip.id !== tripId
    );

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedTrips)
      );

      setTrips(updatedTrips);
    } catch {
      // Storage may be unavailable.
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#FAF8F3]">

        <section className="bg-[#102C3C] px-6 pb-20 pt-36 text-center md:pb-24 md:pt-44">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FFB39F]">
              Your Travel Plans
            </p>

            <h1 className="mt-5 text-4xl font-bold text-white md:text-6xl">
              My Trips
            </h1>

            <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-white/70">
              View and manage your saved travel plans.
            </p>
          </motion.div>
        </section>

        <section className="px-6 py-16 md:py-20">
          <div className="mx-auto max-w-4xl">

            {trips.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl border border-[#EAE4D9] bg-white px-6 py-16 text-center"
              >
                <FiMapPin
                  size={32}
                  className="mx-auto text-[#287C91]"
                />

                <h2 className="mt-5 text-2xl font-bold text-[#102C3C]">
                  No Trips Planned Yet
                </h2>

                <p className="mt-3 text-sm text-[#6B777B]">
                  Your saved trips will appear here.
                </p>

                <Link
                  to="/plan-trip"
                  className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#FF7658] px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#E96549]"
                >
                  Plan Your First Trip
                  <FiArrowRight />
                </Link>
              </motion.div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {trips.map((trip) => {
                    const destination = destinations.find(
                      (item) => item.id === trip.destinationId
                    );

                    return (
                      <motion.article
                        layout
                        key={trip.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col gap-5 rounded-2xl border border-[#EAE4D9] bg-white p-4 shadow-sm sm:flex-row sm:items-center"
                      >
                        {destination && (
                          <img
                            src={destination.image}
                            alt={destination.name}
                            className="h-36 w-full rounded-xl object-cover sm:h-28 sm:w-36"
                          />
                        )}

                        <div className="min-w-0 flex-1">
                          <h2 className="text-xl font-bold text-[#102C3C]">
                            {trip.destinationName}
                          </h2>

                          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#6B777B]">
                            <span className="flex items-center gap-2">
                              <FiCalendar className="text-[#287C91]" />
                              {formatDate(trip.startDate)} –{" "}
                              {formatDate(trip.endDate)}
                            </span>

                            <span className="flex items-center gap-2">
                              <FiUsers className="text-[#287C91]" />
                              {trip.travelers}{" "}
                              {trip.travelers === 1
                                ? "Traveler"
                                : "Travelers"}
                            </span>
                          </div>

                          <p className="mt-3 text-xs font-medium text-[#287C91]">
                            Saved Travel Plan
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => deleteTrip(trip.id)}
                          aria-label={`Remove trip to ${trip.destinationName}`}
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-100 px-4 py-3 text-xs font-semibold text-red-500 transition-colors hover:bg-red-50"
                        >
                          <FiTrash2 size={16} />
                          Remove
                        </button>
                      </motion.article>
                    );
                  })}
                </AnimatePresence>

                <div className="pt-6 text-center">
                  <Link
                    to="/plan-trip"
                    className="inline-flex items-center gap-2 rounded-full bg-[#102C3C] px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#287C91]"
                  >
                    Plan Another Trip
                    <FiArrowRight />
                  </Link>
                </div>
              </div>
            )}

            <p className="mt-10 text-center text-xs text-[#6B777B]">
              Trips are saved in this browser only.
              These are not confirmed reservations.
            </p>

          </div>
        </section>

      </main>
    </>
  );
};

export default MyTrips;