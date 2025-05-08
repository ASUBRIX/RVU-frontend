// App.jsx
import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Button, Modal, Badge, Card, Spinner } from 'react-bootstrap'
import {
  InfoCircleFill,
  Stopwatch,
  CheckCircleFill,
  ArrowLeft,
  ArrowRight,
  HouseFill,
  ExclamationTriangleFill,
  TrophyFill,
} from 'react-bootstrap-icons'
import { useParams, useNavigate } from 'react-router-dom'
import QuestionNavigator from './components/QuestionNavigator'
import QuestionPanel from './components/QuestionPanel'
import InfoSidebar from './components/InfoSidebar'
import { XCircleFill } from 'react-bootstrap-icons'
import { useAuthContext } from '@/context/useAuthContext'
import { useNotificationContext } from '@/context/useNotificationContext'
import authService from '@/helpers/authService'

function TestQuestions() {
  const { testId } = useParams()
  console.log('TestQuestions component received testId from URL params:', testId);
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuthContext()
  const { showNotification } = useNotificationContext()
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [testData, setTestData] = useState(null)
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [showInfoPanel, setShowInfoPanel] = useState(true)
  const [showInstructions, setShowInstructions] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [showExitConfirmation, setShowExitConfirmation] = useState(false)
  const [testResults, setTestResults] = useState({
    totalQuestions: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    unanswered: 0,
    score: 0,
    timeTaken: '',
  })

  // Timer state
  const [timeRemaining, setTimeRemaining] = useState(3600) // 60 minutes in seconds
  const [timerActive, setTimerActive] = useState(true)
  const [timerWarning, setTimerWarning] = useState(false)
  const [startTime] = useState(Date.now())

  // Questions state
  const [questions, setQuestions] = useState([])

  // Fetch test data from API
  useEffect(() => {
    if (!isAuthenticated || !user?.token) {
      setError('Authentication required')
      setLoading(false)
      return
    }

    const fetchTestData = async () => {
      try {
        console.log(`Fetching test data for test ID: ${testId}`)
        
        // Use the API endpoint for taking a test
        const responseData = await authService.getTestToTake(testId, user.token)
        console.log('Test data received:', responseData)
        
        if (!responseData.test) {
          throw new Error('Test data not found in response');
        }
        
        // Set test data
        setTestData(responseData.test)
        
        // Set time remaining if duration is available
        // API provides duration_minutes directly
        if (responseData.test.duration_minutes) {
          const totalSeconds = parseInt(responseData.test.duration_minutes) * 60;
          setTimeRemaining(totalSeconds > 0 ? totalSeconds : 3600)
        }
        
        // Format questions from API response
        const formattedQuestions = responseData.test.questions.map(q => ({
          id: q.id,
          question: q.question?.en, // Question text is in question.en
          question_tamil: q.question?.ta, // Tamil version in question.ta
          options: q.options.map(opt => opt.text?.en), // Options text in text.en
          options_tamil: q.options.map(opt => opt.text?.ta), // Tamil options in text.ta
          optionIds: q.options.map(opt => opt.id),
          selectedOption: null,
          markedForReview: false
        }))
        
        setQuestions(formattedQuestions)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching test:', err)
        
        let errorMessage = 'Failed to load test'
        if (err.response?.status === 401) {
          errorMessage = 'Your session has expired. Please sign in again.'
        } else if (err.response?.data?.error) {
          errorMessage = err.response.data.error
        }
        
        setError(errorMessage)
        showNotification({
          message: errorMessage,
          variant: 'danger'
        })
        
        setLoading(false)
      }
    }

    fetchTestData()
  }, [testId, isAuthenticated, user?.token, showNotification])

  // Calculate test stats
  const answeredCount = questions.filter((q) => q.selectedOption !== null).length
  const markedCount = questions.filter((q) => q.markedForReview).length

  // Timer effect
  useEffect(() => {
    let interval

    if (timerActive && timeRemaining > 0 && !showResults) {
      interval = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1)
      }, 1000)

      // Set warning when less than 5 minutes remaining
      if (timeRemaining <= 300 && !timerWarning) {
        setTimerWarning(true)
      }
    } else if (timeRemaining === 0 && !showResults) {
      handleSubmitConfirm()
    }

    return () => clearInterval(interval)
  }, [timerActive, timeRemaining, showResults])

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const formatDuration = (milliseconds) => {
    const seconds = Math.floor(milliseconds / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)

    const remainingMinutes = minutes % 60
    const remainingSeconds = seconds % 60

    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m ${remainingSeconds}s`
    } else {
      return `${minutes}m ${remainingSeconds}s`
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleOptionSelect = (optionIndex) => {
    const updatedQuestions = [...questions]
    updatedQuestions[currentQuestionIndex].selectedOption = optionIndex
    setQuestions(updatedQuestions)
  }

  const handleMarkForReview = () => {
    const updatedQuestions = [...questions]
    updatedQuestions[currentQuestionIndex].markedForReview = !updatedQuestions[currentQuestionIndex].markedForReview
    setQuestions(updatedQuestions)
  }

  const handleSubmitConfirm = () => {
    setShowConfirmation(true)
  }

  const handleSubmitTest = async () => {
    // Close confirmation modal
    setShowConfirmation(false)
    
    // Stop the timer
    setTimerActive(false)
    
    // Calculate time taken in seconds
    const timeTakenSeconds = Math.floor((Date.now() - startTime) / 1000)
    
    // Prepare submission data in the exact format required by the API
    const answers = questions.map(q => {
      if (q.selectedOption !== null) {
        return {
          question_id: q.id,
          selected_option_id: q.optionIds[q.selectedOption]
        }
      }
      return null
    }).filter(a => a !== null)
    
    try {
      console.log('Submitting test answers:', answers)
      
      // Debug the request payload
      console.log('Request payload:', JSON.stringify({ answers, time_taken_seconds: timeTakenSeconds }))
      
      // Submit test with answers array and time taken
      const responseData = await authService.submitTest(testId, { 
        answers, 
        time_taken_seconds: timeTakenSeconds 
      }, user.token)
      console.log('Test submission response:', responseData)
      
      // Calculate results based on the response
      const totalQuestions = questions.length
      
      // Extract result data from the response
      let correctAnswers = 0
      let incorrectAnswers = 0
      let score = 0
      let passed = false
      
      if (responseData.result) {
        // Use the result object structure from the API response
        correctAnswers = responseData.result.correct_answers || 0
        incorrectAnswers = totalQuestions - correctAnswers
        score = responseData.result.score || 0
        passed = responseData.result.passed || false
      } else {
        // Fallback calculations in case the API response is different
        correctAnswers = responseData.correct_answers || 0
        incorrectAnswers = responseData.incorrect_answers || 0
        score = responseData.score || 0
        passed = responseData.passed || false
      }
      
      const unanswered = totalQuestions - answers.length
      
      // Calculate time taken
      const timeTaken = formatDuration(Date.now() - startTime)
      
      // Set results
      setTestResults({
        totalQuestions,
        correctAnswers,
        incorrectAnswers,
        unanswered,
        score,
        timeTaken,
        passed
      })
      
      // Show results page
      setShowResults(true)
      
      showNotification({
        message: 'Test submitted successfully!',
        variant: 'success'
      })
    } catch (err) {
      console.error('Error submitting test:', err)
      
      // Log detailed error information for debugging
      if (err.response) {
        console.error('Response status:', err.response.status)
        console.error('Response data:', err.response.data)
      } else if (err.request) {
        console.error('Request made but no response received:', err.request)
      } else {
        console.error('Error setting up request:', err.message)
      }
      
      showNotification({
        message: err.response?.data?.error || 'Failed to submit test. Please try again.',
        variant: 'danger'
      })
      
      // Re-enable timer if submission fails
      setTimerActive(true)
    }
  }

  const handleBackToHome = () => {
    navigate('/academy/home')
  }

  const handleExitTest = () => {
    setShowExitConfirmation(true);
  }

  const handleConfirmExit = () => {
    navigate('/free-test');
  }

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading test...</span>
        </Spinner>
        <p className="mt-3">Loading test content...</p>
      </Container>
    )
  }

  if (error) {
    return (
      <Container className="text-center py-5">
        <div className="alert alert-danger">
          <p>{error}</p>
          <Button variant="primary" onClick={() => navigate('/free-test')}>
            Back to Tests
          </Button>
        </div>
      </Container>
    )
  }

  // If showing results page
  if (showResults) {
    return (
      <div className="result-card app-container results-container">
        <Container className="py-5">
          <Row className="justify-content-center">
            <Col lg={8} md={10}>
              <Card className="results-card">
                <Card.Body className="p-0">
                  <div className="results-header">
                    <TrophyFill size={36} className="trophy-icon" />
                    <h1>Test Results</h1>
                  </div>

                  <div className="results-content p-4">
                    <h2 className="test-name mb-4">{testData?.title || 'Test'}</h2>

                    <div className="score-container mb-4">
                      <div className="score-circle">
                        <div className="score-value">{testResults.score}%</div>
                      </div>
                      <div className="score-label">Your Score</div>
                    </div>

                    <div className="pass-status mb-4">
                      {testResults.passed ? (
                        <Badge bg="success" className="p-2 fs-6">PASSED</Badge>
                      ) : (
                        <Badge bg="danger" className="p-2 fs-6">FAILED</Badge>
                      )}
                    </div>

                    <div className="results-details">
                      <div className="result-item">
                        <div className="result-label">Total Questions</div>
                        <div className="result-value">{testResults.totalQuestions}</div>
                      </div>
                      <div className="result-item correct">
                        <div className="result-label">Correct Answers</div>
                        <div className="result-value">{testResults.correctAnswers}</div>
                      </div>
                      <div className="result-item incorrect">
                        <div className="result-label">Incorrect Answers</div>
                        <div className="result-value">{testResults.incorrectAnswers}</div>
                      </div>
                      <div className="result-item unanswered">
                        <div className="result-label">Unanswered</div>
                        <div className="result-value">{testResults.unanswered}</div>
                      </div>
                      <div className="result-item">
                        <div className="result-label">Time Taken</div>
                        <div className="result-value">{testResults.timeTaken}</div>
                      </div>
                      <div className="result-item">
                        <div className="result-label">Passing Score</div>
                        <div className="result-value">{testData?.passing_score || 60}%</div>
                      </div>
                    </div>

                    <div className="d-flex justify-content-center mt-4">
                      <Button variant="primary" className="px-4 py-2" onClick={handleBackToHome}>
                        Back to Home
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    )
  }

  return (
    <div className="app-container">
      <div className={`main-content ${showInfoPanel ? 'with-sidebar' : ''}`}>
        <Container fluid className="test-app">
          <div className="test-header">
            <div>
              <h1 className="test-title">{testData?.title || 'Test'}</h1>
              <div className="mt-2">
                <Badge bg="success" className="me-2">
                  {answeredCount} Answered
                </Badge>
                {markedCount > 0 && (
                  <Badge bg="warning" text="dark">
                    {markedCount} Marked for Review
                  </Badge>
                )}
              </div>
            </div>

            <div className="d-flex align-items-center justify-content-between">
              <div className="instructions-btn me-2" onClick={() => setShowInstructions(true)}>
                <InfoCircleFill size={20} className="info-icon" />
                <span className="ms-1">Test Instructions</span>
              </div>

              <div className="test-timer ms-2">
                <Stopwatch size={20} className="timer-icon" />
                <span className="ms-1">{formatTime(timeRemaining)}</span>
              </div>

              {/* Exit test button */}
              <Button 
                className="mb-0 ms-2 d-flex align-items-center bg-danger border-0" 
                onClick={handleExitTest}
              >
                <XCircleFill size={20} className="me-2" />
                Exit Test
              </Button>

              {/* Info button */}
              <Button variant="outline-primary" className="ms-2 d-md-none d-flex align-items-center" onClick={() => setShowInfoPanel(!showInfoPanel)}>
                <InfoCircleFill size={18} className="me-1" />
                Info
              </Button>
            </div>
          </div>

          <Row className="mb-4">
            <Col xs={12}>
              <QuestionNavigator
                questions={questions}
                currentQuestionIndex={currentQuestionIndex}
                setCurrentQuestionIndex={setCurrentQuestionIndex}
              />
            </Col>
          </Row>

          <Row className="mb-4">
            <Col xs={12}>
              <QuestionPanel question={questions[currentQuestionIndex]} onOptionSelect={handleOptionSelect} onMarkForReview={handleMarkForReview} />
            </Col>
          </Row>
        </Container>
      </div>

      {/* Sticky Navigation Footer */}
      <div className={`navigation-footer ${showInfoPanel ? 'with-sidebar' : ''}`}>
        <div className="navigation-container">
          <Button variant="outline-primary" onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0} className="nav-btn">
            <ArrowLeft className="me-2" /> Previous
          </Button>

          <Button variant="success" className="nav-btn submit-btn" onClick={handleSubmitConfirm}>
            Submit Test <CheckCircleFill size={16} className="ms-2" />
          </Button>

          <Button variant="outline-primary" onClick={handleNextQuestion} disabled={currentQuestionIndex === questions.length - 1} className="nav-btn">
            Next <ArrowRight className="ms-2" />
          </Button>
        </div>
      </div>

      <InfoSidebar
        isOpen={showInfoPanel}
        toggleSidebar={() => setShowInfoPanel(!showInfoPanel)}
        testName={testData?.title || 'Test'}
        totalQuestions={questions.length}
        answeredQuestions={answeredCount}
        markedQuestions={markedCount}
        timeRemaining={formatTime(timeRemaining)}
      />

      {/* Instructions Modal */}
      <Modal show={showInstructions} onHide={() => setShowInstructions(false)} centered className="instructions-modal" size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <InfoCircleFill size={20} className="me-2 text-primary" />
            Test Instructions
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-3">Please read the following instructions carefully before proceeding with the test:</p>
          <ul className="instructions-list">
            {typeof testData?.instructions === 'string' ? (
              <li>{testData.instructions}</li>
            ) : Array.isArray(testData?.instructions) ? (
              testData.instructions.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))
            ) : (
              <>
                <li>Read each question carefully before answering.</li>
                <li>You can mark questions for review to come back to them later.</li>
                <li>Once you submit the test, you cannot change your answers.</li>
                <li>Each question carries equal marks.</li>
                <li>There is no negative marking for wrong answers.</li>
              </>
            )}
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowInstructions(false)}>
            Got it
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Confirmation Modal */}
      <Modal show={showConfirmation} onHide={() => setShowConfirmation(false)} centered className="confirmation-modal">
        <Modal.Header closeButton>
          <Modal.Title className="d-flex align-items-center">
            <ExclamationTriangleFill size={24} className="me-2 text-warning" />
            Submit Test
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="confirmation-message">
            Are you sure you want to submit your test? Once submitted, you will not be able to change your answers.
          </p>

          {answeredCount === 0 && (
            <div className="alert alert-warning">
              <ExclamationTriangleFill size={16} className="me-2" />
              Warning: You haven't answered any questions. Submitting now will result in a score of 0.
            </div>
          )}

          <div className="test-summary">
            <h6>Test Summary</h6>
            <div className="summary-item">
              <span>Total Questions:</span>
              <span>{questions.length}</span>
            </div>
            <div className="summary-item">
              <span>Answered:</span>
              <span>{answeredCount}</span>
            </div>
            <div className="summary-item">
              <span>Unanswered:</span>
              <span>{questions.length - answeredCount}</span>
            </div>
            <div className="summary-item">
              <span>Marked for Review:</span>
              <span>{markedCount}</span>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowConfirmation(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmitTest}
          >
            Yes, Submit Test
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Exit Confirmation Modal */}
      <Modal 
        show={showExitConfirmation} 
        onHide={() => setShowExitConfirmation(false)} 
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Exit Test?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to exit the test? Your progress will be lost.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowExitConfirmation(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmExit}>
            Exit Test
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default TestQuestions
