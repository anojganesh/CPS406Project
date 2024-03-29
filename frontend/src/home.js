import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles/home.css";

const Home = (props) => {
  const { loggedIn, email } = props;
  const navigate = useNavigate();

  const onButtonClick = () => {
    navigate('/login') //take to login page on button click
  };

  return (
    <div className="mainContainer">
      <div className={"titleContainer"}>
        <h1 className="Title">Club Membership Portal</h1>
      </div>
      <br></br>
      <div className={"buttonContainer"}>
        <input
          className={"inputButton"}
          type="button"
          onClick={onButtonClick}
          value={loggedIn ? "Log out" : "Log in"}
        />
      </div>
    </div>
  );
};

export default Home;
