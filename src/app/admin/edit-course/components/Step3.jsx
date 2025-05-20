import { Row } from 'react-bootstrap';
import CourseContent from '../CourseContent/CourseContent';

const Step3 = ({ stepperInstance }) => {
  const setActiveStep = (step) => {
    // can also handle state changes outside stepper if needed
  };

  const setProgress = (progress) => {
    // for optional progress bar update logic
  };

  return (
    <form id="step-3" role="tabpanel" className="content fade" aria-labelledby="steppertrigger3">
      <Row>
        <CourseContent setActiveStep={setActiveStep} setProgress={setProgress} stepperInstance={stepperInstance} />
      </Row>
    </form>
  );
};

export default Step3;
