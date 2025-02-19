import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import Dashboard from "./Dashboard"; // Import Dashboard inside Home

const Home = () => {
  const { user, logout } = useAuth(); // Get authentication state

  return (
    <div className="mt-12 w-full max-w-lg text-center bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-3xl font-semibold">
        {user ? `Welcome back, ${user.email}!` : "Welcome to CodeCollab Hub"}
      </h2>
      <p className="mt-2 text-gray-400">
        This is a platform for programmers to share code, ideas, and collaborate.
      </p>

      {user ? (
        <div className="mt-6">
          <Dashboard /> {/* Dashboard now appears inside Home */}
          <button
            onClick={logout}
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="mt-6 space-x-4">
          <Link to="/login">
            <Button label="Login" />
          </Link>
          <Link to="/signup">
            <Button label="Sign Up" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;
