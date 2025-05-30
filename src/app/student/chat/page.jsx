import { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { FaPaperPlane, FaFile, FaImage, FaPaperclip, FaUserShield } from 'react-icons/fa';
import { BsCheck2, BsCheck2All } from 'react-icons/bs';
import io from 'socket.io-client';

const socket = io('https://server.pudhuyugamacademy.com'); 

const StudentChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [shouldScroll, setShouldScroll] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    socket.on('chat_message', (msg) => {
      setShouldScroll(true);
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off('chat_message');
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, shouldScroll]);

  const scrollToBottom = () => {
    if (shouldScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      setShouldScroll(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const newMsg = {
        id: Date.now(),
        text: newMessage,
        sender: 'instructor',
        timestamp: new Date().toISOString(),
        status: 'sent',
        type: 'text'
      };
      setMessages([...messages, newMsg]);
      socket.emit('chat_message', newMsg);
      setNewMessage('');
      setShouldScroll(true);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const newMsg = {
        id: Date.now(),
        text: file.name,
        sender: 'instructor',
        timestamp: new Date().toISOString(),
        status: 'sent',
        type: 'file',
        fileType: file.type.split('/')[1],
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      };
      setMessages([...messages, newMsg]);
      socket.emit('chat_message', newMsg);
      setShouldScroll(true);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessageStatus = (status) => {
    switch (status) {
      case 'sent': return <BsCheck2 />;
      case 'delivered': return <BsCheck2All />;
      case 'read': return <BsCheck2All className="text-primary" />;
      default: return null;
    }
  };

  const renderFileMessage = (msg) => {
    const icon = msg.fileType === 'pdf' ? <FaFile /> : <FaImage />;
    return (
      <div className="file-message">
        {icon}
        <div>
          <div>{msg.text}</div>
          <div className="small text-muted">{msg.fileSize}</div>
        </div>
      </div>
    );
  };

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
              <div className="chat-messages p-3" style={{ height: '70vh', overflowY: 'auto' }}>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`d-flex ${msg.sender === 'instructor' ? 'justify-content-end' : 'justify-content-start'} mb-2`}
                  >
                    <div className={`p-2 rounded ${msg.sender === 'instructor' ? 'bg-primary text-white' : 'bg-light'}`} style={{ maxWidth: '75%' }}>
                      {msg.type === 'file' ? renderFileMessage(msg) : <div>{msg.text}</div>}
                      <div className="d-flex justify-content-end align-items-center gap-1 mt-1 small text-muted">
                        <span>{formatTime(msg.timestamp)}</span>
                        {msg.sender === 'instructor' && renderMessageStatus(msg.status)}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef}></div>
              </div>
              <div className="chat-input p-3 border-top bg-white">
                <Form onSubmit={handleSubmit} className="d-flex align-items-center gap-2">
                  <Button variant="light" onClick={() => fileInputRef.current.click()}><FaPaperclip /></Button>
                  <Form.Control
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <Button variant="primary" type="submit"><FaPaperPlane /></Button>
                </Form>
                <input type="file" ref={fileInputRef} className="d-none" onChange={handleFileUpload} accept="image/*,.pdf,.doc,.docx" />
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default StudentChatPage;

