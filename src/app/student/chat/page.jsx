import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import {
  Container,
  Form,
  Button
} from 'react-bootstrap';
import {
  FaPaperPlane,
  FaUserShield
} from 'react-icons/fa';
import { useAuthContext } from '@/context/useAuthContext';

const baseURL = import.meta.env.VITE_API_BASE_URL;
const socket = io(baseURL);

const StudentChatPage = () => {
  const { user } = useAuthContext();
  const userId = user?.id;

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!userId) return;

    socket.emit('join_room', userId);

    axios.get(`${baseURL}/api/chat/history/${userId}`)
      .then(res => setMessages(res.data))
      .catch(() => setMessages([]));

    socket.on('chat_message', (msg) => {
      if (msg.userId === userId) {
        setMessages(prev => [...prev, msg]);
      }
    });

    return () => socket.off('chat_message');
  }, [userId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !userId) return;

    const msg = {
      userId,
      sender: 'student',
      text: newMessage,
      type: 'text',
      timestamp: new Date().toISOString()
    };

    const { data: savedMsg } = await axios.post(`${baseURL}/api/chat/send`, msg);
    setMessages(prev => [...prev, savedMsg]);
    socket.emit('chat_message', savedMsg);
    setNewMessage('');
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Container className="py-4" style={{ maxWidth: '900px' }}>
      {/* Header */}
      <div className="d-flex align-items-center mb-3">
        <FaUserShield className="me-2" size={20} />
        <h5 className="mb-0">Admin Support</h5>
      </div>

      {/* Chat area */}
      <div style={{ height: '65vh', overflowY: 'auto', background: '#f9f9fb' }} className="p-3 mb-3 rounded border">
        {messages.length === 0 && (
          <div className="text-center text-muted">No messages yet</div>
        )}
        {messages.map((msg, idx) => (
          <div
            key={msg.id || idx}
            className={`d-flex ${msg.sender === 'student' ? 'justify-content-end' : 'justify-content-start'} mb-2`}
          >
            {/* Admin Avatar */}
            {msg.sender !== 'student' && (
              <div
                className="me-2 d-flex align-items-center justify-content-center rounded-circle"
                style={{
                  width: 36,
                  height: 36,
                  backgroundColor: '#ed155a',
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: 14,
                  flexShrink: 0
                }}
              >
                A
              </div>
            )}

            {/* Message Bubble */}
            <div
              className={`p-2 rounded ${msg.sender === 'student' ? 'bg-primary text-white' : 'bg-light text-dark'}`}
              style={{ maxWidth: '75%' }}
            >
              <div>{msg.text}</div>
              <div className="d-flex justify-content-end align-items-center gap-1 mt-1 small text-muted">
                <span>{formatTime(msg.timestamp)}</span>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>

      {/* Input */}
      <Form onSubmit={handleSend} className="d-flex align-items-center gap-2">
        <Form.Control
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          autoFocus
        />
        <Button type="submit" variant="primary" disabled={!newMessage.trim()}>
          <FaPaperPlane />
        </Button>
      </Form>
    </Container>
  );
};

export default StudentChatPage;
