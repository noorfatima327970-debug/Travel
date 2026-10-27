import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import {
  FiArrowLeft,
  FiArrowRight,
  FiCalendar,
  FiCheckCircle,
  FiMapPin,
  FiUsers,
} from "react-icons/fi";

import Navbar from "../components/Navbar";
import { destinations } from "../data/destinations";

const STORAGE_KEY = "voyage-planned-trips";

const getToday = () => {
  const date = new Date();

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
};

const getNextDay = (dateString) => {
  const date = new Date(`${dateString}T12:00:00`);
  date.setDate(date.getDate() + 1);

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
};

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

const TripPlanner = () => {
  const [searchParams] = useSearchParams();

  const destinationFromUrl = searchParams.get("destination");

  const validDestination = destinations.some(
    (item) => item.id === destinationFromUrl
  )
    ? destinationFromUrl
    : "";

  const [destinationId, setDestinationId] = useState(validDestination);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [travelers, setTravelers] = useState(2);

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setDestinationId(validDestination);
  }, [validDestination]);

  const selectedDestination = destinations.find(
    (item) => item.id === destinationId
  );

  const inputClasses =
    "mt-2 w-full rounded-xl border border-[#EAE4D9] bg-white px-4 py-3.5 text-sm text-[#102C3C] outline-none transition-colors focus:border-[#287C91]";

  const labelClasses =
    "flex items-center gap-2 text-sm font-semibold text-[#102C3C]";

  const handleSubmit = (event) => {
    event.preventDefault();

    setError("");
    setSuccess(false);

    if (!selectedDestination || !startDate || !endDate) {
      setError("Please complete all trip details.");
      return;
    }

    if (startDate < getToday()) {
      setError("Please select a future departure date.");
      return;
    }

    if (endDate <= startDate) {
      setError("Return date must be after departure date.");
      return;
    }

    if (!Number.isInteger(travelers) || travelers < 1 || travelers > 10) {
      setError("Please select between 1 and 10 travelers.");
      return;
    }

    const newTrip = {
      id:
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      destinationId: selectedDestination.id,
      destinationName: selectedDestination.name,
      startDate,
      endDate,
      travelers,
      createdAt: new Date().toISOString(),
    };

    try {
      const existingTrips = loadTrips();

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify([newTrip, ...existingTrips])
      );

      setSuccess(true);
      setStartDate("");
      setEndDate("");
      setTravelers(2);
    } catch {
      setError("Unable to save the trip in this browser.");
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#FAF8F3]">

        {/* HEADER */}

        <section className="bg-[#102C3C] px-6 pb-20 pt-36 text-center md:pb-24 md:pt-44">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mx-auto max-w-2xl"
          >
            <Link
              to="/"
              className="mb-7 inline-flex items-center gap-2 text-xs font-semibold text-white/70 hover:text-white"
            >
              <FiArrowLeft size={15} />
              Back to Home
            </Link>

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FFB39F]">
              Your Next Adventure
            </p>

            <h1 className="mt-5 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
              Plan Your Trip
            </h1>

            <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-white/70 md:text-base">
              Choose your destination, dates and travelers.
              Save your plan in just a few steps.
            </p>
          </motion.div>
        </section>

        {/* FORM */}

        <section className="px-6 py-16 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mx-auto max-w-2xl rounded-3xl border border-[#EAE4D9] bg-white p-6 shadow-sm sm:p-9 md:p-12"
          >
            <h2 className="text-2xl font-bold text-[#102C3C]">
              Your Trip Details
            </h2>

            <p className="mb-9 mt-2 text-sm text-[#6B777B]">
              Fill in the details below to save your trip.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">

              <div>
                <label htmlFor="destination" className={labelClasses}>
                  <FiMapPin className="text-[#287C91]" />
                  Destination
                </label>

                <select
                  id="destination"
                  value={destinationId}
                  onChange={(event) =>
                    setDestinationId(event.target.value)
                  }
                  className={inputClasses}
                  required
                >
                  <option value="">Select a destination</option>

                  {destinations.map((destination) => (
                    <option
                      key={destination.id}
                      value={destination.id}
                    >
                      {destination.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">

                <div>
                  <label htmlFor="departure" className={labelClasses}>
                    <FiCalendar className="text-[#287C91]" />
                    Departure Date
                  </label>

                  <input
                    id="departure"
                    type="date"
                    min={getToday()}
                    value={startDate}
                    onChange={(event) => {
                      const value = event.target.value;

                      setStartDate(value);

                      if (endDate && endDate <= value) {
                        setEndDate("");
                      }
                    }}
                    className={inputClasses}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="return" className={labelClasses}>
                    <FiCalendar className="text-[#287C91]" />
                    Return Date
                  </label>

                  <input
                    id="return"
                    type="date"
                    min={startDate ? getNextDay(startDate) : getToday()}
                    value={endDate}
                    onChange={(event) =>
                      setEndDate(event.target.value)
                    }
                    className={inputClasses}
                    required
                  />
                </div>

              </div>

              <div>
                <label htmlFor="travelers" className={labelClasses}>
                  <FiUsers className="text-[#287C91]" />
                  Travelers
                </label>

                <select
                  id="travelers"
                  value={travelers}
                  onChange={(event) =>
                    setTravelers(Number(event.target.value))
                  }
                  className={inputClasses}
                >
                  {Array.from({ length: 10 }, (_, index) => (
                    <option key={index + 1} value={index + 1}>
                      {index + 1}{" "}
                      {index === 0 ? "Traveler" : "Travelers"}
                    </option>
                  ))}
                </select>
              </div>

              <AnimatePresence mode="wait">
                {selectedDestination && (
                  <motion.div
                    key={selectedDestination.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-4 rounded-2xl bg-[#FAF8F3] p-3"
                  >
                    <img
                      src={selectedDestination.image}
                      alt={selectedDestination.name}
                      className="h-20 w-24 shrink-0 rounded-xl object-cover"
                    />

                    <div>
                      <h3 className="font-bold text-[#102C3C]">
                        {selectedDestination.name}
                      </h3>

                      <p className="mt-1 text-xs text-[#6B777B]">
                        {selectedDestination.tagline}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {error && (
                <p
                  role="alert"
                  className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600"
                >
                  {error}
                </p>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  role="status"
                  className="rounded-xl bg-green-50 px-4 py-4 text-sm font-medium text-green-700"
                >
                  <div className="flex items-center gap-2">
                    <FiCheckCircle size={20} />
                    Trip saved successfully!
                  </div>

                  <Link
                    to="/my-trips"
                    className="mt-3 inline-flex items-center gap-2 font-bold text-green-800 underline"
                  >
                    View My Trips
                    <FiArrowRight />
                  </Link>
                </motion.div>
              )}

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#FF7658] px-6 py-4 text-sm font-bold text-white transition-colors hover:bg-[#E96549]"
              >
                Save My Trip
                <FiArrowRight size={18} />
              </button>

              <p className="text-center text-xs text-[#6B777B]">
                Demo planner only. No real bookings or payments.
              </p>

            </form>
          </motion.div>
        </section>

      </main>
    </>
  );
};

export default TripPlanner;