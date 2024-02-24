import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import io from "socket.io-client";
import axios from "axios";
import "./ChatForm.scss";
import MicRecorder from "mic-recorder-to-mp3";
import {
  faMicrophone,
  faSave,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

const Mp3Recorder = new MicRecorder({ bitRate: 128 });
const socket = io("http://localhost:3002");

const ChatForm = ({
  messages,
  setMessages,
  newMessage,
  setNewMessage,
  setIsTyping,
  setTypingUser,
  sendMessage,
  username,
}) => {
  //----------------------------------------------------------//
  const [isRecording, setIsRecording] = useState(false);
  const [blobURL, setBlobURL] = useState(""); //This state is for storing Voice recording url
  const [isBlocked, setIsBlocked] = useState(false); //This state is for giving access to Voice recording to record from the user and
  // the defualt of it is false that means it has access and then in UseEffect(line 139) by using navigator.mediaDevices.getUserMedia
  //it checks does it have access to Recording voice or not.
  const [isStarted, setIsStarted] = useState(false);
  const [isStopped, setIsStopped] = useState(false);
  const [isCancelButtonVisible, setIsCancelButtonVisible] = useState(false);
  const [isStartButtonVisible, setIsStartButtonVisible] = useState(true);
  const [isSaveButtonVisible, setIsSaveButtonVisible] = useState(false);
  const [isAudioVisible, setIsAudioVisible] = useState(false);
  const [timer, setTimer] = useState(0); //This state is for counting time.

  //This UseEffect is for counting time of recording voice. The timer will start when the state of isRecording change.
  //That means when we start recording the timer will start and when it is not recording the timer will not working.

  useEffect(() => {
    let intervalId;

    if (isRecording) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    } else {
      clearInterval(intervalId);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [isRecording]); //This line says, UseEffect will work with the state of isRecording.
  //-----------------------------CountingTimeOfRecordingVoice--------------------------//
  const startRecording = () => {
    if (isBlocked) {
      console.log("Permission Denied");
    } else {
      Mp3Recorder.start()
        .then(() => {
          setIsRecording(true);
          setIsSaveButtonVisible(true);
          setIsStarted(true);
          setIsCancelButtonVisible(true);
          setIsStartButtonVisible(false);
          setIsAudioVisible(false);
        })
        .catch((e) => console.error(e));
    }
  };

  const stopRecording = () => {
    Mp3Recorder.stop()
      .getMp3()
      .then(([buffer, blob]) => {
        const blobURL = URL.createObjectURL(blob);
        setBlobURL(blobURL);
        setIsRecording(false);
        setIsStarted(false);
        setIsStopped(true);
        setIsCancelButtonVisible(false);
        setIsSaveButtonVisible(false);
        setIsStartButtonVisible(true);
        setIsAudioVisible(true);
        const now = new Date();
        const formattedTime = now.toLocaleTimeString();
        const formattedDate = now.toLocaleDateString();

        // In the line below we send these parameters (newMessage, blobURL, formattedTime, formattedDate) to
        //the addMessage in ChatApp.
        addMessage(newMessage, blobURL, formattedTime, formattedDate);

        // Reset blobURL after sending the audio
        setBlobURL(""); // Reset blobURL to empty string

        setNewMessage("");
      })
      .catch((e) => console.log(e));
  };

  const addMessage = (text, blobURL, time, date) => {
    setIsTyping(false);
    setTypingUser("");

    axios
      .post("http://localhost:3002/messages", {
        text,
        user: username,
        blob: blobURL,
        time,
        date,
      })
      .then((response) => {
        setMessages((prevMessages) => [...prevMessages, response.data]);
        setNewMessage("");
      })
      .catch((error) => {
        console.error("Error adding message:", error);
      });

    socket.emit("message", {
      text,
      user: username,
      blob: blobURL,
      time,
      date,
    });
  };
  //If the project does not work, do not comment addMessage in ChatApp.
  // addMessage: This function is used to add a new message to the server and the list of messages.

  const cancelRecording = () => {
    Mp3Recorder.stop();
    setIsRecording(false);
    setIsStopped(false);
    setIsStarted(false);
    setIsCancelButtonVisible(false);
    setBlobURL("");
    setIsStartButtonVisible(true);
    setIsSaveButtonVisible(false);
    setTimer(0);
  };

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(() => {
        console.log("Permission Granted");
        setIsBlocked(false);
      })
      .catch(() => {
        console.log("Permission Denied");
        setIsBlocked(true);
      });
  }, []);

  // Function to format time
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes < 10 ? "0" + minutes : minutes}:${
      seconds < 10 ? "0" + seconds : seconds
    }`;
  };

  //--------------------VoiceRecordingSection-----------------//

  const handleText = (e) => {
    setNewMessage(e.target.value);
    setIsTyping(true);
    setTypingUser(username);
  };

  const handleSendClick = () => {
    if (newMessage.trim() === "" && !blobURL) {
      return;
    }
    if (isRecording) {
      return;
    } //I said, if the client is recording voice do not send any text message and the button for sending message does not work.

    const now = new Date();
    const formattedTime = now.toLocaleTimeString();
    const formattedDate = now.toLocaleDateString();

    const updatedMessages = [
      ...messages,
      {
        text: newMessage,
        user: username,
        time: formattedTime,
        date: formattedDate,
        blob: blobURL,
      },
    ];
    setMessages(updatedMessages);
    setNewMessage("");
    setIsTyping(false);
    setTypingUser("");

    const formData = new FormData();
    formData.append("audio", blobURL);
    formData.append("text", newMessage);

    axios
      .post("http://localhost:3002/messages", formData)
      .then((response) => {
        console.log("Message sent successfully:", response.data);
        // در اینجا می‌توانید بر روی پاسخ سرور عملیات مورد نظر را انجام دهید، مانند به‌روزرسانی رابط کاربری
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      });

    // ارسال پیام به سوکت
    socket.emit("message", {
      text: newMessage,
      user: username,
      time: formattedTime, // Include the current time
      date: formattedDate, // Include the current date
      blob: blobURL,
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendClick(e);
    }
  };

  useEffect(() => {
    const typingTimer = setTimeout(() => {
      setIsTyping(false);
      setTypingUser("");
    }, 1000);

    return () => clearTimeout(typingTimer);
  }, [newMessage, setIsTyping, setTypingUser]);

  return (
    <div className="wrapper">
      <div className="MainDiv">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${
              message.user === username ? "sent" : "received"
            }`}
          >
            {/** In this part I declared a condition for determine if the user is sending message or receiving message.
             * If it is sending message give sent className to it and if it is receiving message give received className. **/}
            <div
              key={message.date}
              style={{
                textAlign: message.user === username ? "left" : "right",
              }}
            >
              {/** In this part I said if the current user is sending message put everything to the left part
               * and if it is receiving message put everything to the right part. **/}
              <span
                style={{
                  fontWeight: "bold",
                  fontStyle: "italic",
                  display: "flex",
                  flexDirection: "column",
                  paddingLeft: "4px",
                  marginLeft: message.user === username ? "8px" : "0",
                  marginRight: message.user === username ? "0" : "8px",
                }}
              >
                <br />
                {message.user}
                <span
                  style={{
                    color: "gray",
                    fontSize: "0.9em",
                  }}
                >
                  ({message.date} {message.time})
                </span>
              </span>{" "}
              {message.blob && (
                <audio controls>
                  <source src={message.blob} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              )}
              <span
                style={{
                  paddingLeft: "4px",
                  borderRadius: "6px",
                  marginLeft: message.user === username ? "8px" : "0",
                  marginRight: message.user === username ? "0" : "8px",
                  backgroundColor:
                    message.user === username ? "lightgreen" : "lightblue",
                }}
              >
                {message.text}
              </span>
            </div>
          </div>
        ))}

        <div className="TextBoxAndButtonContainer ">
          <button
            className="SendButton"
            onClick={handleSendClick}
            onKeyDown={handleKeyDown}
          >
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
          <input
            className="TextBox2"
            type="text"
            value={newMessage}
            onChange={handleText}
            onKeyDown={handleKeyDown}
            placeholder="Type your message"
          />

          <div className="VoiceRecording">
            {isStartButtonVisible && (
              <button
                className="StartButton"
                onClick={startRecording}
                disabled={isRecording}
              >
                <FontAwesomeIcon icon={faMicrophone} size="2x" />
              </button>
            )}
            {isCancelButtonVisible && (
              <button className="CancelButton" onClick={cancelRecording}>
                <FontAwesomeIcon icon={faTimes} size="2x" />
              </button>
            )}
            {isSaveButtonVisible && (
              <button
                className="SaveButton"
                onClick={stopRecording}
                disabled={!isRecording}
              >
                <FontAwesomeIcon icon={faSave} size="2x" />
              </button>
            )}
            {isRecording && <p className="Timer">{formatTime(timer)}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatForm;
