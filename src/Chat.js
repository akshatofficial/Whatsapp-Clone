import {
  Avatar,
  IconButton,
  // Dialog,
  // DialogActions,
  // DialogContent,
  // DialogContentText,
  // DialogTitle,
  // Button,
  // TextField,
} from "@material-ui/core";
import {
  AttachFile,
  InsertEmoticon,
  Mic,
  MoreVert,
  SearchOutlined,
} from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import "./Chat.css";
import { db } from "./firebase";
import { useStateValue } from "./StateProvider";
import firebase from "firebase";
import bcrypt from "bcryptjs";
import { toast } from "react-toastify";
import Picker from 'emoji-picker-react';

const Chat = () => {
  const [seed, setSeed] = useState("");
  const [input, setInput] = useState("");
  const { roomId } = useParams();
  const [roomName, setRoomName] = useState("");
  const [messages, setMessages] = useState([]);
  const [{ user }, dispatch] = useStateValue();
  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  // const [passwordForEntry, setPasswordForEntry] = useState("");
  // const [open, setOpen] = useState(false);

  // useEffect(() => {
  //   setOpen(true);
  // }, [roomId]);

  useEffect(() => {
    toast.success("Welcome! Now choose a Room to chat.", {
      position: "top-right",
      autoClose: 3000,
      pauseOnHover: true,
    });
  }, []);

  useEffect(() => {
    if (roomId) {
      db.collection("rooms")
        .doc(roomId)
        .onSnapshot((snapShot) => {
          setRoomName(snapShot.data().name);
          setSeed(snapShot.data().seedForAvatar);
        });

      db.collection("rooms")
        .doc(roomId)
        .collection("messages")
        .orderBy("timestamp", "asc")
        .onSnapshot((snapshot) => {
          setMessages(snapshot.docs.map((doc) => doc.data()));
        });
    }
  }, [roomId]);

  // useEffect(() => {
  //   setSeed(Math.floor(Math.random() * 1000));
  // }, []);

  // const handleClickOpen = () => {
  //   setOpen(true);
  // };

  // const handleClose = () => {
  //   setOpen(false);
  // };

  const sendMessage = (e) => {
    e.preventDefault();
    console.log("You have typed >>> ", input);

    db.collection("rooms").doc(roomId).collection("messages").add({
      name: user.displayName,
      message: input,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      email: user.email,
    });

    setInput("");
  };

  //   const randomColorGenerator = () => {
  //       let color;
  //       const randomColor = Math.floor(Math.random()*16777215).toString(16);
  //       color = "#" + randomColor;
  //       return color;
  //   }

  // const AuthenticatePasswordForEntry = () => {
  //   if (passwordForEntry === "") {
  //     toast.error("Enter password Please!", {
  //       position: "top-right",
  //       autoClose: 2000,
  //       pauseOnHover: true,
  //     });
  //   } else {
  //     let passwordFromDB = "";
  //     db.collection("rooms")
  //       .doc(roomId)
  //       .onSnapshot((snapshot) => {
  //         passwordFromDB = snapshot.data().password;
  //       });
  //       console.log(passwordFromDB);
  //     const checkPassword = bcrypt.compareSync(
  //       passwordForEntry,
  //       passwordFromDB
  //     );
  //     if (checkPassword) {
  //       setIsAuthenticated(true);
  //       toast.success(`Welcome to ${roomName} room!`, {
  //         position: "top-right",
  //         autoClose: 2000,
  //         pauseOnHover: true,
  //       });
  //       setOpen(false);
  //     }else{
  //       toast.error("Invalid Password!", {
  //         position: "top-right",
  //         autoClose: 2000,
  //         pauseOnHover: true,
  //       });
  //     }
  //   }
  //   setOpen(false);
  //   setPasswordForEntry("");
  // };

  const [chosenEmoji, setChosenEmoji] = useState(null);
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);

  const onEmojiClick = (event, emojiObject) => {
    setChosenEmoji(emojiObject);
    setInput((prevState) => prevState + emojiObject.emoji)
  };

  return (
    <div className="chat">
      <div className="chat__header">
        <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
        <div className="chat__headerInfo">
          <h3>{roomName}</h3>
          {messages.length > 0 ? (
            <p>
              Last seen at...{" "}
              {new Date(
                messages[messages.length - 1]?.timestamp?.toDate()
              ).toUTCString()}
            </p>
          ) : (
            <p>Start conversation Please...</p>
          )}
        </div>
        <div className="chat__headerRight">
          <IconButton>
            <SearchOutlined />
          </IconButton>
          <IconButton>
            <AttachFile />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </div>
      </div>
      <div className="chat__body">
        {messages.map((message) => (
          <p
            className={`chat__message ${
              message.email === user.email && "chat__reciever"
            }`}
          >
            <span className="chat__name">{message.name}</span>
            {message.message}
            <span className="chat__timeStamp">
              {new Date(message.timestamp?.toDate()).toUTCString()}
            </span>
          </p>
        ))}
      </div>
      <div className="chat__footer">
        {openEmojiPicker ? <Picker onEmojiClick={onEmojiClick} /> : null}
        <IconButton
          onClick={() => setOpenEmojiPicker((prevState) => !prevState)}
        >
          <InsertEmoticon />
        </IconButton>

        <form>
          <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" onClick={sendMessage}>
            Send
          </button>
        </form>
        <Mic />
      </div>
    </div>
  );
  // ) : (
  //   <Dialog
  //     open={open}
  //     onClose={handleClose}
  //     aria-labelledby="form-dialog-title"
  //   >
  //     <DialogTitle id="form-dialog-title">Enter Password</DialogTitle>
  //     <DialogContent>
  //       <TextField
  //         autoFocus
  //         margin="dense"
  //         id="password"
  //         label="Enter Password"
  //         type="password"
  //         fullWidth
  //         value={passwordForEntry}
  //         onChange={(e) => setPasswordForEntry(e.target.value)}
  //       />
  //     </DialogContent>
  //     <DialogActions>
  //       <Button onClick={AuthenticatePasswordForEntry} color="primary">
  //         Enter Chat Room
  //       </Button>
  //       <Button onClick={handleClose} color="primary">
  //         Cancel
  //       </Button>
  //     </DialogActions>
  //   </Dialog>
  // );
};

export default Chat;
