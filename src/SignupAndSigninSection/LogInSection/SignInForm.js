import React, { useState } from "react";
import "./SignInForm.scss";

const SignInForm = ({ onSignIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSignInClick = () => {
    // اعتبارسنجی نام کاربری و رمز عبور
    const userList = JSON.parse(localStorage.getItem("users")) || [];
    const user = userList.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      // اگر اعتبارسنجی موفق بود، وضعیت ورود به سیستم را به true تغییر دهید
      setIsLoggedIn(true);
      // ورود به ChatApp با ارسال نام کاربری
      onSignIn(username);
    } else {
      // اگر اعتبارسنجی ناموفق بود، نمایش پیغام خطا
      alert("Invalid username or password");
    }
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
