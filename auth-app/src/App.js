import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../../frontend/src/pages/Home";
import HelloPage from "./pages/SecondPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hello" element={<HelloPage />} />
      </Routes>
    </Router>
  );
}

export default App;
