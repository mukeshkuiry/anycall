"use client";
import { useEffect } from "react";
import { useSocket } from "../providers/Socket";
import TempVideo from "../components/TempVideo";
import ChatBox from "../components/ChatBox";

type Props = {};

const Join = (props: Props) => {
  const { handleConnection } = useSocket();

  useEffect(() => {
    handleConnection();
  }, [handleConnection]);

  // go to browser full screen mode
  useEffect(() => {
    const goFullScreen = async () => {
      try {
        const elem = document.documentElement;
        if (elem && elem.requestFullscreen) {
          await elem.requestFullscreen();
        }
      } catch (error) {
        console.log("Error in full screen", error);
      }
    };
    goFullScreen();
  }, []);

  return (
    <div className="flex max-h-screen h-screen w-screen bg-black overflow-hidden lg:pl-16">
      <TempVideo />
      <ChatBox />
    </div>
  );
};

export default Join;
