import React, { useState, useEffect } from "react";
import axios from "axios";
import ChatList from "./ChatList";
import ChatForm from "./ChatForm";
import io from "socket.io-client";
import SignInForm from "../SignupAndSigninSection/LogInSection/SignInForm";

const socket = io("http://localhost:3002");
const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState("");
  const [username, setUsername] = useState(""); //For getting username from SignInForm to put it in ChatForm to show it when the client
  //send some text or voice I did some steps:
  //1:declare useState for username in ChatApp
  //2:declare handleSignIn in ChatApp
  //3:pass the handleSignIn to SignInForm which the name is onSignIn
  //4:pass the username to ChatForm to use it there
  //5:declare useState for username in SignInForm
  //6:declare handleSignInClick and use handleSignIn and put username in onSignIn as it's argument
  //7:give handleSignInClick to the onclick of SigninButton
  //8:use the username which I pass it from ChatApp in user like this:   user:username
  //I have to declare this useState to use username wich I want to show in ChatForm.

  //I used callback function to get username from SignInForm.
  const handleSignIn = (username) => {
    setUsername(username);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3002/messages");
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchData();
    //request for fecthing data
    socket.on("message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });
    //socket.on is used to listen for the "message" event,
    // and whenever a new message is received from the server, it is added to the list of messages.
    return () => {
      socket.off("message");
    };
    //In the return section, socket.off is used to prevent listening to the "message" event beyond what is necessary (cleanup).
  }, []);
  //--------------------------------USeEffectSection------------------------------//
  // const addMessage = (text, blobURL) => {
  //   setIsTyping(false);
  //   setTypingUser("");

  //   axios
  //     .post("http://localhost:3002/messages", {
  //       text,
  //       user: "Mohammad",
  //       blob: blobURL,
  //     })
  //     .then((response) => {
  //       setMessages((prevMessages) => [...prevMessages, response.data]);
  //       setNewMessage("");
  //     })
  //     .catch((error) => {
  //       console.error("Error adding message:", error);
  //     });

  //   socket.emit("message", { text, user: "Mohammad", blob: blobURL });

  //   //I used socket.emit to send the new message to the server to inform other users.
  // };
  // addMessage: This function is used to add a new message to the server and the list of messages.
  //-----------------------------addMessageSection-----------------------------------//
  return (
    <div>
      {/* {username ? (
        <p>Welcome, {username}!</p>
      ) : (
        <SignInForm onSignIn={handleSignIn} />
      )} */}
      <ChatList
        messages={messages}
        isTyping={isTyping}
        typingUser={typingUser}
      />
      {!username ? (
        <SignInForm onSignIn={handleSignIn} />
      ) : (
        <ChatForm
          messages={messages}
          setMessages={setMessages}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          setIsTyping={setIsTyping}
          setTypingUser={setTypingUser}
          username={username}
        />
      )}
    </div>
    //I said if I did not fill the username field show the SignInForm and if I
    // filled it do not show SignInForm and show ChatApp
  );
};
//The ChatApp component includes two other components,
// namely ChatList and ChatForm, which display the list of messages and the chat form, respectively.
//I send messages , isTyping , typingUser that declared in this component(ChatApp) to ChatList component to use them there.
//I send messages , setMessages , newMessages , setNewMessages , addMessages , setIsTyping , setTypingUser
//that declared in this component(ChatApp) to ChatForm component to use them there.
export default ChatApp;
//-------------------------------------returnSection----------------------------------------//
