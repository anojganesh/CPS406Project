import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles/login.css";

const Home = (props) => {
  const { loggedIn, email } = props;
  const navigate = useNavigate();
  const onButtonClick = () => {
    const username = document.getElementById("usernameInput").value;
    const password = document.getElementById("passwordInput").value;

    //create data object
    const data = {
      username: username,
      password: password,
    };

    // Send the data to the backend using fetch or XMLHttpRequest
    fetch("http://localhost:3001", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.ok) {
          navigate("/member");
        } else {
          const loginfail = document.getElementById("loginfail");
          loginfail.style.display = "block";
        }
      })
      .catch((error) => {
        const loginfail = document.getElementById("loginfail");
        loginfail.style.display = "block";
        console.error("Error:", error);
      });
  };

  return (
    <div className="mainContainer">
      <div className="subContainer">
        <div className={"titleContainer"}>
          <h2>Club Log In</h2>
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
            type="text"
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

export default Home;
