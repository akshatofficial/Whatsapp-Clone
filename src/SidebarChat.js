import { Avatar } from "@material-ui/core";
//import { AddCircle } from "@material-ui/icons";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "./firebase";
//import { db } from "./firebase";
import "./sidebarChat.css";

const SidebarChat = ({ roomName, roomId, seedForAvatar }) => {
  // const [seed, setSeed] = useState("");
  // useEffect(() => {
  //   setSeed(Math.floor(Math.random() * 1000));
  // }, []);

  // const createChat = () => {
  //   const chatRoom = prompt("Please Enter the Chat-Room name.");

  //   if (chatRoom) {
  //     db.collection("rooms").add({
  //       name: chatRoom,
  //     });
  //   }
  // };

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (roomId) {
      db.collection("rooms")
        .doc(roomId)
        .collection("messages")
        .orderBy("timestamp", "asc")
        .onSnapshot((snapshot) => {
          setMessages(snapshot.docs.map((doc) => doc.data()));
        });
    }
  }, [roomId]);

  return (
    <Link to={`/rooms/${roomId}`}>
      <div className="sidebarChat">
        <Avatar
          src={`https://avatars.dicebear.com/api/human/${seedForAvatar}.svg`}
        />
        <div className="sidebarChat__info">
          <h3>{roomName}</h3>
          {messages.length > 0 ? (
            <p>{messages[messages.length - 1].message}</p>
          ) : (
            <p>Start Conversation Please...</p>
          )}
        </div>
      </div>
    </Link>
  );
  // <div onClick={createChat} className="sidebarChat__createChat">
  //   <h3>Add new Chat</h3>
  //   <IconButton>
  //     <AddCircle/>
  //   </IconButton>
  // </div>
};

export default SidebarChat;
