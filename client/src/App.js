import React, { useState, useEffect } from 'react';
import './App.css';
import io from 'socket.io-client';
import Chat from './Chat';

function App() {
  const [socket, setSocket] = useState(null);
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    const newSocket = io.connect("http://localhost:3001");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const joinRoom = () => {
    if (username.trim() !== "" && room.trim() !== "") {
      socket.emit("join_room", { room, username }); // Emit room and username as an object
      setShowChat(true);
    }
  };

  return (  
    <div className="App">
      {!showChat ? (
        <form onSubmit={(e) => {
          e.preventDefault(); // Prevent form submission
          joinRoom();
        }}>
          <h1>Join a Chat</h1>
          <input
            type="text"
            placeholder="Enter your Name.."
            value={username}
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <br/>
          <br/>
          <input
            type="text"
            placeholder="Room ID.."
            value={room}
            onChange={(event) => {
              setRoom(event.target.value);
            }}
          />
          <br/>
          <br/>
          <center>
            <button
              style={{
                backgroundColor: 'blue',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
              }}
              type="submit"
            >
              Join A Room
            </button>
          </center>
        </form>
      ) : (
        socket && <Chat socket={socket} username={username} room={room} />
      )}
    </div>
  );
}

export default App;
