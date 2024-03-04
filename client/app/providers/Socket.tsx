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

  const {
    peer,
    createOffer,
    createAnswer,
    setRemoteDescription,
    remoteStream,
  } = useWebRTC();

  const handleConnection = useCallback(() => {
    try {
      const newSocket = new WebSocket("ws://localhost:8000/peer");
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
      console.log("Socket not initialized");
      return false;
    },
    [randomId, socket]
  );

  const handleReceiveAnswer = useCallback(
    async (answer: RTCSessionDescriptionInit) => {
      console.log("Received answer:", answer);
      await setRemoteDescription(answer);
    },
    [setRemoteDescription]
  );

  const handleCreateOffer = useCallback(async () => {
    if (socket) {
      const offer = await createOffer();
      console.log("Offer:", offer);
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
        console.log("Negotiation needed");
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
      console.log("Received offer:", offer);
      const answer = await createAnswer(offer);
      console.log("Answer:", answer);
      const msg: IMessage = {
        type: "answer",
        senderId: randomId,
        content: JSON.stringify(answer),
      };
      if (socket) socket.send(JSON.stringify(msg));
    },
    [createAnswer, randomId, socket]
  );

  const handleMessages = useCallback(
    async (event: MessageEvent) => {
      if (socket) {
        const data: IMessage = JSON.parse(event.data);
        console.log("Received message:", data);
        if (data.type === "message") setMessages((prev) => [...prev, data]);
        else if (data.type === "join") {
          setPeerJoined(true);
        } else if (data.type === "send offer") {
          setICanSendOffer(true);
          handleCreateOffer();
        } else if (data.type === "offer") {
          handleReceiveOffer(JSON.parse(data.content));
        } else if (data.type === "answer") {
          handleReceiveAnswer(JSON.parse(data.content));
        }
      }
    },
    [handleCreateOffer, handleReceiveAnswer, handleReceiveOffer, socket]
  );

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        handleMessages(event);
      };
    }
  }, [handleMessages, socket, socket?.onmessage]);

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
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
