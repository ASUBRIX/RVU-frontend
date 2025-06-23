import { useState, useEffect } from 'react';
import { Container, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { FiUser, FiDollarSign, FiFolder, FiCheckCircle } from 'react-icons/fi';

// Simple imports - if these fail, the error will be clear
import BasicInfo from './components/BasicInfo';
import PricingPlans from './components/PricingPlans';
import CourseContent from './components/CourseContent';
import AdvancedSettings from './components/AdvancedSettings';

const EditCourse = () => {
  console.log('📚 EditCourse - Start rendering');
  
  try {
    const { courseId: urlCourseId } = useParams(); // Get courseId from URL
    const navigate = useNavigate();
    
    // State management
    const [activeStep, setActiveStep] = useState(1);
    const [progress, setProgress] = useState(15);
    const [courseName, setCourseName] = useState('');
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    
    // Course creation state
    const [createdCourseId, setCreatedCourseId] = useState(null); // Store courseId from BasicInfo
    const [isNewCourse, setIsNewCourse] = useState(urlCourseId === 'new');
    const [courseCreated, setCourseCreated] = useState(false);
    
    // Determine the actual courseId to use
    const actualCourseId = isNewCourse ? createdCourseId : urlCourseId;

    console.log('📚 EditCourse - URL CourseId:', urlCourseId);
    console.log('📚 EditCourse - Created CourseId:', createdCourseId);
    console.log('📚 EditCourse - Actual CourseId:', actualCourseId);
    console.log('📚 EditCourse - Is New Course:', isNewCourse);
    console.log('📚 EditCourse - Course Created:', courseCreated);

    // Debug: Log when courseId changes
    useEffect(() => {
      console.log('📚 CourseId state changed:', {
        urlCourseId,
        createdCourseId,
        actualCourseId,
        isNewCourse,
        courseCreated
      });
    }, [urlCourseId, createdCourseId, actualCourseId, isNewCourse, courseCreated]);

    // Handle course creation success from BasicInfo
    const handleCourseCreated = (newCourseId, courseData) => {
      console.log('📚 Course created successfully with ID:', newCourseId);
      setCreatedCourseId(newCourseId);
      setCourseCreated(true);
      setCourseName(courseData.courseName || `Course #${newCourseId}`);
      setSuccessMessage('Course created successfully! You can now add pricing plans.');
      
      // Update URL to reflect the new course ID
      navigate(`/admin/edit-course/${newCourseId}`, { replace: true });
      setIsNewCourse(false);
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);
    };

    // Handle course update from BasicInfo (for existing courses)
    const handleCourseUpdated = (courseData) => {
      console.log('📚 Course updated successfully');
      setCourseName(courseData.courseName || courseName);
      setSuccessMessage('Course updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    };

    // Check if step is accessible
    const isStepAccessible = (stepNumber) => {
      if (stepNumber === 1) return true; // Basic Info is always accessible
      if (isNewCourse && !courseCreated) return false; // Can't access other steps without creating course
      return true;
    };

    // Handle step navigation with validation
    const handleStepClick = (stepNumber) => {
      if (!isStepAccessible(stepNumber)) {
        setError('Please complete the basic information and create the course first.');
        setTimeout(() => setError(null), 5000);
        return;
      }
      
      console.log('📚 Step clicked:', stepNumber);
      setActiveStep(stepNumber);
    };

    const steps = [
      { 
        number: 1, 
        title: 'Basic Information', 
        icon: <FiUser />, 
        component: BasicInfo,
        accessible: true
      },
      { 
        number: 2, 
        title: 'Pricing Plans', 
        icon: <FiDollarSign />, 
        component: PricingPlans,
        accessible: isStepAccessible(2)
      },
      { 
        number: 3, 
        title: 'Course Content', 
        icon: <FiFolder />, 
        component: CourseContent,
        accessible: isStepAccessible(3)
      },
      { 
        number: 4, 
        title: 'Advanced Settings', 
        icon: <FiFolder />, 
        component: AdvancedSettings,
        accessible: isStepAccessible(4)
      },
    ];

    console.log('📚 EditCourse - Current step:', activeStep);

    const renderActiveComponent = () => {
      try {
        const commonProps = {
          setActiveStep,
          setProgress,
          courseName,
          setCourseName,
          courseId: actualCourseId,
          isNewCourse,
          courseCreated
        };

        // Special props for BasicInfo
        if (activeStep === 1) {
          commonProps.onCourseCreated = handleCourseCreated;
          commonProps.onCourseUpdated = handleCourseUpdated;
        }

        console.log('📚 EditCourse - Rendering step:', activeStep, 'with courseId:', actualCourseId);

        switch (activeStep) {
          case 1:
            return <BasicInfo {...commonProps} />;
          case 2:
            return <PricingPlans {...commonProps} />;
          case 3:
            return <CourseContent {...commonProps} />;
          case 4:
            return <AdvancedSettings {...commonProps} />;
          default:
            return <BasicInfo {...commonProps} />;
        }
      } catch (error) {
        console.error('📚 Component render error:', error);
        setError(error.message);
        return (
          <div style={{ 
            padding: '20px', 
            background: '#ffe6e6', 
            border: '1px solid #ff9999',
            borderRadius: '5px' 
          }}>
            <h4>Component Error</h4>
            <p>Error rendering step {activeStep}: {error.message}</p>
            <button 
              onClick={() => setActiveStep(1)}
              style={{ 
                background: '#007bff', 
                color: 'white', 
                border: 'none', 
                padding: '10px 20px', 
                borderRadius: '3px' 
              }}
            >
              Go to Step 1
            </button>
          </div>
        );
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

            <div className="step-content">
              {renderActiveComponent()}
            </div>
          </div>
        </Container>
      </div>
    );

  } catch (error) {
    console.error('📚 EditCourse Error:', error);
    return (
      <div style={{ 
        padding: '20px', 
        background: '#ffe6e6', 
        border: '1px solid #ff9999',
        borderRadius: '5px',
        margin: '20px'
      }}>
        <h2>EditCourse Error</h2>
        <p><strong>Error:</strong> {error.message}</p>
        <p><strong>Type:</strong> {error.name}</p>
        <details>
          <summary>Full Error Details</summary>
          <pre>{error.stack}</pre>
        </details>
        <button 
          onClick={() => window.location.href = '/admin/all-courses'}
          style={{
            background: '#007bff',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '3px',
            cursor: 'pointer'
          }}
        >
          Back to Courses
        </button>
      </div>
    );
  }
};

export default EditCourse;