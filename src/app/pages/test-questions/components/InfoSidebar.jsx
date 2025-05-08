// components/InfoSidebar.jsx
import React from 'react';
import { Card, Badge, ProgressBar, Button } from 'react-bootstrap';
import { TbArrowBigLeftLines, TbArrowBigRightLines } from "react-icons/tb";
import { PersonFill, ClockFill, BookmarkCheckFill, XLg } from 'react-bootstrap-icons';

// import './InfoSidebar.scss';

const InfoSidebar = ({ 
  isOpen, 
  toggleSidebar, 
  testName = "General Knowledge Assessment",
  totalQuestions = 5,
  answeredQuestions = 0,
  markedQuestions = 0,
  timeRemaining = "00:00"
}) => {
  // Sample student data
  const studentName = "John Doe";
  const studentId = "STU12345";
  
  const progressPercentage = Math.round((answeredQuestions / totalQuestions) * 100);
  
  return (
    <div className={`info-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-tab" onClick={toggleSidebar}>
        <span className="sidebar-tab-text">
          {isOpen ? <TbArrowBigLeftLines size={24}/> : <TbArrowBigRightLines size={24}/> }
        </span>
      </div>
      
      {isOpen && (
        <div className="sidebar-content">
          <div className="d-flex justify-content-between align-items-center mb-3 d-md-none">
            <h5 className="mb-0">Test Info</h5>
            <Button 
              variant="link" 
              className="p-0 text-muted" 
              onClick={toggleSidebar}
              aria-label="Close sidebar"
            >
              <XLg size={20} />
            </Button>
          </div>
          
          <Card className="mb-4">
            <Card.Body>
              <div className="d-flex align-items-center mb-3">
                <div className="student-avatar">
                  <PersonFill size={24} />
                </div>
                <div className="ms-3">
                  <h5 className="mb-0">{studentName}</h5>
                  <span className="text-muted">{studentId}</span>
                </div>
              </div>
              
              {/* <h6 className="sidebar-section-title">
                <BookmarkCheckFill className="me-2" />
                Current Exam
              </h6>
              <div className="exam-info mb-3">
                <div className="current-exam-name">{testName}</div>
                <div className="d-flex align-items-center mt-2">
                  <ClockFill size={14} className="me-2 text-danger" />
                  <span className="text-muted">{timeRemaining} remaining</span>
                </div>
              </div> */}
              
              <h6 className="sidebar-section-title">Progress</h6>
              <div className="mb-2 d-flex justify-content-between">
                <span>Completion</span>
                <Badge bg="primary">{progressPercentage}%</Badge>
              </div>
              <ProgressBar now={progressPercentage} className="mb-3" variant="primary" />
              
              <div className="d-flex justify-content-between text-center">
                <div className="progress-stat">
                  <div className="progress-stat-value">{totalQuestions}</div>
                  <div className="progress-stat-label">Total</div>
                </div>
                <div className="progress-stat">
                  <div className="progress-stat-value">{answeredQuestions}</div>
                  <div className="progress-stat-label">Answered</div>
                </div>
                <div className="progress-stat">
                  <div className="progress-stat-value">{markedQuestions}</div>
                  <div className="progress-stat-label">Marked</div>
                </div>
              </div>
            </Card.Body>
          </Card>
          
          <Card>
            <Card.Body>
              <Card.Title>Question Indicators</Card.Title>
              <div className="indicator-legend">
                <div className="d-flex align-items-center mb-2">
                  <div className="sample-indicator not-visited">1</div>
                  <span>Not Visited</span>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <div className="sample-indicator not-answered">2</div>
                  <span>Not Answered</span>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <div className="sample-indicator answered">3</div>
                  <span>Answered</span>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <div className="sample-indicator marked-for-review">4</div>
                  <span>Marked for Review</span>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <div className="sample-indicator answered marked-for-review">
                    <span className="answer-badge"></span>
                    5
                  </div>
                  <span>Answered & Marked for Review</span>
                </div>
                <div className="d-flex align-items-center">
                  <div className="sample-indicator current">6</div>
                  <span>Current Question</span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      )}
    </div>
  );
};

export default InfoSidebar;