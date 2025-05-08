import { Card, Form, Row, Col, Tab, Badge } from 'react-bootstrap';
import { useState, useEffect } from 'react';

const SeoSettings = () => {
  // Define pages that need SEO settings
  const pages = [
    'home',
    'about-us',
    'our-team',
    'courses',
    'gallery',
    'blogs',
    'contact'
  ];

  // Initialize state with nested structure for each page
  const initialSeoState = pages.reduce((acc, page) => {
    acc[page] = {
      metaTitle: '',
      metaDescription: '',
      metaKeywords: '',
    };
    return acc;
  }, {});

  const [seoConfig, setSeoConfig] = useState(initialSeoState);
  const [activeTab, setActiveTab] = useState(pages[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch existing SEO data when component mounts
  useEffect(() => {
    const fetchSeoData = async () => {
      setIsLoading(true);
      try {
        // This is where you'd make your API call
        // For example:
        // const response = await fetch('/api/seo-settings');
        // const data = await response.json();
        // setSeoConfig(data);
        
        // Simulating API response with mock data
        setTimeout(() => {
          const mockData = {
            'home': {
              metaTitle: 'Welcome to Our Educational Platform',
              metaDescription: 'Discover our wide range of courses, experienced faculty, and state-of-the-art learning resources designed to help you excel in your educational journey.',
              metaKeywords: 'education, learning, courses, online learning',
            },
            // Other pages would have their data here
          };
          
          // Merge the mock data with initial state to ensure all pages have entries
          const completeData = { ...initialSeoState };
          Object.keys(mockData).forEach(page => {
            if (completeData[page]) {
              completeData[page] = { ...completeData[page], ...mockData[page] };
            }
          });
          
          setSeoConfig(completeData);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error fetching SEO data:", error);
        setIsLoading(false);
      }
    };
    
    fetchSeoData();
  }, []);

  const handleChange = (e, page) => {
    const { name, value } = e.target;
    setSeoConfig(prev => ({
      ...prev,
      [page]: {
        ...prev[page],
        [name]: value
      }
    }));
  };

  const handleSubmit = async (e, singlePage = null) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // Determine what data to save
      const dataToSave = singlePage 
        ? { [singlePage]: seoConfig[singlePage] } 
        : seoConfig;
      
      // This is where you'd make your API call
      // For example:
      // await fetch('/api/seo-settings', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(dataToSave)
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Show success message
      alert(singlePage 
        ? `SEO Settings for ${singlePage.replace(/-/g, ' ')} page saved successfully!` 
        : 'All SEO Settings saved successfully!');
        
      setIsSaving(false);
    } catch (error) {
      console.error("Error saving SEO data:", error);
      alert("Failed to save SEO settings. Please try again.");
      setIsSaving(false);
    }
  };

  const handleReset = (page) => {
    if (window.confirm(`Are you sure you want to reset SEO settings for ${page.replace(/-/g, ' ')} page?`)) {
      setSeoConfig(prev => ({
        ...prev,
        [page]: {
          metaTitle: '',
          metaDescription: '',
          metaKeywords: '',
        }
      }));
    }
  };

  // Calculate optimal lengths for SEO fields
  const getTitleLengthStatus = (title) => {
    const length = title.length;
    if (length === 0) return { color: 'secondary', text: '0/60' };
    if (length < 30) return { color: 'warning', text: `${length}/60 (Too short)` };
    if (length > 60) return { color: 'danger', text: `${length}/60 (Too long)` };
    return { color: 'success', text: `${length}/60 (Optimal)` };
  };

  const getDescriptionLengthStatus = (desc) => {
    const length = desc.length;
    if (length === 0) return { color: 'secondary', text: '0/160' };
    if (length < 120) return { color: 'warning', text: `${length}/160 (Too short)` };
    if (length > 160) return { color: 'danger', text: `${length}/160 (Too long)` };
    return { color: 'success', text: `${length}/160 (Optimal)` };
  };

  if (isLoading) {
    return (
      <Card>
        <Card.Body className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading SEO settings...</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card>
      <Card.Header>
        <h4 className="card-title mb-0">SEO Settings</h4>
      </Card.Header>
      <Card.Body>
        <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
          <Row>
            <Col md={12}>
              <Form.Group className="mb-4 ">
                <Form.Label>Select Page</Form.Label>
                <div className="d-flex align-items-center">
                  <Form.Select 
                    value={activeTab} 
                    onChange={(e) => setActiveTab(e.target.value)}
                    className="text-capitalize border border-primary"
                  >
                    {pages.map(page => (
                      <option key={page} value={page}>
                        {page.replace(/-/g, ' ')}
                      </option>
                    ))}
                  </Form.Select>
                  {seoConfig[activeTab]?.metaTitle && (
                    <Badge bg="success" pill className="ms-2">✓</Badge>
                  )}
                </div>
              </Form.Group>
              
              <Tab.Content>
                {pages.map(page => {
                  const titleStatus = getTitleLengthStatus(seoConfig[page]?.metaTitle || '');
                  const descStatus = getDescriptionLengthStatus(seoConfig[page]?.metaDescription || '');
                  
                  return (
                    <Tab.Pane key={page} eventKey={page}>
                      <Form onSubmit={(e) => handleSubmit(e, page)}>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h5 className="text-capitalize mb-0">{page.replace(/-/g, ' ')} Page SEO</h5>
                          <button 
                            type="button" 
                            className="btn btn-sm btn-outline-secondary" 
                            onClick={() => handleReset(page)}
                          >
                            Reset Fields
                          </button>
                        </div>
                        
                        <Row className="g-3">
                          <Col md={12}>
                            <Form.Group className="mb-3">
                              <Form.Label className="d-flex justify-content-between">
                                <span>Meta Title</span>
                                <Badge bg={titleStatus.color}>{titleStatus.text}</Badge>
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name="metaTitle"
                                value={seoConfig[page]?.metaTitle || ''}
                                onChange={(e) => handleChange(e, page)}
                                placeholder="Enter meta title"
                              />
                              <Form.Text className="text-muted">
                                Recommended length: 50-60 characters
                              </Form.Text>
                            </Form.Group>
                          </Col>

                          <Col md={12}>
                            <Form.Group className="mb-3">
                              <Form.Label className="d-flex justify-content-between">
                                <span>Meta Description</span>
                                <Badge bg={descStatus.color}>{descStatus.text}</Badge>
                              </Form.Label>
                              <Form.Control
                                as="textarea"
                                rows={3}
                                name="metaDescription"
                                value={seoConfig[page]?.metaDescription || ''}
                                onChange={(e) => handleChange(e, page)}
                                placeholder="Enter meta description"
                              />
                              <Form.Text className="text-muted">
                                Recommended length: 150-160 characters
                              </Form.Text>
                            </Form.Group>
                          </Col>

                          <Col md={12}>
                            <Form.Group className="mb-3">
                              <Form.Label>Meta Keywords</Form.Label>
                              <Form.Control
                                type="text"
                                name="metaKeywords"
                                value={seoConfig[page]?.metaKeywords || ''}
                                onChange={(e) => handleChange(e, page)}
                                placeholder="Enter keywords separated by commas"
                              />
                              <Form.Text className="text-muted">
                                Separate keywords with commas (e.g., education, learning, courses)
                              </Form.Text>
                            </Form.Group>
                          </Col>
                        </Row>

                        <div className="text-end mt-3">
                          <button 
                            type="submit" 
                            className="btn btn-primary "
                            disabled={isSaving}
                          >
                            {isSaving ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Saving...
                              </>
                            ) : (
                              `Save SEO`
                            )}
                          </button>
                        </div>
                      </Form>
                    </Tab.Pane>
                  );
                })}
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
        
        {/* <div className="text-end mt-4">
          <button 
            type="button" 
            className="btn btn-primary" 
            onClick={(e) => handleSubmit(e)}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Saving All Settings...
              </>
            ) : (
              'Save All SEO Settings'
            )}
          </button>
        </div> */}
      </Card.Body>
    </Card>
  );
};

export default SeoSettings;