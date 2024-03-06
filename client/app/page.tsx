"use client";
import Snowfall from "react-snowfall";
import JoinCard from "./components/JoinCard";
import ChatBox from "./components/ChatBox";
import { useSocket } from "./providers/Socket";
import VideoStream from "./components/VideoStream";

export default function Home() {
  const { joined } = useSocket();

  return (
    <>
      {!joined ? (
        <div className="flex justify-center absolute items-center h-screen max-h-screen w-screen bg-black">
          {/* <img
            className="w-screen h-screen relative top-0 left-0"
            src="/bg.jpg"
            alt="Snow"
          /> */}
          <Snowfall
            radius={[2, 5]}
            snowflakeCount={300}
            rotationSpeed={[1, 9]}
          />
          <JoinCard />
        </div>
      ) : (
        <div className="max-h-screen w-screen absolute flex bg-black md:px-32 md:py-12 py-6 px-4">
          <VideoStream />
          <div className="w-2/3 hidden">
            <ChatBox />
          </div>
        </div>
      )}
    </>
  );
}
