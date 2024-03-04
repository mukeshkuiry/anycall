interface IMessage {
  type: "message" | "join" | "leave" | "offer" | "answer" | "send offer";
  senderId: string;
  content: string;
}
