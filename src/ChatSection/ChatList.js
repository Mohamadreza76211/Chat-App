import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import "./ChatList.scss";

const socket = io("http://localhost:3002");
//nitializes a WebSocket connection to the server at "http://localhost:3002".

const ChatList = ({ messages, isTyping, typingUser }) => {
  const [receivedMessages, setReceivedMessages] = useState([]);
  //Initializes a state variable receivedMessages using the useState hook to keep track of messages received from the server.
  useEffect(() => {
    socket.on("message", (data) => {
      console.log("Message received from server:", data);
      setReceivedMessages((prevMessages) => [...prevMessages, data]);
    });
    //The useEffect hook is used to subscribe to the "message" event emitted by the server when a new message is received.
    //When a new message is received, it is added to the receivedMessages state.
    return () => {
      socket.off("message");
      //In the return section, socket.off is used to prevent listening to the "message" event beyond what is necessary (cleanup).
    };
  }, []);
  //---------------------------------useEffectSection----------------------------------------//

  return (
    //I use isTyping below when it is true and it refrences from ChatApp component and I put it value true in ChatForm component.
    <div>
      {isTyping && (
        <div
          style={{
            position: "relative",
            bottom: "0",
            left: "50%",
            marginTop: "160px",
            transform: "translateX(-50%)",
          }}
        >
          <p
            style={{
              fontStyle: "italic",
              fontWeight: "bold",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <span>{typingUser}</span> is typing...
          </p>
        </div>
      )}
    </div>
  );
};
//-------------------------------------returnSection----------------------------------------//

export default ChatList;
