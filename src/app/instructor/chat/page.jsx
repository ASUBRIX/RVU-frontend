import { useState, useEffect, useRef } from 'react'
import { Container, Row, Col, Form, Button, Badge } from 'react-bootstrap'
import { FaPaperPlane, FaFile, FaImage, FaPaperclip, FaUserShield } from 'react-icons/fa'
import { BsCheck2, BsCheck2All, BsThreeDots } from 'react-icons/bs'

const InstructorChatPage = () => {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [adminOnline, setAdminOnline] = useState(true)
  const [shouldScroll, setShouldScroll] = useState(false)
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)

  // Simulated admin data
  const admin = {
    name: 'Admin Support',
    avatar: '/assets/images/avatar/admin.png',
    lastSeen: 'Active now',
  }

  // Simulated instructor data
  const instructor = {
    name: 'John Doe',
    avatar: '/assets/images/avatar/user.png',
  }

  useEffect(() => {
    // Simulate some initial messages
    setMessages([
      {
        id: 1,
        text: 'Hello! Welcome to Puthuyugam. How can I assist you today?',
        sender: 'admin',
        timestamp: new Date().toISOString(),
        status: 'read',
        type: 'text',
      }
    ])
  }, [])

  const scrollToBottom = () => {
    if (shouldScroll && messagesEndRef.current) {
      const chatContainer = messagesEndRef.current.parentElement
      chatContainer.scrollTop = chatContainer.scrollHeight
      setShouldScroll(false)
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, shouldScroll])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (newMessage.trim()) {
      setShouldScroll(true)
      const newMsg = {
        id: Date.now(),
        text: newMessage,
        sender: 'instructor',
        timestamp: new Date().toISOString(),
        status: 'sent',
        type: 'text',
      }
      setMessages([...messages, newMsg])
      setNewMessage('')

      // Simulate admin typing
      setIsTyping(true)
      setTimeout(() => {
        setIsTyping(false)
        // Simulate admin response
        setShouldScroll(true)
        const adminResponse = {
          id: Date.now() + 1,
          text: "Thank you for your message. I'll look into this and get back to you shortly.",
          sender: 'admin',
          timestamp: new Date().toISOString(),
          status: 'sent',
          type: 'text',
        }
        setMessages((prev) => [...prev, adminResponse])
      }, 3000)
    }
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setShouldScroll(true)
      const newMsg = {
        id: Date.now(),
        text: file.name,
        sender: 'instructor',
        timestamp: new Date().toISOString(),
        status: 'sent',
        type: 'file',
        fileType: file.type.split('/')[1],
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      }
      setMessages([...messages, newMsg])
    }
  }

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const formatMessageDate = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })
  }

  const renderMessageStatus = (status) => {
    switch (status) {
      case 'sent':
        return <BsCheck2 className="message-status" />
      case 'delivered':
        return <BsCheck2All className="message-status" />
      case 'read':
        return <BsCheck2All className="message-status text-primary" />
      default:
        return null
    }
  }

  const renderFileMessage = (message) => {
    const icon = message.fileType === 'pdf' ? <FaFile /> : <FaImage />
    return (
      <div className="file-message">
        {icon}
        <div className="file-details">
          <span className="file-name">{message.text}</span>
          <span className="file-size">{message.fileSize}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="chat-page">
      <Container fluid>
        <Row className="justify-content-center">
          <Col md={8} lg={12} className='p-0' >
            <div className="chat-container">
              <div className="chat-header">
                <div className="d-flex align-items-center">
                  <div className="ms-3">
                    <h5 className="mb-0">{admin.name}</h5>
                    <small className="text-muted">puthuyugam</small>
                  </div>
                </div>
                <div className="position-relative">
                  <div className="admin-icon-wrapper">
                    <FaUserShield size={24} className="admin-icon" />
                  </div>
                </div>
              </div>

              <div className="chat-messages">
                {messages.map((message, index) => {
                  const showDate = index === 0 || formatMessageDate(message.timestamp) !== formatMessageDate(messages[index - 1].timestamp)

                  return (
                    <div key={message.id}>
                      {showDate && (
                        <div className="message-date-divider">
                          <span>{formatMessageDate(message.timestamp)}</span>
                        </div>
                      )}
                      <div className={`message ${message.sender === 'instructor' ? 'message-sent' : 'message-received'}`}>
                        <div className="message-content">
                          {message.type === 'file' ? renderFileMessage(message) : <p>{message.text}</p>}
                          <div className="message-meta">
                            <small className="message-time">{formatMessageTime(message.timestamp)}</small>
                            {message.sender === 'instructor' && renderMessageStatus(message.status)}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
                {isTyping && (
                  <div className="message message-received">
                    <div className="message-content">
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="chat-input">
                <Form onSubmit={handleSubmit}>
                  <div className="input-group">
                    <Button variant="link" className="btn-attachment" onClick={() => fileInputRef.current.click()}>
                      <FaPaperclip />
                    </Button>
                    <Form.Control type="text" placeholder="Type your message..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
                    <Button type="submit" variant="primary">
                      <FaPaperPlane />
                    </Button>
                  </div>
                </Form>
                <input type="file" ref={fileInputRef} className="d-none" onChange={handleFileUpload} accept="image/*,.pdf,.doc,.docx" />
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default InstructorChatPage
