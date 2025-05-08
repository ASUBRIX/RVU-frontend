import { FaSearch } from "react-icons/fa";
import { Card, CardBody, CardTitle, Col, Container, Row, Button, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Pagination from "./Pagination";
import { FaFolderOpen } from "react-icons/fa";
import { useAuthContext } from '@/context/useAuthContext';
import { useNotificationContext } from '@/context/useNotificationContext';
import authService from '@/helpers/authService';

// Pagination settings
const ITEMS_PER_PAGE = 6;

const FreeTestsList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isAuthenticated } = useAuthContext();
  const { showNotification } = useNotificationContext();
  const hasFetchedRef = useRef(false);
  
  // Debug authentication state
  useEffect(() => {
    console.log('Authentication Debug:');
    console.log('- isAuthenticated:', isAuthenticated);
    console.log('- user:', user);
    console.log('- token exists:', !!user?.token);
    if (user?.token) {
      console.log('- token first 20 chars:', user.token.substring(0, 20) + '...');
    }
  }, [isAuthenticated, user]);
  
  // Reset the fetch flag when authentication state changes
  useEffect(() => {
    hasFetchedRef.current = false;
  }, [isAuthenticated, user?.token]);

  useEffect(() => {
    // Skip if already fetched or not authenticated
    if (hasFetchedRef.current || !isAuthenticated) {
      if (!isAuthenticated) {
        setError('Please sign in to view free tests');
        setLoading(false);
      }
      return;
    }
    
    // Skip if token is missing
    if (!user?.token) {
      setError('Authentication token missing. Please sign in again.');
      setLoading(false);
      return;
    }

    const fetchTests = async () => {
      try {
        hasFetchedRef.current = true;
        console.log('Fetching free tests with token:', user.token.substring(0, 20) + '...');
        
        const responseData = await authService.getFreeTests(user.token);
        console.log('API response data:', responseData);
        
        if (responseData) {
          setTests(responseData.folders || []);
        } else {
          setError('No test data received');
        }
      } catch (err) {
        console.error('Error fetching tests:', err);
        
        if (err.response) {
          console.error('Response status:', err.response.status);
          console.error('Response data:', err.response.data);
          
          if (err.response.status === 401) {
            console.error('401 Unauthorized - Auth key invalid or expired');
            showNotification({
              message: 'Your session has expired. Please sign in again.',
              variant: 'danger'
            });
            setError('Authentication failed. Please sign in again.');
          } else {
            setError(`Error: ${err.response?.data?.error || 'Failed to fetch tests'}`);
            showNotification({
              message: err.response?.data?.error || 'Failed to fetch tests',
              variant: 'danger'
            });
          }
        } else if (err.request) {
          console.error('No response received - Network issue:', err.request);
          console.error('Request details:', {
            url: err.config?.url,
            method: err.config?.method,
            headers: err.config?.headers
          });
          
          setError('Network error. No response received from the server. Check if the server is running and handling this endpoint.');
          showNotification({
            message: 'Network error. No response received from the server.',
            variant: 'danger'
          });
        } else {
          console.error('Error setting up request:', err.message);
          setError('Error setting up request: ' + err.message);
          showNotification({
            message: 'Error setting up request: ' + err.message,
            variant: 'danger'
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, [isAuthenticated, user?.token, showNotification]);

  // Filtered tests based on search query
  const filteredTests = tests.filter((test) =>
    test.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination Logic
  const totalPages = Math.ceil(filteredTests.length / ITEMS_PER_PAGE);
  const paginatedTests = filteredTests.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Pagination handling
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top of the page when changing pages
    window.scrollTo(0, 0);
  };

  if (!isAuthenticated) {
    return (
      <Container className="text-center py-5">
        <p className="text-danger">Please sign in to view free tests</p>
        <Link to="/auth/sign-in" className="btn btn-primary">
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
      </Container>
    );
  }

  return (
    <section className="pt-4">
      <Container>
        {/* Header & Search Bar */}
        <Row className="mb-4 align-items-center">
          <Col>
            <h3>Free Tests</h3>
            <p>Total ({filteredTests.length})</p>
          </Col>
          <Col sm={4}>
            <form className="border rounded">
              <div className="input-group input-borderless">
                <input
                  className="form-control me-1 border-0"
                  type="search"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button variant="primary">
                  <FaSearch />
                </Button>
              </div>
            </form>
          </Col>
        </Row>

        {/* Test List */}
        <Row className="g-4">
          {paginatedTests.length > 0 ? (
            paginatedTests.map((test) => (
              <Col lg={6} key={test.id}>
                <Link to={`/free-test/free-test-details/${test.id}`} className="text-decoration-none">
                  <Card className="shadow p-3">
                    <Row className="align-items-center">
                      <Col xs={2}>
                        <FaFolderOpen size={40} color="gold"/>
                      </Col>
                      <Col xs={8}>
                        <CardTitle className="mb-0">{test.name}</CardTitle>
                        {/* <p className="small text-muted">{test.tests_count || 0} test(s)</p> */}
                      </Col>
                      <Col xs={2} className="text-end">
                        <span className="fw-bold">&gt;</span>
                      </Col>
                    </Row>
                  </Card>
                </Link>
              </Col>
            ))
          ) : (
            <Col className="text-center py-5">
              <p>No free tests available. Check back later!</p>
            </Col>
          )}
        </Row>

        {/* Pagination component with props */}
        {filteredTests.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </Container>
    </section>
  );
};

export default FreeTestsList;
