// ChatBox.tsx
import { useEffect, useRef, useState } from "react";
import { useSocket } from "../providers/Socket";
import { useRouter } from "next/navigation";
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

  const router = useRouter();
  const handleNew = () => {
    window.location.reload();
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

  useEffect(() => {
    // Play notification sound when someone joins
    if (peerJoined) {
      notificationRef.current?.play();
    }
  }, [peerJoined]);

  return (
    <div className="flex flex-col h-full backdrop-blur-sm bg-[#ffffff10] p-4 ml-8 rounded-xl">
      <audio ref={notificationRef} src={"/notification.mp3"} />{" "}
      {/* Notification sound */}
      <div
        className="flex-grow overflow-y-auto p-8 custom-scrollbar"
        ref={chatBoxRef}
      >
        <div>
          {!peerJoined ? (
            <h1 className=" text-yellow-500 text-center">
              Waiting for any stranger to join...
            </h1>
          ) : (
            <h1 className=" text-yellow-500 text-center">
              Someone joined, you can start chatting...
            </h1>
          )}
        </div>

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
              } text-white  px-5 py-1.5 max-w-xs `}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center p-4 gap-4">
        <button
          onClick={handleNew}
          className="ml-2 px-4 py-2 bg-purple-500 text-white rounded-lg "
        >
          New
        </button>
        <input
          ref={inputRef}
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={!peerJoined}
          placeholder="Write message here"
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
          className="p-2 w-full rounded-lg border border-blue-500 outline-none"
        />
        <button
          disabled={messages.length === 0}
          onClick={handleSendMessage}
          className="ml-2 px-4 py-1  bg-purple-500 text-white rounded-lg"
        >
          Send
        </button>
      </div>
      {error && <div className="text-red-500 text-sm text-center">{error}</div>}
    </div>
  );
};

export default ChatBox;
