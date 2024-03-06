let socketUrl: string;

if (process.env.NODE_ENV === "production") {
  socketUrl = "wss://anycall.onrender.com/peer";
} else if (process.env.NODE_ENV === "development") {
  socketUrl = "ws://localhost:8000/peer";
} else {
  socketUrl = "wss://anycall.onrender.com/peer";
}

export default socketUrl;
