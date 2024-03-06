import React, { useEffect, useRef, useState } from "react";
import { SocketProvider, useSocket } from "../providers/Socket";

type Props = {};

const ChatBox = (props: Props) => {
  const [message, setMessage] = useState<string>("");

  const chatBoxRef = useRef<HTMLDivElement>(null);

  const { messages, randomId, sendMessage, peerJoined } = useSocket();

  // Function to scroll the chat box to the bottom
  const scrollToBottom = () => {
    if (chatBoxRef.current) {
      (chatBoxRef.current as HTMLDivElement).scrollTop = (
        chatBoxRef.current as HTMLDivElement
      ).scrollHeight;
    }
  };

  const handleSendMessage = () => {
    if (!message.trim()) {
      console.log("Please enter a message.");
      return;
    }

    const sent = sendMessage(message);
    if (sent) {
      setMessage(""); // Clear input field after sending
    } else {
      console.log("Message not sent");
    }
  };

  useEffect(() => {
    // Scroll to bottom when component mounts or chat messages change
    scrollToBottom();
  }, [messages]); // Include any dependency that triggers new messages

  return (
    <div className="flex flex-col w-2/3  backdrop-blur-sm bg-[#ffffff10] p-4 ml-8 rounded-xl">
      <div className="flex-grow overflow-y-auto p-8 " ref={chatBoxRef}>
        <div>
          {!peerJoined ? (
            <h1 className="text-xl text-yellow-500 text-center">
              Waiting for any stranger to join...
            </h1>
          ) : (
            <h1 className="text-xl text-yellow-500 text-center">
              Someone joined, you can start chatting...
            </h1>
          )}
        </div>

        {messages.map((msg, index) => (
          <>
            {
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
                      ? "bg-blue-500 rounded-l-full rounded-t-full"
                      : "bg-green-500 rounded-r-full rounded-t-full"
                  } text-white  px-6 p-3 max-w-xs text-xl`}
                >
                  {msg.content}
                </div>
                {/* <div className="bg-white rounded-full h-12 w-12 flex justify-normal items-center">
                  {"male" === "male" ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="50"
                      height="40"
                      fillRule="evenodd"
                      clipRule="evenodd"
                      imageRendering="optimizeQuality"
                      shapeRendering="geometricPrecision"
                      textRendering="geometricPrecision"
                      viewBox="0 0 100000 100000"
                      id="male"
                    >
                      <path d="M34496 28751c380,4315 1339,9091 1968,11784 -1400,-1230 -7265,-7087 -6968,-1908 364,6314 5605,7266 5618,7269l877 186 0 892c0,19 -122,6539 5360,9528 2742,1496 5697,2245 8650,2245 2952,0 5905,-749 8647,-2245 5483,-2989 5361,-9509 5361,-9528l0 -892 875 -186c15,-3 5256,-955 5620,-7269 289,-5049 -5341,454 -6789,1681 484,-2520 1309,-6862 1702,-10922 -273,-938 -615,-1701 -1037,-2091 -1786,-1646 -7472,2304 -10258,-877 -2786,-3182 -3122,-3729 -6578,-3291 -3455,440 -113,4388 -5240,3620 -4919,-735 -6601,-100 -7690,1789l-118 215zm-2149 5774c-469,-1149 -824,-2669 -634,-4487 445,-4278 -3011,-7241 1449,-12396 4460,-5155 3123,-6910 7471,-7021 4346,-109 8137,-3182 11704,-988 3569,2193 6022,-986 8584,3731 2566,4716 4907,1536 6133,6033 1226,4498 2899,4937 1673,8667 -712,2165 -1349,4921 -1758,6852 2506,-1534 6110,-2673 5737,3830 -362,6310 -4672,8443 -6525,9072 -172,2119 -1140,7706 -6481,10619 -305,166 -611,323 -921,473 2577,625 6056,-133 9296,2270 4280,3178 3865,8565 3865,8565 0,0 6217,-829 9254,5247 3039,6077 691,13673 691,13673 -38509,3320 -25261,3320 -63770,0 0,0 -2348,-7596 689,-13673 3039,-6076 9256,-5247 9256,-5247 0,0 -415,-5387 3865,-8565 3240,-2403 6717,-1645 9296,-2270 -310,-150 -617,-307 -923,-473 -5339,-2913 -6307,-8500 -6479,-10619 -1853,-629 -6163,-2762 -6525,-9072 -341,-5930 2628,-5505 5053,-4221zm24104 25347c-163,2485 -393,6423 -393,7938 0,2348 1935,553 4972,2348 9526,5629 -31585,5629 -22060,0 3037,-1795 4972,0 4972,-2348 0,-1515 -230,-5452 -393,-7938 2108,724 4280,1085 6452,1085 2171,0 4343,-362 6450,-1085z"></path>
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 80 80"
                      height={40}
                      width={50}
                      id="female"
                    >
                      <path d="M15.902 56.122a15.597 15.597 0 0 0-.982 5.464v8.108A5.313 5.313 0 0 0 20.227 75h39.546a5.313 5.313 0 0 0 5.307-5.306v-8.092c0-.52-.026-1.047-.078-1.568-.442-4.445-2.901-8.416-6.746-10.894a15.778 15.778 0 0 0-8.497-2.533c-.207-.293-.607-1.166-.533-3.27.247-.297.491-.614.732-.952h3.182c.575 0 1.123-.248 1.503-.68 4.777-5.44 4.453-13.925 3.834-18.5-.081-.6-.145-1.2-.21-1.8a71.05 71.05 0 0 0-.186-1.637C57.006 11.35 49.227 5 39.985 5c-9.24 0-17.02 6.349-18.096 14.769a84.075 84.075 0 0 0-.185 1.63c-.064.603-.128 1.205-.209 1.806-.62 4.574-.945 13.059 3.833 18.5.38.432.928.68 1.503.68h3.195a15.24 15.24 0 0 0 1.19 1.468c-.002 1.536-.272 2.296-.454 2.626-6.491-.23-12.57 3.505-14.86 9.643zm11.955-17.737h-.067c-3.271-4.488-2.735-11.66-2.331-14.644.086-.639.154-1.278.223-1.918.054-.516.109-1.032.174-1.548C26.68 13.847 32.753 9 39.986 9c7.233 0 13.307 4.847 14.128 11.276.066.517.121 1.035.176 1.552.068.638.137 1.277.223 1.914.403 2.983.938 10.156-2.332 14.643h-.038c1.16-2.8 1.753-5.946 1.753-9.363v-4.65c0-1.904-1.603-5.184-12.394-5.772-3.42-.099-5.746-3.612-5.765-3.64a1.998 1.998 0 0 0-2.71-.641c-.96.573-1.882 1.348-2.742 2.306-2.696 3.003-4.181 7.075-4.181 11.463v.934c0 3.417.594 6.564 1.753 9.363zm2.247-9.363v-.934c0-3.4 1.122-6.523 3.158-8.791.153-.172.31-.334.466-.486 1.477 1.574 4.1 3.684 7.607 3.785 3.786.21 7.765 1.127 8.561 1.956v4.47c0 2.931-.5 5.601-1.485 7.936-3.08 7.294-7.855 6.79-8.11 6.758a1.986 1.986 0 0 0-.627.004c-.047.008-4.926.719-8.085-6.762-.985-2.335-1.485-5.005-1.485-7.936zm15.542 18.133c-.348.092-.697.172-1.042.288l-.248.084c-.53.18-.961.575-1.188 1.087l-2.952 6.69-2.951-6.69a2.003 2.003 0 0 0-1.239-1.103l-1.038-.32c-.067-.021-.135-.033-.202-.053.045-.148.088-.3.127-.462 1.827.884 3.467 1.053 4.453 1.053.259 0 .473-.012.634-.025.812.065 3.002.074 5.466-1.235.053.244.114.47.18.686zM33.805 51.01l.168.052 4.413 10.002a2.001 2.001 0 0 0 3.66 0l4.418-10.011a11.937 11.937 0 0 1 9.625 1.448c2.813 1.814 4.612 4.704 4.932 7.93.04.388.06.782.06 1.17v8.092c0 .708-.6 1.306-1.308 1.306H20.227c-.721 0-1.307-.586-1.307-1.306v-8.108c0-1.398.246-2.767.73-4.066 1.607-4.309 5.992-7.039 10.65-7.039 1.164 0 2.346.17 3.505.53z"></path>
                    </svg>
                  )}
                </div> */}
              </div>
            }
          </>
        ))}
      </div>
      <div className="flex justify-center p-4 gap-4">
        <button className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-xl">
          Rejoin
        </button>
        <input
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
          className="p-3 w-full rounded-lg border border-blue-500 outline-none text-xl"
        />
        <button
          disabled={messages.length === 0}
          onClick={handleSendMessage}
          className="ml-2 px-4 py-2 text-xl bg-blue-500 text-white rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
