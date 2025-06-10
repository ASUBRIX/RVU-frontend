import { useEffect, useState } from 'react';
import { Button, Card, CardBody, Container, Form, Table } from 'react-bootstrap';
import { PersonCircle } from 'react-bootstrap-icons'
import EnquiryDetailModal from './components/EnquiryDetailModal';
import enquiryApi from '@/helpers/admin/enquiryApi';
import PageMetaData from '@/components/PageMetaData';
import { timeSince } from '@/utils/date';

const EnquiryRow = ({ enquiry, onViewDetails }) => {
  const { id, name, email, phone, message, created_at, status } = enquiry;

  return (
    <tr>
      <td>
        <div className="d-flex align-items-center">
          <div
            className="me-2 d-flex align-items-center justify-content-center rounded-circle"
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#f9dce2',
              flexShrink: 0,
            }}
          >
            <PersonCircle size={38} color="#ed155a" />
          </div>
          <div>
            <div>{name || 'Unknown'}</div>
            <div className="text-muted small">{email || 'No email'}</div>
          </div>
        </div>
      </td>
      <td>{phone || 'N/A'}</td>
      <td className="text-truncate" style={{ maxWidth: '250px' }}>
        {message || 'No message'}
      </td>
      <td>{created_at ? timeSince(created_at) : 'N/A'}</td>
      <td>
        <span className={`badge bg-${status === 'read' ? 'success' : 'warning'}`}>
          {status?.toUpperCase() || 'NEW'}
        </span>
      </td>
      <td>
        <Button size="sm" variant="primary" onClick={() => onViewDetails(enquiry)}>
          View
        </Button>
      </td>
    </tr>
  );
};

const Enquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchEnquiries = async () => {
    try {
      const res = await enquiryApi.getAll();
      setEnquiries(res.data);
    } catch (err) {
      console.error('Error fetching enquiries:', err);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleViewDetails = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setShowModal(true);
  };

  return (
    <>
      <PageMetaData title="Enquiries" />
      <Container fluid className="py-4">
        <h4 className="mb-4">Student Enquiries</h4>
        <Card>
          <CardBody>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <Form.Control
                type="text"
                placeholder="Search by name or message..."
                className="w-25"
              />
            </div>
            <Table responsive hover className="mb-0">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Message</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {enquiries.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center text-muted">
                      No enquiries found.
                    </td>
                  </tr>
                ) : (
                  enquiries.map((enquiry) => (
                    <EnquiryRow
                      key={enquiry.id}
                      enquiry={enquiry}
                      onViewDetails={handleViewDetails}
                    />
                  ))
                )}
              </tbody>
            </Table>
          </CardBody>
        </Card>
      </Container>

      <EnquiryDetailModal
        show={showModal}
        enquiry={selectedEnquiry}
        onHide={() => setShowModal(false)}
      />
    </>
  );
};

export default Enquiries;
