import React, { useState, useRef } from "react";

const VoiceToText = () => {
  const [text, setText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState("");
  const recognitionRef = useRef(null);

  const startListening = () => {
    console.log("Starting speech recognition...");
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser");
      console.error("Speech Recognition API not supported.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true; // Keep listening until stopped
    recognition.interimResults = true; // Show live updates
    recognition.maxAlternatives = 1;

    let finalTranscript = ""; // Store finalized text

    recognition.onstart = () => {
      console.log("Recording started...");
      setIsRecording(true);
      setError("");
    };

    recognition.onresult = (event) => {
      let interimTranscript = "";

      for (let i = 0; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          finalTranscript += transcript + " "; // Add finalized text
        } else {
          interimTranscript += transcript; // Show real-time updates
        }
      }

      setText(finalTranscript + interimTranscript); // Update screen
    };

    recognition.onspeechend = () => {
      console.log("Speech ended.");
      recognition.stop();
      setIsRecording(false);
    };

    recognition.onerror = (event) => {
      if (event.error === "no-speech") {
        setError("No speech detected. Please try speaking louder.");
        console.warn("No speech detected.");
      } else {
        setError(`Error occurred: ${event.error}`);
        console.error("Speech recognition error:", event.error);
      }
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    console.log("Stopping speech recognition...");
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
      console.log("Recording stopped.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Voice to Text</h2>
      <button onClick={startListening} disabled={isRecording}>
        {isRecording ? "Listening..." : "Start Recording"}
      </button>
      <button
        onClick={stopListening}
        disabled={!isRecording}
        style={{ marginLeft: "10px" }}
      >
        Stop Recording
      </button>
      <p>
        <strong>Live Speech Output:</strong> {text}
      </p>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default VoiceToText;
