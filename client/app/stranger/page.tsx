"use client";
import { useEffect } from "react";
import { useSocket } from "../providers/Socket";
import TempVideo from "../components/TempVideo";
import ChatBox from "../components/ChatBox";

type Props = {};

const Join = (props: Props) => {
  const { handleConnection } = useSocket();

  useEffect(() => {
    handleConnection();
  }, [handleConnection]);

  return (
    <div className="flex max-h-screen h-screen w-screen bg-black overflow-hidden pl-16">
      <TempVideo />
      <ChatBox />
    </div>
  );
};

export default Join;
