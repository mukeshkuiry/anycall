import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

/* eslint-disable @next/next/no-img-element */
type Props = {};

const GroupLanding = (props: Props) => {
  const router = useRouter();
  const handleJoin = () => {
    router.push("/stranger");
  };
  return (
    <div className="flex flex-col items-center justify-center transition-all">
      {/* Description */}
      <p className="text-purple-600 text-base md:text-lg mb-3 md:mb-5 font-mono text-center">
        Talk with friends and family! Create a room and invite your friends.
      </p>

      <img
        src="/group.jpg"
        alt="User 1"
        className="h-40 md:h-60 rounded-xl mb-3"
      />
      <div className="flex lg:flex-row flex-col justify-center items-center w-4/5 border border-purple-500 rounded-md mt-6">
        <input
          type="text"
          placeholder="Name"
          className="px-6 py-2 md:px-6 md:py-2 w-full outline-none rounded-md bg-[#000] text-white"
          spellCheck="false"
        />
        <input
          type="text"
          placeholder="Room ID"
          className="px-6 py-2 md:px-6 md:py-2 w-full outline-none lg:border-l border border-purple-500 lg:border-y-0 lg:border-r-0 bg-black text-white"
          spellCheck="false"
          slot="input"
        />

        {/* Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="bg-purple-500 text-white px-6 py-2 md:px-6 md:py-2 hover:bg-purple-600 w-full lg:w-auto lg:rounded-r-md text-nowrap"
          onClick={handleJoin}
        >
          Join Room
        </motion.button>
      </div>
    </div>
  );
};

export default GroupLanding;
