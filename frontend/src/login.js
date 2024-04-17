import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles/login.css";

const Login = (props) => {
  const { loggedIn, email } = props;
  const navigate = useNavigate();
  const onButtonClick = async () => {
    const username = document.getElementById("usernameInput").value;
    const password = document.getElementById("passwordInput").value;

    const data = {
      username: username,
      password: password,
    };

    try {
      const response = await fetch("http://localhost:5000/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username, password: password }),
      });
      const data = await response.json();
      if (data.valid) {
        if (data.isAdmin) {
          navigate("/admin", {
            state: { username: username, fullname: data.fullname },
          });
        } else {
          navigate("/member", {
            state: { username: username, fullname: data.fullname },
          });
        }
      } else {
        const loginfail = document.getElementById("loginfail");
        loginfail.style.display = "block";
      }
    } catch (error) {
      const loginfail = document.getElementById("loginfail");
      loginfail.style.display = "block";
      console.error("Error:", error);
    }
  };

  return (
    <div className="mainContainer">
      <div className="subContainer">
        <div className={"titleContainer"}>
          <h2>Club Log In</h2>
          <h4>Demo Accounts:</h4>
          <h5>Admin user: johndoe</h5>
          <h5>Password: password1</h5>
          <h5>Member user: bob36</h5>
          <h5>Password: bob123</h5>
        </div>

        <div className={"loginfail"} id="loginfail">
          <h4 className="loginfailtext">
            Incorrect username and/or password. Please try again.
          </h4>
        </div>

        <div className={"buttonContainer"}>
          <input
            className={"inputText username"}
            id="usernameInput"
            type="text"
            placeholder="Username"
          />
          <input
            className={"inputText password"}
            id="passwordInput"
            type="password"
            placeholder="Password"
          />
          <input
            className={"inputButton"}
            type="button"
            onClick={onButtonClick}
            value="Log In"
          />
          {loggedIn ? <div>Your email address is {email}</div> : <div />}
        </div>
      </div>
    </div>
  );
};

export default Login;
