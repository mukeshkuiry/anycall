/* eslint-disable @next/next/no-img-element */
import { motion } from "framer-motion";
import { useSocket } from "../providers/Socket";

type Props = {};

const JoinCard = (props: Props) => {
  const { handleConnection, setJoined } = useSocket();

  const handleJoin = () => {
    handleConnection();
    setJoined(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-h-screen flex flex-col items-center justify-center"
    >
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

      {/* Description */}
      <p className="text-purple-600 text-base md:text-lg mb-3 md:mb-5 font-mono text-center">
        Talk to strangers! You&apos;re about to meet people who you have never
        met before!
      </p>

      {/* Images */}
      <div className="flex flex-col md:flex-row justify-between w-full max-h-80 md:max-h-screen m-3 p-6 mb-12">
        <img
          src="https://blog.placeit.net/wp-content/uploads/2021/03/mockup-of-a-pro-gamer-wearing-a-t-shirt.png"
          alt="User 1"
          className="h-40 md:h-96 rounded-lg mb-3 md:mb-0"
        />
        <img
          src="https://i.vimeocdn.com/video/907019718-e4b2a9638c0b1b2d4591a09d6da2f465e6bfa50b8291b3323cd799ffe8249c2b-d_640x360.jpg"
          alt="User 2"
          className="h-40 md:h-96 rounded-lg"
        />
      </div>

      {/* Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="bg-purple-500 text-white px-7 py-3 md:px-6 md:py-3 rounded-md shadow-md hover:bg-purple-600 mb-1 md:mb-3"
        onClick={handleJoin}
      >
        Start Chat
      </motion.button>

      {/* Additional Description */}
      <p className="text-gray-500 text-sm md:text-base mb-3 md:mb-5 text-center">
        Discover interesting people, share your thoughts, and have fun in a safe
        environment.
      </p>

      {/* Terms and Conditions */}
      <p className="text-xs md:text-sm text-gray-500 mt-1 md:mt-2 text-center">
        By using AnyCall, you accept the terms & conditions.
      </p>
    </motion.div>
  );
};

export default JoinCard;
