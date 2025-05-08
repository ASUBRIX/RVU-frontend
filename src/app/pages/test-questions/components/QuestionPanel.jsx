// components/QuestionPanel.jsx
import React from 'react';
import { Card, Form, Button, Badge } from 'react-bootstrap';
import { BookmarkFill, BookmarkCheckFill } from 'react-bootstrap-icons';
// import './QuestionPanel.scss';

// Add inline styles for Tamil text rendering
const styles = {
  tamilText: {
    fontFamily: "'Noto Sans Tamil', 'Latha', 'Tamil MN', sans-serif",
    fontSize: "1.1em",
    lineHeight: "1.6",
    color: "#333",
    borderTop: "1px solid #eee",
    paddingTop: "0.5rem",
    marginTop: "0.5rem"
  }
};

const QuestionPanel = ({ question, onOptionSelect, onMarkForReview }) => {
  if (!question) return null;
  
  return (
    <Card className="question-panel">
      <Card.Header>
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <Badge bg="primary" className="question-number me-2">{question.id}</Badge>
            <h5 className="mb-0">Question</h5>
          </div>
          <Button 
            variant={question.markedForReview ? "warning" : "outline-warning"}
            onClick={onMarkForReview}
            className="mark-review-btn d-flex align-items-center"
          >
            {question.markedForReview ? (
              <>
                <BookmarkCheckFill className="me-1" />
                Marked for Review
              </>
            ) : (
              <>
                <BookmarkFill className="me-1" />
                Mark for Review
              </>
            )}
          </Button>
        </div>
      </Card.Header>
      <Card.Body>
        <div>
          <p className="mb-2">{question.question}</p>
          {question.question_tamil && (
            <p style={styles.tamilText}>{question.question_tamil}</p>
          )}
        </div>
        <Form>
          {question.options && question.options.map((option, index) => (
            <Form.Check
              className="mb-3"
              key={index}
              id={`option-${question.id}-${index}`}
              type="radio"
              name={`question-${question.id}`}
              checked={question.selectedOption === index}
              onChange={() => onOptionSelect(index)}
              label={
                <div>
                  <span>{option}</span>
                  {question.options_tamil && question.options_tamil[index] && (
                    <div style={styles.tamilText}>{question.options_tamil[index]}</div>
                  )}
                </div>
              }
            />
          ))}
        </Form>
      </Card.Body>
    </Card>
  );
};

export default QuestionPanel;