import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import CodeEditor from "../components/CodeEditor";
import { Terminal } from "xterm";
import "xterm/css/xterm.css";
import { io } from "socket.io-client"; // Add socket import

const socket = io("http://localhost:5000"); // Replace with your server URL

const RoomPage = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [code, setCode] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [language, setLanguage] = useState<string>("javascript");
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const terminalRef = useRef<HTMLDivElement | null>(null);
  const terminalRoomRef = useRef<HTMLDivElement | null>(null); // Second terminal ref
  const term = useRef<Terminal | null>(null);
  const termRoom = useRef<Terminal | null>(null); // Second terminal
  let userInput = "";

  useEffect(() => {
    if (!roomId) return;

    // Join the room when the component mounts
    socket.emit("join_room", roomId);

    // Receive code changes from other users in the room
    socket.on("receive_code", (newCode: string) => {
      setCode(newCode);
    });

    // Setup first terminal (editor terminal)
    if (terminalRef.current && !term.current) {
      term.current = new Terminal({
        rows: 10,
        theme: { background: "#1e1e1e", foreground: "#ffffff" },
        cursorBlink: true,
      });

      term.current.open(terminalRef.current);
      term.current.writeln("\x1b[32mWelcome to CodeCollab Hub Terminal!\x1b[37m");
      term.current.write("> ");

      term.current.onKey(({ key, domEvent }) => {
        if (!term.current) return;

        const charCode = domEvent.keyCode;
        if (charCode === 13) {
          term.current.writeln("");
          executeCommand(userInput.trim());
          userInput = "";
        } else if (charCode === 8) {
          if (userInput.length > 0) {
            userInput = userInput.slice(0, -1);
            term.current.write("\b \b");
          }
        } else if (charCode >= 32 && charCode <= 126) {
          userInput += key;
          term.current.write(key);
        }
      });
    }

    // Setup second terminal (room terminal)
    if (terminalRoomRef.current && !termRoom.current) {
      termRoom.current = new Terminal({
        rows: 10,
        theme: { background: "#1e1e1e", foreground: "#ffffff" },
        cursorBlink: true,
      });

      termRoom.current.open(terminalRoomRef.current);
      termRoom.current.writeln("\x1b[32mWelcome to the room terminal!\x1b[37m");
      termRoom.current.write("> ");

      termRoom.current.onKey(({ key, domEvent }) => {
        if (!termRoom.current) return;

        const charCode = domEvent.keyCode;
        if (charCode === 13) {
          termRoom.current.writeln("");
          executeCommand(userInput.trim());
          userInput = "";
        } else if (charCode === 8) {
          if (userInput.length > 0) {
            userInput = userInput.slice(0, -1);
            termRoom.current.write("\b \b");
          }
        } else if (charCode >= 32 && charCode <= 126) {
          userInput += key;
          termRoom.current.write(key);
        }
      });
    }

    // Cleanup on unmount
    return () => {
      socket.emit("leave_room", roomId); // Emit leaving room event when the component unmounts
      socket.off("receive_code");
    };
  }, [roomId]);

  const executeCommand = (command: string) => {
    if (!term.current) return;
    if (command === "clear") {
      term.current.clear();
    } else if (command.startsWith("echo ")) {
      term.current.writeln(command.slice(5));
    } else {
      term.current.writeln(`\x1b[31mUnknown command:\x1b[37m ${command}`);
    }
    term.current.write("\r\n> ");
  };

  const handleRunCode = async () => {
    if (!code.trim()) {
      setOutput("No code to run.");
      term.current?.writeln("\x1b[33mNo code to run.\x1b[37m");
      return;
    }

    setIsRunning(true);
    setOutput("Processing...");
    term.current?.writeln("\x1b[36mProcessing...\x1b[37m");

    try {
      const response = await fetch("http://localhost:5000/api/run", { // Updated to port 5000
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, code }),
      });

      const result = await response.json();

      if (result.output) {
        setOutput(result.output);
        term.current?.writeln(`\x1b[32m${result.output}\x1b[37m`);
      } else if (result.error) {
        setOutput(result.error);
        term.current?.writeln(`\x1b[31m${result.error}\x1b[37m`);
      }
    } catch (error) {
      setIsRunning(false);
      setOutput("Error: Failed to execute code.");
      term.current?.writeln(`\x1b[31mError:\x1b[37m Failed to execute code.`);
    }

    setIsRunning(false);
  };

  // Emit code changes to the backend for other users in the room
  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    socket.emit("send_code", newCode); // Send code to backend to sync with other users
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-900 text-white py-4">
      <h2 className="text-3xl font-bold">Room: {roomId}</h2>

      <div className="flex flex-col w-[90vw] mt-4 bg-gray-800 rounded-lg shadow-lg">
        <div className="flex justify-between p-3 bg-gray-700 rounded-t-lg">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="p-2 bg-gray-600 text-white rounded-md"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
            <option value="c">C</option>
            <option value="go">Go</option>
            <option value="rust">Rust</option>
            <option value="php">PHP</option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
            <option value="sql">SQL</option>
          </select>

          <button
            onClick={handleRunCode}
            className={`px-6 py-2 ${isRunning ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"} rounded-md text-white font-semibold`}
            disabled={isRunning}
          >
            {isRunning ? "Running..." : "Run Code"}
          </button>
        </div>

        <div className="h-[25vh] p-4">
          <CodeEditor
            code={code}
            onChange={handleCodeChange}
            language={language}
          />
        </div>

        <div className="mt-4 bg-gray-800 text-white p-4 rounded w-full">
          <h3 className="text-lg font-bold">Output</h3>
          <pre className="text-green-400">{output}</pre>
        </div>

        {/* Main Terminal */}
        <div ref={terminalRef} className="h-[40vh] bg-black p-4 rounded-b-lg" />

        {/* Second Terminal for Room */}
        <div ref={terminalRoomRef} className="h-[40vh] bg-black p-4 rounded-b-lg mt-4" />
      </div>
    </div>
  );
};

export default RoomPage;
