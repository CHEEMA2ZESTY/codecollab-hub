const express = require("express");
const { exec } = require("child_process");
const WebSocket = require("ws");
const path = require("path");

const app = express();
const PORT = 4000;

// Serve frontend (optional)
app.use(express.static(path.join(__dirname, "frontend")));

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// WebSocket Server
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("New terminal connection");

  // Default to project root path
  let currentPath = process.cwd();
  
  ws.send(`Connected to ${currentPath}`);

  ws.on("message", (message) => {
    console.log("Command received:", message);
    
    if (message.startsWith("cd ")) {
      // Change directory
      let newPath = path.resolve(currentPath, message.substring(3));
      currentPath = newPath;
      ws.send(`Switched to ${currentPath}`);
    } else {
      // Execute system commands
      exec(message, { cwd: currentPath }, (err, stdout, stderr) => {
        if (err) {
          ws.send(`Error: ${stderr || err.message}`);
        } else {
          ws.send(stdout || "Command executed.");
        }
      });
    }
  });
});
