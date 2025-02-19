import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Settings() {
  const { user, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const [username, setUsername] = useState(user?.displayName || "");
  const [password, setPassword] = useState("");

  const toggleDarkMode = () => {
    const newTheme = darkMode ? "light" : "dark";
    setDarkMode(!darkMode);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", !darkMode);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-900 text-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Settings</h2>

      {/* Profile Section */}
      <div className="mb-6">
        <h3 className="text-lg font-medium">Profile</h3>
        <label className="block mt-2">
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full mt-1 p-2 bg-gray-800 text-white rounded"
            disabled
          />
        </label>
        <label className="block mt-2">
          Email:
          <input
            type="email"
            value={user?.email || ""}
            className="w-full mt-1 p-2 bg-gray-800 text-white rounded"
            disabled
          />
        </label>
        <label className="block mt-2">
          Update Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-1 p-2 bg-gray-800 text-white rounded"
          />
        </label>
        <button className="mt-3 bg-blue-500 hover:bg-blue-400 px-4 py-2 rounded">
          Update Profile
        </button>
      </div>

      {/* Theme Settings */}
      <div className="mb-6">
        <h3 className="text-lg font-medium">Theme</h3>
        <label className="flex items-center mt-2">
          <input
            type="checkbox"
            checked={darkMode}
            onChange={toggleDarkMode}
            className="mr-2"
          />
          Enable Dark Mode
        </label>
      </div>

      {/* Privacy Settings */}
      <div className="mb-6">
        <h3 className="text-lg font-medium">Privacy</h3>
        <button className="mt-2 text-red-400 hover:text-red-300">
          Delete Account
        </button>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="mt-4 bg-red-500 hover:bg-red-400 px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}
