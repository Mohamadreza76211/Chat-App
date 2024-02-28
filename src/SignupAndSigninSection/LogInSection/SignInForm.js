import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Link,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";
import "./SignInForm.scss";

const SignInForm = ({ onSignIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [rememberMe, setRememberMe] = useState(false); // Added state for Remember Me

  // Load username and password from local storage if Remember Me is checked
  useEffect(() => {
    const storedRememberMe = localStorage.getItem("rememberMe");

    if (storedRememberMe === "true") {
      const storedUsername = localStorage.getItem("username") || ""; // اضافه کردن یک پیشفرض خالی برای مقادیر null
      const storedPassword = localStorage.getItem("password") || ""; // اضافه کردن یک پیشفرض خالی برای مقادیر null

      setUsername(storedUsername);
      setPassword(storedPassword);
      setRememberMe(true);
    } else {
      setUsername("");
      setPassword("");
    }
  }, []);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  // Save username, password, and Remember Me status to local storage when submitting the form
  const onSubmit = () => {
    if (rememberMe) {
      localStorage.setItem("rememberMe", rememberMe);
      localStorage.setItem("username", username);
      localStorage.setItem("password", password);
    } else {
      localStorage.removeItem("rememberMe");
      localStorage.removeItem("username");
      localStorage.removeItem("password");
    }

    handleSignInClick();
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleSignInClick = () => {
    const userList = JSON.parse(localStorage.getItem("users")) || [];
    const user = userList.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      setIsLoggedIn(true);
      onSignIn(username);
    } else {
      // Displaying error messages if any
      alert("Invalid username or password");
    }
  };

  return (
    <Box
      className="FormContainer"
      component="div"
      style={{
        maxWidth: "500px",
        margin: "auto",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        backgroundColor: "white",
      }}
    >
      <Typography variant="h5" component="div" style={{ mb: 2 }}>
        Login Form
      </Typography>
      <TextField
        fullWidth
        // className="InputForUserName"
        label="Username"
        {...register("username", {
          required: "Username is required",
          minLength: {
            value: 3,
            message: "Username must be at least 3 characters",
          },
        })}
        error={Boolean(errors.username)}
        helperText={errors.username?.message}
        margin="normal"
        value={username}
        onChange={handleUsernameChange}
        placeholder="Please enter your username"
      />
      <TextField
        fullWidth
        // className="InputForPassword"
        type="password"
        label="Password"
        {...register("password", {
          required: "Password is required",
          minLength: {
            value: 6,
            message: "Password must be at least 6 characters",
          },
        })}
        error={Boolean(errors.password)}
        helperText={errors.password?.message}
        margin="normal"
        style={{ mt: 2 }}
        value={password}
        onChange={handlePasswordChange}
        placeholder="Please enter your password"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={rememberMe}
            onChange={handleRememberMeChange}
            color="primary"
          />
        }
        label="Remember Me"
        style={{ mt: 1, textAlign: "left" }}
      />

      <Box className="DataContainer" component="div">
        <Button
          className="SigninButton"
          variant="contained"
          color="primary"
          onClick={handleSubmit(onSubmit)} // Using handleSubmit here
        >
          Sign In
        </Button>
        <Box style={{ mt: 2, textAlign: "center" }}>
          {/* <Link href="#" variant="body2">
              Forgot Password?
            </Link> */}{" "}
          {/** make a form for this section **/}
          <Box>
            <Link href="/SignUpForm" variant="body2">
              Don't have an account? Sign Up
            </Link>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SignInForm;
