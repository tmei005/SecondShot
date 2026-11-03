import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "../components/LoginButton";
import LogoutButton from "../components/LogoutButton";
import "./Home.css";

const designWidth = 1920;
const designHeight = 1080;

const Home = () => {
  const [scale, setScale] = useState(1);
  const { isLoading, error, isAuthenticated, loginWithRedirect } = useAuth0();
  const navigate = useNavigate();

  // Navigate to the Home page if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/peripherals");
    }
  }, [isAuthenticated, navigate]);

  // Scale design to fit viewport
  useEffect(() => {
    function updateScale() {
      const scaleX = window.innerWidth / designWidth;
      const scaleY = window.innerHeight / designHeight;
      setScale(Math.min(scaleX, scaleY));
    }
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  return (
    <div className="home-page">
      <div className="home-canvas" style={{ "--home-scale": scale }}>
        {/* Left Sidebar */}
        <div className="home-sidebar" />

        {/* SVG Logo */}
        <div data-svg-wrapper className="home-logo">
          <svg
            width="294"
            height="416"
            viewBox="0 0 294 416"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M60.6375 346.667L6.125 208L61.25 69.3333H110.25L55.125 208L86.975 288.6L182.525 69.3333H232.75L287.875 208L232.75 346.667H183.75L238.875 208L207.025 128.267L112.088 346.667H60.6375Z"
              fill="black"
            />
          </svg>
        </div>

        {/* Instructions */}
        <div className="home-instructions">
          <p>
            <strong>Instructions</strong>
          </p>
          <p>Log in or create an account to get started.</p>
          <p>Check your camera and microphone on the peripherals page.</p>
          <p>Select your questions or let us pick them for you.</p>
          <p>
            Start the interview — you'll answer 3 questions one at a time.
            <br />
            You get 20 seconds to prepare before recording each answer.
          </p>
          <p>
            After finishing, review your responses, add a self-evaluation,
            <br />
            and email it to a mentor for feedback.
          </p>
        </div>

        {/* Get Started Button */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            loginWithRedirect();
          }}
          className="home-get-started"
        >
          <span className="home-get-started-label">
            Get Started
          </span>
        </a>

        {/* Divider Lines */}
        <div className="home-divider home-divider-one" />
        <div className="home-divider home-divider-two" />
        <div className="home-divider home-divider-three" />

        {/* Sign In */}
        <div
          className="home-sign-in"
        >
          {error && <p>Authentication Error</p>}
          {!error && isLoading && <p>Loading...</p>}
          {!error && !isLoading && <LoginButton />}
        </div>

        {/* Contact Us */}
        <div
          className="home-contact"
        >
          <LogoutButton />
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=Interviewmock@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="home-contact-link"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;
