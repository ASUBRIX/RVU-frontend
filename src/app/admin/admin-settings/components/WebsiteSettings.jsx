import { Card, Form, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { useState, useEffect, useContext } from 'react';
import httpClient from '../../../../helpers/httpClient';
import { useAuthContext } from '@/context/useAuthContext';

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

  // Fetch settings on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setFetchLoading(true);
        const response = await httpClient.get('/api/admin/settings', {
          headers: {
            'auth_key': user?.token
          }
        });
        
        // Transform the snake_case API response to camelCase for the component
        const apiData = response.data;
        setSettings({
          siteName: apiData.site_name || '',
          siteTitle: apiData.site_title || '',
          siteDescription: apiData.site_description || '',
          siteEmail: apiData.site_email || '',
          sitePhone: apiData.site_phone || '',
          siteAddress: apiData.site_address || '',
          siteLogo: apiData.site_logo || null,
          siteFavicon: apiData.site_favicon || null,
          copyrightText: apiData.copyright_text || '',
          facebookUrl: apiData.facebook_url || '',
          youtubeUrl: apiData.youtube_url || '',
          telegramUrl: apiData.telegram_url || '',
          instagramUrl: apiData.instagram_url || ''
        });

        setFetchLoading(false);
      } catch (error) {
        console.error('Error fetching settings:', error);
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
    if (files) {
      setSettings(prev => ({
        ...prev,
        [name]: files[0]
      }));
    } else {
      setSettings(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // UPDATED handleSubmit function with fixes for file uploads
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setFeedback({ type: '', message: '' });
      
      // Check if we have file uploads
      const hasFileUploads = settings.siteLogo instanceof File || settings.siteFavicon instanceof File;
      
      // Always use FormData - it handles both files and normal data
      const formData = new FormData();
      
      // Add all text fields
      formData.append('site_name', settings.siteName);
      formData.append('site_title', settings.siteTitle);
      formData.append('site_description', settings.siteDescription);
      formData.append('site_email', settings.siteEmail);
      formData.append('site_phone', settings.sitePhone);
      formData.append('site_address', settings.siteAddress);
      formData.append('copyright_text', settings.copyrightText);
      formData.append('facebook_url', settings.facebookUrl);
      formData.append('youtube_url', settings.youtubeUrl);
      formData.append('telegram_url', settings.telegramUrl);
      formData.append('instagram_url', settings.instagramUrl);
      
      // Add file fields only if they are Files
      if (settings.siteLogo instanceof File) {
        formData.append('site_logo', settings.siteLogo);
        console.log('Adding logo file to request:', settings.siteLogo.name);
      }
      
      if (settings.siteFavicon instanceof File) {
        formData.append('site_favicon', settings.siteFavicon);
        console.log('Adding favicon file to request:', settings.siteFavicon.name);
      }
      
      console.log('Sending request with FormData, has files:', hasFileUploads);
      
      // Send request using httpClient (with updated interceptor)
      const response = await httpClient.put('/api/settings', formData, {
        headers: {
          'auth_key': user?.token
          // DO NOT set Content-Type here! Let the browser set it automatically
        }
      });
      
      setFeedback({
        type: 'success',
        message: response.data.message || 'Website settings updated successfully'
      });
      
      // Update state with new data
      if (response.data.settings) {
        const updatedData = response.data.settings;
        setSettings({
          siteName: updatedData.site_name || '',
          siteTitle: updatedData.site_title || '',
          siteDescription: updatedData.site_description || '',
          siteEmail: updatedData.site_email || '',
          sitePhone: updatedData.site_phone || '',
          siteAddress: updatedData.site_address || '',
          siteLogo: updatedData.site_logo || null,
          siteFavicon: updatedData.site_favicon || null,
          copyrightText: updatedData.copyright_text || '',
          facebookUrl: updatedData.facebook_url || '',
          youtubeUrl: updatedData.youtube_url || '',
          telegramUrl: updatedData.telegram_url || '',
          instagramUrl: updatedData.instagram_url || ''
        });
      }
      
      console.log('Settings updated:', response.data);
    } catch (error) {
      console.error('Error updating settings:', error);
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
      <Card>
        <Card.Body className="text-center py-5">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-3">Loading website settings...</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card>
      <Card.Header>
        <h4 className="card-title mb-0">Website Settings</h4>
      </Card.Header>
      <Card.Body>
        {feedback.message && (
          <Alert variant={feedback.type} dismissible onClose={() => setFeedback({ type: '', message: '' })}>
            {feedback.message}
          </Alert>
        )}
        
        <Form onSubmit={handleSubmit}>
          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Site Name</Form.Label>
                <Form.Control
                  type="text"
                  name="siteName"
                  value={settings.siteName}
                  onChange={handleChange}
                  placeholder="Enter site name"
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Site Title</Form.Label>
                <Form.Control
                  type="text"
                  name="siteTitle"
                  value={settings.siteTitle}
                  onChange={handleChange}
                  placeholder="Enter site title"
                />
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group>
                <Form.Label>Site Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="siteDescription"
                  value={settings.siteDescription}
                  onChange={handleChange}
                  placeholder="Enter site description"
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Site Email</Form.Label>
                <Form.Control
                  type="email"
                  name="siteEmail"
                  value={settings.siteEmail}
                  onChange={handleChange}
                  placeholder="Enter site email"
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Site Phone</Form.Label>
                <Form.Control
                  type="tel"
                  name="sitePhone"
                  value={settings.sitePhone}
                  onChange={handleChange}
                  placeholder="Enter site phone"
                />
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group>
                <Form.Label>Site Address</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="siteAddress"
                  value={settings.siteAddress}
                  onChange={handleChange}
                  placeholder="Enter site address"
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Site Logo</Form.Label>
                <Form.Control
                  type="file"
                  name="siteLogo"
                  onChange={handleChange}
                  accept="image/*"
                />
                {typeof settings.siteLogo === 'string' && settings.siteLogo && (
                  <div className="mt-2">
                    <small>Current logo: </small>
                    <img 
                      src={settings.siteLogo} 
                      alt="Current logo" 
                      style={{ maxHeight: '40px', maxWidth: '100%' }} 
                    />
                  </div>
                )}
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Site Favicon</Form.Label>
                <Form.Control
                  type="file"
                  name="siteFavicon"
                  onChange={handleChange}
                  accept="image/x-icon,image/png"
                />
                {typeof settings.siteFavicon === 'string' && settings.siteFavicon && (
                  <div className="mt-2">
                    <small>Current favicon: </small>
                    <img 
                      src={settings.siteFavicon} 
                      alt="Current favicon" 
                      style={{ maxHeight: '32px', maxWidth: '100%' }} 
                    />
                  </div>
                )}
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group>
                <Form.Label>Copyright Text</Form.Label>
                <Form.Control
                  type="text"
                  name="copyrightText"
                  value={settings.copyrightText}
                  onChange={handleChange}
                  placeholder="Enter copyright text"
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Facebook URL</Form.Label>
                <Form.Control
                  type="url"
                  name="facebookUrl"
                  value={settings.facebookUrl}
                  onChange={handleChange}
                  placeholder="Enter Facebook URL"
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Youtube URL</Form.Label>
                <Form.Control
                  type="url"
                  name="youtubeUrl"
                  value={settings.youtubeUrl}
                  onChange={handleChange}
                  placeholder="Enter Youtube URL"
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Telegram URL</Form.Label>
                <Form.Control
                  type="url"
                  name="telegramUrl"
                  value={settings.telegramUrl}
                  onChange={handleChange}
                  placeholder="Enter Telegram URL"
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Instagram URL</Form.Label>
                <Form.Control
                  type="url"
                  name="instagramUrl"
                  value={settings.instagramUrl}
                  onChange={handleChange}
                  placeholder="Enter Instagram URL"
                />
              </Form.Group>
            </Col>

            <Col md={12}>
              <div className="text-end">
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                      <span className="ms-2">Saving...</span>
                    </>
                  ) : 'Save Settings'}
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