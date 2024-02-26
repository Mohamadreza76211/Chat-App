import React from "react";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import ChatApp from "./ChatSection/ChatApp";
import VoiceRcording from "./VoiceRecording";
import SignUpForm from "./SignupAndSigninSection/SignUpSection/SignUpForm";
import AdminPanel from "./ClientMangement/AdminPanel";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/SignUpForm" />} />
          <Route path="/SignUpForm" element={<SignUpForm />} />
          <Route path="/ChatApp" element={<ChatApp />} />
          <Route path="/AdminPanel" element={<AdminPanel />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
