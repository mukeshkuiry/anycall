import React from "react";
import ReactPlayer from "react-player";

type Props = {
  myStream: MediaStream | null;
  remoteStream: MediaStream | null;
};

const VideoStreamPhone = ({ myStream, remoteStream }: Props) => {
  return (
    <div className="h-[calc(100vh-4rem)] w-full flex justify-center items-center relative">
      {remoteStream && (
        <ReactPlayer
          playing
          url={remoteStream}
          width={"100%"}
          height={"100%"}
          controls
        />
      )}

      <div className="absolute bottom-0 right-0 w-[40vw]">
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
