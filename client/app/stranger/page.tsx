"use client";
import { useEffect } from "react";
import { useSocket } from "../providers/Socket";
import AnycallNavbar from "../components/Navbar";
import VideoStream from "../components/VideoStream";
import ChatBox from "../components/ChatBox";

type Props = {};

const Join = (props: Props) => {
  const { handleConnection } = useSocket();

  useEffect(() => {
    handleConnection();
  }, [handleConnection]);

  return (
    <div className="flex flex-col max-h-screen min-h-screen bg-black">
      <AnycallNavbar />
      <div className="flex lg:px-32 lg:mt-6 h-[calc(100vh-6rem)]">
        <VideoStream />
        <div className="hidden lg:inline w-2/3">
          <ChatBox />
        </div>
      </div>
    </div>
  );
};

export default Join;
