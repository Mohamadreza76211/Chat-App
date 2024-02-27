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
import jsPDF from "jspdf";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [allUsersChecked, setAllUsersChecked] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showTitleForm, setShowTitleForm] = useState(false);
  const [userCheckboxCheckedList, setUserCheckboxCheckedList] = useState([]);

  const loadUsers = () => {
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    setUsers(storedUsers);
    setUserCheckboxCheckedList(storedUsers.map(() => false));
    setAllUsersChecked(false);
  };

  useEffect(() => {
    loadUsers(); // Load users on component mount
  }, []);

  const removeFromLocalStorage = (usernames) => {
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const updatedUsers = storedUsers.filter(
      (user) => !usernames.includes(user.username)
    );
    localStorage.setItem("users", JSON.stringify(updatedUsers));
  };

  const handleExportButtonClick = () => {
    if (!userCheckboxCheckedList.includes(true)) {
      alert("Please choose a username");
      return;
    }
    const doc = new jsPDF();
    doc.text("User List", 10, 10);
    let exportContent = "";
    users.forEach((user, index) => {
      if (userCheckboxCheckedList[index]) {
        exportContent += `${index + 1}. Username: ${user.username}\nPassword:${
          user.password
        }\nSignUp Date: ${user.signUpDate}\nTitlt:${user.title}\n\n`;
      }
    });

    doc.text(exportContent, 10, 20);

    setUserCheckboxCheckedList(userCheckboxCheckedList.map(() => false));
    setAllUsersChecked(false);
    doc.save("user_list.pdf");
  };

  const handleDeleteButtonClick = () => {
    const deletedUsernames = users
      .filter((user, index) => userCheckboxCheckedList[index])
      .map((user) => user.username);
    setAllUsersChecked(false);

    removeFromLocalStorage(deletedUsernames);

    const updatedUsers = users.filter(
      (user, index) => !userCheckboxCheckedList[index]
    );
    setUsers(updatedUsers);
    setUserCheckboxCheckedList(updatedUsers.map(() => false));
  };

  const handleCancelAddingUser = () => {
    setShowForm(false);
  };
  const handleCancelAddingTitle = () => {
    setShowTitleForm(false);
  };

  const handleAddButtonClick = () => {
    setShowForm(false);
    if (!newUser || !newPassword) {
      alert("Please enter your username and password");
      return;
    }
    const userExists = users.some((user) => user.username === newUser);
    if (userExists) {
      alert("Your User exists");
      return;
    }
    const newUserObject = {
      username: newUser,
      password: newPassword,
      signUpDate: new Date().toLocaleString(),
    };
    const updatedUsers = [...users, newUserObject];
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
  };

  const handleAddButtonClickForTitle = () => {
    setShowTitleForm(false);
    if (!newTitle) {
      alert("Please enter your Title");
      return;
    }

    const selectedUsers = users.filter(
      (user, index) => userCheckboxCheckedList[index]
    );

    if (selectedUsers.length === 0) {
      alert("Please select a user");
      return;
    }

    const updatedUsers = users.map((user) => {
      if (
        selectedUsers.some(
          (selectedUser) => selectedUser.username === user.username
        )
      ) {
        return { ...user, title: newTitle };
      }
      return user;
    });

    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
  };

  const handleAddUserButtonClick = () => {
    setShowForm(true);
  };
  const handleAddTitleButtonClick = () => {
    setShowTitleForm(true);
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
  const handleNewUserChange = (e) => {
    const value = e.target.value;
    if (/^[a-zA-Z]+$/.test(value) || value === "") {
      setNewUser(e.target.value);
    } else {
      alert("You can use only characters for username");
      // setNewUser(e.target.value);
      setNewUser(value);
      setNewUser("");
    }
  };
  const handleNewTitleChange = (e) => {
    const value = e.target.value;
    if (/^[a-zA-Z]+$/.test(value) || value === "") {
      setNewTitle(e.target.value);
    } else {
      alert("You can use only characters for username");
      // setNewUser(e.target.value);
      setNewTitle(value);
      setNewTitle("");
    }
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
            onClick={handleDeleteButtonClick}
          >
            Delete
          </Button>
          <Button
            variant="contained"
            style={{ color: "black", fontWeight: "bold" }}
            className="ExportButton"
            onClick={handleExportButtonClick}
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
                <span style={{ marginLeft: "5px", fontWeight: "bold" }}>
                  <span style={{ color: "blue" }}>Username:</span>{" "}
                  <span>{user.username}</span>
                </span>
                {/* این خط جدید را اضافه کرده و رشته Password: در خط جدید نوشته‌ام */}
                <span style={{ marginLeft: "5px", fontWeight: "bold" }}>
                  <span style={{ color: "blue" }}>Password:</span>{" "}
                  <span>{user.password}</span>
                </span>
              </div>
            ))}
          </div>
          <div>
            <Button
              onClick={handleAddTitleButtonClick}
              style={{
                display: "flex",
                paddingRight: "10px",
                color: "black",
                backgroundColor: "#61d1f0",
                fontWeight: "bold",
                marginLeft: "48px",
              }}
            >
              <span>TITLE</span>
            </Button>
            {users.map((user, index) => (
              <div
                key={index}
                style={{ display: "flex", alignItems: "center" }}
              >
                <Checkbox
                  style={{ marginLeft: "5px", visibility: "hidden" }}
                  checked={userCheckboxCheckedList[index]}
                  onChange={() => handleUserCheckboxChange(index)}
                />
                {/* نمایش عنوان در صورت وجود */}
                {user.title && (
                  <span
                    style={{
                      fontWeight: "bold",
                      backgroundColor: "#00ff73",
                      padding: "4px",
                      borderRadius: "4px",
                    }}
                  >{` ${user.title}`}</span>
                )}
              </div>
            ))}
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
              <Input
                id="newUserInput"
                value={newUser}
                onChange={handleNewUserChange}
                aria-describedby="newUserInput-helper-text"
                placeholder="Username"
              />
              <Input
                id="newPasswordInput"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                aria-describedby="newPasswordInput-helper-text"
                placeholder="Password"
              />
              <div style={{ display: "flex", marginTop: "20px" }}>
                {" "}
                {/* Container for buttons */}
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
                <Button
                  variant="contained"
                  color="primary"
                  className="CancelButton"
                  onClick={handleCancelAddingUser}
                >
                  <span style={{ fontSize: "12px", fontWeight: "bold" }}>
                    {" "}
                    Cancel{" "}
                  </span>
                </Button>
              </div>
              <FormHelperText id="newUserInput-helper-text">
                Enter the new user's name and password
              </FormHelperText>
            </FormControl>
          )}
          {showTitleForm && (
            <FormControl className="AddingUserSection">
              <Input
                id="newTitleInput"
                value={newTitle}
                onChange={handleNewTitleChange}
                aria-describedby="newUserInput-helper-text"
                placeholder="Please enter the title"
              />

              <div style={{ display: "flex", marginTop: "20px" }}>
                {" "}
                {/* Container for buttons */}
                <Button
                  variant="contained"
                  color="primary"
                  className="AddButton"
                  onClick={handleAddButtonClickForTitle}
                >
                  <span style={{ fontSize: "12px", fontWeight: "bold" }}>
                    {" "}
                    Add{" "}
                  </span>
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  className="CancelButton"
                  onClick={handleCancelAddingTitle}
                >
                  <span style={{ fontSize: "12px", fontWeight: "bold" }}>
                    {" "}
                    Cancel{" "}
                  </span>
                </Button>
              </div>
              <FormHelperText id="newUserInput-helper-text">
                Enter the new user's name and password
              </FormHelperText>
            </FormControl>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
