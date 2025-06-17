import { FaSearch, FaFolderOpen } from 'react-icons/fa';
import { Card, CardTitle, Col, Container, Row, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Pagination from './Pagination';
import { getFreeFolders } from '@/helpers/user/testApi'; // ✅ Using your user-side testApi

const ITEMS_PER_PAGE = 6;

const FreeTestsList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await getFreeFolders();
        setTests(response.data?.folders || []);
      } catch (err) {
        console.error('Error fetching free folders:', err);
        setError('Failed to fetch free tests.');
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

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
        <p className="text-danger">{error}</p>
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
