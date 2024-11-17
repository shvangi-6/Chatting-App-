import React, { useState, useEffect } from 'react';

function Chat({ socket, username, room }) {
    const [currentMessage, setCurrentMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);

    const sendMessage = async () => {
        if (currentMessage !== '') {
            const messageData = {
                room: room,
                author: username,
                message: currentMessage,
                time: `${new Date(Date.now()).getHours()}:${new Date(Date.now()).getMinutes()}`,
            };

            // Ensure the user joins the room before sending a message
            socket.emit('join_room', { room: room });

            await socket.emit('send_message', messageData);
            setCurrentMessage(''); // Clear the input field after sending the message
        }
    };

    useEffect(() => {
        socket.on('receive_message', (data) => {
            // Update chat history with new message
            setChatHistory((prevHistory) => [...prevHistory, data]);
        });

        return () => {
            socket.off('receive_message');
        };
    }, [socket]);

    return (
        <div className="chat-window">
            <div className="chat-header">
                <p>Live Chat</p>
            </div>
            <div className="chat-body">
                {chatHistory.map((message, index) => (
                    <div
                        key={index}
                        className={message.author === username ? 'sent-message' : 'received-message'}
                    >
                        <div className="message-content">
                            <p>{message.message}</p>
                            <p>{message.time}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="chat-footer">
                <input
                    type="text"
                    placeholder="Hey..."
                    value={currentMessage}
                    onChange={(event) => {
                        setCurrentMessage(event.target.value);
                    }}
                />
                <button onClick={sendMessage}>&#9658;</button>
            </div>
        </div>
    );
}

export default Chat;
