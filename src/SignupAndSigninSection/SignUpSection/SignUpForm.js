import React, { useState } from "react";
import "./SignUpForm.scss";
import { Link } from "react-router-dom";

const SignUpForm = () => {
  const [username, setUsername] = useState(
    localStorage.getItem("username") !== null &&
      localStorage.getItem("username") !== undefined
      ? localStorage.getItem("username")
      : ""
  );
  const [password, setPassword] = useState(
    localStorage.getItem("password") || ""
  );

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSignupChange = (e) => {
    e.preventDefault();
    console.log("نام کاربری:", username);
    console.log("رمز عبور:", password);
    localStorage.setItem("username", username);
    localStorage.setItem("password", password);
    setUsername("");
    setPassword("");
  };

  return (
    <div className="FormContainer">
      <form onSubmit={handleSignupChange}>
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

        <div className="DataContainer">
          <Link to="/ChatApp" className="SignupButton" type="submit">
            Signup
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;
