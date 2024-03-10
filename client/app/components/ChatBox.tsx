// ChatBox.tsx
import { useEffect, useRef, useState } from "react";
import { useSocket } from "../providers/Socket";
import { IoSendOutline } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";

type Props = {};

const ChatBox = (props: Props) => {
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  const chatBoxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const notificationRef = useRef<HTMLAudioElement>(null); // Reference to the audio element

  const { messages, randomId, sendMessage, peerJoined } = useSocket();

  // Function to scroll the chat box to the bottom
  const scrollToBottom = () => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  };

  const handleSendMessage = () => {
    if (!message.trim()) {
      setError("Please enter a message.");
      return;
    }

    const sent = sendMessage(message);
    if (sent) {
      setMessage(""); // Clear input field after sending
      setError("");
      inputRef.current?.focus(); // Focus back on input field after sending
    } else {
      setError("Message not sent");
    }
  };

  useEffect(() => {
    // Scroll to bottom when component mounts or chat messages change
    scrollToBottom();
  }, [messages]); // Include any dependency that triggers new messages

  useEffect(() => {
    // Play notification sound when a new message is received
    if (
      messages.length > 0 &&
      messages[messages.length - 1].senderId !== randomId
    ) {
      notificationRef.current?.play();
    }
  }, [messages, randomId]);

  return (
    <div className=" hidden lg:flex flex-col w-[35vw] h-[calc(100%-2rem)] bg-[#FEFCFF] p-4 m-4 rounded-xl">
      <audio ref={notificationRef} src={"/notification.mp3"} />{" "}
      <div className="flex justify-between items-center mb-3">
        <h1 className="text-2xl font-bold">Chats</h1>
        <button className=" text-3xl cursor-pointer text-gray-400 font-[100px]">
          <IoMdClose />
        </button>
      </div>
      {/* Notification sound */}
      <div
        className="flex-grow overflow-y-auto p-2 custom-scrollbar"
        ref={chatBoxRef}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex mb-2 w-full  gap-4 ${
              randomId === msg.senderId
                ? "justify-end flex-row"
                : "flex-row-reverse justify-end"
            }`}
          >
            <div
              className={` ${
                randomId === msg.senderId
                  ? "bg-purple-500 rounded-l-full rounded-t-full"
                  : "bg-green-500 rounded-r-full rounded-t-full"
              }   px-5 py-1.5 max-w-xs `}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>
      <p className="text-red-600 text-sm m-1">{error}</p>
      <div className="flex justify-center rounded-lg border border-blue-500">
        <input
          type="text"
          ref={inputRef}
          typeof="text"
          minLength={1}
          maxLength={1000}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          // disabled={!peerJoined}
          placeholder="Write message here"
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
          className="p-2 h-10 w-full outline-none bg-transparent resize-none overflow-hidden"
        />
        <button
          disabled={messages.length === 0}
          onClick={handleSendMessage}
          className="mr-3 text-xl cursor-pointer"
        >
          <IoSendOutline />
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
