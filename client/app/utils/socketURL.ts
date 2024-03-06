let socketUrl: string;

if (process.env.NODE_ENV === "production") {
  socketUrl = "wss://anycall.onrender.com/peer";
} else if (process.env.NODE_ENV === "development") {
  socketUrl = "wss://anycall.onrender.com/peer";
} else {
  socketUrl = "wss://anycall.onrender.com/peer";
}

export default socketUrl;
