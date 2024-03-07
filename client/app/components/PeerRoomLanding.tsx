import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

/* eslint-disable @next/next/no-img-element */
type Props = {};

const PeerRoomLanding = (props: Props) => {
  const router = useRouter();
  const handleJoin = () => {
    router.push("/stranger");
  };
  return (
    <div className="flex flex-col items-center justify-center transition-all">
      {/* Description */}
      <p className="text-purple-600 text-base md:text-lg mb-3 md:mb-5 font-mono text-center">
        Talk to strangers! You&apos;re about to meet people who you have never
        met before!
      </p>

      {/* Images */}
      <div className="flex flex-col md:flex-row justify-between w-full max-h-80 md:max-h-screen m-3 p-6 mb-14 lg:mb-0">
        <img
          src="https://blog.placeit.net/wp-content/uploads/2021/03/mockup-of-a-pro-gamer-wearing-a-t-shirt.png"
          alt="User 1"
          className="h-40 md:h-60 rounded-lg mb-3 md:mb-0"
        />
        <img
          src="https://i.vimeocdn.com/video/907019718-e4b2a9638c0b1b2d4591a09d6da2f465e6bfa50b8291b3323cd799ffe8249c2b-d_640x360.jpg"
          alt="User 2"
          className="h-40 md:h-60 rounded-lg"
        />
      </div>

      {/* Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="bg-purple-500 text-white px-6 py-2 md:px-6 md:py-2 rounded-md shadow-md hover:bg-purple-600 mb-2 md:mb-3"
        onClick={handleJoin}
      >
        Start Chat
      </motion.button>
    </div>
  );
};

export default PeerRoomLanding;
