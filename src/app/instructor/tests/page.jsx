import { useState, useEffect } from 'react';
import ChoicesFormInput from '@/components/form/ChoicesFormInput';
import PageMetaData from '@/components/PageMetaData';
import { Card, CardBody, CardHeader, Col, FormControl, Row, Spinner, Button, Badge, Container } from 'react-bootstrap';
import { FaAngleLeft, FaAngleRight, FaSearch } from 'react-icons/fa';
import { TrophyFill } from 'react-bootstrap-icons';
import httpClient from '@/helpers/httpClient';
import { useAuthContext } from '@/context/useAuthContext';
import { format } from 'date-fns';
import authService from '@/helpers/authService';
import { useNotificationContext } from '@/context/useNotificationContext';

const TestsHistoryPage = () => {
  const [loading, setLoading] = useState(true);
  const [resultLoading, setResultLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [testHistory, setTestHistory] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 5
  });
  const [selectedTest, setSelectedTest] = useState(null);
  const [testResults, setTestResults] = useState(null);
  
  const { user } = useAuthContext();
  const { showNotification } = useNotificationContext();
  
  const fetchTestHistory = async (page = 1) => {
    try {
      setLoading(true);
      const response = await httpClient.get(`/api/tests/history?page=${page}&limit=${pagination.limit}&sort=${sortBy}`, {
        headers: {
          'auth_key': user?.token
        }
      });
      
      if (response.data && response.data.status === 'success') {
        setTestHistory(response.data.history);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching test history:', error);
      showNotification({
        message: 'Failed to load test history',
        variant: 'danger'
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (user?.token) {
      fetchTestHistory();
    }
  }, [user, sortBy]);
  
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy');
    } catch (error) {
      return dateString;
    }
  };
  
  const handlePageChange = (page) => {
    fetchTestHistory(page);
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    // Filter results client-side for now
    // In a production app, you would likely update the API request with a search parameter
  };
  
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const fetchTestResult = async (testId, attemptId) => {
    try {
      setResultLoading(true);
      
      // Use the same API endpoint as in test-questions page
      const response = await authService.getTestResult(testId, attemptId, user.token);
      
      console.log('Test result response:', response);
      
      if (response) {
        setTestResults({
          totalQuestions: response.total_questions || 0,
          correctAnswers: response.correct_answers || 0,
          incorrectAnswers: response.incorrect_answers || 0,
          unanswered: response.unanswered || 0,
          score: response.score || 0,
          timeTaken: response.time_taken || '-',
          passed: response.passed || false,
          passingScore: response.passing_score || 60
        });
      } else {
        // Fallback to basic data from history
        setTestResults({
          totalQuestions: '-',
          correctAnswers: '-',
          incorrectAnswers: '-',
          unanswered: '-',
          score: selectedTest.score || 0,
          timeTaken: '-',
          passed: selectedTest.status === 'Passed',
          passingScore: 60
        });
      }
    } catch (error) {
      console.error('Error fetching test result:', error);
      showNotification({
        message: 'Failed to load test result details',
        variant: 'warning'
      });
      
      // Set default values from the history item
      setTestResults({
        totalQuestions: '-',
        correctAnswers: '-',
        incorrectAnswers: '-',
        unanswered: '-',
        score: selectedTest.score || 0,
        timeTaken: '-',
        passed: selectedTest.status === 'Passed',
        passingScore: 60
      });
    } finally {
      setResultLoading(false);
    }
  };

  const handleTestClick = (test) => {
    setSelectedTest(test);
    // Fetch detailed test result if available
    if (test.test_id && test.attempt_id) {
      fetchTestResult(test.test_id, test.attempt_id);
    } else {
      // Use basic data from history
      setTestResults({
        totalQuestions: '-',
        correctAnswers: '-',
        incorrectAnswers: '-',
        unanswered: '-',
        score: test.score || 0,
        timeTaken: '-',
        passed: test.status === 'Passed',
        passingScore: 60
      });
    }
  };

  const handleBackToList = () => {
    setSelectedTest(null);
    setTestResults(null);
  };
  
  const filteredTests = searchTerm 
    ? testHistory.filter(test => 
        test.test_name.toLowerCase().includes(searchTerm.toLowerCase()))
    : testHistory;
  
  // If a test is selected, show the test results view
  if (selectedTest) {
    return <>
      <PageMetaData title="Test Result" />
      <div className="result-card app-container results-container">
        <Container className="py-5">
          <Row className="justify-content-center">
            <Col lg={8} md={10}>
              <Card className="results-card">
                <Card.Body className="p-0">
                  {resultLoading ? (
                    <div className="text-center py-5">
                      <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading test result...</span>
                      </Spinner>
                      <p className="mt-3">Loading test result details...</p>
                    </div>
                  ) : (
                    <>
                      <div className="results-header">
                        <TrophyFill size={36} className="trophy-icon" />
                        <h1>Test Results</h1>
                      </div>

                      <div className="results-content p-4">
                        <h2 className="test-name mb-4">{selectedTest.test_name || 'Test'}</h2>

                        <div className="score-container mb-4">
                          <div className="score-circle">
                            <div className="score-value">{testResults?.score || selectedTest.score}%</div>
                          </div>
                          <div className="score-label">Your Score</div>
                        </div>

                        <div className="pass-status mb-4">
                          {(testResults?.passed || selectedTest.status === 'Passed') ? (
                            <Badge bg="success" className="p-2 fs-6">PASSED</Badge>
                          ) : (
                            <Badge bg="danger" className="p-2 fs-6">FAILED</Badge>
                          )}
                        </div>

                        <div className="results-details">
                          <div className="result-item">
                            <div className="result-label">Total Questions</div>
                            <div className="result-value">{testResults?.totalQuestions || '-'}</div>
                          </div>
                          <div className="result-item correct">
                            <div className="result-label">Correct Answers</div>
                            <div className="result-value">{testResults?.correctAnswers || '-'}</div>
                          </div>
                          <div className="result-item incorrect">
                            <div className="result-label">Incorrect Answers</div>
                            <div className="result-value">{testResults?.incorrectAnswers || '-'}</div>
                          </div>
                          <div className="result-item unanswered">
                            <div className="result-label">Unanswered</div>
                            <div className="result-value">{testResults?.unanswered || '-'}</div>
                          </div>
                          <div className="result-item">
                            <div className="result-label">Time Taken</div>
                            <div className="result-value">{testResults?.timeTaken || '-'}</div>
                          </div>
                          <div className="result-item">
                            <div className="result-label">Passing Score</div>
                            <div className="result-value">{testResults?.passingScore || 60}%</div>
                          </div>
                        </div>

                        <div className="d-flex justify-content-center mt-4">
                          <Button variant="primary" className="px-4 py-2" onClick={handleBackToList}>
                            Back to Tests
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>;
  }
  
  return <>
      <PageMetaData title="Test History" />
      <Card className="border bg-transparent rounded-3">
        <CardHeader className="bg-transparent border-bottom">
          <h3 className="mb-0">Your Test History</h3>
        </CardHeader>
        <CardBody>
          <Row className="g-3 align-items-center justify-content-between mb-4">
            <Col md={8}>
              <form className="rounded position-relative" onSubmit={handleSearch}>
                <FormControl 
                  className="pe-5 bg-transparent" 
                  type="search" 
                  placeholder="Search tests" 
                  aria-label="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="bg-transparent p-2 position-absolute top-50 end-0 translate-middle-y border-0 text-primary-hover text-reset" type="submit">
                  <FaSearch className="fas fa-search fs-6 " />
                </button>
              </form>
            </Col>
            <Col md={3}>
              <form>
                <ChoicesFormInput 
                  className="form-select js-choice border-0 z-index-9 bg-transparent" 
                  aria-label=".form-select-sm"
                  value={sortBy}
                  onChange={handleSortChange}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="score">Highest Score</option>
                </ChoicesFormInput>
              </form>
            </Col>
          </Row>
          
          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
              <p className="mt-2">Loading your test history...</p>
            </div>
          ) : (
            <>
              <div className="table-responsive border-0">
                <table className="table table-dark-gray align-middle p-4 mb-0 table-hover">
                  <thead>
                    <tr>
                      <th scope="col" className="border-0">Test Name</th>
                      <th scope="col" className="border-0">Date</th>
                      <th scope="col" className="border-0">Score</th>
                      <th scope="col" className="border-0 rounded-end">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTests.length > 0 ? (
                      filteredTests.map((test) => (
                        <tr 
                          key={test.attempt_id} 
                          onClick={() => handleTestClick(test)}
                          style={{ cursor: 'pointer' }}
                          className="test-row"
                        >
                          <td>{test.test_name}</td>
                          <td>{formatDate(test.taken_date)}</td>
                          <td>{test.score}%</td>
                          <td>
                            <span className={`badge bg-${test.status === 'Passed' ? 'success' : 'danger'}`}>
                              {test.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="text-center py-3">
                          {searchTerm ? 'No tests match your search' : 'No test history found'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              {pagination.totalPages > 0 && (
                <div className="d-sm-flex justify-content-sm-between align-items-sm-center mt-4 mt-sm-3">
                  <p className="mb-0 text-center text-sm-start">
                    Showing {filteredTests.length > 0 ? ((pagination.currentPage - 1) * pagination.limit) + 1 : 0} to {Math.min(pagination.currentPage * pagination.limit, pagination.total)} of {pagination.total} entries
                  </p>
                  <nav className="d-flex justify-content-center mb-0" aria-label="navigation">
                    <ul className="pagination pagination-sm pagination-primary-soft d-inline-block d-md-flex rounded mb-0">
                      <li className={`page-item mb-0 ${pagination.currentPage === 1 ? 'disabled' : ''}`}>
                        <button 
                          className="page-link" 
                          onClick={() => handlePageChange(pagination.currentPage - 1)}
                          disabled={pagination.currentPage === 1}
                        >
                          <FaAngleLeft className="fas fa-angle-left" />
                        </button>
                      </li>
                      
                      {[...Array(pagination.totalPages)].map((_, i) => (
                        <li key={i} className={`page-item mb-0 ${pagination.currentPage === i + 1 ? 'active' : ''}`}>
                          <button 
                            className="page-link" 
                            onClick={() => handlePageChange(i + 1)}
                          >
                            {i + 1}
                          </button>
                        </li>
                      ))}
                      
                      <li className={`page-item mb-0 ${pagination.currentPage === pagination.totalPages ? 'disabled' : ''}`}>
                        <button 
                          className="page-link" 
                          onClick={() => handlePageChange(pagination.currentPage + 1)}
                          disabled={pagination.currentPage === pagination.totalPages}
                        >
                          <FaAngleRight className="fas fa-angle-right" />
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              )}
            </>
          )}
        </CardBody>
      </Card>
    </>;
};

export default TestsHistoryPage;
