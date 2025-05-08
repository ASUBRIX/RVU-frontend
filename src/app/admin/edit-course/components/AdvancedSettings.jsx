import { Form, Button, Card } from 'react-bootstrap';
import { useState } from 'react';
import { FiInfo } from 'react-icons/fi';

const AdvancedSettings = () => {
  const [settings, setSettings] = useState({
    isEnrollmentLimited: false,
    maxEnrollments: '',
    requiresPrerequisites: false,
    prerequisites: [],
    hasCertificate: false,
    certificateTemplate: '',
    isRefundable: false,
    refundDuration: '',
    refundConditions: '',
    hasAssessment: false,
    passingScore: '',
    allowRetakes: false,
    maxRetakes: '',
    showProgress: true,
    trackCompletion: true,
    allowDownloads: false,
    showLeaderboard: false
  });

  const handleSettingChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div>
      <h4 className="mb-4">Advanced Settings</h4>
      
      <Form>
        {/* Enrollment Settings */}
        <Card className="border-0 shadow-sm mb-4">
          <Card.Body className="p-4">
            <h5 className="mb-4">Enrollment Settings</h5>
            <div className="row g-4">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <div className="d-flex align-items-center gap-2">
                    <Form.Check 
                      type="switch"
                      id="limitEnrollments"
                      label="Limit Enrollments"
                      checked={settings.isEnrollmentLimited}
                      onChange={(e) => handleSettingChange('isEnrollmentLimited', e.target.checked)}
                    />
                    <FiInfo className="text-muted" title="Set a maximum number of students who can enroll" />
                  </div>
                </Form.Group>
                {settings.isEnrollmentLimited && (
                  <Form.Group>
                    <Form.Control 
                      type="number"
                      className="bg-light border-0"
                      placeholder="Maximum number of students"
                      value={settings.maxEnrollments}
                      onChange={(e) => handleSettingChange('maxEnrollments', e.target.value)}
                    />
                  </Form.Group>
                )}
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <div className="d-flex align-items-center gap-2">
                    <Form.Check 
                      type="switch"
                      id="prerequisites"
                      label="Require Prerequisites"
                      checked={settings.requiresPrerequisites}
                      onChange={(e) => handleSettingChange('requiresPrerequisites', e.target.checked)}
                    />
                    <FiInfo className="text-muted" title="Students must complete specific courses before enrolling" />
                  </div>
                </Form.Group>
                {settings.requiresPrerequisites && (
                  <Form.Group>
                    <Form.Select 
                      className="bg-light border-0"
                      multiple
                      value={settings.prerequisites}
                      onChange={(e) => handleSettingChange('prerequisites', 
                        Array.from(e.target.selectedOptions, option => option.value)
                      )}
                    >
                      <option value="course1">Course 1</option>
                      <option value="course2">Course 2</option>
                      <option value="course3">Course 3</option>
                    </Form.Select>
                  </Form.Group>
                )}
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Certificate Settings */}
        <Card className="border-0 shadow-sm mb-4">
          <Card.Body className="p-4">
            <h5 className="mb-4">Certificate Settings</h5>
            <div className="row g-4">
              <div className="col-md-12">
                <Form.Group className="mb-3">
                  <div className="d-flex align-items-center gap-2">
                    <Form.Check 
                      type="switch"
                      id="certificate"
                      label="Enable Course Certificate"
                      checked={settings.hasCertificate}
                      onChange={(e) => handleSettingChange('hasCertificate', e.target.checked)}
                    />
                    <FiInfo className="text-muted" title="Issue certificates upon course completion" />
                  </div>
                </Form.Group>
                {settings.hasCertificate && (
                  <Form.Group>
                    <Form.Select 
                      className="bg-light border-0"
                      value={settings.certificateTemplate}
                      onChange={(e) => handleSettingChange('certificateTemplate', e.target.value)}
                    >
                      <option value="">Select Certificate Template</option>
                      <option value="template1">Template 1</option>
                      <option value="template2">Template 2</option>
                      <option value="template3">Template 3</option>
                    </Form.Select>
                  </Form.Group>
                )}
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Refund Settings */}
        <Card className="border-0 shadow-sm mb-4">
          <Card.Body className="p-4">
            <h5 className="mb-4">Refund Settings</h5>
            <div className="row g-4">
              <div className="col-md-12">
                <Form.Group className="mb-3">
                  <div className="d-flex align-items-center gap-2">
                    <Form.Check 
                      type="switch"
                      id="refund"
                      label="Allow Refunds"
                      checked={settings.isRefundable}
                      onChange={(e) => handleSettingChange('isRefundable', e.target.checked)}
                    />
                    <FiInfo className="text-muted" title="Set refund policy for the course" />
                  </div>
                </Form.Group>
                {settings.isRefundable && (
                  <>
                    <Form.Group className="mb-3">
                      <Form.Control 
                        type="number"
                        className="bg-light border-0"
                        placeholder="Refund period (in days)"
                        value={settings.refundDuration}
                        onChange={(e) => handleSettingChange('refundDuration', e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Control 
                        as="textarea"
                        rows={3}
                        className="bg-light border-0"
                        placeholder="Refund conditions..."
                        value={settings.refundConditions}
                        onChange={(e) => handleSettingChange('refundConditions', e.target.value)}
                      />
                    </Form.Group>
                  </>
                )}
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Assessment Settings */}
        <Card className="border-0 shadow-sm mb-4">
          <Card.Body className="p-4">
            <h5 className="mb-4">Assessment Settings</h5>
            <div className="row g-4">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <div className="d-flex align-items-center gap-2">
                    <Form.Check 
                      type="switch"
                      id="assessment"
                      label="Enable Assessments"
                      checked={settings.hasAssessment}
                      onChange={(e) => handleSettingChange('hasAssessment', e.target.checked)}
                    />
                    <FiInfo className="text-muted" title="Add quizzes and tests to the course" />
                  </div>
                </Form.Group>
                {settings.hasAssessment && (
                  <>
                    <Form.Group className="mb-3">
                      <Form.Control 
                        type="number"
                        className="bg-light border-0"
                        placeholder="Passing score (%)"
                        value={settings.passingScore}
                        onChange={(e) => handleSettingChange('passingScore', e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <div className="d-flex align-items-center gap-2">
                        <Form.Check 
                          type="switch"
                          id="retakes"
                          label="Allow Retakes"
                          checked={settings.allowRetakes}
                          onChange={(e) => handleSettingChange('allowRetakes', e.target.checked)}
                        />
                      </div>
                    </Form.Group>
                    {settings.allowRetakes && (
                      <Form.Group>
                        <Form.Control 
                          type="number"
                          className="bg-light border-0"
                          placeholder="Maximum retakes allowed"
                          value={settings.maxRetakes}
                          onChange={(e) => handleSettingChange('maxRetakes', e.target.value)}
                        />
                      </Form.Group>
                    )}
                  </>
                )}
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Additional Settings */}
        <Card className="border-0 shadow-sm mb-4">
          <Card.Body className="p-4">
            <h5 className="mb-4">Additional Settings</h5>
            <div className="row g-4">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <div className="d-flex align-items-center gap-2">
                    <Form.Check 
                      type="switch"
                      id="progress"
                      label="Show Progress"
                      checked={settings.showProgress}
                      onChange={(e) => handleSettingChange('showProgress', e.target.checked)}
                    />
                    <FiInfo className="text-muted" title="Display progress bar for students" />
                  </div>
                </Form.Group>
                <Form.Group className="mb-3">
                  <div className="d-flex align-items-center gap-2">
                    <Form.Check 
                      type="switch"
                      id="completion"
                      label="Track Completion"
                      checked={settings.trackCompletion}
                      onChange={(e) => handleSettingChange('trackCompletion', e.target.checked)}
                    />
                    <FiInfo className="text-muted" title="Track and record course completion" />
                  </div>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <div className="d-flex align-items-center gap-2">
                    <Form.Check 
                      type="switch"
                      id="downloads"
                      label="Allow Downloads"
                      checked={settings.allowDownloads}
                      onChange={(e) => handleSettingChange('allowDownloads', e.target.checked)}
                    />
                    <FiInfo className="text-muted" title="Enable content downloads for students" />
                  </div>
                </Form.Group>
                <Form.Group className="mb-3">
                  <div className="d-flex align-items-center gap-2">
                    <Form.Check 
                      type="switch"
                      id="leaderboard"
                      label="Show Leaderboard"
                      checked={settings.showLeaderboard}
                      onChange={(e) => handleSettingChange('showLeaderboard', e.target.checked)}
                    />
                    <FiInfo className="text-muted" title="Display student rankings and achievements" />
                  </div>
                </Form.Group>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Action Buttons */}
        <div className="d-flex justify-content-end gap-3">
          <Button variant="light" className="px-4">
            Back
          </Button>
          <Button variant="dark" className="px-4">
            Save & Continue
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AdvancedSettings; 