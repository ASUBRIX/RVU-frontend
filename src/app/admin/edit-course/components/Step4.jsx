const Step4 = ({ stepperInstance }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Optional: validate form or save to backend
    stepperInstance?.next(); // Moves to the next step
  };

  return (
    <form id="step-4" role="tabpanel" className="content fade" onSubmit={handleSubmit} aria-labelledby="steppertrigger4">
      <h4>Advanced Settings</h4>
      {/* Your form fields go here */}

      <div className="d-flex justify-content-between mt-4">
        <button type="button" className="btn btn-secondary" onClick={() => stepperInstance?.previous()}>
          Previous
        </button>
        <button type="submit" className="btn btn-primary">
          Save and Continue
        </button>
      </div>
    </form>
  );
};

export default Step4;
