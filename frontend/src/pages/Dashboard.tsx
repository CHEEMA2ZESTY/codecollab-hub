const Dashboard = () => {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white py-6">
      <h2 className="text-4xl font-bold mb-6">Dashboard</h2>
      
      <div className="w-full max-w-4xl bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-2xl font-semibold text-blue-400 mb-4">Welcome to Your Dashboard</h3>
        <p className="text-lg text-gray-300 mb-8">
          Manage your coding projects, review your progress, and collaborate with teammates all in one place.
        </p>

        {/* Add some user or project-specific data */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-700 p-6 rounded-lg shadow-md">
            <h4 className="text-xl font-semibold text-blue-400">Recent Activity</h4>
            <p className="text-gray-300 mt-2">See what your team has been working on lately.</p>
            {/* Display some activity data or links here */}
          </div>

          <div className="bg-gray-700 p-6 rounded-lg shadow-md">
            <h4 className="text-xl font-semibold text-blue-400">Active Projects</h4>
            <p className="text-gray-300 mt-2">Track your ongoing projects and progress.</p>
            {/* List active projects */}
          </div>

          <div className="bg-gray-700 p-6 rounded-lg shadow-md">
            <h4 className="text-xl font-semibold text-blue-400">Upcoming Tasks</h4>
            <p className="text-gray-300 mt-2">Stay on top of deadlines and tasks in your projects.</p>
            {/* List upcoming tasks */}
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-lg text-gray-400">
            Manage your workspace, collaborate with others, and take your coding skills to the next level!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
