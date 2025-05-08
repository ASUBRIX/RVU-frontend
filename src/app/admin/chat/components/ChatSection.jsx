import { useState, useRef, useEffect } from 'react';
import { Card, Form, InputGroup, Row, Col } from 'react-bootstrap';
import { FaSearch, FaPaperPlane, FaUserGraduate } from 'react-icons/fa';
import chatIcon from '@/assets/images/avatar/01.jpg'; // You might need to change this to an appropriate image

const ChatSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const messageInputRef = useRef(null);

  const adjustTextareaHeight = (element) => {
    element.style.height = 'auto';
    element.style.height = `${Math.min(element.scrollHeight, 100)}px`;
  };

  useEffect(() => {
    if (messageInputRef.current) {
      messageInputRef.current.style.height = '40px';
    }
  }, []);

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
    adjustTextareaHeight(e.target);
  };

  // Mock data for chats
  const [chats] = useState([
    {
      id: 1,
      name: 'John Smith',
      avatar: null,
      lastMessage: 'Hello, when is the next class?',
      phone: '+1 (555) 123-4567',
      unread: 2,
      messages: [
        {
          content: 'Hello, when is the next class?',
          sent: false,
          time: '10:30 AM'
        },
        {
          content: 'Hi John, the next class is scheduled for tomorrow at 2 PM.',
          sent: true,
          time: '10:32 AM'
        },
        {
          content: 'Will there be any assignments?',
          sent: false,
          time: '10:33 AM'
        }
      ]
    },
    {
      id: 2,
      name: 'Emily Johnson',
      avatar: null,
      lastMessage: 'Thank you for your help!',
      phone: '+1 (555) 234-5678',
      unread: 0,
      messages: [
        {
          content: 'I have a question about the last assignment.',
          sent: false,
          time: 'Yesterday'
        },
        {
          content: 'Sure, what would you like to know?',
          sent: true,
          time: 'Yesterday'
        },
        {
          content: 'I was confused about the third question.',
          sent: false,
          time: 'Yesterday'
        },
        {
          content: 'Let me explain: you need to apply the formula we discussed in class.',
          sent: true,
          time: 'Yesterday'
        },
        {
          content: 'Thank you for your help!',
          sent: false,
          time: 'Yesterday'
        }
      ]
    },
    {
      id: 3,
      name: 'Michael Davis',
      avatar: null,
      lastMessage: 'Can I get a copy of yesterday\'s notes?',
      phone: '+1 (555) 345-6789',
      unread: 1,
      messages: [
        {
          content: 'Can I get a copy of yesterday\'s notes?',
          sent: false,
          time: '2 days ago'
        }
      ]
    }
  ]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && selectedChat) {
      // Add logic to send message
      const newMessage = {
        content: message,
        sent: true,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      // Update the chats array with the new message
      const updatedChats = chats.map(chat => {
        if (chat.id === selectedChat.id) {
          return {
            ...chat,
            messages: [...chat.messages, newMessage],
            lastMessage: message
          };
        }
        return chat;
      });
      
      // Update the selected chat with the new message
      setSelectedChat({
        ...selectedChat,
        messages: [...selectedChat.messages, newMessage],
        lastMessage: message
      });
      
      setMessage('');
      messageInputRef.current.focus();
    }
  };

  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <Card.Body className="p-0">
        <Row className="g-0 chat-section">
          {/* Left sidebar - Chat list */}
          <Col md={4} className="border-end">
            <div className="p-3 border-bottom">
              <h5 className="mb-3">Chats</h5>
              <InputGroup className="mb-3">
                <InputGroup.Text className="bg-light border-0">
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search by name or number"
                  aria-label="Search chats"
                  className="border-0 bg-light"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </InputGroup>
            </div>

            {/* Chat list */}
            <div className="chat-list">
              {filteredChats.length > 0 ? (
                filteredChats.map((chat) => (
                  <div 
                    key={chat.id}
                    className={`chat-item p-3 border-bottom ${selectedChat?.id === chat.id ? 'bg-light' : ''}`}
                    onClick={() => handleSelectChat(chat)}
                  >
                    <div className="d-flex align-items-center">
                      <div className="avatar me-3 position-relative">
                        <img 
                          src={chat.avatar || chatIcon} 
                          alt={chat.name} 
                          className="rounded-circle"
                          width={40}
                          height={40}
                        />
                      </div>
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-center">
                          <h6 className="mb-0">{chat.name}</h6>
                          {chat.unread > 0 && (
                            <span className="badge bg-danger rounded-pill">{chat.unread}</span>
                          )}
                        </div>
                        <p className="small text-truncate mb-0 message-preview">
                          {chat.phone}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="d-flex flex-column align-items-center justify-content-center text-center p-5">
                  <div className="icon-wrapper mb-3">
                    <FaUserGraduate size={50} className="text-info opacity-50" />
                  </div>
                  <h5>No conversations found</h5>
                </div>
              )}
            </div>
          </Col>

          {/* Right side - Chat area */}
          <Col md={8} className="chat-input-wrapper">
            {selectedChat ? (
              <>
                {/* Chat header */}
                <div className="p-3 border-bottom">
                  <div className="d-flex align-items-center">
                    <div className="avatar me-3 position-relative">
                      <img 
                        src={selectedChat.avatar || chatIcon} 
                        alt={selectedChat.name} 
                        className="rounded-circle"
                        width={40}
                        height={40}
                      />
                    </div>
                    <div>
                      <h5 className="mb-0">{selectedChat.name}</h5>
                      <p className="small text-muted mb-0">
                        {selectedChat.phone}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Chat messages */}
                <div className="chat-messages p-3">
                  {selectedChat.messages && selectedChat.messages.length > 0 ? (
                    selectedChat.messages.map((msg, index) => (
                      <div 
                        key={index}
                        className={`message mb-3 ${msg.sent ? 'ms-auto' : ''}`}
                      >
                        <div className={`p-3 rounded ${msg.sent ? 'bg-primary text-white' : 'bg-light'}`}>
                          {msg.content}
                        </div>
                        <div className={`small text-muted mt-1 ${msg.sent ? 'text-end' : ''}`}>
                          {msg.time}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="d-flex flex-column align-items-center justify-content-center h-100 text-center">
                      <div className="icon-wrapper mb-3">
                        <img 
                          src="/assets/images/message-icon.png" 
                          alt="Start chatting" 
                          width={100}
                          height={100}
                          className="chat-bubble-icon"
                        />
                      </div>
                      <h5>No messages yet</h5>
                      <p className="text-muted">Send a message to start the conversation</p>
                    </div>
                  )}
                </div>

                {/* Message input */}
                <div className="chat-input-container">
                  <Form onSubmit={handleSendMessage}>
                    <InputGroup>
                      <Form.Control
                        as="textarea"
                        rows={1}
                        placeholder="Type a message..."
                        aria-label="Message"
                        value={message}
                        onChange={handleMessageChange}
                        ref={messageInputRef}
                        className="chat-input"
                      />
                      <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={!message.trim()}
                      >
                        <FaPaperPlane />
                      </button>
                    </InputGroup>
                  </Form>
                </div>
              </>
            ) : (
              // No conversation selected state
              <div className="d-flex flex-column align-items-center justify-content-center h-100 text-center p-5">
                <div className="icon-wrapper mb-4">
                  <div className="chat-bubble-icon">
                    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M60 110C88.1665 110 111 87.1665 111 59C111 30.8335 88.1665 8 60 8C31.8335 8 9 30.8335 9 59C9 70.2195 12.9 80.5975 19.593 88.9275C20.4015 90.0225 20.7435 91.401 20.4795 92.8215L17.4 110L35.0235 102.897C36.1185 102.453 37.3575 102.453 38.4525 102.87C45.2505 105.618 52.422 107.112 60 107.112C61.0275 107.112 62.0415 107.085 63.042 107.031C62.028 105.051 61.5 102.834 61.5 100.5C61.5 90.8445 69.345 83 79.5 83C83.3625 83 86.9175 84.285 89.7 86.4C93.9825 79.797 96 69.954 96 59C96 39.167 79.833 23 60 23C40.167 23 24 39.167 24 59C24 78.833 40.167 95 60 95C61.9935 95 64.5975 94.739 67.5 94.217C68.4045 94.0305 69.4185 94.4505 69.9045 95.292C71.8845 98.427 75.4395 100.5 79.5 100.5C85.7175 100.5 90.69 95.691 91.137 89.5755C90.1095 89.8665 89.0415 90 87.945 90C74.529 90 63.687 79.158 63.687 65.742C63.687 52.326 74.529 41.484 87.945 41.484C101.361 41.484 112.203 52.326 112.203 65.742C112.203 73.1955 108.87 79.851 103.5 84.051C103.581 85.6785 103.5 87.3465 103.5 89.0145C103.5 97.527 102.222 105.618 95.2635 110H60Z" fill="#0d6efd" fillOpacity="0.2"/>
                      <path d="M79.5 92.25C83.6421 92.25 87 88.8921 87 84.75C87 80.6079 83.6421 77.25 79.5 77.25C75.3579 77.25 72 80.6079 72 84.75C72 88.8921 75.3579 92.25 79.5 92.25Z" fill="#0d6efd" fillOpacity="0.3"/>
                    </svg>
                  </div>
                </div>
                <h3>No conversation selected</h3>
                <p className="text-muted">
                  Select a conversation from the left panel
                </p>
              </div>
            )}
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default ChatSection; 