"use client";
/* eslint-disable @next/next/no-img-element */
import Snowfall from "react-snowfall";
import { motion } from "framer-motion";
import LandingPage from "./components/LandingPage";

export default function Home() {
  return (
    <>
      <div className="relative w-screen h-screen overflow-hidden bg-black">
        <Snowfall radius={[2, 5]} snowflakeCount={50} rotationSpeed={[1, 9]} />
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="flex justify-center items-center h-full"
        >
          <LandingPage />
        </motion.div>
      </div>
    </>
  );
}
