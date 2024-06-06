// ChatFooter.js
import React, { useState } from "react";
import "./chatfooter.css"

const ChatFooter = ({ socket, user, receiverId}) => {
  const [message, setMessage] = useState("");
  // const [receiverId, setReceiverId] = useState("");

  const sendMessage = () => {
    if (message.trim() && socket) {
      socket.emit("sendMessage", { userId: user.id, userName: user.userName, receiverId, text: message });
      setMessage("");
    }
  };

  return (
    <div className="chat-footer-container">
      <div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
      />
      <button onClick={sendMessage}>Send</button>
      </div>

    </div>
  );
};

export default ChatFooter;




