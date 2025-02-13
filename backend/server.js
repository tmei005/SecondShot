const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/voice-to-text", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const transcriptionSchema = new mongoose.Schema({
  text: String,
});

const Transcription = mongoose.model("Transcription", transcriptionSchema);

// API Routes
app.post("/api/save-transcription", async (req, res) => {
  const { text } = req.body;
  const transcription = new Transcription({ text });
  await transcription.save();
  res.status(201).json({ message: "Transcription saved successfully!" });
});

app.get("/api/get-transcriptions", async (req, res) => {
  const transcriptions = await Transcription.find();
  res.json(transcriptions);
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
