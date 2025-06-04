import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { Container, Row, Col, Form, Button, ListGroup, Spinner } from 'react-bootstrap';
import { FaPaperPlane, FaUserGraduate, FaSearch } from 'react-icons/fa';
import { useAuthContext } from '@/context/useAuthContext';

const baseURL = import.meta.env.VITE_API_BASE_URL;
const socket = io(baseURL);

const AdminChatPage = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const messagesEndRef = useRef(null);
  const { user: adminUser } = useAuthContext();

  
  useEffect(() => {
    axios.get(`${baseURL}/api/chat/students`)
      .then(res => setStudents(res.data))
      .catch(() => setStudents([]));
  }, []);

  
  useEffect(() => {
    if (!selectedStudent) return;
    setLoadingMsgs(true);
    socket.emit('join_room', selectedStudent.id);
    axios.get(`${baseURL}/api/chat/history/${selectedStudent.id}`)
      .then(res => setMessages(res.data))
      .finally(() => setLoadingMsgs(false));
    socket.on('chat_message', (msg) => {
      if (msg.userId === selectedStudent.id) {
        setMessages(prev => [...prev, msg]);
      }
    });
    return () => socket.off('chat_message');
  }, [selectedStudent]);

  useEffect(() => {
    if (messagesEndRef.current)
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Sending a new message as admin
  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedStudent) return;
    const msg = {
      userId: selectedStudent.id,
      sender: 'admin',
      text: newMessage,
      type: 'text',
      timestamp: new Date().toISOString()
    };
    const { data: savedMsg } = await axios.post(`${baseURL}/api/chat/send`, msg);
    setMessages([...messages, savedMsg]);
    socket.emit('chat_message', savedMsg);
    setNewMessage('');
  };

  // Filter students by search
  const filteredStudents = students.filter(stu =>
    stu.name?.toLowerCase().includes(search.toLowerCase()) ||
    stu.email?.toLowerCase().includes(search.toLowerCase())
  );

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Container fluid>
      <Row>
        {/* Student List Sidebar */}
        <Col md={4} className="border-end" style={{ height: '85vh', overflowY: 'auto' }}>
          <div className="p-3 border-bottom">
            <h5>Student Chats</h5>
            <Form.Control
              type="text"
              placeholder="Search by name or email"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="my-2"
            />
          </div>
          <ListGroup variant="flush">
            {filteredStudents.length > 0 ? filteredStudents.map(stu => (
              <ListGroup.Item
                key={stu.id}
                action
                onClick={() => setSelectedStudent(stu)}
                active={selectedStudent && selectedStudent.id === stu.id}
                className="d-flex align-items-center"
                style={{ cursor: 'pointer' }}
              >
                <FaUserGraduate className="me-2 text-primary" size={20} />
                <div>
                  <div><strong>{stu.name}</strong></div>
                  <div className="small text-muted">{stu.email}</div>
                </div>
              </ListGroup.Item>
            )) : (
              <ListGroup.Item>
                <span className="text-muted">No students found.</span>
              </ListGroup.Item>
            )}
          </ListGroup>
        </Col>
        {/* Chat Window */}
        <Col md={8} style={{ height: '85vh', display: 'flex', flexDirection: 'column' }}>
          <div className="p-3 border-bottom" style={{ minHeight: 70 }}>
            {selectedStudent ? (
              <div className="d-flex align-items-center">
                <FaUserGraduate className="me-2" size={24} />
                <h5 className="mb-0">{selectedStudent.name}</h5>
                <span className="ms-2 small text-muted">{selectedStudent.email}</span>
              </div>
            ) : (
              <span className="text-muted">Select a student to view chat</span>
            )}
          </div>
          <div className="flex-grow-1 p-3" style={{ overflowY: 'auto', background: '#f9f9fb' }}>
            {loadingMsgs && <Spinner animation="border" size="sm" />}
            {selectedStudent && messages.length === 0 && !loadingMsgs && (
              <div className="text-center text-muted">No messages yet</div>
            )}
            {selectedStudent && messages.map((msg, idx) => (
              <div
                key={msg.id || idx}
                className={`d-flex ${msg.sender === 'admin' ? 'justify-content-end' : 'justify-content-start'} mb-2`}
              >
                <div className={`p-2 rounded ${msg.sender === 'admin' ? 'bg-primary text-white' : 'bg-light'}`} style={{ maxWidth: '75%' }}>
                  {msg.text}
                  <div className="d-flex justify-content-end align-items-center gap-1 mt-1 small text-muted">
                    <span>{formatTime(msg.timestamp)}</span>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef}></div>
          </div>
          {/* Chat input */}
          <div className="p-3 border-top bg-white">
            <Form onSubmit={handleSend} className="d-flex align-items-center gap-2">
              <Form.Control
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                disabled={!selectedStudent}
              />
              <Button type="submit" variant="primary" disabled={!selectedStudent || !newMessage.trim()}>
                <FaPaperPlane />
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminChatPage;
