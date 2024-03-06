import { useEffect, useState } from "react";
import { useWebRTC } from "../providers/WebRTC";
import { useSocket } from "../providers/Socket";
import ReactPlayer from "react-player";
import VideoStreamPhone from "./VideoStreamPhone";

const VideoStream = () => {
  const { joined } = useSocket();
  const { sendTracks, remoteStream } = useWebRTC();
  const [myStream, setMyStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getMediaStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            aspectRatio: 1.5,
            width: { min: 640, ideal: 1280 },
            height: { min: 400, ideal: 720 },
          },
          audio: true,
        });
        setMyStream(stream);
        sendTracks(stream);
      } catch (err) {
        console.error("Error accessing media devices:", err);
        setError("Failed to access media devices. Please check your settings.");
      }
    };

    if (joined) {
      getMediaStream();
    }
  }, [joined, myStream, sendTracks]);

  return (
    <div className="w-full lg:w-[45%]">
      {error && <div className="text-red-500">{error}</div>}
      <div className="hidden lg:flex flex-col justify-between items-center gap-4 rounded-xl overflow-hidden">
        <div className="h-[45vh] w-full backdrop-blur-sm bg-[#ffffff10] rounded-xl overflow-hidden">
          {remoteStream && (
            <ReactPlayer
              playing
              url={remoteStream}
              width="100%"
              height="100%"
              controls
              muted
              className="rounded-xl"
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
              className="rounded-xl"
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
