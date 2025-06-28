// File: client/src/pages/Chat.js
import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './Chat.css';

// Replace with your deployed backend URL:
const SOCKET_URL = 'https://motouber-web-production.up.railway.app';

export default function Chat({ room, user }) {
  const [socket]    = useState(() => io(SOCKET_URL));
  const [messages, setMessages] = useState([]);
  const [text, setText]         = useState('');
  const endRef      = useRef();

  useEffect(() => {
    socket.emit('join', room);
    socket.on('chatMessage', (msg) => {
      setMessages((msgs) => [...msgs, msg]);
    });
    return () => {
      socket.disconnect();
    };
  }, [room, socket]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    socket.emit('chatMessage', { room, user, message: text });
    setText('');
  };

  return (
    <div className="chat-container">
      <div className="chat-header">Chat: {room}</div>
      <div className="chat-messages">
        {messages.map((m, i) => (
          <div
            key={i}
            className={m.user === user ? 'my-message' : 'other-message'}
          >
            <strong>{m.user}</strong>: {m.message}
            <div className="timestamp">
              {new Date(m.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <form className="chat-form" onSubmit={send}>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
