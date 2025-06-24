import React, { useState, useEffect, useCallback } from 'react';
import { Container, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { FiUser, FiDollarSign, FiFolder, FiSettings, FiCheckCircle } from 'react-icons/fi';

// Import components
import BasicInfo from './components/BasicInfo';
import PricingPlans from './components/PricingPlans';
import CourseContent from './components/CourseContent';
import AdvancedSettings from './components/AdvancedSettings';

const EditCourse = () => {
  const { courseId: urlCourseId } = useParams();
  const navigate = useNavigate();
  
  // Core state
  const [activeStep, setActiveStep] = useState(1);
  const [progress, setProgress] = useState(15);
  const [courseName, setCourseName] = useState('');
  
  // Feedback state
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Course creation state
  const [createdCourseId, setCreatedCourseId] = useState(null);
  const [isNewCourse, setIsNewCourse] = useState(urlCourseId === 'new');
  const [courseCreated, setCourseCreated] = useState(false);
  
  // Determine the actual courseId to use
  const actualCourseId = isNewCourse ? createdCourseId : urlCourseId;

  // Memoized handlers to prevent unnecessary re-renders
  const handleCourseCreated = useCallback((newCourseId, courseData) => {
    setCreatedCourseId(newCourseId);
    setCourseCreated(true);
    setCourseName(courseData.courseName || `Course #${newCourseId}`);
    setSuccessMessage('Course created successfully! You can now add pricing plans.');
    
    // Update URL to reflect the new course ID
    navigate(`/admin/edit-course/${newCourseId}`, { replace: true });
    setIsNewCourse(false);
    
    // Clear success message after 5 seconds
    setTimeout(() => setSuccessMessage(''), 5000);
  }, [navigate]);

  const handleCourseUpdated = useCallback((courseData) => {
    setCourseName(courseData.courseName || courseName);
    setSuccessMessage('Course updated successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  }, [courseName]);

  // Check if step is accessible
  const isStepAccessible = useCallback((stepNumber) => {
    if (stepNumber === 1) return true; // Basic Info is always accessible
    if (isNewCourse && !courseCreated) return false; // Can't access other steps without creating course
    return true;
  }, [isNewCourse, courseCreated]);

  // Handle step navigation with validation
  const handleStepClick = useCallback((stepNumber) => {
    if (!isStepAccessible(stepNumber)) {
      setError('Please complete the basic information and create the course first.');
      setTimeout(() => setError(null), 5000);
      return;
    }
    
    setActiveStep(stepNumber);
  }, [isStepAccessible]);

  // Memoized step configuration
  const steps = [
    { 
      number: 1, 
      title: 'Basic Information', 
      icon: <FiUser />, 
      accessible: true
    },
    { 
      number: 2, 
      title: 'Pricing Plans', 
      icon: <FiDollarSign />, 
      accessible: isStepAccessible(2)
    },
    { 
      number: 3, 
      title: 'Course Content', 
      icon: <FiFolder />, 
      accessible: isStepAccessible(3)
    },
    { 
      number: 4, 
      title: 'Advanced Settings', 
      icon: <FiSettings />, 
      accessible: isStepAccessible(4)
    },
  ];

  // Memoized common props to prevent unnecessary re-renders
  const commonProps = React.useMemo(() => ({
    setActiveStep,
    setProgress,
    courseName,
    setCourseName,
    courseId: actualCourseId,
    isNewCourse,
    courseCreated
  }), [actualCourseId, isNewCourse, courseCreated, courseName]);

  // Render active component with error boundary
  const renderActiveComponent = () => {
    const stepProps = { ...commonProps };

    // Add specific props for BasicInfo
    if (activeStep === 1) {
      stepProps.onCourseCreated = handleCourseCreated;
      stepProps.onCourseUpdated = handleCourseUpdated;
    }

    switch (activeStep) {
      case 1:
        return <BasicInfo {...stepProps} />;
      case 2:
        return <PricingPlans {...stepProps} />;
      case 3:
        return <CourseContent {...stepProps} />;
      case 4:
        return <AdvancedSettings {...stepProps} />;
      default:
        return <BasicInfo {...stepProps} />;
    }
  };

  return (
    <div className="min-vh-100 py-4">
      <Container>
        {/* Error Alert */}
        {error && (
          <Alert variant="danger" className="mb-4" dismissible onClose={() => setError(null)}>
            <strong>Error:</strong> {error}
          </Alert>
        )}

        {/* Success Alert */}
        {successMessage && (
          <Alert variant="success" className="mb-4" dismissible onClose={() => setSuccessMessage('')}>
            <FiCheckCircle className="me-2" />
            {successMessage}
          </Alert>
        )}

        {/* Course Creation Status */}
        {isNewCourse && !courseCreated && (
          <Alert variant="info" className="mb-4">
            <strong>Creating New Course:</strong> Complete the basic information to create your course, then continue with pricing and content.
          </Alert>
        )}

        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="mb-1">
              {isNewCourse && !courseCreated 
                ? 'Create New Course' 
                : courseName || `Edit Course ${actualCourseId ? `#${actualCourseId}` : ''}`
              }
            </h2>
            <p className="text-muted mb-0">
              {isNewCourse && !courseCreated 
                ? 'Set up your new course step by step'
                : 'Update content, price, and structure of your course'
              }
            </p>
          </div>
          <div>
            <small className="text-muted">
              Step {activeStep}/4 | Course ID: {actualCourseId || 'Pending'} 
              {isNewCourse && !courseCreated && ' (New)'}
            </small>
          </div>
        </div>

        {/* Step Navigation */}
        <div className="bg-white rounded-4 border p-4 mb-4">
          <div className="d-flex justify-content-between position-relative mb-4">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className={`step-item text-center position-relative ${
                  activeStep >= step.number ? 'active' : ''
                } ${!step.accessible ? 'disabled' : ''}`}
                style={{ 
                  flex: 1, 
                  cursor: step.accessible ? 'pointer' : 'not-allowed',
                  opacity: step.accessible ? 1 : 0.5
                }}
                onClick={() => step.accessible && handleStepClick(step.number)}
              >
                <div
                  className={`step-icon rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2 ${
                    activeStep === step.number
                      ? 'bg-primary text-white'
                      : activeStep > step.number
                      ? 'bg-success text-white'
                      : step.accessible
                      ? 'bg-light text-muted'
                      : 'bg-light text-muted'
                  }`}
                  style={{ width: '40px', height: '40px' }}
                >
                  {activeStep > step.number && step.accessible ? <FiCheckCircle /> : step.icon}
                </div>
                <h6 className={
                  activeStep >= step.number && step.accessible 
                    ? 'text-dark' 
                    : 'text-muted'
                }>
                  {step.title}
                </h6>
                {!step.accessible && step.number > 1 && (
                  <small className="text-muted d-block">
                    Complete Step 1 first
                  </small>
                )}
                {index < steps.length - 1 && (
                  <div
                    className="step-line position-absolute"
                    style={{
                      top: '20px',
                      right: '-50%',
                      width: '100%',
                      height: '2px',
                      background: activeStep > step.number && step.accessible ? '#198754' : '#e9ecef',
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className="step-content">
            {renderActiveComponent()}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default EditCourse;