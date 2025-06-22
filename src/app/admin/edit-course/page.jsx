import { useState } from 'react';
import { Container } from 'react-bootstrap';
import { FiUser, FiDollarSign, FiFolder } from 'react-icons/fi';
import BasicInfo from './components/BasicInfo';
import PricingPlans from './components/PricingPlans';
import CourseContent from './components/CourseContent';
import AdvancedSettings from './components/AdvancedSettings';

const EditCourse = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [progress, setProgress] = useState(15);
  const [courseName, setCourseName] = useState('');

  const steps = [
    { number: 1, title: 'Basic Information', icon: <FiUser /> },
    { number: 2, title: 'Pricing Plans', icon: <FiDollarSign /> },
    { number: 3, title: 'Course Content', icon: <FiFolder /> },
    { number: 4, title: 'Advanced Settings', icon: <FiFolder /> },
  ];

  // Function to render the active component
  const renderActiveComponent = () => {
    const commonProps = {
      setActiveStep,
      setProgress,
      courseName,
      setCourseName
    };

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
  };

  return (
    <div className="min-vh-100 py-4">
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="mb-1">{courseName || 'Edit Course'}</h2>
            <p className="text-muted mb-0">Update content, price, and structure of your course</p>
          </div>
        </div>

        <div className="bg-white rounded-4 border p-4 mb-4">
          <div className="d-flex justify-content-between position-relative mb-4">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className={`step-item text-center position-relative ${activeStep >= step.number ? 'active' : ''}`}
                style={{ flex: 1 }}
                role="button"
                onClick={() => setActiveStep(step.number)}
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
};

export default EditCourse;