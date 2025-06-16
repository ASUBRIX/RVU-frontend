// src/pages/admin/TestManagement/components/TestSettings.jsx
import { useState } from 'react';
import { Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { FiSave, FiArrowLeft, FiCheck } from 'react-icons/fi';

const TestSettings = ({ setActiveStep, setProgress }) => {
  const [settings, setSettings] = useState({
    defaultDuration: { hours: 2, minutes: 0 },
    defaultPassingScore: 60,
    defaultAttemptsAllowed: 1,
    autoGrading: true,
    showResultsImmediately: true,
    allowReview: true,
    shuffleQuestions: false,
    requireProctoring: false,
    notifications: {
      onStart: true,
      onComplete: true,
      onFail: true,
    },
  });

  const handleSettingChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNotificationChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: value,
      },
    }));
  };

  const handleSave = () => {
    console.log('Saving settings:', settings);
    setProgress(100);
    setActiveStep(1);
  };

  return (
    <div className="mt-4">
      <Row className="mb-4 align-items-center">
        <Col>
          <Button
            variant="link"
            className="p-0 mb-2"
            onClick={() => {
              setProgress(50);
              setActiveStep(2);
            }}
          >
            <FiArrowLeft className="me-2" /> Back to Test Creation
          </Button>
          <h4 className="mb-1">Test Settings</h4>
          <p className="text-muted mb-0">Configure default settings for all tests</p>
        </Col>
        <Col xs="auto">
          <Button variant="primary" className="rounded-pill" onClick={handleSave}>
            <FiSave className="me-2" /> Save Settings
          </Button>
        </Col>
      </Row>

      <Row>
        <Col lg={8}>
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body>
              <h5 className="mb-4">Default Test Settings</h5>
              <Form>
                <Form.Group className="mb-4">
                  <Form.Label>Default Test Duration</Form.Label>
                  <Row>
                    <Col md={6}>
                      <Form.Control
                        type="number"
                        placeholder="Hours"
                        value={settings.defaultDuration.hours}
                        onChange={(e) =>
                          handleSettingChange('defaultDuration', {
                            ...settings.defaultDuration,
                            hours: parseInt(e.target.value) || 0,
                          })
                        }
                        className="bg-light border-0"
                      />
                    </Col>
                    <Col md={6}>
                      <Form.Control
                        type="number"
                        placeholder="Minutes"
                        value={settings.defaultDuration.minutes}
                        onChange={(e) =>
                          handleSettingChange('defaultDuration', {
                            ...settings.defaultDuration,
                            minutes: parseInt(e.target.value) || 0,
                          })
                        }
                        className="bg-light border-0"
                      />
                    </Col>
                  </Row>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Default Passing Score (%)</Form.Label>
                  <Form.Control
                    type="number"
                    value={settings.defaultPassingScore}
                    onChange={(e) =>
                      handleSettingChange('defaultPassingScore', parseInt(e.target.value))
                    }
                    className="bg-light border-0"
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Default Attempts Allowed</Form.Label>
                  <Form.Control
                    type="number"
                    value={settings.defaultAttemptsAllowed}
                    onChange={(e) =>
                      handleSettingChange('defaultAttemptsAllowed', parseInt(e.target.value))
                    }
                    className="bg-light border-0"
                  />
                </Form.Group>

                <hr className="my-4" />

                <Form.Check
                  type="switch"
                  id="auto-grading"
                  label="Enable Auto Grading"
                  checked={settings.autoGrading}
                  onChange={(e) => handleSettingChange('autoGrading', e.target.checked)}
                  className="mb-4"
                />
                <Form.Check
                  type="switch"
                  id="show-results"
                  label="Show Results Immediately"
                  checked={settings.showResultsImmediately}
                  onChange={(e) => handleSettingChange('showResultsImmediately', e.target.checked)}
                  className="mb-4"
                />
                <Form.Check
                  type="switch"
                  id="allow-review"
                  label="Allow Test Review"
                  checked={settings.allowReview}
                  onChange={(e) => handleSettingChange('allowReview', e.target.checked)}
                  className="mb-4"
                />
                <Form.Check
                  type="switch"
                  id="shuffle-questions"
                  label="Shuffle Questions by Default"
                  checked={settings.shuffleQuestions}
                  onChange={(e) => handleSettingChange('shuffleQuestions', e.target.checked)}
                  className="mb-4"
                />
                <Form.Check
                  type="switch"
                  id="require-proctoring"
                  label="Require Proctoring"
                  checked={settings.requireProctoring}
                  onChange={(e) => handleSettingChange('requireProctoring', e.target.checked)}
                  className="mb-4"
                />

                <hr className="my-4" />
                <h6 className="mb-3">Notification Settings</h6>
                <Form.Check
                  type="switch"
                  id="notify-start"
                  label="Notify when test starts"
                  checked={settings.notifications.onStart}
                  onChange={(e) => handleNotificationChange('onStart', e.target.checked)}
                  className="mb-3"
                />
                <Form.Check
                  type="switch"
                  id="notify-complete"
                  label="Notify when test is completed"
                  checked={settings.notifications.onComplete}
                  onChange={(e) => handleNotificationChange('onComplete', e.target.checked)}
                  className="mb-3"
                />
                <Form.Check
                  type="switch"
                  id="notify-fail"
                  label="Notify on test failure"
                  checked={settings.notifications.onFail}
                  onChange={(e) => handleNotificationChange('onFail', e.target.checked)}
                  className="mb-3"
                />
              </Form>
            </Card.Body>
          </Card>

          <Alert variant="success" className="d-flex align-items-center">
            <FiCheck className="me-2" size={20} />
            <div>
              <strong>All changes are automatically saved</strong>
              <p className="mb-0 small">
                These settings will be applied as defaults for all new tests
              </p>
            </div>
          </Alert>
        </Col>

        <Col lg={4}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h6 className="mb-3">About Test Settings</h6>
              <p className="text-muted small mb-0">
                These settings will be used as defaults when creating new tests. You can override
                these settings for individual tests during test creation.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TestSettings;
