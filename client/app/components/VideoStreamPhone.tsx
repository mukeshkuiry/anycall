import React from "react";
import ReactPlayer from "react-player";

type Props = {
  myStream: MediaStream | null;
  remoteStream: MediaStream | null;
};

const VideoStreamPhone = ({ myStream, remoteStream }: Props) => {
  return (
    <div className="flex flex-col md:w-1/3 justify-between items-center gap-4">
      <div className="h-[45vh] w-full backdrop-blur-sm bg-[#ffffff10] rounded-xl overflow-hidden">
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
      <div className="w-full h-[45vh] backdrop-blur-sm bg-[#ffffff10] rounded-xl overflow-hidden">
        {myStream && (
          <ReactPlayer
            playing
            url={myStream}
            controls
            width="100%"
            height="100%"
          />
        )}
      </div>
    </div>
  );
};

export default VideoStreamPhone;
