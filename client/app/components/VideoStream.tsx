import React, { useEffect, useState } from "react";
import { useWebRTC } from "../providers/WebRTC";
import { useSocket } from "../providers/Socket";
import ReactPlayer from "react-player";

type Props = {};

const VideoStream = (props: Props) => {
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
    <div className="flex flex-col md:w-1/3 justify-between items-center">
      <div className="h-full w-full">
        {remoteStream && (
          <ReactPlayer
            url={remoteStream}
            playing
            width="100%"
            height="100%"
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
