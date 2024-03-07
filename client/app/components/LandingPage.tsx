/* eslint-disable @next/next/no-img-element */
import { motion } from "framer-motion";
import { useState } from "react";
import PeerRoomLanding from "./PeerRoomLanding";
import GroupLanding from "./GroupLanding";

type Props = {};

const LandingPage = (props: Props) => {
  const [isChecked, setIsChecked] = useState<boolean>(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-center items-center flex-col">
        {/* Logo */}
        <img
          src="https://dl.memuplay.com/new_market/img/com.video.mini.icon.2021-03-18-21-22-39.png"
          alt="Like Logo"
          className="w-10 h-10 md:w-12 md:h-12 mb-2 md:mb-3"
        />

        {/* Title */}
        <h1 className="text-lg md:text-xl font-semibold mb-3 md:mb-6 text-white text-center">
          Welcome to AnyCall
        </h1>
      </div>
      <div className="h-[57vh] flex justify-center items-center">
        {isChecked ? <PeerRoomLanding /> : <GroupLanding />}
      </div>
      <p className="text-xs md:text-sm text-gray-500 mt-1 md:mt-2 text-center">
        By using AnyCall, you accept the terms & conditions.
      </p>
      <div className="my-4 w-full flex justify-center pt-4">
        <div className="glassmorphism-card w-fit p-1">
          <button
            className={`lg:px-10 px-4 py-3  text-white m-1 rounded-md transition-all ${
              !isChecked
                ? "bg-black"
                : "bg-gradient-to-r from-pink-500 to-blue-500"
            }`}
            onClick={() => setIsChecked(true)}
          >
            Stranger Chat
          </button>
          <button
            className={`lg:px-12 px-6 py-3  text-white m-1 rounded-md transition-all ${
              isChecked
                ? "bg-black"
                : "bg-gradient-to-r from-blue-500 to-pink-500"
            }`}
            onClick={() => setIsChecked(false)}
          >
            Group Chat
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default LandingPage;
