import { FaSearch, FaFolderOpen } from 'react-icons/fa';
import { Card, CardTitle, Col, Container, Row, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import Pagination from './Pagination';
import { useAuthContext } from '@/context/useAuthContext';
import { useNotificationContext } from '@/context/useNotificationContext';
import authService from '@/helpers/authService';

const ITEMS_PER_PAGE = 6;

const FreeTestsList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isAuthenticated } = useAuthContext();
  const { showNotification } = useNotificationContext();
  const hasFetchedRef = useRef(false);

  // Debug auth state and session
  useEffect(() => {
    console.log('🔐 Checking session state...');
    console.log('- isAuthenticated:', isAuthenticated);
    console.log('- user object:', user);
    if (user?.token) {
      console.log('- Token present:', user.token.substring(0, 20) + '...');
    } else {
      console.warn('⚠️ No token found in user context.');
    }
  }, [user, isAuthenticated]);

  useEffect(() => {
    hasFetchedRef.current = false;
  }, [isAuthenticated, user?.token]);

  useEffect(() => {
    if (hasFetchedRef.current || !isAuthenticated) {
      if (!isAuthenticated) {
        console.warn('❌ Not authenticated. Skipping fetch.');
        setError('Please sign in to view free tests');
        setLoading(false);
      }
      return;
    }

    if (!user?.token) {
      console.warn('❌ Token missing. Cannot fetch tests.');
      setError('Authentication token missing. Please sign in again.');
      setLoading(false);
      return;
    }

    const fetchTests = async () => {
      try {
        hasFetchedRef.current = true;
        console.log('📡 Fetching free tests with token...');
        const responseData = await authService.getFreeTests(user.token);
        console.log('✅ Free tests fetched:', responseData);
        setTests(responseData.folders || []);
      } catch (err) {
        console.error('🚨 Error fetching tests:', err);
        if (err.response) {
          if (err.response.status === 401) {
            showNotification({ message: 'Session expired. Sign in again.', variant: 'danger' });
            setError('Authentication failed. Sign in again.');
          } else {
            setError(err.response?.data?.error || 'Failed to fetch tests');
            showNotification({
              message: err.response?.data?.error || 'Fetch failed',
              variant: 'danger',
            });
          }
        } else if (err.request) {
          setError('No response from server. Check your connection.');
          showNotification({ message: 'No response from server', variant: 'danger' });
        } else {
          setError('Request setup error: ' + err.message);
          showNotification({ message: 'Setup error: ' + err.message, variant: 'danger' });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, [isAuthenticated, user?.token, showNotification]);

  const filteredTests = tests.filter((test) =>
    test.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTests.length / ITEMS_PER_PAGE);
  const paginatedTests = filteredTests.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  if (!isAuthenticated) {
    return (
      <Container className="text-center py-5">
        <p className="text-danger">Please sign in to view free tests</p>
        <Link to="/auth" className="btn btn-primary">Sign In</Link>
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
                        <FaFolderOpen size={40} color="gold" />
                      </Col>
                      <Col xs={8}>
                        <CardTitle className="mb-0">{test.name}</CardTitle>
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

        {/* Pagination */}
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