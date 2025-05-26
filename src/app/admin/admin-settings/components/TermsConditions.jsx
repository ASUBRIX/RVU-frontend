import { Card, Form, Alert, Spinner } from 'react-bootstrap';
import { useState, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useAuthContext } from '@/context/useAuthContext';
import httpClient from '../../../../helpers/httpClient';

const TermsConditions = () => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const quillRef = useRef(null);
  const { user } = useAuthContext();

  // Fetch existing terms and conditions
  useEffect(() => {
    const fetchTerms = async () => {
      try {
        setFetchLoading(true);
        const response = await httpClient.get('/api/admin/legal', {
          headers: {
            'auth_key': user?.token
          }
        });
        
        if (response.data && response.data.content) {
          setContent(response.data.content);
        }
        
        setFetchLoading(false);
      } catch (error) {
        console.error('Error fetching terms:', error);
        setFeedback({
          type: 'danger',
          message: error.response?.data?.message || 'Failed to load terms and conditions'
        });
        setFetchLoading(false);
      }
    };

    fetchTerms();
  }, [user?.token]);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['link'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'indent',
    'align',
    'link'
  ];

  const handleChange = (value) => {
    setContent(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setFeedback({ type: '', message: '' });
      
      const response = await httpClient.put('/api/admin/legal', 
        { content },
        {
          headers: {
            'auth_key': user?.token,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setFeedback({
        type: 'success',
        message: response.data.message || 'Terms and conditions updated successfully'
      });
      
      console.log("Terms and Conditions saved successfully:", response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error updating terms:', error);
      setFeedback({
        type: 'danger',
        message: error.response?.data?.message || 'Failed to update terms and conditions'
      });
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
          <p className="mt-3">Loading terms and conditions...</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card>
      <Card.Header>
        <h4 className="card-title mb-0">Terms & Conditions</h4>
      </Card.Header>
      <Card.Body>
        {feedback.message && (
          <Alert variant={feedback.type} dismissible onClose={() => setFeedback({ type: '', message: '' })}>
            {feedback.message}
          </Alert>
        )}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-4">
            <Form.Label>Terms & Conditions Content</Form.Label>
            <div className="mb-3">
              <ReactQuill
                ref={quillRef}
                theme="snow"
                value={content}
                onChange={handleChange}
                modules={modules}
                formats={formats}
                // style={{ height: '300px', marginBottom: '40px' }}
              />
            </div>
            <Form.Text className="text-muted">
              This content will be displayed on your Terms & Conditions page.
            </Form.Text>
          </Form.Group>
          <div className="text-end mt-5">
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
              ) : 'Save Changes'}
            </button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default TermsConditions;