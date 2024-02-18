import React, { useState, useEffect } from "react";
import MicRecorder from "mic-recorder-to-mp3";
import "./VoiceRecording.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophone,
  faSave,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

const Mp3Recorder = new MicRecorder({ bitRate: 128 });

const VoiceRecording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [blobURL, setBlobURL] = useState("");
  const [isBlocked, setIsBlocked] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [isStopped, setIsStopped] = useState(false);
  const [isCancelButtonVisible, setIsCancelButtonVisible] = useState(false);
  const [isStartButtonVisible, setIsStartButtonVisible] = useState(true);
  const [isSaveButtonVisible, setIsSaveButtonVisible] = useState(false);
  const [isAudioVisible, setIsAudioVisible] = useState(false);
  const [timer, setTimer] = useState(0);

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
  }, [isRecording]);

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
      })
      .catch((e) => console.log(e));
  };

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

  return (
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
      {isAudioVisible && <audio src={blobURL} controls />}
      {isRecording && <p className="Timer">{formatTime(timer)}</p>}
    </div>
  );
};

export default VoiceRecording;
