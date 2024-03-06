import React, { useEffect, useState } from "react";
import { useWebRTC } from "../providers/WebRTC";
import { useSocket } from "../providers/Socket";
import ReactPlayer from "react-player";
import VideoStreamPhone from "./VideoStreamPhone";

type Props = {};

const VideoStream = (props: Props) => {
  const { joined } = useSocket();

  const { sendTracks, remoteStream } = useWebRTC();

  const [myStream, setMyStream] = useState<MediaStream | null>(null);
  // const [videoQuality, setVideoQuality] = useState<"low" | "medium" | "high">(
  //   "high"
  // );
  // const [videoQualityValue, setVideoQualityValue] = useState<number>(300);

  // useEffect(() => {
  //   if (videoQuality === "low") {
  //     setVideoQualityValue(300);
  //   } else if (videoQuality === "medium") {
  //     setVideoQualityValue(1000);
  //   } else {
  //     setVideoQualityValue(4800);
  //   }
  // }, [videoQuality]);

  useEffect(() => {
    if (joined) {
      const stream = navigator?.mediaDevices?.getUserMedia({
        video: {
          //   width: {
          //     max: videoQualityValue,
          //   },
          //   height: {
          //     max: videoQualityValue,
          //   },
          aspectRatio: 1.5, // set aspect ratio to 4:3
        },
        audio: true,
      });
      if (stream)
        stream.then((stream) => {
          sendTracks(stream);
          setMyStream(stream);
        });
    }
  }, [joined, remoteStream, sendTracks]);
  return (
    <div className="w-full lg:w-[45%]">
      <div className="hidden lg:flex flex-col justify-between items-center gap-4">
        <div className="h-[45vh] w-full backdrop-blur-sm bg-[#ffffff10] rounded-xl overflow-hidden">
          {remoteStream && (
            <ReactPlayer
              playing
              url={remoteStream}
              width="100%"
              height="100%"
              controls
              muted
            />
          )}
        </div>
        <div className="w-full h-[45vh] backdrop-blur-sm bg-[#ffffff10] rounded-xl overflow-hidden">
          {myStream && (
            <ReactPlayer
              playing
              url={myStream}
              controls
              width="100%"
              height="100%"
              muted
            />
          )}
        </div>
      </div>
      <div className="lg:hidden">
        <VideoStreamPhone myStream={myStream} remoteStream={remoteStream} />
      </div>
    </div>
  );
};

export default VideoStream;
