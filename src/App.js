import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import ChatApp from "./ChatSection/ChatApp";
import VoiceRcording from "./VoiceRecording";
import SignUpForm from "./SignupAndSigninSection/SignUpSection/SignUpForm";
import SignInForm from "./SignupAndSigninSection/LogInSection/SignInForm";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/SignUpForm" exact element={<SignUpForm />} />
          {/* <Route path="/SignInForm" element={<SignInForm />} /> */}
          <Route path="/ChatApp" element={<ChatApp />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
