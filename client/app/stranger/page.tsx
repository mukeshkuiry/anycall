"use client";
import { useEffect } from "react";
import { useSocket } from "../providers/Socket";
import TempVideo from "../components/TempVideo";
import ChatBox from "../components/ChatBox";
import { nextImageLoaderRegex } from "next/dist/build/webpack-config";

type Props = {};

const Join = (props: Props) => {
  const { handleConnection } = useSocket();

  useEffect(() => {
    handleConnection();
  }, [handleConnection]);

  // go to browser full screen mode
  useEffect(() => {
    const goFullScreen = () => {
      try {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
          elem.requestFullscreen();
        } else if ((elem as any).webkitRequestFullscreen) {
          (elem as any).webkitRequestFullscreen();
        } else if ((elem as any).mozRequestFullScreen) {
          (elem as any).mozRequestFullScreen();
        } else if ((elem as any).msRequestFullscreen) {
          (elem as any).msRequestFullscreen();
        } else {
          console.log("Fullscreen not supported");
        }
      } catch (error) {
        console.log("Error in full screen", error);
        return nextImageLoaderRegex;
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
