import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  IconButton,
  // Dialog,
  // DialogActions,
  // DialogContent,
  // DialogContentText,
  // DialogTitle,
  // Button,
  // TextField,
  Popover,
  Typography,
} from "@material-ui/core";
import {
  Chat,
  DonutLarge,
  MoreVert,
  SearchOutlined,
  AddCircle,
} from "@material-ui/icons";
import "./sidebar.css";
import SidebarChat from "./SidebarChat";
import { db } from "./firebase";
import { useStateValue } from "./StateProvider";
// import bcrypt from "bcryptjs";
import { toast } from "react-toastify";
import firebase from "firebase";
import { actionTypes } from "./Reducer";
import { useHistory } from 'react-router-dom';

const Sidebar = () => {
  const [roomsArray, setRoomsArray] = useState([]);
  const [{ user }, dispatch] = useStateValue();
  //const [open, setOpen] = useState(false);
  // const [newChatRoomName, setNewChatRoomName] = useState("");
  // const [newChatRoomPassword, setNewChatRoomPassword] = useState("");

  // const handleClickOpen = () => {
  //   setOpen(true);
  // };

  // const handleClose = () => {
  //   setOpen(false);
  // };
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  useEffect(() => {
    const func = db.collection("rooms").onSnapshot((snapshot) => {
      setRoomsArray(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
    });

    return () => {
      func();
    };
  }, []);

  const createChat = () => {
    // let newChatRoomPasswordHashed = null;
    // if (newChatRoomName === "") {
    //   toast.error("Enter Chat-Room name Please!", {
    //     position: "top-right",
    //     autoClose: 2000,
    //     pauseOnHover: true,
    //   });
    // } else if (newChatRoomPassword === "") {
    //   toast.error("Enter password Please!", {
    //     position: "top-right",
    //     autoClose: 2000,
    //     pauseOnHover: true,
    //   });
    // } else {
    //   newChatRoomPasswordHashed = bcrypt.hashSync(newChatRoomPassword, 10);
    //   const seedForAvatar = Math.floor(Math.random() * 1000);
    //   if (newChatRoomName && newChatRoomPasswordHashed) {
    //     db.collection("rooms").add({
    //       name: newChatRoomName,
    //       seedForAvatar,
    //       password: newChatRoomPasswordHashed,
    //     });
    //     setOpen(false);
    //     toast.success("Char Room Created Successfully!", {
    //       position: "top-right",
    //       autoClose: 2000,
    //       pauseOnHover: true,
    //     });
    //   }
    // }

    // setNewChatRoomPassword("");
    // setNewChatRoomName("");

    /************Normal************/
    const chatRoomName = prompt("Enter the name of Chat Room");
    const seedForAvatar = Math.floor(Math.random() * 1000);
    if (chatRoomName) {
      db.collection("rooms").add({
        name: chatRoomName,
        seedForAvatar,
        //password: newChatRoomPasswordHashed,
      });
    }
  };

  const history = useHistory();

  const logOut = () => {
    firebase.auth().signOut();
    dispatch({ type: actionTypes.UNSET_USER, user: null });
    history.push("/");
    //window.location.reload();
    toast.success("Logout Successfully!", {
      position: "top-right",
      autoClose: 2000,
      pauseOnHover: true,
    });
  };

  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <Avatar src={user?.photoURL} />
        <div className="sidebar__headerRight">
          <IconButton>
            <DonutLarge />
          </IconButton>
          <IconButton>
            <Chat />
          </IconButton>
          <IconButton onClick={handleClick}>
            <MoreVert />
          </IconButton>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            <Typography>
              <Button variant="contained" onClick={logOut}>Logout</Button>
            </Typography>
          </Popover>
        </div>
      </div>
      <div className="sidebar__search">
        <div className="sidebar__searchContainer">
          <IconButton>
            <SearchOutlined />
          </IconButton>

          <input placeholder="Search or create new chat." type="text" />
        </div>
      </div>
      <div className="createChat">
        <div className="sidebar__createChat">
          <h3>Add new Chat</h3>
          <IconButton>
            <AddCircle onClick={createChat} />
            {/* {open ? (
              <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="form-dialog-title"
              >
                <DialogTitle id="form-dialog-title">Add Chat Room</DialogTitle>
                <DialogContent>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Chat Room Name"
                    type="email"
                    fullWidth
                    value={newChatRoomName}
                    onChange={(e) => setNewChatRoomName(e.target.value)}
                  />
                  <TextField
                    margin="dense"
                    id="name"
                    label="Set Password"
                    type="password"
                    fullWidth
                    value={newChatRoomPassword}
                    onChange={(e) => setNewChatRoomPassword(e.target.value)}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose} color="primary">
                    Cancel
                  </Button>
                  <Button onClick={createChat} color="primary">
                    Create
                  </Button>
                </DialogActions>
              </Dialog>
            ) : null} */}
          </IconButton>
        </div>
      </div>

      <div className="sidebar__chats">
        {/* <SidebarChat addChat="tr" /> */}
        {roomsArray.map((room) => (
          <SidebarChat
            key={room.id}
            roomId={room.id}
            roomName={room.data.name}
            seedForAvatar={room.data.seedForAvatar}
          />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
