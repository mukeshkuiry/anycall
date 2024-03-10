"use client";
import { useEffect, useState } from "react";
import { useWebRTC } from "../providers/WebRTC";
import ReactPlayer from "react-player";
import AnycallNavbar from "./Navbar";
import { MdAddCall, MdCallEnd, MdEmojiEmotions } from "react-icons/md";
import { FaVideo, FaVideoSlash } from "react-icons/fa";
import { IoMdMic, IoMdMicOff } from "react-icons/io";
import { useSocket } from "../providers/Socket";
import Avatar from "./Avatar";

const TempVideo = () => {
  const {
    sendTracks,
    pauseAudioTracks,
    pauseVideoTracks,
    resumeAudioTracks,
    resumeVideoTracks,
    remoteStream,
  } = useWebRTC();

  const { socket, randomId, remoteAudio, remoteVideo, peerJoined } =
    useSocket();
  const [myStream, setMyStream] = useState<MediaStream | null>(null);
  const [audio, setAudio] = useState<boolean>(true);
  const [video, setVideo] = useState<boolean>(true);
  const [audioPlaying, setAudioPlaying] = useState<boolean>(false);

  useEffect(() => {
    const getMediaStream = async () => {
      try {
        if (window.location.pathname === "/stranger") {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: {
              width: 1920,
              height: 1080,
              aspectRatio: 16 / 9,
            },
            audio: audio,
          });
          setMyStream(stream);
          video && sendTracks(stream);
        }
      } catch (err) {
        console.error("Error accessing media devices:", err);
      }
    };

    getMediaStream();
  }, [audio, sendTracks, video]);

  useEffect(() => {
    if (video) {
      resumeVideoTracks();
      const msg: IMessage = {
        type: "video resume",
        senderId: randomId,
        content: "video",
      };
      socket?.send(JSON.stringify(msg));
    } else {
      pauseVideoTracks();
      const msg: IMessage = {
        type: "video pause",
        senderId: randomId,
        content: "video",
      };
      socket?.send(JSON.stringify(msg));
    }
  }, [pauseVideoTracks, randomId, resumeVideoTracks, socket, video]);

  useEffect(() => {
    if (audio) {
      resumeAudioTracks();
      const msg: IMessage = {
        type: "audio resume",
        senderId: randomId,
        content: "audio",
      };
      socket?.send(JSON.stringify(msg));
    } else {
      pauseAudioTracks();
      const msg: IMessage = {
        type: "audio pause",
        senderId: randomId,
        content: "audio",
      };
      socket?.send(JSON.stringify(msg));
    }
  }, [audio, pauseAudioTracks, randomId, resumeAudioTracks, socket]);

  const toggleAudio = () => {
    setAudio(!audio);
  };

  const toggleVideo = () => {
    setVideo(!video);
  };

  const handleNewCall = () => {
    window.location.reload();
  };

  const handleEndCall = () => {
    window.location.href = "/";
  };

  useEffect(() => {
    if (remoteAudio && remoteStream) {
      const audio = new Audio();
      audio.srcObject = remoteStream;
      audio.play();
      audio.onplaying = () => {
        setAudioPlaying(true);
      };

      audio.onended = () => {
        setAudioPlaying(false);
      };
    }
  }, [remoteAudio, remoteStream]);



  return (
    <div className="w-full h-full">
      <AnycallNavbar />
      <div className="flex justify-center items-center m-4 h-[calc(100%-12rem)] relative bg-[#26242cbc] backdrop-blur-xl rounded-xl">
        {remoteStream && remoteVideo ? (
          <ReactPlayer
            playing
            url={remoteStream}
            muted
            width="100%"
            height={"100%"}
            style={{
              objectFit: "cover",
              outline: "none",
            }}
          />
        ) : (
          <div className="flex flex-col justify-center items-center">
            {peerJoined ? (
              <Avatar size="large" type="stranger" />
            ) : (
              <Avatar size="large" type="waiting" />
            )}
          </div>
        )}
        <div className="absolute right-4 bottom-6  lg:right-8 lg:bottom-8">
          {myStream && video ? (
            <ReactPlayer
              playing={video}
              url={myStream}
              width={window.innerWidth > 768 ? "250px" : "100px"}
              height={"auto"}
              muted
              style={{
                objectFit: "cover",
                outline: "none",
                boxShadow: "0 0 10px 5px rgba(0, 0, 0, 0.5)",
              }}
            />
          ) : (
            <div
              style={{ boxShadow: "0 0 10px 5px rgba(0, 0, 0, 0.5)" }}
              className="flex pt-2 justify-center items-center w-[100px] h-[140px] lg:w-[250px] bg-gray-800"
            >
              <Avatar size="small" type="user" />
            </div>
          )}
        </div>
      </div>
      <div className="w-full flex justify-center items-center p-2 gap-4">
        <button
          className="p-3 rounded-xl bg-gray-600 hover:bg-gray-700 transition-all text-white text-2xl"
          onClick={toggleAudio}
        >
          {audio ? <IoMdMic /> : <IoMdMicOff />}
        </button>
        <button
          className="p-3 rounded-xl bg-gray-600 hover:bg-gray-700 transition-all text-white text-2xl"
          onClick={toggleVideo}
        >
          {video ? <FaVideo /> : <FaVideoSlash />}
        </button>
        <button className="p-3 rounded-xl bg-gray-600 hover:bg-gray-700 transition-all text-white text-2xl">
          <MdEmojiEmotions />
        </button>
        <button
          className="p-3 rounded-xl bg-red-600 hover:bg-red-700 transition-all text-white text-2xl"
          onClick={handleEndCall}
        >
          <MdCallEnd />
        </button>
        <button
          className="p-3 rounded-xl bg-gray-600 hover:bg-gray-700 transition-all text-white text-2xl"
          onClick={handleNewCall}
        >
          <MdAddCall />
        </button>
      </div>
    </div>
  );
};

export default TempVideo;
