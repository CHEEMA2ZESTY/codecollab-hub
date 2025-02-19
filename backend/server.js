require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const axios = require("axios");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// 🔹 Middleware
app.use(cors());
app.use(express.json());

// 🔹 Authentication Routes
app.use("/api/auth", require("./routes/authRoutes"));

// 🔹 Code Execution API (Updated with Improved Error Handling)
app.post("/api/run", async (req, res) => {
  const { language, code } = req.body;

  console.log("📩 Received request for code execution:");
  console.log(`🔹 Language: ${language}`);
  console.log(`🔹 Code: ${code}`);

  if (!language || !code) {
    return res.status(400).json({ error: "Missing language or code" });
  }

  const languageMap = {
    javascript: 63,
    python: 71,
    java: 62,
    cpp: 54,
    c: 50,
    go: 60,
    rust: 73,
    php: 68,
    sql: 82,
  };

  const languageId = languageMap[language];
  if (!languageId) {
    return res.status(400).json({ error: "Unsupported language" });
  }

  if (!process.env.RAPIDAPI_KEY) {
    console.error("❌ RAPIDAPI_KEY is missing in environment variables.");
    return res.status(500).json({ error: "Server misconfiguration: API key missing" });
  }

  try {
    console.log("🚀 Sending code to Judge0 API...");
    const response = await axios.post(
      "https://judge0-ce.p.rapidapi.com/submissions",
      {
        source_code: code,
        language_id: languageId,
        stdin: "",
        memory_limit: 512000, // Set memory limit to 512MB (512000KB)
        time_limit: 5, // 5 seconds timeout
      },
      {
        headers: {
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    const submissionToken = response.data.token;
    console.log(`✅ Submission token received: ${submissionToken}`);

    // Polling to get execution result
    const fetchExecutionResult = async () => {
      try {
        const result = await axios.get(
          `https://judge0-ce.p.rapidapi.com/submissions/${submissionToken}?base64_encoded=false`,
          {
            headers: {
              "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
              "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
            },
          }
        );

        console.log("📊 Execution Result:", result.data);
        
        if (result.data.status && result.data.status.id <= 2) {
          // Status 1: In queue, Status 2: Processing
          console.log("⌛ Execution still in progress, retrying...");
          setTimeout(fetchExecutionResult, 2000); // Retry after 2 seconds
        } else {
          res.json({
            output: result.data.stdout || result.data.stderr || "No output",
            status: result.data.status.description,
          });
        }
      } catch (fetchError) {
        console.error("❌ Error fetching execution result:", fetchError.message);
        res.status(500).json({ error: "Failed to retrieve execution result" });
      }
    };

    setTimeout(fetchExecutionResult, 3000); // Start polling after 3 seconds
  } catch (error) {
    console.error("❌ Error in code execution:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Code execution request failed" });
  }
});

// 🔹 Real-time Collaboration (Socket.io Setup)
io.on("connection", (socket) => {
  console.log("🔗 A user connected");

  // Handle room creation
  socket.on("create_room", (roomName) => {
    if (!roomName) return;

    // Check if the room already exists
    const room = io.sockets.adapter.rooms.get(roomName);
    if (room && room.size > 0) {
      socket.emit("error", "Room already exists!");
    } else {
      socket.join(roomName);
      socket.emit("user_joined", roomName); // Emit to the client that they've joined the room
      console.log(`${socket.id} created room: ${roomName}`);
    }
  });

  // Handle room joining
  socket.on("join_room", (roomName) => {
    if (!roomName) return;

    // Check if the room exists
    const room = io.sockets.adapter.rooms.get(roomName);
    if (room && room.size > 0) {
      socket.join(roomName);
      socket.emit("user_joined", roomName); // Emit to the client that they've joined the room
      console.log(`${socket.id} joined room: ${roomName}`);
    } else {
      socket.emit("error", "Room does not exist.");
    }
  });

  // Handle real-time code sharing
  socket.on("send_code", (newCode) => {
    console.log("📡 Received real-time code update:", newCode);
    socket.broadcast.emit("receive_code", newCode); // Send to all other users in the room
  });

  // 🔹 Terminal Input/Output via WebSockets
  socket.on("send_terminal_input", ({ roomId, input }) => {
    console.log(`⌨️ Received input from ${socket.id} in room ${roomId}:`, input);
    
    // Process input (mock execution for now)
    const output = `You typed: ${input}`;
    
    // Emit output to all users in the room
    io.to(roomId).emit("receive_terminal_output", output);
  });

  socket.on("disconnect", () => {
    console.log("🔌 User disconnected");
  });
});

// 🔹 Server Initialization
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
