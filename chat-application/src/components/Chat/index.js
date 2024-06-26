import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import ChatBody from "../ChatBody";
import ChatFooter from "../ChatFooter";
import axios from "axios";
import "./chat.css";
import { FaUserCircle } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";

import profile from "../assets/profile.png";

const Chat = ({ user }) => {
  const [socket, setSocket] = useState(null);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const lastMessageRef = useRef(null);
  const [avatarImage, setAvatarImage] = useState(profile);
  const fileUploadRef = useRef(null);

  useEffect(() => {
    const newSocket = io(`${process.env.SERVER_URL_PRODUCTION}`,{ transports: ["websocket"] });
    setSocket(newSocket);

    newSocket.emit("addUser", { userId: user.id, userName: user.userName });

    newSocket.on("getUsers", async (users) => {
      const otherUsers = users.filter((usr) => usr.userId !== user.id);

      const userWithImages = await Promise.all(otherUsers.map(async (usr) => {
        try {
          const response = await axios.get(`${process.env.SERVER_URL_PRODUCTION}/user-image/${usr.userId}`);
          return { ...usr, imageUrl: response.data.imageUrl };
        } catch (error) {
          console.error(`Error fetching image for user ${usr.userId}:`, error);
          return { ...usr, imageUrl: null };
        }
      }));
      setUsers(userWithImages);
    });

    newSocket.on("getMessage", (message) => {
      if (
        (message.sender === user.id &&
          message.receiver === selectedUser?.userId) ||
        (message.receiver === user.id &&
          message.sender === selectedUser?.userId)
      ) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });

    return () => newSocket.close();
  }, [user, selectedUser]);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const fetchMessages = async (selectedUser) => {
    try {
      const response = await axios.get(`${process.env.SERVER_URL_PRODUCTION}/messages`, {
        params: {
          senderId: user.id,
          receiverId: selectedUser.userId,
        },
      });
      // console.log(response.data, "response data====>")
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleUserSelect = (usr) => {
    setSelectedUser(usr);
    fetchMessages(usr);
  };

  const handleImageUpload = (event) => {
    event.preventDefault();
    fileUploadRef.current.click();
  };

  const UploadImageDisplay = async () => {
    try {
      const uploadedFile = fileUploadRef.current.files[0];
      console.log(uploadedFile, "uploaded file===>");
      const formData = new FormData();
      formData.append("file", uploadedFile);
      formData.append("userId", user.id);

      console.log(formData, "form data===>");

      const response = await fetch(`${process.env.SERVER_URL_PRODUCTION}/upload`, {
        method: "POST",
        body: formData,
      });

      // console.log(response.data, "response data===>");

      if (response.status === 201) {
        const data = await response.json();
        setAvatarImage(data?.location);
      }
    } catch (error) {
      console.error(error);
      setAvatarImage(profile);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>
          Welcome, <span>{user.userName}</span>
        </h2>
        <p className="profile-image">
          <img
            src={avatarImage}
            alt="avatar"
            className="avatar-image"
          ></img>
          <form
            id="form"
            encType="multipart/form-data"
          >
            <button
              type="submit"
              className="profile-btn"
              onClick={handleImageUpload}
            >
              <FaPlus />
            </button>
            <input
              type="file"
              id="file"
              ref={fileUploadRef}
              onChange={UploadImageDisplay}
              hidden
            ></input>
          </form>
        </p>
      </div>
      <div className="chat-body">
        <div className="chat-users-container">
          <h3>My Chats</h3>
          <ul>
            {users.map((usr) => (
              <li
                key={usr.userId}
                onClick={() => handleUserSelect(usr)}
                className={
                  selectedUser?.userId === usr.userId ? "selected-user" : ""
                }
              >
                <div className="users-list">
                  <div>
                    {usr.imageUrl ? (
                      <img src={usr.imageUrl} alt="User Avatar" className="user-avatar" />
                    ) : (
                      <FaUserCircle className="user-icon" />
                    )}
                  </div>
                  <div>
                    <p className="user-heading">{usr.userName}</p>
                    <p className="user-last-msg"></p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="chat-body-container">
          <div className="chat-body-messages">
            <ChatBody
              messages={messages}
              user={user}
              senderId={user.id}
              lastMessageRef={lastMessageRef}
            />
          </div>
          <div className="chat-body-footer">
            {selectedUser && (
              <ChatFooter
                socket={socket}
                user={user}
                receiverId={selectedUser.userId}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
