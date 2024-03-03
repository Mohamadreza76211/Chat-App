import { useForm } from "react-hook-form";
import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Link,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";

const SignUpForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleUsernameChange = (e) => {
    const input = e.target.value;
    const onlyLetters = /^[A-Za-z]+$/;
    if (onlyLetters.test(input) || input === "") {
      setUsername(e.target.value);
    } else {
      alert("You can use only characters for username");
      setUsername(input);
      setUsername("");
    }
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

  const onSubmit = () => {
    handleLinkClick();
    window.location.href = "/ChatApp";
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

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
        SignUp Form
      </Typography>
      <TextField
        fullWidth
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
      <Box className="DataContainer" component="div">
        <Button
          className="SigninButton"
          variant="contained"
          color="primary"
          onClick={handleSubmit(onSubmit)} // Using handleSubmit here
        >
          SignUp
        </Button>
      </Box>
    </Box>
  );
};
export default SignUpForm;
