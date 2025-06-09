import { Card, Form, Alert, Spinner } from 'react-bootstrap';
import { useState, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useAuthContext } from '@/context/useAuthContext';
import { fetchPrivacyPolicy, updatePrivacyPolicy } from '@/helpers/admin/privacyApi';

const PrivacyPolicy = () => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const quillRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetchLoading(true);
        const response = await fetchPrivacyPolicy();
        if (response.data && response.data.content) {
          setContent(response.data.content);
        }
      } catch (error) {
        console.error('Error fetching privacy policy:', error);
        setFeedback({
          type: 'danger',
          message: error.response?.data?.message || 'Failed to load privacy policy',
        });
      } finally {
        setFetchLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (value) => setContent(value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setFeedback({ type: '', message: '' });
      const response = await updatePrivacyPolicy(content);
      setFeedback({ type: 'success', message: response.data.message });
    } catch (error) {
      console.error('Error updating privacy policy:', error);
      setFeedback({
        type: 'danger',
        message: error.response?.data?.message || 'Failed to update privacy policy',
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <Card>
        <Card.Body className="text-center py-5">
          <Spinner animation="border" />
          <p className="mt-3">Loading privacy policy...</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card>
      <Card.Header>
        <h4 className="card-title mb-0">Privacy Policy</h4>
      </Card.Header>
      <Card.Body>
        {feedback.message && (
          <Alert variant={feedback.type} dismissible onClose={() => setFeedback({ type: '', message: '' })}>
            {feedback.message}
          </Alert>
        )}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-4">
            <Form.Label>Privacy Policy Content</Form.Label>
            <ReactQuill
              ref={quillRef}
              theme="snow"
              value={content}
              onChange={handleChange}
              modules={{
                toolbar: [
                  [{ header: [1, 2, 3, 4, 5, 6, false] }],
                  ['bold', 'italic', 'underline', 'strike'],
                  [{ list: 'ordered' }, { list: 'bullet' }],
                  [{ indent: '-1' }, { indent: '+1' }],
                  [{ align: [] }],
                  ['link'],
                  ['clean'],
                ],
              }}
              formats={[
                'header',
                'bold', 'italic', 'underline', 'strike',
                'list', 'bullet', 'indent',
                'align', 'link',
              ]}
              style={{ height: '300px', marginBottom: '60px' }}
            />
          </Form.Group>
          <div className="text-end mt-4">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" />
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

export default PrivacyPolicy;
