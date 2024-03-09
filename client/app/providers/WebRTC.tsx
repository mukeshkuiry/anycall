"use client";
import React, { FC, useCallback, useEffect } from "react";
import { RTCPeerConn } from "./RTCPeerConn";

type Props = {
  children: React.ReactNode;
};

interface IWebRTCContext {
  peer: RTCPeerConnection | null;
  setPeer: (peer: RTCPeerConnection | null) => void;
  createOffer: () => Promise<RTCSessionDescriptionInit | undefined>;
  createAnswer: (
    offer: RTCSessionDescriptionInit
  ) => Promise<RTCSessionDescriptionInit | undefined>;
  setRemoteDescription: (answer: RTCSessionDescriptionInit) => Promise<void>;
  sendTracks: (stream: MediaStream) => Promise<void>;
  pauseVideoTracks: () => void;
  resumeVideoTracks: () => void;
  pauseAudioTracks: () => void;
  resumeAudioTracks: () => void;

  remoteStream: MediaStream | null;
}

const defaultWebRTCContext: IWebRTCContext = {
  peer: null,
  setPeer: () => {},
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
  pauseVideoTracks: () => {},
  resumeVideoTracks: () => {},
  pauseAudioTracks: () => {},
  resumeAudioTracks: () => {},
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

  useEffect(() => {
    if (peer) {
      peer.onconnectionstatechange = (event) => {
        if (peer.connectionState === "connected") {
          console.log("Connected");
        }
        if (peer.connectionState === "disconnected") {
          console.log("Disconnected");
        }
      };
    }
  }, [peer]);

  const createOffer = useCallback(async () => {
    try {
      if (peer) {
        const offer = await peer.createOffer();
        // console.log("Offer created:" + offer);
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

  const pauseVideoTracks = () => {
    peer?.getSenders().forEach((sender) => {
      if (sender.track?.kind === "video") {
        sender.track.enabled = false;
      }
    });
  };

  const resumeVideoTracks = () => {
    peer?.getSenders().forEach((sender) => {
      if (sender.track?.kind === "video") {
        sender.track.enabled = true;
      }
    });
  };

  const pauseAudioTracks = () => {
    peer?.getSenders().forEach((sender) => {
      if (sender.track?.kind === "audio") {
        sender.track.enabled = false;
      }
    });
  };

  const resumeAudioTracks = () => {
    peer?.getSenders().forEach((sender) => {
      if (sender.track?.kind === "audio") {
        sender.track.enabled = true;
      }
    });
  };

  const sendTracks = async (stream: MediaStream) => {
    stream.getTracks().forEach((track) => {
      peer?.addTrack(track, stream);
    });
  };

  const handleTrackEvent = (event: RTCTrackEvent) => {
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
    setPeer: SetPeer,
    createOffer,
    createAnswer,
    setRemoteDescription,
    sendTracks,
    pauseAudioTracks,
    resumeAudioTracks,
    pauseVideoTracks,
    resumeVideoTracks,
    remoteStream,
  };
  return (
    <WebRTCContext.Provider value={value}>{children}</WebRTCContext.Provider>
  );
};
