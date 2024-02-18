const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const bodyParser = require("body-parser");
const axios = require("axios");
const multer = require("multer"); // Import multer for handling file uploads

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.use(express.static(path.join(__dirname, "build")));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const messages = [];

app.get("/messages", (req, res) => {
  res.json(messages);
});

app.post("/messages", (req, res) => {
  const { text, user } = req.body;

  if (!text || !user) {
    return res.status(400).json({ error: "Text and user are required." });
  }

  const now = new Date();
  const formattedTime = now.toLocaleTimeString();
  const formattedDate = now.toLocaleDateString();

  const newMessage = {
    text,
    user,
    time: formattedTime,
    date: formattedDate,
  };

  messages.push(newMessage);

  io.emit("message", newMessage);

  res.json({
    success: true,
    message: "Message added successfully.",
    data: newMessage,
  });
});

// Multer configuration for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

// Endpoint for handling audio file uploads
app.post("/upload-audio", upload.single("audio"), async (req, res) => {
  try {
    const audioFile = req.file; // Get the uploaded audio file
    const audioData = await fs.promises.readFile(audioFile.path); // Read the audio file content as buffer
    const audioBlob = new Blob([audioData], { type: audioFile.mimetype }); // Create a blob from the audio file content
    const audioUrl = URL.createObjectURL(audioBlob); // Create URL for the blob
    res.json({
      success: true,
      audioUrl: audioUrl,
    });
  } catch (error) {
    console.error("Error uploading audio:", error);
    res.status(500).json({ error: "Failed to upload audio." });
  }
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("message", (data) => {
    console.log("Message received:", data);
    io.emit("message", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
