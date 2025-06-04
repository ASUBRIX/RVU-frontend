import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { FaPaperPlane, FaPaperclip, FaUserShield, FaFile, FaImage } from 'react-icons/fa';
import { useAuthContext } from '@/context/useAuthContext';

const baseURL = import.meta.env.VITE_API_BASE_URL;
const socket = io(baseURL);

const StudentChatPage = () => {
  const { user } = useAuthContext();
  const userId = user?.id;

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Join student room and fetch history on mount
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

  // Auto-scroll to latest message
  useEffect(() => {
    if (messagesEndRef.current)
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send new text message
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

  // (Optional) Add file upload logic here for future support

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = (msg, idx) => (
    <div
      key={msg.id || idx}
      className={`d-flex ${msg.sender === 'student' ? 'justify-content-end' : 'justify-content-start'} mb-2`}
    >
      <div className={`p-2 rounded ${msg.sender === 'student' ? 'bg-primary text-white' : 'bg-light'}`} style={{ maxWidth: '75%' }}>
        {msg.type === 'file'
          ? (
            <div>
              {msg.file_type === 'pdf' ? <FaFile /> : <FaImage />}
              <div>{msg.text}</div>
              <div className="small text-muted">{msg.file_size}</div>
            </div>
          )
          : <div>{msg.text}</div>
        }
        <div className="d-flex justify-content-end align-items-center gap-1 mt-1 small text-muted">
          <span>{formatTime(msg.timestamp)}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="chat-page">
      <Container fluid>
        <Row className="justify-content-center">
          <Col md={8} lg={10} className="p-0">
            <div className="chat-container">
              <div className="chat-header p-3 d-flex justify-content-between align-items-center bg-light">
                <div className="d-flex align-items-center">
                  <FaUserShield className="me-2" size={20} />
                  <h5 className="mb-0">Admin Support</h5>
                </div>
              </div>
              <div className="chat-messages p-3" style={{ height: '70vh', overflowY: 'auto', background: '#f9f9fb' }}>
                {messages.map(renderMessage)}
                <div ref={messagesEndRef}></div>
              </div>
              <div className="chat-input p-3 border-top bg-white">
                <Form onSubmit={handleSend} className="d-flex align-items-center gap-2">
                  <Button variant="light" onClick={() => fileInputRef.current && fileInputRef.current.click()} disabled>
                    <FaPaperclip />
                  </Button>
                  <Form.Control
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    autoFocus
                  />
                  <Button variant="primary" type="submit" disabled={!newMessage.trim()}>
                    <FaPaperPlane />
                  </Button>
                </Form>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="d-none"
                  accept="image/*,.pdf,.doc,.docx"
                  disabled
                />
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default StudentChatPage;
