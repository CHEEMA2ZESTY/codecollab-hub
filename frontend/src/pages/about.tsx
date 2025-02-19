const About = () => {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white py-6">
      <h2 className="text-4xl font-bold mb-6">About CodeCollab Hub</h2>
      <div className="w-full max-w-4xl bg-gray-800 rounded-lg shadow-lg p-6">
        <p className="text-xl text-gray-300 mb-4">
          CodeCollab Hub is a platform designed for programmers to collaborate in real-time, share code, and work together on projects seamlessly. Whether you're learning to code, teaching others, or building software with a team, CodeCollab Hub makes it easy to code together from anywhere.
        </p>
        
        <div className="mt-6 space-y-6">
          <section>
            <h3 className="text-2xl font-semibold text-blue-400">Real-Time Collaborative Editing</h3>
            <p className="text-gray-300">
              Code in sync with your teammates in real-time. Every keystroke, every change is instantly visible to all participants in the room.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-semibold text-blue-400">Multi-Language Code Support</h3>
            <p className="text-gray-300">
              Write code in various programming languages, including JavaScript, Python, Java, C++, Go, and more. Run and test your code directly in the browser.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-semibold text-blue-400">Integrated Terminal</h3>
            <p className="text-gray-300">
              Our integrated terminal allows you to execute commands, interact with your code, and run live tests in a safe and secure environment.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-semibold text-blue-400">Room Management</h3>
            <p className="text-gray-300">
              Manage and organize coding rooms for team projects or study groups. Collaborate and share ideas while keeping everything in one place.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-semibold text-blue-400">Why Choose CodeCollab Hub?</h3>
            <p className="text-gray-300">
              Whether you are working on open-source projects, conducting coding bootcamps, or need a virtual coding space for a team project, CodeCollab Hub provides everything you need in one place:
            </p>
            <ul className="list-disc list-inside mt-2 text-gray-300">
              <li>Seamless real-time code collaboration</li>
              <li>Support for various programming languages</li>
              <li>Integrated terminals for testing code</li>
              <li>Easy-to-use room management features</li>
            </ul>
          </section>
        </div>

        <div className="mt-8 text-center">
          <p className="text-lg text-gray-400">
            Join CodeCollab Hub today and start collaborating with developers from all around the world!
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
