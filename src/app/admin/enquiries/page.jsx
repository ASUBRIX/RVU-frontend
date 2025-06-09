import { useEffect, useMemo, useState } from 'react';
import { Button, Card, CardBody, Container, Form, Pagination, Table } from 'react-bootstrap';
import { FiSearch } from 'react-icons/fi';
import { FaSearch, FaUser } from 'react-icons/fa';
import httpClient from '@/helpers/httpClient';
import PageMetaData from '@/components/PageMetaData';
import EnquiryDetailModal from './components/EnquiryDetailModal';
import { colorVariants } from '@/context/constants';
import { timeSince } from '@/utils/date';

const EnquiryRow = ({ enquiry, onViewDetails }) => {
  const { id, name, email, phone, message, created_at, status } = enquiry;

  return (
    <tr>
      <td>
        <div className="d-flex align-items-center">
          <div
            className="me-2 rounded-circle d-flex align-items-center justify-content-center"
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#ed155a',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px'
            }}
          >
            <FaUser />
          </div>
          <div>
            <h6 className="mb-0">{name}</h6>
            <span className="small text-body-secondary">ID: {id}</span>
          </div>
        </div>
      </td>
      <td>{message}</td>
      <td>{timeSince(created_at)} ago</td>
      <td>
        <span className={`badge-status badge-${status?.toLowerCase() || 'new'}`}>{status || 'New'}</span>
      </td>
      <td>
        <Button variant="primary-soft" size="sm" onClick={() => onViewDetails(enquiry)}>
          View Details
        </Button>
      </td>
    </tr>
  );
};

const EnquiriesPage = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const res = await httpClient.get('/api/admin/enquiries');
        setEnquiries(res.data);
      } catch (error) {
        console.error('Failed to fetch enquiries:', error);
      }
    };
    fetchEnquiries();
  }, []);

  const filteredData = useMemo(() => {
    return enquiries
      .filter(({ name, email, phone, message, status }) => {
        const term = searchTerm.toLowerCase();
        return (
          name.toLowerCase().includes(term) ||
          email?.toLowerCase().includes(term) ||
          phone?.includes(term) ||
          message?.toLowerCase().includes(term)
        ) && (statusFilter === 'All' || status === statusFilter);
      })
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [enquiries, searchTerm, statusFilter]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const currentItems = filteredData.slice(indexOfLastItem - itemsPerPage, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const renderPaginationItems = () => {
    const items = [
      <Pagination.Prev key="prev" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} />
    ];
    for (let i = 1; i <= totalPages; i++) {
      items.push(
        <Pagination.Item key={i} active={i === currentPage} onClick={() => setCurrentPage(i)}>
          {i}
        </Pagination.Item>
      );
    }
    items.push(
      <Pagination.Next key="next" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} />
    );
    return items;
  };

  return (
    <>
      <PageMetaData title="Enquiries Management" />
      <div className="bg-light p-4 mb-4">
        <Container fluid>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="fw-bold">Enquiries Management</h3>
          </div>
          <div className="row g-3 align-items-center">
            <div className="col-md-8">
              <Form.Control
                type="text"
                placeholder="Search enquiries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-4 d-flex justify-content-end">
              <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="All">All Status</option>
                <option value="New">New</option>
                <option value="Pending">Pending</option>
                <option value="Responded">Responded</option>
              </Form.Select>
            </div>
          </div>
        </Container>
      </div>

      <Card className="m-4 border-0 shadow">
        <CardBody>
          <Table responsive>
            <thead>
              <tr>
                <th>Student</th>
                <th>Message</th>
                <th>Time</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? currentItems.map((item) => (
                <EnquiryRow key={item.id} enquiry={item} onViewDetails={setSelectedEnquiry} />
              )) : (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    <FaSearch className="fs-3 mb-2" />
                    <p className="mb-0">No enquiries found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>

          {filteredData.length > itemsPerPage && (
            <div className="d-flex justify-content-center mt-4">
              <Pagination>{renderPaginationItems()}</Pagination>
            </div>
          )}
        </CardBody>
      </Card>

      <EnquiryDetailModal
        show={!!selectedEnquiry}
        onHide={() => setSelectedEnquiry(null)}
        enquiry={selectedEnquiry}
      />
    </>
  );
};

export default EnquiriesPage;
