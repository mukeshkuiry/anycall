let socketUrl: string;

if (process.env.NODE_ENV === "production") {
  socketUrl = "ws://localhost:8000/peer";
} else if (process.env.NODE_ENV === "development") {
  socketUrl = "ws://localhost:8000/peer";
} else {
  socketUrl = "ws://localhost:8000/peer";
}

export default socketUrl;
