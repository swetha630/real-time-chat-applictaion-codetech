import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000");

function Chat() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [username] = useState("User" + Math.floor(Math.random() * 1000));

  useEffect(() => {
    axios.get("http://localhost:5000/api/messages").then((res) => {
      setMessages(res.data);
    });

    socket.on("chatMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.disconnect();
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("chatMessage", { username, message });
      setMessage("");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Real-Time Chat</h2>
      <div style={{ maxHeight: "300px", overflowY: "scroll", border: "1px solid #ccc", padding: 10 }}>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.username}</strong>: {msg.message}
          </div>
        ))}
      </div>
      <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Enter message" />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default Chat;
