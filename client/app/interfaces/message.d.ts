interface IMessage {
  type:
    | "message"
    | "join"
    | "leave"
    | "offer"
    | "answer"
    | "send offer"
    | "video pause"
    | "video resume"
    | "audio pause"
    | "audio resume";
  senderId: string;
  content: string;
}
