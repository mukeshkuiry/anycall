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
      className="min-h-screen flex flex-col items-center justify-center"
    >
      {/* Logo */}
      <img
        src="https://dl.memuplay.com/new_market/img/com.video.mini.icon.2021-03-18-21-22-39.png"
        alt="Like Logo"
        className="w-12 h-12 md:w-16 md:h-16 mb-2 md:mb-4"
      />

      {/* Title */}
      <h1 className="text-2xl md:text-3xl font-semibold mb-4 md:mb-8 text-white text-center">
        Welcome to AnyCall
      </h1>

      {/* Description */}
      <p className="text-purple-600 text-lg md:text-2xl mb-4 md:mb-6 font-mono text-center">
        Talk to strangers! You&apos;re about to meet people who you have never
        met before!
      </p>

      {/* Images */}
      <div className="flex flex-col md:flex-row justify-between w-full max-h-96 md:max-h-screen m-4 p-8">
        <img
          src="https://blog.placeit.net/wp-content/uploads/2021/03/mockup-of-a-pro-gamer-wearing-a-t-shirt.png"
          alt="User 1"
          className="h-40 md:h-96  rounded-lg mb-4 md:mb-0"
        />
        <img
          src="https://i.vimeocdn.com/video/907019718-e4b2a9638c0b1b2d4591a09d6da2f465e6bfa50b8291b3323cd799ffe8249c2b-d_640x360.jpg"
          alt="User 2"
          className="h-40 md:h-96 rounded-lg mb-8"
        />
      </div>

      {/* Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="bg-purple-500 text-white px-6 py-3 md:px-8 md:py-4 rounded-md shadow-md hover:bg-purple-600 mb-2 md:mb-4"
        onClick={handleJoin}
      >
        Start Chat
      </motion.button>

      {/* Additional Description */}
      <p className="text-gray-500 text-base md:text-xl mb-4 md:mb-6 text-center">
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
