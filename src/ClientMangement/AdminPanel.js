import React, { useState, useEffect } from "react";
import "./AdminPanel.scss";
import {
  Button,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputLabel,
  Input,
  FormHelperText,
} from "@material-ui/core";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState("");
  const [allUsersChecked, setAllUsersChecked] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [userCheckboxCheckedList, setUserCheckboxCheckedList] = useState([]);

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    setUsers(storedUsers);
    setUserCheckboxCheckedList(storedUsers.map(() => false));
    setAllUsersChecked(false);
  }, [users]);

  const handleAddButtonClick = () => {
    setShowForm(false);
    const updatedUsers = [
      ...users,
      { username: newUser, signUpDate: new Date().toLocaleString() }, // تغییر اینجا
    ];
    setUsers(updatedUsers);
  };

  const handleAddUserButtonClick = () => {
    setShowForm(true);
  };

  const handleUserCheckboxChange = (index) => {
    setUserCheckboxCheckedList((prevState) => {
      const newState = [...prevState];
      newState[index] = !prevState[index];
      return newState;
    });

    const allChecked = userCheckboxCheckedList.every((isChecked) => isChecked);
    setAllUsersChecked(allChecked);
  };

  const handleAllUsersCheckboxChange = (event) => {
    const isChecked = event.target.checked;
    setAllUsersChecked(isChecked);
    setUserCheckboxCheckedList((prevState) => prevState.map(() => isChecked));
  };

  return (
    <div style={{ width: "100%" }}>
      <div className="MainDivForAdminPanel">
        <Button
          variant="contained"
          color="primary"
          className="AddUserButton"
          onClick={handleAddUserButtonClick}
        >
          <span
            className="SpanForAddUser"
            style={{ fontSize: "12px", fontWeight: "bold", color: "black" }}
          >
            {" "}
            Add User{" "}
          </span>
        </Button>{" "}
        <div className="ContainerForButtons">
          <Button
            variant="contained"
            style={{ color: "black", fontWeight: "bold" }}
            className="DeleteButton"
          >
            Delete
          </Button>
          <Button
            variant="contained"
            style={{ color: "black", fontWeight: "bold" }}
            className="ExportButton"
          >
            Export
          </Button>
        </div>
      </div>
      <div className="FormContainerForAdminPanel">
        <div className="ButtonGroup">
          <div>
            <FormControlLabel
              variant="contained"
              style={{
                color: "black",
                fontWeight: "bold",
                backgroundColor: "#61d1f0",
                paddingRight: "10px",
                marginLeft: "40px",
                borderRadius: "6px",
                marginLeft: "10px",
                borderRadius: "4px",
              }}
              className="FormControlLabelForName"
              control={
                <Checkbox
                  checked={allUsersChecked}
                  onChange={handleAllUsersCheckboxChange}
                />
              }
              label="Name"
            />
            {users.map((user, index) => (
              <div
                key={index}
                style={{ display: "flex", alignItems: "center" }}
              >
                <Checkbox
                  style={{ marginLeft: "10px" }}
                  checked={userCheckboxCheckedList[index]}
                  onChange={() => handleUserCheckboxChange(index)}
                />
                <span style={{ marginLeft: "5px", fontWeight: "bold" }}>{`${
                  index + 1
                }. ${user.username}`}</span>
              </div>
            ))}
          </div>
          <div>
            <Button
              style={{
                color: "black",
                backgroundColor: "#61d1f0",
                fontWeight: "bold",
              }}
            >
              Title
            </Button>
          </div>
          <div>
            <div>
              <Button
                style={{
                  display: "flex",
                  paddingRight: "60px",
                  color: "black",
                  backgroundColor: "#61d1f0",
                  fontWeight: "bold",
                  // paddingLeft: "48px",
                  marginLeft: "48px",
                }}
              >
                <span>Date Modified</span>
              </Button>
            </div>
            {users.map((user, index) => (
              <div
                key={index}
                style={{ display: "flex", alignItems: "center" }}
              >
                <Checkbox
                  style={{ marginLeft: "10px", visibility: "hidden" }}
                />
                <span style={{ marginLeft: "5px", fontWeight: "bold" }}>
                  {user.signUpDate}
                </span>
              </div>
            ))}
          </div>

          {showForm && (
            <FormControl className="AddingUserSection">
              <InputLabel htmlFor="newUserInput"> New User </InputLabel>
              <Button
                variant="contained"
                color="primary"
                className="AddButton"
                onClick={handleAddButtonClick}
              >
                <span style={{ fontSize: "12px", fontWeight: "bold" }}>
                  {" "}
                  Add{" "}
                </span>
              </Button>
              <Input
                id="newUserInput"
                value={newUser}
                onChange={(e) => setNewUser(e.target.value)}
                aria-describedby="newUserInput-helper-text"
              />
              <FormHelperText id="newUserInput-helper-text">
                {" "}
                Enter the new user's name{" "}
              </FormHelperText>
            </FormControl>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
