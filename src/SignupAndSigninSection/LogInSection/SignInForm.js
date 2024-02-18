import React from "react";
import { useState } from "react";
import "./SignInForm.scss";

const SignInForm = ({ onSignIn }) => {
  const [username, setUsername] = useState(
    localStorage.getItem("username") || ""
  );
  const [password, setPassword] = useState(
    localStorage.getItem("password") || ""
  );
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };
  const handleSignInClick = () => {
    if (username.trim() !== "") {
      onSignIn(username); // ارسال نام کاربری به‌صورت مستقیم به تابع onSignIn
    }
  };
  //I used OnSignIn in handleSignInClick to send username to ChatApp. I put username in onSignIn as it's argument.

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
            placeholder="Please enter your password"
          />
        </div>

        <div className="DataContainer">
          <button
            className="SigninButton"
            type="button"
            onClick={handleSignInClick}
          >
            SignIn
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignInForm;
