import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import VoiceToText from "./pages/VoiceToText";

const App = () => {
  return (
    <Router>
      <nav>
        <ul>
          <li>
            <Link to="/voice-to-text">Voice to Text</Link>
          </li>
        </ul>
      </nav>

      <Routes>
        <Route path="/voice-to-text" element={<VoiceToText />} />
      </Routes>
    </Router>
  );
};

export default App;
