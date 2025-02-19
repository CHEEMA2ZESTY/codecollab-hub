import { useState } from "react";
import { useNavigate } from "react-router-dom";

const RoomManagement = () => {
  const [roomId, setRoomId] = useState<string>(""); 
  const [newRoomId, setNewRoomId] = useState<string>(""); 
  const navigate = useNavigate(); 

  const handleCreateRoom = () => {
    const generatedRoomId = Math.random().toString(36).substring(2, 10); 
    setNewRoomId(generatedRoomId);
    navigate(`/room/${generatedRoomId}`);  
  };

  const handleJoinRoom = () => {
    if (!roomId) {
      alert("Please enter a room ID");
      return;
    }
    navigate(`/room/${roomId}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white py-4">
      <h2 className="text-3xl font-bold">Manage Room</h2>

      <button
        onClick={handleCreateRoom}
        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-semibold"
      >
        Create Room
      </button>

      <div className="mt-6">
        <input
          type="text"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          placeholder="Enter Room ID"
          className="p-2 bg-gray-600 text-white rounded-md"
        />
        <button
          onClick={handleJoinRoom}
          className="ml-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-semibold"
        >
          Join Room
        </button>
      </div>

      {newRoomId && (
        <div className="mt-4 text-center">
          <p>Your Room ID: <strong>{newRoomId}</strong></p>
        </div>
      )}
    </div>
  );
};

export default RoomManagement;
