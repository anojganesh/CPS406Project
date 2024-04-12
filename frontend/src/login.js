import React from "react";
import { useNavigate } from "react-router-dom";
import './styles/login.css';

const Home = (props) => {
  const { loggedIn, email } = props;
  const navigate = useNavigate();

  const onButtonClick = () => {
    // You'll update this function later
  };

  return (
    <div className="mainContainer">
        <div className="subContainer">
            <div className={"titleContainer"}>
                <h2>Club Log In</h2>
            </div>
            <div className={"buttonContainer"}>
                <input
                className={"inputText username"}
                type="text"
                onClick={onButtonClick}
                placeholder="Username"
                />
                <input
                className={"inputText password"}
                type="text"
                onClick={onButtonClick}
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
