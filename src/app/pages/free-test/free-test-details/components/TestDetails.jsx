import { Card, Col, Container, Row, Button, Spinner } from "react-bootstrap";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FaFile, FaFolderOpen } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useAuthContext } from '@/context/useAuthContext';
import { useNotificationContext } from '@/context/useNotificationContext';
import authService from '@/helpers/authService';

const TestDetails = () => {
  const { testId: folderId } = useParams();
  const navigate = useNavigate();
  const [folderContents, setFolderContents] = useState({
    folder: null,
    breadcrumbs: [],
    folders: [],
    tests: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isAuthenticated } = useAuthContext();
  const { showNotification } = useNotificationContext();

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated || !user?.token) {
      setError('Authentication required');
      setLoading(false);
      return;
    }

    const fetchFolderContents = async () => {
      try {
        console.log(`Fetching contents for folder: ${folderId}`);
        
        const contents = await authService.getFolderContentsPublic(folderId, user.token);
        console.log('Folder contents response:', contents);
        console.log('Folder info:', contents.folder);
        console.log('Breadcrumbs:', contents.breadcrumbs);
        console.log('Subfolders:', contents.folders);
        console.log('Tests:', contents.tests);
        
        setFolderContents({
          folder: contents.folder || null,
          breadcrumbs: contents.breadcrumbs || [],
          folders: contents.folders || [],
          tests: contents.tests || []
        });
      } catch (err) {
        console.error('Error fetching folder contents:', err);
        
        if (err.response) {
          if (err.response.status === 401) {
            setError('Your session has expired. Please sign in again.');
            showNotification({
              message: 'Your session has expired. Please sign in again.',
              variant: 'danger'
            });
          } else {
            setError(`Error: ${err.response?.data?.error || 'Failed to fetch folder contents'}`);
          }
        } else if (err.request) {
          setError('Network error. No response received from the server.');
        } else {
          setError(`Error: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFolderContents();
  }, [folderId, isAuthenticated, user?.token, showNotification]);

  const handleTakeTest = (testId) => {
    console.log('Taking test with ID:', testId);
    console.log('Navigating to URL:', `/test-questions/${testId}`);
    navigate(`/test-questions/${testId}`);
  };

  const handleFolderClick = (subfolderId) => {
    navigate(`/free-test/free-test-details/${subfolderId}`);
  };

  const renderBreadcrumbs = () => {
    return (
      <p className="d-flex align-items-center">
        <Link to="/free-test" className="me-2 text-decoration-none">Free Tests</Link>
        {folderContents.breadcrumbs.map((crumb, index) => (
          <span key={crumb.id}>
            &gt; 
            {index === folderContents.breadcrumbs.length - 1 ? (
              <span className="ms-2">{crumb.name}</span>
            ) : (
              <Link 
                to={`/free-test/free-test-details/${crumb.id}`} 
                className="ms-2 me-2 text-decoration-none"
              >
                {crumb.name}
              </Link>
            )}
          </span>
        ))}
      </p>
    );
  };

  if (!isAuthenticated) {
    return (
      <Container className="text-center py-5">
        <p className="text-danger">Please sign in to view tests</p>
        <Link to="/auth" className="btn btn-primary">
          Sign In
        </Link>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center py-5">
        <p className="text-danger">Error: {error}</p>
        <Button variant="secondary" onClick={() => navigate('/free-test')}>
          Back to Free Tests
        </Button>
      </Container>
    );
  }

  return (
    <section className="pt-4">
      <Container>
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <h3>{folderContents.folder?.name || 'Test Folder'}</h3>
            {renderBreadcrumbs()}
          </Col>
        </Row>

        {/* Subfolders List */}
        {folderContents.folders.length > 0 && (
          <>
            <h4 className="mb-3">Folders</h4>
            <Row className="g-4 mb-4">
              {folderContents.folders.map((subfolder) => (
                <Col lg={6} key={subfolder.id}>
                  <Card className="shadow p-3" onClick={() => handleFolderClick(subfolder.id)} style={{cursor: 'pointer'}}>
                    <Row className="align-items-center">
                      <Col xs={2}>
                        <FaFolderOpen size={40} color="gold"/>
                      </Col>
                      <Col xs={8}>
                        <h5 className="mb-0">{subfolder.name}</h5>
                        {/* <p className="small text-muted">{subfolder.tests_count || 0} test(s)</p> */}
                      </Col>
                      <Col xs={2} className="text-end">
                        <span className="fw-bold">&gt;</span>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              ))}
            </Row>
          </>
        )}

        {/* Tests List */}
        {folderContents.tests.length > 0 && (
          <>
            <h4 className="mb-3">Tests</h4>
            <Row className="g-4">
              {folderContents.tests.map((test) => (
                <Col lg={6} key={test.id}>
                  <Card className="test-card shadow p-3">
                    <Row className="d-flex align-items-center justify-content-between">
                      <Col xs={2}>
                        <div className="icon-wrapper">
                          <FaFile size={40} color="#3256a8"/>
                        </div>
                      </Col>
                      <Col xs={6}>
                        <h5 className="mb-0">{test.title}</h5>
                        <p className="small text-muted mb-0">Duration: {test.duration_hours}h {test.duration_minutes}m</p>
                        <p className="small text-muted mb-0">Pass Score: {test.passing_score}%</p>
                      </Col>
                      <Col xs={4} className="d-flex justify-content-end">
                        <Button 
                          variant="success" 
                          onClick={() => handleTakeTest(test.id)} 
                          className="px-4 py-2 fw-bold"
                        >
                          Take Test
                        </Button>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              ))}
            </Row>
          </>
        )}

        {folderContents.folders.length === 0 && folderContents.tests.length === 0 && (
          <Col className="text-center py-5">
            <p>No content available in this folder.</p>
            <Button variant="secondary" onClick={() => navigate('/free-test')}>
              Back to Free Tests
            </Button>
          </Col>
        )}
      </Container>
    </section>
  );
};

export default TestDetails;
