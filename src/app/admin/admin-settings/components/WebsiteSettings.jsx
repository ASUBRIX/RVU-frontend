import { Card, Form, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useAuthContext } from '@/context/useAuthContext';
import { getWebsiteSettingsAdmin, updateWebsiteSettingsAdmin } from '@/helpers/admin/websiteSettingsAdminApi';

const WebsiteSettings = () => {
  const { user } = useAuthContext();
  const [settings, setSettings] = useState({
    siteName: '',
    siteTitle: '',
    siteDescription: '',
    siteEmail: '',
    sitePhone: '',
    siteAddress: '',
    siteLogo: null,
    siteFavicon: null,
    copyrightText: '',
    facebookUrl: '',
    youtubeUrl: '',
    telegramUrl: '',
    instagramUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setFetchLoading(true);
        const apiData = await getWebsiteSettingsAdmin();
        setSettings({
          siteName: apiData.site_name || '',
          siteTitle: apiData.site_title || '',
          siteDescription: apiData.site_description || '',
          siteEmail: apiData.site_email || '',
          sitePhone: apiData.site_phone || '',
          siteAddress: apiData.site_address || '',
          siteLogo: null,
          siteFavicon: null,
          copyrightText: apiData.copyright_text || '',
          facebookUrl: apiData.facebook_url || '',
          youtubeUrl: apiData.youtube_url || '',
          telegramUrl: apiData.telegram_url || '',
          instagramUrl: apiData.instagram_url || ''
        });
        setFetchLoading(false);
      } catch (error) {
        setFeedback({
          type: 'danger',
          message: error.response?.data?.message || 'Failed to load website settings'
        });
        setFetchLoading(false);
      }
    };
    fetchSettings();
  }, [user?.token]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setFeedback({ type: '', message: '' });
      const formData = new FormData();
      Object.entries(settings).forEach(([key, value]) => {
        const snakeKey = key.replace(/[A-Z]/g, m => `_${m.toLowerCase()}`);
        formData.append(snakeKey, value);
      });
      const response = await updateWebsiteSettingsAdmin(formData);
      setFeedback({ type: 'success', message: response.message || 'Website settings updated successfully' });
    } catch (error) {
      setFeedback({
        type: 'danger',
        message: error.response?.data?.message || 'Failed to update website settings'
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <Card><Card.Body className="text-center py-5"><Spinner animation="border" role="status" variant="primary" /><p className="mt-3">Loading website settings...</p></Card.Body></Card>
    );
  }

  return (
    <Card>
      <Card.Header><h4 className="card-title mb-0">Website Settings</h4></Card.Header>
      <Card.Body>
        {feedback.message && (
          <Alert variant={feedback.type} dismissible onClose={() => setFeedback({ type: '', message: '' })}>{feedback.message}</Alert>
        )}
        <Form onSubmit={handleSubmit}>
          <Row className="g-3">
            {['siteName', 'siteTitle', 'siteEmail', 'sitePhone', 'copyrightText', 'facebookUrl', 'youtubeUrl', 'telegramUrl', 'instagramUrl'].map((field, i) => (
              <Col md={6} key={i}>
                <Form.Group>
                  <Form.Label>{field.replace(/([A-Z])/g, ' $1')}</Form.Label>
                  <Form.Control
                    type="text"
                    name={field}
                    value={settings[field]}
                    onChange={handleChange}
                    placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1')}`}
                  />
                </Form.Group>
              </Col>
            ))}
            {['siteDescription', 'siteAddress'].map((field, i) => (
              <Col md={12} key={i}>
                <Form.Group>
                  <Form.Label>{field.replace(/([A-Z])/g, ' $1')}</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={field === 'siteDescription' ? 3 : 2}
                    name={field}
                    value={settings[field]}
                    onChange={handleChange}
                    placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1')}`}
                  />
                </Form.Group>
              </Col>
            ))}
            {['siteLogo', 'siteFavicon'].map((field, i) => (
              <Col md={6} key={i}>
                <Form.Group>
                  <Form.Label>{field.replace(/([A-Z])/g, ' $1')}</Form.Label>
                  <Form.Control
                    type="file"
                    name={field}
                    onChange={handleChange}
                    accept="image/*"
                  />
                </Form.Group>
              </Col>
            ))}
            <Col md={12}>
              <div className="text-end">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? (<><Spinner as="span" animation="border" size="sm" /><span className="ms-2">Saving...</span></>) : 'Save Settings'}
                </button>
              </div>
            </Col>
          </Row>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default WebsiteSettings;
