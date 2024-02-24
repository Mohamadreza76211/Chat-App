import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import ChatApp from "./ChatSection/ChatApp";
import VoiceRcording from "./VoiceRecording";
import SignUpForm from "./SignupAndSigninSection/SignUpSection/SignUpForm";
import AdminPanel from "./ClientMangement/AdminPanel";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/SignUpForm" exact element={<SignUpForm />} />
          <Route path="/ChatApp" element={<ChatApp />} />
          <Route path="/AdminPanel" element={<AdminPanel />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
