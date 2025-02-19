import React from "react";
import { Editor, useMonaco } from "@monaco-editor/react"; 

interface CodeEditorProps {
  code: string;
  language: string;
  onChange: (value: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ code, language, onChange }) => {
  const monaco = useMonaco(); 

  React.useEffect(() => {
    if (monaco) {
      const languages = ["html", "sql", "php", "rust", "go", "kotlin"];
      languages.forEach((lang) => {
        if (!monaco.languages.getLanguages().some((l) => l.id === lang)) {
          monaco.languages.register({ id: lang });
        }
      });
    }
  }, [monaco]);

  return (
    <div className="w-[90%] h-full mx-auto border border-gray-700 rounded-md overflow-hidden shadow-lg">
      <Editor
        height="100%"
        language={language} 
        theme="vs-dark"
        value={code}
        onChange={(value) => onChange(value ?? "")}
        options={{
          fontSize: 16,
          minimap: { enabled: false },
          wordWrap: "on",
          scrollBeyondLastLine: false,
        }}
      />
    </div>
  );
};

export default CodeEditor;
