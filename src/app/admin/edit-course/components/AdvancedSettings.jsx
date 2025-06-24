import React, { useState, useEffect, useCallback, memo } from 'react';
import { Card, Form, Button, Alert, Spinner, Row, Col, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { 
  FaCheckCircle, 
  FaExclamationTriangle, 
  FaUsers, 
  FaCertificate, 
  FaGlobe, 
  FaLock,
  FaComments,
  FaDownload,
  FaEye,
  FaBell
} from 'react-icons/fa';

const AdvancedSettings = memo(({ 
  setActiveStep,
  setProgress,
  courseName,
  courseId,
  isNewCourse,
  courseCreated 
}) => {
  // Settings state
  const [settings, setSettings] = useState({
    // Course Status & Visibility
    status: 'draft', // draft, published, archived
    visibility: 'public', // public, private, unlisted
    
    // Enrollment Settings
    maxStudents: '',
    requireApproval: false,
    allowWaitlist: true,
    enrollmentDeadline: '',
    
    // Learning Features
    certificateEnabled: false,
    certificateTemplate: 'default',
    completionRequirement: 80, // percentage
    allowDiscussions: true,
    allowDownloads: false,
    allowNotes: true,
    
    // Communication
    emailNotifications: true,
    announcementsEnabled: true,
    progressReports: false,
    
    // Advanced Features
    prerequisiteCourses: [],
    tags: '',
    language: 'english',
    difficulty: 'beginner',
    
    // SEO & Marketing
    metaDescription: '',
    metaKeywords: '',
    featured: false,
    
    // Access Control
    accessDuration: 'lifetime', // lifetime, limited
    accessDays: 365,
    allowRefunds: true,
    refundPeriod: 30
  });

  // UI state
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  
  const navigate = useNavigate();

  // Load existing settings if editing
  useEffect(() => {
    if (courseId && !isNewCourse) {
      loadAdvancedSettings();
    }
  }, [courseId, isNewCourse]);

  const loadAdvancedSettings = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock existing settings
      const mockSettings = {
        ...settings,
        status: 'draft',
        visibility: 'public',
        certificateEnabled: true,
        allowDiscussions: true,
        maxStudents: '100',
        tags: 'programming, web development, javascript'
      };
      
      setSettings(mockSettings);
    } catch (error) {
      console.error('Failed to load settings:', error);
      setError('Failed to load advanced settings. Using defaults.');
    }
  };

  // Handle input changes
  const handleSettingChange = useCallback((field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [validationErrors]);

  // Validation
  const validateSettings = () => {
    const errors = {};
    
    if (settings.maxStudents && (isNaN(settings.maxStudents) || parseInt(settings.maxStudents) < 1)) {
      errors.maxStudents = 'Maximum students must be a positive number';
    }
    
    if (settings.completionRequirement < 0 || settings.completionRequirement > 100) {
      errors.completionRequirement = 'Completion requirement must be between 0 and 100';
    }
    
    if (settings.accessDuration === 'limited' && (!settings.accessDays || settings.accessDays < 1)) {
      errors.accessDays = 'Access days must be at least 1';
    }
    
    if (settings.refundPeriod < 0 || settings.refundPeriod > 365) {
      errors.refundPeriod = 'Refund period must be between 0 and 365 days';
    }
    
    if (settings.metaDescription && settings.metaDescription.length > 160) {
      errors.metaDescription = 'Meta description should be under 160 characters';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Save settings
  const handleSaveSettings = async () => {
    if (!validateSettings()) {
      setError('Please fix the validation errors before saving.');
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccessMessage('Advanced settings saved successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      
      if (setProgress) {
        setProgress(100);
      }
      
    } catch (error) {
      console.error('Failed to save settings:', error);
      setError('Failed to save advanced settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Publish course
  const handlePublishCourse = async () => {
    if (!validateSettings()) {
      setError('Please fix the validation errors before publishing.');
      return;
    }
    
    const confirmPublish = window.confirm(
      'Are you sure you want to publish this course? Once published, students will be able to enroll and access the content.'
    );
    
    if (!confirmPublish) return;
    
    try {
      setSaving(true);
      setError(null);
      
      // Update status to published
      handleSettingChange('status', 'published');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccessMessage('Course published successfully! Students can now enroll.');
      setTimeout(() => {
        navigate('/admin/all-courses');
      }, 2000);
      
    } catch (error) {
      console.error('Failed to publish course:', error);
      setError('Failed to publish course. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Finish and go back
  const handleFinish = () => {
    navigate('/admin/all-courses');
  };

  // Get status badge
  const getStatusBadge = () => {
    switch (settings.status) {
      case 'published':
        return <Badge bg="success">Published</Badge>;
      case 'draft':
        return <Badge bg="secondary">Draft</Badge>;
      case 'archived':
        return <Badge bg="warning">Archived</Badge>;
      default:
        return <Badge bg="secondary">Draft</Badge>;
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-2">Advanced Settings</h4>
          <p className="text-muted mb-0">
            Configure advanced options and publish your course
          </p>
        </div>
        
        <div className="text-end">
          <div className="mb-1">{getStatusBadge()}</div>
          <small className="text-muted">Course ID: {courseId || 'Pending'}</small>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <Alert variant="success" className="mb-4">
          <FaCheckCircle className="me-2" />
          {successMessage}
        </Alert>
      )}

      {/* Error Message */}
      {error && (
        <Alert variant="danger" className="mb-4">
          <FaExclamationTriangle className="me-2" />
          {error}
        </Alert>
      )}

      {/* Course not created warning */}
      {isNewCourse && !courseCreated && (
        <Alert variant="info" className="mb-4">
          <strong>New Course:</strong> Complete the previous steps before configuring advanced settings.
          <div className="mt-2">
            <Button 
              variant="outline-info" 
              size="sm"
              onClick={() => setActiveStep(1)}
            >
              Go to Basic Information
            </Button>
          </div>
        </Alert>
      )}

      {/* Settings Sections */}
      <div className="row g-4">
        {/* Course Status & Visibility */}
        <div className="col-12">
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-bottom">
              <h6 className="mb-0 d-flex align-items-center">
                <FaGlobe className="me-2 text-primary" />
                Course Status & Visibility
              </h6>
            </Card.Header>
            <Card.Body>
              <Row className="g-3">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      value={settings.status}
                      onChange={(e) => handleSettingChange('status', e.target.value)}
                      disabled={saving}
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </Form.Select>
                    <Form.Text className="text-muted">
                      {settings.status === 'draft' && 'Course is not visible to students'}
                      {settings.status === 'published' && 'Course is live and accepting enrollments'}
                      {settings.status === 'archived' && 'Course is no longer accepting new enrollments'}
                    </Form.Text>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Visibility</Form.Label>
                    <Form.Select
                      value={settings.visibility}
                      onChange={(e) => handleSettingChange('visibility', e.target.value)}
                      disabled={saving}
                    >
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                      <option value="unlisted">Unlisted</option>
                    </Form.Select>
                    <Form.Text className="text-muted">
                      {settings.visibility === 'public' && 'Visible in course listings'}
                      {settings.visibility === 'private' && 'Only accessible by invitation'}
                      {settings.visibility === 'unlisted' && 'Accessible by direct link only'}
                    </Form.Text>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Check
                      type="checkbox"
                      id="featured"
                      label="Featured Course"
                      checked={settings.featured}
                      onChange={(e) => handleSettingChange('featured', e.target.checked)}
                      disabled={saving}
                    />
                    <Form.Text className="text-muted">
                      Display prominently in course listings
                    </Form.Text>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </div>

        {/* Enrollment Settings */}
        <div className="col-md-6">
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white border-bottom">
              <h6 className="mb-0 d-flex align-items-center">
                <FaUsers className="me-2 text-success" />
                Enrollment Settings
              </h6>
            </Card.Header>
            <Card.Body>
              <Form.Group className="mb-3">
                <Form.Label>Maximum Students</Form.Label>
                <Form.Control
                  type="number"
                  value={settings.maxStudents}
                  onChange={(e) => handleSettingChange('maxStudents', e.target.value)}
                  placeholder="Unlimited"
                  min="1"
                  isInvalid={!!validationErrors.maxStudents}
                  disabled={saving}
                />
                {validationErrors.maxStudents && (
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.maxStudents}
                  </Form.Control.Feedback>
                )}
                <Form.Text className="text-muted">
                  Leave empty for unlimited enrollment
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Enrollment Deadline</Form.Label>
                <Form.Control
                  type="date"
                  value={settings.enrollmentDeadline}
                  onChange={(e) => handleSettingChange('enrollmentDeadline', e.target.value)}
                  disabled={saving}
                />
                <Form.Text className="text-muted">
                  Optional deadline for course enrollment
                </Form.Text>
              </Form.Group>

              <div className="d-flex flex-column gap-2">
                <Form.Check
                  type="checkbox"
                  id="requireApproval"
                  label="Require approval for enrollment"
                  checked={settings.requireApproval}
                  onChange={(e) => handleSettingChange('requireApproval', e.target.checked)}
                  disabled={saving}
                />
                <Form.Check
                  type="checkbox"
                  id="allowWaitlist"
                  label="Allow waitlist when full"
                  checked={settings.allowWaitlist}
                  onChange={(e) => handleSettingChange('allowWaitlist', e.target.checked)}
                  disabled={saving}
                />
              </div>
            </Card.Body>
          </Card>
        </div>

        {/* Learning Features */}
        <div className="col-md-6">
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white border-bottom">
              <h6 className="mb-0 d-flex align-items-center">
                <FaCertificate className="me-2 text-warning" />
                Learning Features
              </h6>
            </Card.Header>
            <Card.Body>
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  id="certificateEnabled"
                  label="Enable completion certificates"
                  checked={settings.certificateEnabled}
                  onChange={(e) => handleSettingChange('certificateEnabled', e.target.checked)}
                  disabled={saving}
                />
              </Form.Group>

              {settings.certificateEnabled && (
                <Form.Group className="mb-3">
                  <Form.Label>Completion Requirement (%)</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    max="100"
                    value={settings.completionRequirement}
                    onChange={(e) => handleSettingChange('completionRequirement', parseInt(e.target.value))}
                    isInvalid={!!validationErrors.completionRequirement}
                    disabled={saving}
                  />
                  {validationErrors.completionRequirement && (
                    <Form.Control.Feedback type="invalid">
                      {validationErrors.completionRequirement}
                    </Form.Control.Feedback>
                  )}
                  <Form.Text className="text-muted">
                    Percentage of course completion required for certificate
                  </Form.Text>
                </Form.Group>
              )}

              <div className="d-flex flex-column gap-2">
                <Form.Check
                  type="checkbox"
                  id="allowDiscussions"
                  label="Allow student discussions"
                  checked={settings.allowDiscussions}
                  onChange={(e) => handleSettingChange('allowDiscussions', e.target.checked)}
                  disabled={saving}
                />
                <Form.Check
                  type="checkbox"
                  id="allowDownloads"
                  label="Allow content downloads"
                  checked={settings.allowDownloads}
                  onChange={(e) => handleSettingChange('allowDownloads', e.target.checked)}
                  disabled={saving}
                />
                <Form.Check
                  type="checkbox"
                  id="allowNotes"
                  label="Allow student notes"
                  checked={settings.allowNotes}
                  onChange={(e) => handleSettingChange('allowNotes', e.target.checked)}
                  disabled={saving}
                />
              </div>
            </Card.Body>
          </Card>
        </div>

        {/* Communication Settings */}
        <div className="col-md-6">
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white border-bottom">
              <h6 className="mb-0 d-flex align-items-center">
                <FaBell className="me-2 text-info" />
                Communication
              </h6>
            </Card.Header>
            <Card.Body>
              <div className="d-flex flex-column gap-3">
                <Form.Check
                  type="checkbox"
                  id="emailNotifications"
                  label="Email notifications"
                  checked={settings.emailNotifications}
                  onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                  disabled={saving}
                />
                <Form.Check
                  type="checkbox"
                  id="announcementsEnabled"
                  label="Course announcements"
                  checked={settings.announcementsEnabled}
                  onChange={(e) => handleSettingChange('announcementsEnabled', e.target.checked)}
                  disabled={saving}
                />
                <Form.Check
                  type="checkbox"
                  id="progressReports"
                  label="Weekly progress reports"
                  checked={settings.progressReports}
                  onChange={(e) => handleSettingChange('progressReports', e.target.checked)}
                  disabled={saving}
                />
              </div>
            </Card.Body>
          </Card>
        </div>

        {/* Access Control */}
        <div className="col-md-6">
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white border-bottom">
              <h6 className="mb-0 d-flex align-items-center">
                <FaLock className="me-2 text-danger" />
                Access Control
              </h6>
            </Card.Header>
            <Card.Body>
              <Form.Group className="mb-3">
                <Form.Label>Access Duration</Form.Label>
                <Form.Select
                  value={settings.accessDuration}
                  onChange={(e) => handleSettingChange('accessDuration', e.target.value)}
                  disabled={saving}
                >
                  <option value="lifetime">Lifetime Access</option>
                  <option value="limited">Limited Access</option>
                </Form.Select>
              </Form.Group>

              {settings.accessDuration === 'limited' && (
                <Form.Group className="mb-3">
                  <Form.Label>Access Days</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    value={settings.accessDays}
                    onChange={(e) => handleSettingChange('accessDays', parseInt(e.target.value))}
                    isInvalid={!!validationErrors.accessDays}
                    disabled={saving}
                  />
                  {validationErrors.accessDays && (
                    <Form.Control.Feedback type="invalid">
                      {validationErrors.accessDays}
                    </Form.Control.Feedback>
                  )}
                  <Form.Text className="text-muted">
                    Number of days students can access the course
                  </Form.Text>
                </Form.Group>
              )}

              <div className="d-flex flex-column gap-2">
                <Form.Check
                  type="checkbox"
                  id="allowRefunds"
                  label="Allow refunds"
                  checked={settings.allowRefunds}
                  onChange={(e) => handleSettingChange('allowRefunds', e.target.checked)}
                  disabled={saving}
                />
                
                {settings.allowRefunds && (
                  <Form.Group className="mt-2">
                    <Form.Label>Refund Period (days)</Form.Label>
                    <Form.Control
                      type="number"
                      min="0"
                      max="365"
                      value={settings.refundPeriod}
                      onChange={(e) => handleSettingChange('refundPeriod', parseInt(e.target.value))}
                      isInvalid={!!validationErrors.refundPeriod}
                      disabled={saving}
                    />
                    {validationErrors.refundPeriod && (
                      <Form.Control.Feedback type="invalid">
                        {validationErrors.refundPeriod}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>
                )}
              </div>
            </Card.Body>
          </Card>
        </div>

        {/* SEO & Marketing */}
        <div className="col-12">
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-bottom">
              <h6 className="mb-0 d-flex align-items-center">
                <FaEye className="me-2 text-secondary" />
                SEO & Marketing
              </h6>
            </Card.Header>
            <Card.Body>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Meta Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={settings.metaDescription}
                      onChange={(e) => handleSettingChange('metaDescription', e.target.value)}
                      placeholder="Brief description for search engines"
                      maxLength={160}
                      isInvalid={!!validationErrors.metaDescription}
                      disabled={saving}
                    />
                    {validationErrors.metaDescription && (
                      <Form.Control.Feedback type="invalid">
                        {validationErrors.metaDescription}
                      </Form.Control.Feedback>
                    )}
                    <Form.Text className="text-muted">
                      {settings.metaDescription.length}/160 characters
                    </Form.Text>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Tags</Form.Label>
                    <Form.Control
                      type="text"
                      value={settings.tags}
                      onChange={(e) => handleSettingChange('tags', e.target.value)}
                      placeholder="programming, web development, javascript"
                      disabled={saving}
                    />
                    <Form.Text className="text-muted">
                      Comma-separated tags for better discoverability
                    </Form.Text>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="d-flex justify-content-between mt-4 pt-4 border-top">
        <Button 
          variant="outline-secondary" 
          onClick={() => setActiveStep(3)}
          disabled={saving}
        >
          Previous: Content
        </Button>
        
        <div className="d-flex gap-2">
          <Button 
            variant="outline-primary" 
            onClick={handleSaveSettings}
            disabled={saving}
          >
            {saving ? (
              <>
                <Spinner size="sm" className="me-2" />
                Saving...
              </>
            ) : (
              'Save Settings'
            )}
          </Button>
          
          {settings.status === 'draft' && (
            <Button 
              variant="success" 
              onClick={handlePublishCourse}
              disabled={saving}
            >
              {saving ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Publishing...
                </>
              ) : (
                <>
                  <FaCheckCircle className="me-2" />
                  Publish Course
                </>
              )}
            </Button>
          )}
          
          <Button 
            variant="outline-success" 
            onClick={handleFinish}
            disabled={saving}
          >
            Finish & View Courses
          </Button>
        </div>
      </div>

      {/* Course Summary */}
      <Card className="mt-4 border-0 bg-light">
        <Card.Body>
          <h6 className="mb-3">Course Summary</h6>
          <Row className="g-3">
            <Col md={3}>
              <strong>Status:</strong>
              <div>{getStatusBadge()}</div>
            </Col>
            <Col md={3}>
              <strong>Visibility:</strong>
              <div className="text-capitalize">{settings.visibility}</div>
            </Col>
            <Col md={3}>
              <strong>Enrollment:</strong>
              <div>
                {settings.maxStudents ? `Max ${settings.maxStudents}` : 'Unlimited'}
                {settings.requireApproval && ' (Approval Required)'}
              </div>
            </Col>
            <Col md={3}>
              <strong>Features:</strong>
              <div>
                {settings.certificateEnabled && <Badge bg="warning" className="me-1">Certificates</Badge>}
                {settings.allowDiscussions && <Badge bg="info" className="me-1">Discussions</Badge>}
                {settings.allowDownloads && <Badge bg="success" className="me-1">Downloads</Badge>}
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
});

AdvancedSettings.displayName = 'AdvancedSettings';

export default AdvancedSettings;