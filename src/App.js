//import { useState } from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import "./App.css";
import Chat from "./Chat";
import Login from "./Login";
import Sidebar from "./Sidebar";
import { useStateValue } from "./StateProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [{ user }, dispatch] = useStateValue();

  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} pauseOnHover />
      <div className="app">
        {!user ? (
          <Login />
        ) : (
          <div className="app__body">
            <Router>
              {/* Side Bar */}
              <Sidebar />
              <Switch>
                <Route path="/rooms/:roomId">
                  {/* Char box */}

                  <Chat />
                </Route>
                <Route path="/">
                  {/* Char box */}
                  <Chat />
                </Route>
              </Switch>
            </Router>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
