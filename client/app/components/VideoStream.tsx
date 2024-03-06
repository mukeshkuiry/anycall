import React, { useEffect, useState } from "react";
import { useWebRTC } from "../providers/WebRTC";
import { useSocket } from "../providers/Socket";
import ReactPlayer from "react-player";

type Props = {};

const VideoStream = (props: Props) => {
  const { joined } = useSocket();

  const { sendTracks, remoteStream } = useWebRTC();
  const [adjustedTracks, setAdjustedTracks] = useState<MediaStream | null>(
    null
  );

  const [myStream, setMyStream] = useState<MediaStream | null>(null);
  const [videoQuality, setVideoQuality] = useState<"low" | "medium" | "high">(
    "high"
  );
  const [videoQualityValue, setVideoQualityValue] = useState<number>(300);

  useEffect(() => {
    if (videoQuality === "low") {
      setVideoQualityValue(300);
    } else if (videoQuality === "medium") {
      setVideoQualityValue(1000);
    } else {
      setVideoQualityValue(1800);
    }
  }, [videoQuality]);

  useEffect(() => {
    if (joined) {
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
          sendTracks(stream);
          setMyStream(stream);
        });

      if (remoteStream) {
        // reduce video quality of remote stream
        const newTrack = remoteStream;
        newTrack.getVideoTracks().forEach((track) => {
          track.applyConstraints({
            width: { max: videoQualityValue },
            height: { max: videoQualityValue },
          });
        });
        setAdjustedTracks(newTrack);
      }
    }
  }, [joined, remoteStream, sendTracks, videoQuality, videoQualityValue]);
  return (
    <div className="flex flex-col md:w-1/3 justify-between items-center gap-4">
      <div className="h-full w-full rounded-xl">
        {adjustedTracks && (
          <ReactPlayer
            url={adjustedTracks}
            playing
            width="100%"
            height="100%"
            muted
          />
        )}
      </div>
      <div className="w-full h-full">
        {myStream && (
          <ReactPlayer
            url={myStream}
            playing
            width="100%"
            height="100%"
            muted
          />
        )}
      </div>
    </div>
  );
};

export default VideoStream;
