import React from "react";
import { useNavigate } from "react-router-dom";
import './styles/home.css';

const Home = (props) => {
  const { loggedIn, email } = props;
  const navigate = useNavigate();

  const onButtonClick = () => {
    // You'll update this function later
  };

  return (
    <div className="mainContainer" style={{ backgroundImage: "url(/background.jpg)"}}>
      <div className={"titleContainer"}>
        <h1 className="Title">Welcome!</h1>
      </div>
      <div className="Subtitle">This is the home page.</div>
      <div className={"buttonContainer"}>
        <input
          
          className={"inputButton"}
          type="button"
          onClick={onButtonClick}
          value={loggedIn ? "Log out" : "Log in"}
        />
        {loggedIn ? <div>Your email address is {email}</div> : <div />}
      </div>
    </div>
  );
};

export default Home;
