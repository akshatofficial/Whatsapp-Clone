import { Button } from "@material-ui/core";
import React from "react";
import { toast } from "react-toastify";
import { auth, provider } from "./firebase";
import "./Login.css";
import { actionTypes } from "./Reducer";
import { useStateValue } from "./StateProvider";

const Login = () => {
  const [{}, dispatch] = useStateValue();

  const handleSignIn = () => {
    auth
      .signInWithPopup(provider)
      .then((res) => {
        console.log(res);
        dispatch({
          type: actionTypes.SET_USER,
          user: res.user,
        });
      })
      .catch((err) => {
        toast.error(`${err.message}`, {
          position: "top-right",
          autoClose: 2000,
          pauseOnHover: true,
        });
      });
  };
  return (
    <div className="login">
      <div className="login__container">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/897px-WhatsApp.svg.png"
          alt="WhatsChapp"
        />
        <div className="login__text">
          <h3>Sign in to WhatsChapp</h3>
        </div>
        <Button variant="contained" onClick={handleSignIn}>
          Sign in with <div className="google">Google</div>
        </Button>
      </div>
    </div>
  );
};

export default Login;
