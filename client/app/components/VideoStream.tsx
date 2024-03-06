import React, { useEffect, useState } from "react";
import { useWebRTC } from "../providers/WebRTC";
import { useSocket } from "../providers/Socket";
import ReactPlayer from "react-player";

type Props = {};

const VideoStream = (props: Props) => {
  const { joined } = useSocket();

  const { sendTracks, remoteStream } = useWebRTC();

  const [myStream, setMyStream] = useState<MediaStream | null>(null);
  const [videoQuality, setVideoQuality] = useState<"low" | "medium" | "high">(
    "high"
  );
  const [videoQualityValue, setVideoQualityValue] = useState<number>(300);
  const [pauseVideo, setPauseVideo] = useState<boolean>(false);

  useEffect(() => {
    if (videoQuality === "low") {
      setVideoQualityValue(300);
    } else if (videoQuality === "medium") {
      setVideoQualityValue(1000);
    } else {
      setVideoQualityValue(4800);
    }
  }, [videoQuality]);

  useEffect(() => {
    if (joined && !pauseVideo) {
      const stream = navigator?.mediaDevices?.getUserMedia({
        video: {
          width: {
            max: videoQualityValue,
          },
          height: {
            max: videoQualityValue,
          },
          aspectRatio: 1.5, // set aspect ratio to 4:3
        },
        audio: true,
      });
      if (stream)
        stream.then((stream) => {
          !pauseVideo && sendTracks(stream);
          setMyStream(stream);
        });
    }
  }, [
    joined,
    pauseVideo,
    remoteStream,
    sendTracks,
    videoQuality,
    videoQualityValue,
  ]);
  return (
    <div className="flex flex-col md:w-1/3 justify-between items-center gap-4">
      <div className="h-[45vh] w-full backdrop-blur-sm bg-[#ffffff10] rounded-xl overflow-hidden">
        {remoteStream && (
          <ReactPlayer playing url={remoteStream} width="100%" height="100%" controls />
        )}
      </div>
      <div className="w-full h-[45vh] backdrop-blur-sm bg-[#ffffff10] rounded-xl overflow-hidden">
        {myStream && (
          <ReactPlayer playing url={myStream} controls width="100%" height="100%" />
        )}
      </div>
    </div>
  );
};

export default VideoStream;
