import { useState } from 'react';
import { Container } from 'react-bootstrap';
import { FiUser, FiDollarSign, FiFolder } from 'react-icons/fi';

// Simple imports - if these fail, the error will be clear
import BasicInfo from './components/BasicInfo';
import PricingPlans from './components/PricingPlans';
import CourseContent from './components/CourseContent';
import AdvancedSettings from './components/AdvancedSettings';

const EditCourse = () => {
  console.log('📚 EditCourse - Start rendering');
  
  try {
    const [activeStep, setActiveStep] = useState(1);
    const [progress, setProgress] = useState(15);
    const [courseName, setCourseName] = useState('');
    const [error, setError] = useState(null);

    const steps = [
      { number: 1, title: 'Basic Information', icon: <FiUser />, component: BasicInfo },
      { number: 2, title: 'Pricing Plans', icon: <FiDollarSign />, component: PricingPlans },
      { number: 3, title: 'Course Content', icon: <FiFolder />, component: CourseContent },
      { number: 4, title: 'Advanced Settings', icon: <FiFolder />, component: AdvancedSettings },
    ];

    console.log('📚 EditCourse - Current step:', activeStep);

    const renderActiveComponent = () => {
      try {
        const commonProps = {
          setActiveStep,
          setProgress,
          courseName,
          setCourseName
        };

        console.log('📚 EditCourse - Rendering step:', activeStep);

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
          {error && (
            <div style={{ 
              padding: '15px', 
              background: '#ffe6e6', 
              border: '1px solid #ff9999',
              borderRadius: '5px',
              marginBottom: '20px'
            }}>
              <strong>Error:</strong> {error}
              <button 
                onClick={() => setError(null)}
                style={{ 
                  float: 'right', 
                  background: 'transparent', 
                  border: 'none', 
                  fontSize: '18px',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>
            </div>
          )}

          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="mb-1">{courseName || 'Edit Course'}</h2>
              <p className="text-muted mb-0">Update content, price, and structure of your course</p>
            </div>
            <div>
              <small className="text-muted">Debug: Step {activeStep}/4</small>
            </div>
          </div>

          <div className="bg-white rounded-4 border p-4 mb-4">
            <div className="d-flex justify-content-between position-relative mb-4">
              {steps.map((step, index) => (
                <div
                  key={step.number}
                  className={`step-item text-center position-relative ${activeStep >= step.number ? 'active' : ''}`}
                  style={{ flex: 1, cursor: 'pointer' }}
                  onClick={() => {
                    console.log('📚 Step clicked:', step.number);
                    setActiveStep(step.number);
                  }}
                >
                  <div
                    className={`step-icon rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2 ${
                      activeStep === step.number
                        ? 'bg-primary text-white'
                        : activeStep > step.number
                        ? 'bg-success text-white'
                        : 'bg-light text-muted'
                    }`}
                    style={{ width: '40px', height: '40px' }}
                  >
                    {step.icon}
                  </div>
                  <h6 className={activeStep >= step.number ? 'text-dark' : 'text-muted'}>
                    {step.title}
                  </h6>
                  {index < steps.length - 1 && (
                    <div
                      className="step-line position-absolute"
                      style={{
                        top: '20px',
                        right: '-50%',
                        width: '100%',
                        height: '2px',
                        background: activeStep > step.number ? '#198754' : '#e9ecef',
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