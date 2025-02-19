import React, { useEffect, useRef, useCallback } from "react";
import { Terminal as XTerm } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";
import { io } from "socket.io-client";

interface TerminalProps {
  roomId: string;
}

const socket = io("http://localhost:5000");

const TerminalRoom: React.FC<TerminalProps> = ({ roomId }) => {
  const terminalRef = useRef<HTMLDivElement | null>(null);
  const term = useRef<XTerm | null>(null);
  const fitAddon = useRef<FitAddon | null>(null);
  const userInputRef = useRef<string>("");

  const handleResize = useCallback(() => {
    if (fitAddon.current && term.current) {
      try {
        fitAddon.current.fit();
      } catch (error) {
        console.error("Error fitting terminal:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (!terminalRef.current || term.current) return;

    term.current = new XTerm({
      cursorBlink: true,
      theme: {
        background: "#1E1E1E",
        foreground: "#FFFFFF",
      },
    });

    fitAddon.current = new FitAddon();
    term.current.loadAddon(fitAddon.current);
    term.current.open(terminalRef.current);

    requestAnimationFrame(() => {
      try {
        fitAddon.current?.fit();
      } catch (error) {
        console.error("Error fitting terminal:", error);
      }
    });

    term.current.writeln("Welcome to the Room Terminal!");
    term.current.writeln("Connected to Room: " + roomId);

    term.current.onData((data) => {
      if (data === "\r") {
        socket.emit("send_terminal_input", { roomId, input: userInputRef.current });
        term.current?.writeln(`\r\n> ${userInputRef.current}`);
        userInputRef.current = "";
      } else if (data === "\u007F") {
        userInputRef.current = userInputRef.current.slice(0, -1);
      } else {
        userInputRef.current += data;
      }
    });

    socket.on("receive_terminal_output", (message: string) => {
      term.current?.writeln(`\r\n${message}`);
    });

    window.addEventListener("resize", handleResize);

    return () => {
      term.current?.dispose();
      socket.off("receive_terminal_output");
      window.removeEventListener("resize", handleResize);
    };
  }, [roomId, handleResize]);

  return (
    <div className="w-full h-60 bg-black rounded-md shadow-lg overflow-hidden">
      <div ref={terminalRef} className="h-full w-full overflow-x-auto"></div>
    </div>
  );
};

export default TerminalRoom;
