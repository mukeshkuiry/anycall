"use client";
/* eslint-disable @next/next/no-img-element */
import Snowfall from "react-snowfall";
import { motion } from "framer-motion";
import JoinCard from "./components/JoinCard";
import ChatBox from "./components/ChatBox";
import { useSocket } from "./providers/Socket";
import VideoStream from "./components/VideoStream";
import { useEffect } from "react";
import AnycallNavbar from "./components/Navbar";

export default function Home() {
  const { joined } = useSocket();

  useEffect(() => {
    document.title = joined ? "Chat Room" : "Join Chat Room";
  }, [joined]);

  return (
    <>
      <div className="relative w-screen h-screen overflow-hidden bg-black">
        <Snowfall radius={[2, 5]} snowflakeCount={50} rotationSpeed={[1, 9]} />
        {!joined ? (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="flex justify-center items-center h-full"
          >
            <JoinCard />
          </motion.div>
        ) : (
          <div className="flex flex-col max-h-screen min-h-screen bg-black">
            <AnycallNavbar />
            <div className="flex lg:px-32 lg:mt-6 h-[calc(100vh-6rem)]">
              <VideoStream />
              <div className="hidden lg:inline w-2/3">
                <ChatBox />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
