/**
 * Component SCSS:
 * - Test creation styles: src/assets/scss/components/_question-styles.scss
 * - Content management styles: src/assets/scss/components/_content-management.scss
 */

import React, { useState, useEffect } from 'react'
import { Alert, Button, Col, Form, Nav, Row, Tab, Spinner } from 'react-bootstrap'
import { CiTrash } from 'react-icons/ci'
import { FiArrowLeft, FiArrowRight, FiEdit2, FiInfo, FiList, FiPlus, FiSave, FiSettings, FiTrash2 } from 'react-icons/fi'
import { useAuthContext } from '@/context/useAuthContext'
import { useNotificationContext } from '@/context/useNotificationContext'
import authService from '@/helpers/authService'

const CreateTest = ({ onClose, onSave, currentFolderId }) => {
  const { user } = useAuthContext();


  const { showNotification } = useNotificationContext();
  
  const [activeTab, setActiveTab] = useState('basic')
  const [showQuestionForm, setShowQuestionForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [createdTestId, setCreatedTestId] = useState(null)
  const [currentStep, setCurrentStep] = useState('basic') // basic, sections, settings
  
  const [testData, setTestData] = useState({
    title: '',
    description: '',
    duration: {
      hours: '1',
      minutes: '30',
    },
    category: '',
    passingScore: '60',
    instructions: '',
    sections: [],
    settings: {
      shuffleQuestions: false,
      showResults: true,
      allowReview: true,
      requireProctoring: false,
      timeLimit: true,
      isFree: true,
    },
  })

  const [currentSection, setCurrentSection] = useState({
    title: '',
    questions: [],
  })

  const [currentQuestion, setCurrentQuestion] = useState({
    questionEn: '',
    questionTa: '',
    optionsEn: ['', ''],
    optionsTa: ['', ''],
    correctAnswer: 0,
  })

  const [isEditing, setIsEditing] = useState(false)
  const [optionsCount, setOptionsCount] = useState(2)

  const handleInputChange = (field, value) => {
    setTestData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSettingsChange = (field, value) => {
    setTestData((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        [field]: value,
      },
    }))
  }

  const handleSave = async () => {
    try {
      setSubmitting(true);
      
      // Determine which step we're on and handle accordingly
      if (currentStep === 'basic') {
        // Create the test with basic information
        await createBasicTest();
      } else if (currentStep === 'sections' && testData.sections.length > 0) {
        // Save the current section if any
        await saveAllQuestions();
      } else if (currentStep === 'settings') {
        // Update test settings and finalize
        await updateSettings();
        
        // Call onSave with the final test data
        onSave({ ...testData, id: createdTestId });
      }
      
      setSubmitting(false);
    } catch (error) {
      console.error('Error saving test:', error);
      showNotification({
        message: error.response?.data?.error || 'Failed to save test',
        variant: 'danger'
      });
      setSubmitting(false);
    }
  };
  
  // Create a new test with basic information
  const createBasicTest = async () => {
    // Validate required fields
    if (!testData.title) {
      showNotification({
        message: 'Please enter a test title',
        variant: 'danger'
      });
      return;
    }
    
    try {
      // Prepare test data for API
      const testRequestData = {
        folder_id: currentFolderId || null,
        title: testData.title,
        description: testData.description || '',
        category: testData.category || '',
        passing_score: parseInt(testData.passingScore) || 60,
        duration_hours: parseInt(testData.duration.hours) || 0,
        duration_minutes: parseInt(testData.duration.minutes) || 0,
        instructions: testData.instructions || ''
      };
      
      // Call the API to create the test
      const response = await authService.createTest(testRequestData, user.token);
      console.log('Test created:', response);
      
      if (response && response.id) {
        // Store the test ID for future API calls
        setCreatedTestId(response.id);
        
        // Move to the next step
        setCurrentStep('sections');
        setActiveTab('sections');
        
        showNotification({
          message: 'Test basic information saved successfully',
          variant: 'success'
        });
      }
    } catch (error) {
      console.error('Error creating test:', error);
      showNotification({
        message: error.response?.data?.error || 'Failed to create test',
        variant: 'danger'
      });
      throw error;
    }
  };
  
  // Save all questions to the test
  const saveAllQuestions = async () => {
    if (!createdTestId) {
      showNotification({
        message: 'No test ID available. Please create the test first.',
        variant: 'danger'
      });
      return;
    }
    
    try {
      // Save each question
      for (const question of testData.sections) {
        await saveQuestion(question);
      }
      
      // Move to the next step
      setCurrentStep('settings');
      setActiveTab('settings');
      
      showNotification({
        message: 'All questions saved successfully',
        variant: 'success'
      });
    } catch (error) {
      console.error('Error saving questions:', error);
      showNotification({
        message: error.response?.data?.error || 'Failed to save questions',
        variant: 'danger'
      });
      throw error;
    }
  };
  
  // Save a single question
  const saveQuestion = async (question) => {
    // Format the question data for the API
    const questionData = {
      question_english: question.questionEn,
      question_tamil: question.questionTa,
      options: question.optionsEn.map((optionEn, index) => ({
        option_english: optionEn,
        option_tamil: question.optionsTa[index],
        is_correct: index === question.correctAnswer
      }))
    };
    
    // Call the API to add the question
    const response = await authService.addQuestion(createdTestId, questionData, user.token);
    console.log('Question added:', response);
    
    return response;
  };
  
  // Update test settings
  const updateSettings = async () => {
    if (!createdTestId) {
      showNotification({
        message: 'No test ID available. Please create the test first.',
        variant: 'danger'
      });
      return;
    }
    
    try {
      // Format settings data for the API
      const settingsData = {
        title: testData.title,
        description: testData.description,
        category: testData.category,
        passing_score: testData.passingScore || 70,
        duration_hours: testData.duration?.hours || 1,
        duration_minutes: testData.duration?.minutes || 0,
        instructions: testData.instructions || '',
        is_free: testData.settings.isFree,
        status: 'published', // Always publish when completing
        shuffle_questions: testData.settings.shuffleQuestions,
        show_results_immediately: testData.settings.showResults,
        allow_answer_review: testData.settings.allowReview,
        enable_time_limit: testData.settings.timeLimit
      };
      
      // Call the API to update settings
      const response = await authService.updateTestSettings(createdTestId, settingsData, user.token);
      console.log('Settings updated:', response);
      
      showNotification({
        message: 'Test settings saved and test published successfully',
        variant: 'success'
      });
      
      return response;
    } catch (error) {
      console.error('Error updating settings:', error);
      showNotification({
        message: error.response?.data?.error || 'Failed to update settings',
        variant: 'danger'
      });
      throw error;
    }
  };

  const toggleQuestionForm = () => {
    setShowQuestionForm(!showQuestionForm)
    if (!showQuestionForm) {
      setIsEditing(false)
      setCurrentQuestion({
        questionEn: '',
        questionTa: '',
        optionsEn: ['', ''],
        optionsTa: ['', ''],
        correctAnswer: 0,
      })
      setOptionsCount(2)
    }
  }

  const handleAddQuestion = () => {
    // Validate that both English and Tamil questions are filled
    if (currentQuestion.questionEn && currentQuestion.questionTa) {
      setTestData((prev) => ({
        ...prev,
        sections: [...prev.sections, currentQuestion],
      }))

      // Reset form
      setCurrentQuestion({
        questionEn: '',
        questionTa: '',
        optionsEn: ['', ''],
        optionsTa: ['', ''],
        correctAnswer: 0,
      })
      setShowQuestionForm(false)
      setIsEditing(false)
      setOptionsCount(2)
    } else {
      // Optional: Add error handling if questions are not filled
      showNotification({
        message: 'Please fill in both English and Tamil questions',
        variant: 'danger'
      });
    }
  };

  // Handle tab navigation with validation
  const handleNavigateToTab = (tab) => {
    // If moving from basic to sections, validate and create test first
    if (activeTab === 'basic' && tab === 'sections') {
      if (!testData.title) {
        showNotification({
          message: 'Please enter a test title before proceeding',
          variant: 'danger'
        });
        return;
      }
      
      // If we don't have a test ID yet, create the test
      if (!createdTestId) {
        handleSave(); // This will create the test and move to sections tab if successful
        return;
      }
    }
    
    // If moving from sections to settings, check if we have questions
    if (activeTab === 'sections' && tab === 'settings') {
      if (testData.sections.length === 0) {
        showNotification({
          message: 'Please add at least one question before proceeding',
          variant: 'danger'
        });
        return;
      }
      
      // Save all questions
      saveAllQuestions();
      return;
    }
    
    // For other tab changes or if all validations pass
    setActiveTab(tab);
  };
  
  // Check if the input data is valid for the current step
  const isStepValid = () => {
    if (activeTab === 'basic') {
      return !!testData.title;
    }
    if (activeTab === 'sections') {
      return testData.sections.length > 0;
    }
    return true;
  };
  
  // Handle final submission
  const handleFinalSubmit = async () => {
    try {
      await handleSave();
      // Close the form after successful submission
      onClose();
    } catch (error) {
      console.error('Final submission error:', error);
    }
  };

  const handleDeleteQuestion = (index) => {
    setTestData((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index),
    }))
  }

  const handleEditQuestion = (index) => {
    const questionToEdit = testData.sections[index]
    setCurrentQuestion(questionToEdit)
    setShowQuestionForm(true)
    setIsEditing(true)
    setOptionsCount(questionToEdit.optionsEn.length)
    handleDeleteQuestion(index)
  }

  const handleDeleteOption = (index) => {
    if (index >= 2) {
      // Only allow deleting options added after the first two
      setCurrentQuestion((prev) => {
        const newOptionsEn = prev.optionsEn.filter((_, i) => i !== index)
        const newOptionsTa = prev.optionsTa.filter((_, i) => i !== index)

        // Adjust correct answer if needed
        const newCorrectAnswer = prev.correctAnswer >= index ? Math.max(0, prev.correctAnswer - 1) : prev.correctAnswer

        return {
          ...prev,
          optionsEn: newOptionsEn,
          optionsTa: newOptionsTa,
          correctAnswer: newCorrectAnswer,
        }
      })
      setOptionsCount((prev) => prev - 1)
    }
  }

  return (
    <div className="content-management-form p-0">
      {/* Header */}
      <div className="border-bottom p-4 bg-light">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <Button variant="link" className="p-0 text-body mb-2 d-flex align-items-center" onClick={onClose}>
              <FiArrowLeft className="me-2" /> Back to Test Management
            </Button>
            <h4 className="mb-1">Create New Test</h4>
            <p className="text-muted mb-0">Configure your test settings and content</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <Row>
          <Col lg={3}>
            <Nav variant="pills" className="flex-column nav-pills-custom">
              <Nav.Item>
                <Nav.Link active={activeTab === 'basic'} onClick={() => setActiveTab('basic')} className="mb-2">
                  <FiInfo className="me-2" /> Basic Information
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link active={activeTab === 'sections'} onClick={() => setActiveTab('sections')} className="mb-2">
                  <FiList className="me-2" /> Test Sections
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} className="mb-2">
                  <FiSettings className="me-2" /> Test Settings
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>

          <Col lg={9}>
            <Tab.Content>
              <Tab.Pane active={activeTab === 'basic'}>
                <div className="bg-white rounded p-4 shadow-sm">
                  <h5 className="mb-4">Basic Information</h5>
                  <Form>
                    <Form.Group className="mb-3">
                      <Form.Label>Test Title</Form.Label>
                      <Form.Control
                        type="text"
                        value={testData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="Enter test title"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={testData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Enter test description"
                      />
                    </Form.Group>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Category</Form.Label>
                          <Form.Select value={testData.category} onChange={(e) => handleInputChange('category', e.target.value)}>
                            <option value="">Select category</option>
                            <option value="mathematics">Mathematics</option>
                            <option value="science">Science</option>
                            <option value="language">Language</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Passing Score (%)</Form.Label>
                          <Form.Control
                            type="number"
                            min="0"
                            max="100"
                            value={testData.passingScore}
                            onChange={(e) => handleInputChange('passingScore', e.target.value)}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-3">
                      <Form.Label>Duration</Form.Label>
                      <Row>
                        <Col md={6}>
                          <Form.Control
                            type="number"
                            min="0"
                            placeholder="Hours"
                            value={testData.duration.hours}
                            onChange={(e) => handleInputChange('duration', { ...testData.duration, hours: e.target.value })}
                          />
                        </Col>
                        <Col md={6}>
                          <Form.Control
                            type="number"
                            min="0"
                            max="59"
                            placeholder="Minutes"
                            value={testData.duration.minutes}
                            onChange={(e) => handleInputChange('duration', { ...testData.duration, minutes: e.target.value })}
                          />
                        </Col>
                      </Row>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Instructions</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        value={testData.instructions}
                        onChange={(e) => handleInputChange('instructions', e.target.value)}
                        placeholder="Enter test instructions"
                      />
                    </Form.Group>
                  </Form>
                  <div className="mt-4 d-flex justify-content-end">
                    <Button 
                      variant="primary" 
                      onClick={() => handleNavigateToTab('sections')} 
                      className="d-flex align-items-center"
                      disabled={!isStepValid() || submitting}
                    >
                      {submitting && activeTab === 'basic' ? (
                        <>
                          <Spinner size="sm" className="me-2" />
                          Saving...
                        </>
                      ) : (
                        <>
                          Continue <FiArrowRight className="ms-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </Tab.Pane>

              <Tab.Pane active={activeTab === 'sections'}>
                <div className="bg-white rounded p-4 shadow-sm">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="mb-0">Test Sections</h5>
                    <Button variant="primary" onClick={toggleQuestionForm} className="d-flex align-items-center">
                      <FiPlus className="me-2" /> Create Questions
                    </Button>
                  </div>

                  {showQuestionForm ? (
                    <div className="question-form mb-4">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="mb-0">Add New Question</h6>
                        <Button variant="outline-secondary" size="sm" onClick={toggleQuestionForm}>
                          Cancel
                        </Button>
                      </div>
                      <Form>
                        <Row className="mb-3">
                          <Col md={6}>
                            <Form.Group>
                              <Form.Label>Question (English)</Form.Label>
                              <Form.Control
                                as="textarea"
                                rows={2}
                                value={currentQuestion.questionEn}
                                onChange={(e) =>
                                  setCurrentQuestion((prev) => ({
                                    ...prev,
                                    questionEn: e.target.value,
                                  }))
                                }
                                placeholder="Enter question in English"
                                required
                              />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group>
                              <Form.Label>Question (Tamil)</Form.Label>
                              <Form.Control
                                as="textarea"
                                rows={2}
                                value={currentQuestion.questionTa}
                                onChange={(e) =>
                                  setCurrentQuestion((prev) => ({
                                    ...prev,
                                    questionTa: e.target.value,
                                  }))
                                }
                                placeholder="Enter question in Tamil"
                                required
                              />
                            </Form.Group>
                          </Col>
                        </Row>

                        {Array.from({ length: optionsCount }).map((_, index) => (
                          <Row key={index} className="mb-3">
                            <Col md={5}>
                              <Form.Group>
                                <Form.Label>Option {index + 1} (English)</Form.Label>
                                <Form.Control
                                  type="text"
                                  value={currentQuestion.optionsEn[index]}
                                  onChange={(e) => {
                                    const newOptionsEn = [...currentQuestion.optionsEn]
                                    newOptionsEn[index] = e.target.value
                                    setCurrentQuestion((prev) => ({
                                      ...prev,
                                      optionsEn: newOptionsEn,
                                    }))
                                  }}
                                  placeholder={`Enter option ${index + 1} in English`}
                                />
                              </Form.Group>
                            </Col>
                            <Col md={5}>
                              <Form.Group>
                                <Form.Label>Option {index + 1} (Tamil)</Form.Label>
                                <Form.Control
                                  type="text"
                                  value={currentQuestion.optionsTa[index]}
                                  onChange={(e) => {
                                    const newOptionsTa = [...currentQuestion.optionsTa]
                                    newOptionsTa[index] = e.target.value
                                    setCurrentQuestion((prev) => ({
                                      ...prev,
                                      optionsTa: newOptionsTa,
                                    }))
                                  }}
                                  placeholder={`Enter option ${index + 1} in Tamil`}
                                />
                              </Form.Group>
                            </Col>
                            <Col md={1} className="d-flex align-items-end ps-0">
                              <Form.Group>
                                <Form.Label>Correct?</Form.Label>
                                <Form.Check
                                  type="radio"
                                  name="correctAnswer"
                                  checked={currentQuestion.correctAnswer === index}
                                  onChange={() =>
                                    setCurrentQuestion((prev) => ({
                                      ...prev,
                                      correctAnswer: index,
                                    }))
                                  }
                                />
                              </Form.Group>
                            </Col>
                            {index >= 2 && (
                              <Col md={1} className="d-flex align-items-end ps-0">
                                <button type="button" className="btn btn-link text-danger p-0 ms-2" onClick={() => handleDeleteOption(index)}>
                                  <CiTrash size={24} />
                                </button>
                              </Col>
                            )}
                          </Row>
                        ))}
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => setOptionsCount((prev) => Math.min(prev + 1, 6))}
                          className="mt-2"
                          disabled={optionsCount >= 6}>
                          <FiPlus className="me-2" /> Add Another Option
                        </Button>
                        <Button variant="primary" size="sm" onClick={handleAddQuestion} className="mt-2 mx-2">
                          <FiPlus className="me-1" /> {isEditing ? 'Update' : 'Save'}
                        </Button>
                      </Form>
                    </div>
                  ) : null}

                  <div className="questions-list mt-4">
                    {testData.sections.length === 0 ? (
                      <Alert variant="info">No questions added yet. Click "Create Questions" to add your first question.</Alert>
                    ) : (
                      testData.sections.map((question, index) => (
                        <div key={index} className="question-item border rounded p-3 mb-3">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <div>
                              <h6>Question {index + 1}</h6>
                              <p className="mb-1">{question.questionEn}</p>
                              <p className="mb-2 text-muted">{question.questionTa}</p>
                            </div>
                            <div>
                              <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEditQuestion(index)}>
                                <FiEdit2 />
                              </Button>
                              <Button variant="outline-danger" size="sm" onClick={() => handleDeleteQuestion(index)}>
                                <FiTrash2 />
                              </Button>
                            </div>
                          </div>
                          <div className="options-list">
                            {question.optionsEn.map((option, optIndex) => (
                              <div key={optIndex} className={`option-item ${optIndex === question.correctAnswer ? 'text-success' : ''}`}>
                                {optIndex + 1}. {option} / {question.optionsTa[optIndex]}
                                {optIndex === question.correctAnswer && ' (Correct)'}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="mt-4 d-flex justify-content-between">
                    <Button 
                      variant="outline-secondary" 
                      onClick={() => setActiveTab('basic')} 
                      className="d-flex align-items-center"
                    >
                      <FiArrowLeft className="me-2" /> Back
                    </Button>
                    <Button 
                      variant="primary" 
                      onClick={() => handleNavigateToTab('settings')} 
                      className="d-flex align-items-center"
                      disabled={!isStepValid() || submitting}
                    >
                      {submitting && activeTab === 'sections' ? (
                        <>
                          <Spinner size="sm" className="me-2" />
                          Saving Questions...
                        </>
                      ) : (
                        <>
                          Continue <FiArrowRight className="ms-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </Tab.Pane>

              <Tab.Pane active={activeTab === 'settings'}>
                <div className="bg-white rounded p-4 shadow-sm">
                  <h5 className="mb-4">Test Settings</h5>
                  <Form>
                    <Form.Check
                      type="switch"
                      id="shuffle-questions"
                      label="Shuffle Questions"
                      checked={testData.settings.shuffleQuestions}
                      onChange={(e) => handleSettingsChange('shuffleQuestions', e.target.checked)}
                      className="mb-3"
                    />

                    <Form.Check
                      type="switch"
                      id="show-results"
                      label="Show Results Immediately"
                      checked={testData.settings.showResults}
                      onChange={(e) => handleSettingsChange('showResults', e.target.checked)}
                      className="mb-3"
                    />

                    <Form.Check
                      type="switch"
                      id="allow-review"
                      label="Allow Answer Review"
                      checked={testData.settings.allowReview}
                      onChange={(e) => handleSettingsChange('allowReview', e.target.checked)}
                      className="mb-3"
                    />

                    <Form.Check
                      type="switch"
                      id="time-limit"
                      label="Enable Time Limit"
                      checked={testData.settings.timeLimit}
                      onChange={(e) => handleSettingsChange('timeLimit', e.target.checked)}
                      className="mb-3"
                    />

                    <Form.Check
                      type="switch"
                      id="is-free"
                      label="Make Test Free (Available without subscription)"
                      checked={testData.settings.isFree}
                      onChange={(e) => handleSettingsChange('isFree', e.target.checked)}
                      className="mb-3"
                    />
                  </Form>
                  <div className="mt-4 d-flex justify-content-between">
                    <Button 
                      variant="outline-secondary" 
                      onClick={() => setActiveTab('sections')} 
                      className="d-flex align-items-center"
                    >
                      <FiArrowLeft className="me-2" /> Back
                    </Button>
                    <Button 
                      variant="primary" 
                      onClick={handleFinalSubmit}
                      className="d-flex align-items-center"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <Spinner size="sm" className="me-2" />
                          Publishing Test...
                        </>
                      ) : (
                        <>
                          <FiSave className="me-2" /> Save & Publish Test
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default CreateTest
