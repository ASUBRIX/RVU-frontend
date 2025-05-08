// components/QuestionNavigator.jsx
import React from 'react'
import { Card } from 'react-bootstrap'
// import './QuestionNavigator.scss';

const QuestionNavigator = ({ questions, currentQuestionIndex, setCurrentQuestionIndex }) => {
  return (
    <Card className="question-navigator">
      <Card.Body>
        <div className="indicators d-flex justify-content-center flex-wrap">
          {questions.map((question, index) => {
            let indicatorClass = 'question-indicator'

            // Check if the user has visited the question
            const isVisited = question.selectedOption !== null || index < currentQuestionIndex

            // Default to "not visited" (grey)
            if (!isVisited) {
              indicatorClass += ' not-visited'
            }

            // If visited but not answered, make it red
            if (isVisited && question.selectedOption === null) {
              indicatorClass = 'question-indicator not-answered'
            }

            // If answered, make it green
            if (question.selectedOption !== null) {
              indicatorClass = 'question-indicator answered'
            }

            // If marked for review, make it yellow
            if (question.markedForReview) {
              indicatorClass = 'question-indicator marked-for-review'
            }

            // If current question, highlight it
            if (index === currentQuestionIndex) {
              indicatorClass += ' current'
            }

            return (
              <div 
                key={question.id} 
                className={indicatorClass} 
                onClick={() => setCurrentQuestionIndex(index)}
                title={`Go to Question ${index + 1}`}
              >
                {index + 1}
                {question.selectedOption !== null && question.markedForReview && <span className="answer-badge"></span>}
              </div>
            )
          })}
        </div>
      </Card.Body>
    </Card>
  )
}

export default QuestionNavigator
