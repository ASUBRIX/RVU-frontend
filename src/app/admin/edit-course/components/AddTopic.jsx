import { useState } from 'react';
import useToggle from '@/hooks/useToggle';
import { Button, Col, Modal, ModalBody, ModalFooter, ModalHeader, Form, Spinner } from 'react-bootstrap';
import { BsPlusCircle, BsXLg } from 'react-icons/bs';
import { FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

const AddTopic = ({ courseId, onTopicAdded }) => {
  const { isTrue: isOpen, toggle } = useToggle();
  
  // Form state
  const [formData, setFormData] = useState({
    topicName: '',
    videoLink: '',
    description: '',
    isFree: true // default to free
  });
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  // Validation function
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.topicName.trim()) {
      newErrors.topicName = 'Topic name is required';
    } else if (formData.topicName.trim().length < 3) {
      newErrors.topicName = 'Topic name must be at least 3 characters';
    }
    
    if (formData.videoLink.trim() && !isValidUrl(formData.videoLink)) {
      newErrors.videoLink = 'Please enter a valid video URL';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // URL validation helper
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setErrors({});
    setSuccessMessage('');
    
    try {
      // Simulate API call (replace with your actual API call)
      await new Promise(resolve => setTimeout(resolve, 1500)); // Remove this line when adding real API
      
      // TODO: Replace with actual API call
      // const response = await courseContentApi.createTopic(courseId, formData);
      
      setSuccessMessage('Topic added successfully!');
      
      // Reset form
      setFormData({
        topicName: '',
        videoLink: '',
        description: '',
        isFree: true
      });
      
      // Notify parent component
      if (onTopicAdded) {
        onTopicAdded();
      }
      
      // Close modal after 1 second to show success message
      setTimeout(() => {
        setSuccessMessage('');
        toggle();
      }, 1000);
      
    } catch (error) {
      setErrors({ submit: error.message || 'Failed to add topic. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Handle modal close
  const handleClose = () => {
    if (!loading) {
      setFormData({
        topicName: '',
        videoLink: '',
        description: '',
        isFree: true
      });
      setErrors({});
      setSuccessMessage('');
      toggle();
    }
  };

  return (
    <>
      <Button 
        variant="dark" 
        onClick={toggle} 
        size="sm" 
        className="mb-0" 
        disabled={!courseId}
      >
        <BsPlusCircle className="me-2" />
        Add Topic
      </Button>

      <Modal 
        show={isOpen} 
        onHide={handleClose}
        backdrop={loading ? 'static' : true}
        keyboard={!loading}
      >
        <Form onSubmit={handleSubmit}>
          <ModalHeader className="bg-dark">
            <h5 className="modal-title text-white mb-0">
              Add Topic
            </h5>
            <button 
              type="button" 
              className="btn btn-sm btn-light mb-0 ms-auto" 
              onClick={handleClose}
              disabled={loading}
              aria-label="Close"
            >
              <BsXLg />
            </button>
          </ModalHeader>

          <ModalBody>
            {/* Success Message */}
            {successMessage && (
              <div className="alert alert-success d-flex align-items-center mb-3">
                <FiCheckCircle className="me-2" />
                {successMessage}
              </div>
            )}

            {/* Submit Error */}
            {errors.submit && (
              <div className="alert alert-danger d-flex align-items-center mb-3">
                <FiAlertCircle className="me-2" />
                {errors.submit}
              </div>
            )}

            <div className="row text-start g-3">
              {/* Topic Name */}
              <Col md={6}>
                <Form.Group>
                  <Form.Label>
                    Topic name <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter topic name"
                    value={formData.topicName}
                    onChange={(e) => handleInputChange('topicName', e.target.value)}
                    isInvalid={!!errors.topicName}
                    disabled={loading}
                    maxLength={255}
                  />
                  {errors.topicName && (
                    <Form.Control.Feedback type="invalid">
                      {errors.topicName}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>

              {/* Video Link */}
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Video link</Form.Label>
                  <Form.Control
                    type="url"
                    placeholder="Enter video URL (optional)"
                    value={formData.videoLink}
                    onChange={(e) => handleInputChange('videoLink', e.target.value)}
                    isInvalid={!!errors.videoLink}
                    disabled={loading}
                  />
                  {errors.videoLink && (
                    <Form.Control.Feedback type="invalid">
                      {errors.videoLink}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>

              {/* Description */}
              <Col xs={12} className="mt-3">
                <Form.Group>
                  <Form.Label>
                    Topic description <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Enter topic description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    isInvalid={!!errors.description}
                    disabled={loading}
                    maxLength={1000}
                  />
                  {errors.description && (
                    <Form.Control.Feedback type="invalid">
                      {errors.description}
                    </Form.Control.Feedback>
                  )}
                  <Form.Text className="text-muted">
                    {formData.description.length}/1000 characters
                  </Form.Text>
                </Form.Group>
              </Col>

              {/* Free/Premium Toggle */}
              <Col xs={6} className="mt-3">
                <Form.Group>
                  <Form.Label>Access Type</Form.Label>
                  <div className="btn-group w-100" role="group">
                    <input 
                      type="radio" 
                      className="btn-check" 
                      name="accessType" 
                      id="free"
                      checked={formData.isFree}
                      onChange={() => handleInputChange('isFree', true)}
                      disabled={loading}
                    />
                    <label 
                      className="btn btn-sm btn-outline-success" 
                      htmlFor="free"
                    >
                      Free
                    </label>

                    <input 
                      type="radio" 
                      className="btn-check" 
                      name="accessType" 
                      id="premium"
                      checked={!formData.isFree}
                      onChange={() => handleInputChange('isFree', false)}
                      disabled={loading}
                    />
                    <label 
                      className="btn btn-sm btn-outline-warning" 
                      htmlFor="premium"
                    >
                      Premium
                    </label>
                  </div>
                </Form.Group>
              </Col>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button 
              variant="secondary" 
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              variant="success"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    className="me-2"
                  />
                  Adding Topic...
                </>
              ) : (
                'Add Topic'
              )}
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </>
  );
};

export default AddTopic;