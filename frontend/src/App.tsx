import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Editor from "./pages/Editor";
import About from "./pages/about";
import Contact from "./pages/contact";
import Dashboard from "./pages/Dashboard";
import RoomManagement from "./pages/RoomManagement";
import RoomPage from "./pages/RoomPage";
import Navbar from "./components/Navbar";
import Settings from "./pages/Settings"; // New Settings page
import { useAuth } from "./context/AuthContext"; // Import AuthContext
import Home from "./pages/home"; // Ensure Home is imported

function App() {
  return (
    <Router>
      <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white px-6">
        <h1 className="text-4xl font-bold mt-6">CodeCollab Hub</h1>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/editor" element={<Editor />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/room-management" element={<RoomManagement />} />
          <Route path="/room/:roomId" element={<RoomPage />} />
          <Route path="/settings" element={<Settings />} /> {/* Added Settings page */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
