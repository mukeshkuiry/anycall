"use client";
import { RandomID } from "../utils/randomId";
import React, {
  FC,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useWebRTC } from "./WebRTC";
import socketUrl from "../utils/socketURL";

interface SocketProviderProps {
  children: ReactNode;
}

interface ISocketContext {
  socket: WebSocket | null;
  sendMessage: (msg: string) => boolean;
  handleConnection: () => void;
  joined: boolean;
  setJoined: React.Dispatch<React.SetStateAction<boolean>>;
  messages: IMessage[];
  setMessages: React.Dispatch<React.SetStateAction<IMessage[]>>;
  randomId: string;
  peerJoined: boolean;
  setPeerJoined: React.Dispatch<React.SetStateAction<boolean>>;
  remoteAudio: boolean;
  remoteVideo: boolean;
}

const defaultSocketContext: ISocketContext = {
  socket: null,
  sendMessage: () => false,
  handleConnection: () => {},
  joined: false,
  setJoined: () => {},
  messages: [],
  setMessages: () => {},
  randomId: "",
  peerJoined: false,
  setPeerJoined: () => {},
  remoteAudio: true,
  remoteVideo: true,
};

const SocketContext = createContext<ISocketContext>(defaultSocketContext);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider: FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [randomId, setRandomId] = useState<string>(
    defaultSocketContext.randomId
  );
  const [joined, setJoined] = useState<boolean>(defaultSocketContext.joined);
  const [messages, setMessages] = useState<IMessage[]>(
    defaultSocketContext.messages
  );
  const [peerJoined, setPeerJoined] = useState<boolean>(false);
  const [iCanSendOffer, setICanSendOffer] = useState<boolean>(false);
  const [remoteAudio, setRemoteAudio] = useState<boolean>(true);
  const [remoteVideo, setRemoteVideo] = useState<boolean>(true);

  const {
    peer,
    setPeer,
    createOffer,
    createAnswer,
    setRemoteDescription,
  } = useWebRTC();

  const handleConnection = useCallback(() => {
    try {
      const newSocket = new WebSocket(socketUrl);
      newSocket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      newSocket.onopen = () => {
        setSocket(newSocket);
        setRandomId(RandomID());
      };
    } catch (error) {
      console.error("Error initializing WebSocket:", error);
    }
  }, []);

  const sendMessage = useCallback(
    (msg: string) => {
      if (socket) {
        const _msg: IMessage = {
          type: "message",
          senderId: randomId,
          content: msg,
        };
        socket.send(JSON.stringify(_msg));
        return true;
      }
      console.error("Socket not initialized");
      return false;
    },
    [randomId, socket]
  );

  const handleReceiveAnswer = useCallback(
    async (answer: RTCSessionDescriptionInit) => {
      // console.log("Received answer:", answer);
      await setRemoteDescription(answer);
    },
    [setRemoteDescription]
  );

  const handleCreateOffer = useCallback(async () => {
    if (socket) {
      const offer = await createOffer();
      // console.log("Offer:", offer);
      const msg: IMessage = {
        type: "offer",
        senderId: randomId,
        content: JSON.stringify(offer),
      };
      socket.send(JSON.stringify(msg));
    }
  }, [createOffer, randomId, socket]);

  useEffect(() => {
    if (peer) {
      peer.onnegotiationneeded = () => {
        // console.log("Negotiation needed");
        if (iCanSendOffer && peer.connectionState !== "connected") {
          handleCreateOffer();
        }
      };
    }

    return () => {
      if (peer) {
        peer.onnegotiationneeded = null;
      }
    };
  }, [handleCreateOffer, iCanSendOffer, peer, socket]);

  const handleReceiveOffer = useCallback(
    async (offer: RTCSessionDescriptionInit) => {
      // console.log("Received offer:", offer);
      const answer = await createAnswer(offer);
      // console.log("Answer:", answer);
      const msg: IMessage = {
        type: "answer",
        senderId: randomId,
        content: JSON.stringify(answer),
      };
      if (socket) socket.send(JSON.stringify(msg));
    },
    [createAnswer, randomId, socket]
  );

  const handleCloseConnection = useCallback(() => {
    if (socket && peer) {
      socket.close();
      setSocket(null);
      peer.close();
      setPeer(null);
      window.location.reload();
      // console.log("Connection closed");
    }
  }, [socket, peer, setPeer]);

  const handleMessages = useCallback(
    async (event: MessageEvent) => {
      try {
        if (socket) {
          const data: IMessage = JSON.parse(event.data);
          console.log("Received message:", data);
          switch (data.type) {
            case "message":
              setMessages((prev) => [...prev, data]);
              break;
            case "join":
              setPeerJoined(true);
              break;
            case "send offer":
              setICanSendOffer(true);
              handleCreateOffer();
              break;
            case "offer":
              handleReceiveOffer(JSON.parse(data.content));
              break;
            case "answer":
              handleReceiveAnswer(JSON.parse(data.content));
              break;
            case "leave":
              if (peer) peer.close();
              setJoined(false);
              setPeerJoined(false);
              setICanSendOffer(false);
              setMessages([]);
              handleCloseConnection();
              break;
            case "video pause":
              setRemoteVideo(false);
              break;
            case "video resume":
              setRemoteVideo(true);
              break;
            case "audio pause":
              setRemoteAudio(false);
              break;
            case "audio resume":
              setRemoteAudio(true);
              break;
            default:
              break;
          }
        }
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    },
    [
      handleCloseConnection,
      handleCreateOffer,
      handleReceiveAnswer,
      handleReceiveOffer,
      peer,
      socket,
    ]
  );

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        handleMessages(event);
      };
    }
  }, [handleMessages, socket, socket?.onmessage]);

  useEffect(() => {
    if (socket) {
      socket.onclose = () => {
        console.log("Socket closed");
      };
      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    }
  }, [socket]);

  const value: ISocketContext = {
    socket,
    sendMessage,
    handleConnection,
    joined,
    setJoined,
    messages,
    setMessages,
    randomId,
    peerJoined,
    setPeerJoined,
    remoteAudio,
    remoteVideo,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
