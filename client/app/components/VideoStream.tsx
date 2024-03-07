import { useEffect, useState } from "react";
import { useWebRTC } from "../providers/WebRTC";
import ReactPlayer from "react-player";
import VideoStreamPhone from "./VideoStreamPhone";

const VideoStream = () => {
  const { sendTracks, remoteStream } = useWebRTC();
  const [myStream, setMyStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getMediaStream = async () => {
      try {
        if (window.location.pathname === "/stranger") {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: {
              aspectRatio: 1.5,
              width: { min: 640, ideal: 1280, max: 1920 },
              height: { min: 400, ideal: 720, max: 1080 },
            },
            audio: true,
          });
          setMyStream(stream);
          sendTracks(stream);
        }
      } catch (err) {
        console.error("Error accessing media devices:", err);
        setError("Failed to access media devices. Please check your settings.");
      }
    };

    getMediaStream();
  }, [sendTracks]);

  return (
    <div className="w-full lg:w-[45%]">
      {error && <div className="text-red-500">{error}</div>}
      <div className="hidden lg:flex flex-col justify-between items-center gap-4 rounded-xl overflow-hidden">
        <div className="h-[43vh] w-full backdrop-blur-sm bg-[#ffffff10] rounded-xl overflow-hidden">
          {remoteStream && (
            <ReactPlayer
              playing
              url={remoteStream}
              width="100%"
              height="100%"
              controls
            />
          )}
        </div>
        <div className="w-full h-[43vh] backdrop-blur-sm bg-[#ffffff10] rounded-xl overflow-hidden">
          {myStream && (
            <ReactPlayer
              playing
              url={myStream}
              controls
              width="100%"
              height="100%"
              className="rounded-xl"
              muted
              style={{
                transform: "rotateY(180deg)",
              }}
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
