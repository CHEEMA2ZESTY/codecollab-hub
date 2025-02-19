import React, { useEffect, useRef, useCallback } from "react";
import { Terminal as XTerm } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";
import { io } from "socket.io-client";

interface TerminalProps {
  output: string;
  onData: (input: string) => void;
  roomId?: string;
  terminalId: string; // Unique terminal identifier
}

const socket = io("http://localhost:5000");

const Terminal: React.FC<TerminalProps> = ({ output, onData, roomId, terminalId }) => {
  const terminalRef = useRef<HTMLDivElement | null>(null);
  const term = useRef<XTerm | null>(null);
  const fitAddon = useRef<FitAddon | null>(null);
  const userInputRef = useRef<string>("");

  const handleResize = useCallback(() => {
    if (fitAddon.current && term.current) {
      try {
        fitAddon.current.fit();
      } catch (error) {
        console.error(`Error fitting terminal ${terminalId}:`, error);
      }
    }
  }, [terminalId]);

  useEffect(() => {
    if (!terminalRef.current || term.current) return;

    const container = terminalRef.current;
    term.current = new XTerm({
      cursorBlink: true,
      theme: {
        background: "#1E1E1E",
        foreground: "#FFFFFF",
      },
    });

    fitAddon.current = new FitAddon();
    term.current.loadAddon(fitAddon.current);
    term.current.open(container);

    setTimeout(() => {
      try {
        fitAddon.current?.fit();
      } catch (error) {
        console.error(`Error fitting terminal ${terminalId}:`, error);
      }
    }, 100);

    term.current.writeln("Welcome to the CodeCollab Terminal!");
    term.current.writeln("Type your commands here...");

    term.current.onData((data) => {
      if (data === "\r") {
        onData(userInputRef.current);
        socket.emit("send_terminal_input", { roomId, input: userInputRef.current });
        term.current?.writeln(`\r\n> ${userInputRef.current}`);
        userInputRef.current = "";
      } else if (data === "\u007F") {
        userInputRef.current = userInputRef.current.slice(0, -1);
      } else {
        userInputRef.current += data;
      }
    });

    window.addEventListener("resize", handleResize);

    return () => {
      term.current?.dispose();
      term.current = null;
      window.removeEventListener("resize", handleResize);
    };
  }, [onData, roomId, handleResize, terminalId]);

  useEffect(() => {
    if (term.current && output) {
      setTimeout(() => term.current?.writeln(output), 50);
    }
  }, [output]);

  useEffect(() => {
    const handleSocketOutput = (message: string) => {
      term.current?.writeln(`\r\n${message}`);
    };

    socket.on("receive_terminal_output", handleSocketOutput);

    return () => {
      socket.off("receive_terminal_output", handleSocketOutput);
    };
  }, []);

  return (
    <div className="w-full h-60 bg-black rounded-md shadow-lg overflow-hidden">
      <div ref={terminalRef} className="h-full w-full overflow-x-auto" id={`terminal-${terminalId}`}></div>
    </div>
  );
};

export default Terminal;
