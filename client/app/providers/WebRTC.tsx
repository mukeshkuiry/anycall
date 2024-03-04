"use client";
import React, { FC, useCallback, useEffect, useMemo } from "react";
import { RTCPeerConn } from "./RTCPeerConn";

type Props = {
  children: React.ReactNode;
};

interface IWebRTCContext {
  peer: RTCPeerConnection | null;
  createOffer: () => Promise<RTCSessionDescriptionInit | undefined>;
  createAnswer: (
    offer: RTCSessionDescriptionInit
  ) => Promise<RTCSessionDescriptionInit | undefined>;
  setRemoteDescription: (answer: RTCSessionDescriptionInit) => Promise<void>;
  sendTracks: (stream: MediaStream) => Promise<void>;
  remoteStream: MediaStream | null;
}

const defaultWebRTCContext: IWebRTCContext = {
  peer: null,
  createOffer: async () => {
    return undefined;
  },
  createAnswer: async () => {
    return undefined;
  },
  setRemoteDescription: async () => {
    return;
  },
  sendTracks: async () => {
    return;
  },
  remoteStream: null,
};

const WebRTCContext = React.createContext(defaultWebRTCContext);

export const useWebRTC = () => {
  return React.useContext(WebRTCContext);
};

export const WebRTCProvider: FC<Props> = ({ children }: Props) => {
  const [remoteStream, setRemoteStream] = React.useState<MediaStream | null>(
    null
  );
  const [peer, SetPeer] = React.useState<RTCPeerConnection | null>(null);

  useEffect(() => {
    const peer = RTCPeerConn();
    SetPeer(peer);
    return () => {
      peer.close();
    };
  }, []);

  const createOffer = useCallback(async () => {
    try {
      if (peer) {
        const offer = await peer.createOffer();
        console.log("Offer created:" + offer);
        await peer.setLocalDescription(offer);
        return offer;
      }
    } catch (error) {
      console.error("Error creating offer: " + error);
    }
  }, [peer]);

  const createAnswer = async (offer: RTCSessionDescriptionInit) => {
    try {
      if (peer) {
        await peer.setRemoteDescription(offer);
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        return answer;
      }
    } catch (error) {
      console.error("Error creating answer: " + error);
    }
  };

  const setRemoteDescription = async (answer: RTCSessionDescriptionInit) => {
    try {
      if (peer) {
        await peer.setRemoteDescription(answer);
      }
    } catch (error) {
      console.error("Error setting remote description: " + error);
    }
  };

  const sendTracks = async (stream: MediaStream) => {
    stream.getTracks().forEach((track) => {
      peer?.addTrack(track, stream);
    });
  };

  const handleTrackEvent = (event: RTCTrackEvent) => {
    console.log("Track received:", event);
    setRemoteStream(event.streams[0]);
  };

  useEffect(() => {
    peer?.addEventListener("track", handleTrackEvent);

    return () => {
      peer?.removeEventListener("track", handleTrackEvent);
    };
  }, [peer]);

  const value: IWebRTCContext = {
    peer,
    createOffer,
    createAnswer,
    setRemoteDescription,
    sendTracks,
    remoteStream,
  };
  return (
    <WebRTCContext.Provider value={value}>{children}</WebRTCContext.Provider>
  );
};
