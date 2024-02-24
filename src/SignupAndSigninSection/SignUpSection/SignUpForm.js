import React, { useState } from "react";
import "./SignUpForm.scss";
import { Link } from "react-router-dom";

const SignUpForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLinkClick = () => {
    const signUpDate = new Date().toLocaleString(); // Get current date and time
    const newUser = {
      username: username,
      password: password,
      signUpDate: signUpDate,
    };
    const userList = JSON.parse(localStorage.getItem("users")) || [];
    {
      /** In this part at first we get users from localstorage
  then data with json format will change to array format. 
  "users" that we put in localstorage can be anything but it is better to be users because we are getting users name.**/
    }
    const updatedUserList = [...userList, newUser];
    localStorage.setItem("users", JSON.stringify(updatedUserList)); //Adding new user to the localstorage as a Json. with
    setUsername("");
    setPassword("");
  };

  return (
    <div className="FormContainer">
      <form>
        <div className="DataContainer">
          <label className="LabelForUserName" htmlFor="username">
            {" "}
            Username
          </label>
          <input
            className="InputForUserName"
            type="text"
            value={username}
            onChange={handleUsernameChange}
            placeholder="Please enter your username"
          />
        </div>

        <div className="DataContainer">
          <label className="LabelForPassword" htmlFor="password">
            {" "}
            Password
          </label>

          <input
            className="InputForPassword"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Please enter your password"
          />
        </div>

        <div className="SignupLink">
          <Link
            to="/ChatApp"
            style={{ color: "white", textDecoration: "none" }}
            onClick={handleLinkClick}
          >
            Signup
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;
