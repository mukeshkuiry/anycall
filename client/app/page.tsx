/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useRef } from "react";
import ReactPlayer from "react-player";
import Snowfall from "react-snowfall";
import JoinCard from "./components/JoinCard";
import ChatBox from "./components/ChatBox";
import { useSocket } from "./providers/Socket";
import { useWebRTC } from "./providers/WebRTC";

export default function Home() {
  const { joined } = useSocket();
  const { sendTracks, remoteStream } = useWebRTC();

  const [myStream, setMyStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    if (joined) {
      const stream = navigator?.mediaDevices?.getUserMedia({
        video: true,
        audio: true,
      });
      if (stream)
        stream.then((stream) => {
          sendTracks(stream);
          setMyStream(stream);
        });
    }
  }, [joined, sendTracks]);

  return (
    <div className="grid h-screen w-screen absolute">
      <img
        className="w-screen h-screen relative top-0 left-0"
        src="/bg.jpg"
        alt="Snow"
      />

      {!joined ? (
        <div className="flex absolute justify-center items-center h-screen w-screen ">
          <Snowfall
            radius={[2, 5]}
            snowflakeCount={300}
            rotationSpeed={[1, 9]}
          />
          <JoinCard />
        </div>
      ) : (
        <div className="h-screen w-screen absolute flex">
          <Snowfall
            radius={[2, 5]}
            snowflakeCount={100}
            rotationSpeed={[1, 9]}
          />
          <div className="flex flex-col w-1/3 justify-between items-center space-y-8 pl-8 py-8">
            <div className="w-full h-full backdrop-blur-lg border flex justify-center items-center">
              <h1 className="text-white text-3xl">
                {remoteStream && (
                  <ReactPlayer
                    url={remoteStream}
                    playing
                    width="100%"
                    height="100%"
                    muted
                    style={{
                      transform: "rotateY(180deg)",
                    }}
                  />
                )}
              </h1>
            </div>
            <div className="w-full h-full backdrop-blur-lg border flex justify-center items-center">
              <h1 className="text-white text-3xl">
                {myStream && (
                  <ReactPlayer
                    url={myStream}
                    playing
                    width="100%"
                    height="100%"
                    muted
                    style={{
                      transform: "rotateY(180deg)",
                    }}
                  />
                )}
              </h1>
            </div>
          </div>
          <ChatBox />
        </div>
      )}
    </div>
  );
}
