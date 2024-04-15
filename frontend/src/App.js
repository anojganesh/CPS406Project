import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./home";
import Login from "./login";
import Member from "./member";
import Admin from "./admin/admin";
import "./styles/App.css";
import { useEffect, useState } from "react";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const defaultuser = "Jdoe36";
  const defaultName = "John Doe";
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Home
                email={email}
                loggedIn={loggedIn}
                setLoggedIn={setLoggedIn}
              />
            }
          />
          <Route
            path="/login"
            element={<Login setLoggedIn={setLoggedIn} setEmail={setEmail} />}
          />
          <Route
            path="/admin"
            element={<Admin username={defaultuser} fullname={defaultName} />}
          />
          <Route
            path="/member"
            element={<Member username={defaultuser} fullname={defaultName} />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
