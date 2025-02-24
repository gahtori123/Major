import io from 'socket.io-client';

const socket = io(import.meta.env.VITE_BACKEND_URL, { withCredentials: true });

socket.on("connect", () => {
  console.log("Connected to server!");
});

socket.on("connect_error", (err) => {
  console.error("Connection error:", err.message);
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});

export default socket;