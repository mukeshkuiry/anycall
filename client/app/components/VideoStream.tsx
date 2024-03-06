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

  useEffect(() => {
    if (joined) {
      // const stream = navigator?.mediaDevices?.getUserMedia({
      //   video: true,
      //   audio: true,
      // });
      // reduce video quality
      const stream = navigator?.mediaDevices?.getUserMedia({
        video: {
          width: {
            max:
              videoQuality === "low"
                ? 300
                : videoQuality === "medium"
                ? 1000
                : 1800,
          },
          height: {
            max:
              videoQuality === "low"
                ? 300
                : videoQuality === "medium"
                ? 1000
                : 1800,
          },
          aspectRatio: 0.75, // set 3:4
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
        remoteStream.getVideoTracks().forEach((track) => {
          track.applyConstraints({
            width: { max: 100 },
            height: { max: 100 },
            aspectRatio: 0.74,
          });
        });
      }
    }
  }, [joined, remoteStream, sendTracks, videoQuality]);
  return (
    <div className="flex flex-col md:w-1/3 justify-between items-center">
      <div className="h-full w-full">
        {remoteStream && (
          <ReactPlayer
            url={remoteStream}
            playing
            width="100%"
            height="100%"
            muted
            style={{
              transform: "rotateY(180deg)",
              borderRadius: "1rem",
            }}
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
            style={{
              transform: "rotateY(180deg)",
              borderRadius: "1rem",
            }}
          />
        )}
      </div>
    </div>
  );
};

export default VideoStream;
