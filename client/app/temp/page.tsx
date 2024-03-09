"use client";
import ChatBox from "../components/ChatBox";

type Props = {};

const page = (props: Props) => {
  return (
    <div className="bg-[#03020f] flex justify-end items-center h-screen">
      <ChatBox />
    </div>
  );
};

export default page;
