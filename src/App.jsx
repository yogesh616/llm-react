import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StreamComponent = () => {
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState('what is atom');

  useEffect(() => {
    const eventSource = new EventSource(`http://localhost:3000/api?user=${user}`);

    eventSource.onmessage = (event) => {
        const newMessage = JSON.parse(event.data);
        if (newMessage.result) {
            setMessages((prevMessages) => [newMessage.result]);
        }
    };

    eventSource.onerror = (err) => {
        console.error('EventSource failed:', err);
        eventSource.close();
    };

    // Cleanup on unmount
    return () => {
        eventSource.close();
    };
}, [user]); // React to changes in the 'user' state


  return (
    <div>
      <h1>Streamed Messages</h1>
      <input onChange={(e)=> setUser(e.target.value) } />
      <ul>
        {/* Iterate over all messages and render each one */}
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
    </div>
  );
};

export default StreamComponent;
