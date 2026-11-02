import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Contact from "./pages/Contact";
import FeedbackPage from "./pages/FeedbackPage";
import Home from "./pages/Home";
import InterviewHistory from "./pages/InterviewHistory";
import InterviewPage from "./pages/InterviewPage";
import Logout from "./pages/Logout";
import MoreDetails from "./pages/MoreDetails";
import PeripheralsCheckPage from "./pages/PeripheralsCheckPage";
import SecondPage from "./pages/SecondPage";
import VideoUpload from "./pages/Video-Upload";
import VoiceToText from "./pages/VoiceToText";

const App = () => {
  return (
    <Router>
      <nav>
        <ul>
          <li>
            <Link to="/">Start</Link>
          </li>
          <li>
            <Link to="/peripherals">Peripherals & Questions</Link>
          </li>
          <li>
            <Link to="/interview">Interview</Link>
          </li>
          <li>
            <Link to="/more-details">Feedback & Review</Link>
          </li>
          <li>
            <Link to="/interview-history">Interview History</Link>
          </li>
          <li>
            <Link to="/video-upload">Video Upload</Link>
          </li>
          <li>
            <Link to="/feedback">Submit Feedback</Link>
          </li>
          <li>
            <Link to="/voice-to-text">Voice to Text</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/design" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/peripherals" element={<PeripheralsCheckPage />} />
        <Route path="/interview" element={<InterviewPage />} />
        <Route path="/more-details" element={<MoreDetails />} />
        <Route path="/interview-history" element={<InterviewHistory />} />
        <Route path="/video-upload" element={<VideoUpload />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/hello" element={<SecondPage />} />
        <Route path="/voice-to-text" element={<VoiceToText />} />
      </Routes>
    </Router>
  );
};

export default App;
