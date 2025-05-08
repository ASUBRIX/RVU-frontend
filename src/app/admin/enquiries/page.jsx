/**
 * SCSS file: src/assets/scss/components/_enquiries.scss
 */

import { supportRequestsData } from '@/assets/data/products';
import PageMetaData from '@/components/PageMetaData';
import { colorVariants } from '@/context/constants';
import { timeSince } from '@/utils/date';
import { useMemo, useState } from 'react';
import { Button, Card, CardBody, Container, Form, Pagination, Table } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import { FiSearch } from 'react-icons/fi';
import EnquiryDetailModal from './components/EnquiryDetailModal';

// Extended sample data for enquiries with more fields
const enquiriesData = [
  ...supportRequestsData.map((item, index) => ({
    id: index + 1,
    name: item.name,
    email: `${item.name.toLowerCase().replace(' ', '.')}@example.com`,
    phone: `+1 ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
    message: item.description,
    time: item.time,
    image: item.image,
    status: ['New', 'Pending', 'Responded'][Math.floor(Math.random() * 3)]
  })),
  {
    id: supportRequestsData.length + 1,
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '+1 555-123-4567',
    message: 'Interested in your advanced courses for professional development',
    time: new Date(),
    status: 'New'
  },
  {
    id: supportRequestsData.length + 2,
    name: 'Emma Wilson',
    email: 'emma.wilson@example.com',
    phone: '+1 555-987-6543',
    message: 'Requesting information about scholarship opportunities',
    time: new Date(Date.now() - 3600000 * 2),
    status: 'Pending'
  },
  {
    id: supportRequestsData.length + 3,
    name: 'Michael Brown',
    email: 'michael.brown@example.com',
    phone: '+1 555-456-7890',
    message: 'Need help with course registration process',
    time: new Date(Date.now() - 3600000 * 5),
    status: 'Responded'
  }
];

const EnquiryRow = ({ id, name, message, time, image, status, onViewDetails }) => {
  // Generate consistent avatar color based on name
  const nameHash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colorIndex = nameHash % colorVariants.length;
  const avatarColor = colorVariants[colorIndex];

  return (
    <tr>
      <td>
        <div className="d-flex align-items-center">
          <div className="avatar avatar-sm me-2 flex-shrink-0">
            {image ? (
              <img className="avatar-img rounded-circle" src={image} alt={`${name}'s avatar`} />
            ) : (
              <div className={`avatar-img rounded-circle bg-${avatarColor} bg-opacity-10`}>
                <span className={`position-absolute top-50 text-${avatarColor} start-50 translate-middle fw-bold small`}>
                  {name.charAt(0)}
                </span>
              </div>
            )}
          </div>
          <div>
            <h6 className="mb-0">{name}</h6>
            <span className="small text-body-secondary">ID: {id}</span>
          </div>
        </div>
      </td>
      <td>
        <div className="enquiry-message">
          {message}
        </div>
      </td>
      <td>{timeSince(time)} ago</td>
      <td>
        <span className={`badge-status badge-${status.toLowerCase()}`}>
          {status}
        </span>
      </td>
      <td>
        <Button variant="primary-soft" size="sm" onClick={() => onViewDetails(id)}>
          View Details
        </Button>
      </td>
    </tr>
  );
};

const EnquiriesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const itemsPerPage = 10;

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  // Handle status filter change
  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    setCurrentPage(1); // Reset to first page on new filter
  };

  // View details handler
  const handleViewDetails = (id) => {
    const enquiry = enquiriesData.find(item => item.id === id);
    if (enquiry) {
      setSelectedEnquiry(enquiry);
      setShowDetailModal(true);
    }
  };

  // Close modal handler
  const handleCloseModal = () => {
    setShowDetailModal(false);
    setTimeout(() => {
      setSelectedEnquiry(null);
    }, 200); // Clear selected enquiry after modal animation
  };

  // Filter and paginate data
  const filteredData = useMemo(() => {
    return enquiriesData
      .filter((item) => {
        const matchesSearch = 
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.phone.includes(searchTerm) ||
          item.message.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
        
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        // Priority order: New > Pending > Responded
        const statusPriority = {
          'New': 3,
          'Pending': 2,
          'Responded': 1
        };

        // First sort by status priority
        const statusDiff = statusPriority[b.status] - statusPriority[a.status];
        
        // If same status, sort by time (newest first)
        if (statusDiff === 0) {
          return new Date(b.time) - new Date(a.time);
        }
        
        return statusDiff;
      });
  }, [searchTerm, statusFilter, enquiriesData]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // Generate pagination items
  const renderPaginationItems = () => {
    const items = [];
    
    // Previous button
    items.push(
      <Pagination.Prev 
        key="prev" 
        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
      />
    );
    
    // First page
    if (currentPage > 2) {
      items.push(
        <Pagination.Item key={1} onClick={() => setCurrentPage(1)}>
          1
        </Pagination.Item>
      );
      
      if (currentPage > 3) {
        items.push(<Pagination.Ellipsis key="ellipsis-start" />);
      }
    }
    
    // Current page and adjacent pages
    for (let number = Math.max(1, currentPage - 1); number <= Math.min(totalPages, currentPage + 1); number++) {
      items.push(
        <Pagination.Item 
          key={number} 
          active={number === currentPage}
          onClick={() => setCurrentPage(number)}
        >
          {number}
        </Pagination.Item>
      );
    }
    
    // Last page
    if (currentPage < totalPages - 1) {
      if (currentPage < totalPages - 2) {
        items.push(<Pagination.Ellipsis key="ellipsis-end" />);
      }
      
      items.push(
        <Pagination.Item key={totalPages} onClick={() => setCurrentPage(totalPages)}>
          {totalPages}
        </Pagination.Item>
      );
    }
    
    // Next button
    items.push(
      <Pagination.Next 
        key="next" 
        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages || totalPages === 0}
      />
    );
    
    return items;
  };

  return (
    <>
      <PageMetaData title="Enquiries Management" />

      {/* Header Section */}
      <div className="bg-light p-4 mb-4">
        <Container fluid>
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
            <div>
              <h3 className="mb-0 fw-bold">Enquiries Management</h3>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-0 mt-2">
                  <li className="breadcrumb-item">
                    <a href="#" className="text-muted">
                      Dashboard
                    </a>
                  </li>
                  <li className="breadcrumb-item active text-dark" aria-current="page">
                    Enquiries
                  </li>
                </ol>
              </nav>
            </div>
          </div>

          {/* Search and Sort Section */}
          <div className="row g-3 align-items-center">
            <div className="col-md-8">
              <div className="search-input">
                <div className="input-group">
                  <span className="input-group-text border-end-0">
                    <FiSearch className="text-muted" />
                  </span>
                  <Form.Control
                    type="text"
                    placeholder="Search enquiries..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="border-start-0 ps-0 rounded-end"
                  />
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="d-flex align-items-center justify-content-end">
                <label className="me-2 text-nowrap fw-medium">Sort by:</label>
                <Form.Select 
                  onChange={(e) => handleStatusFilterChange(e.target.value)}
                  className="form-select"
                >
                  <option value="All">All Status</option>
                  <option value="New">New</option>
                  <option value="Pending">Pending</option>
                  <option value="Responded">Responded</option>
                </Form.Select>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Main Content */}
      <Card className="shadow border-0 m-4">
        <CardBody className="p-4">
          <div className="table-responsive">
            <Table className="table-hover align-middle mb-0 enquiries-table">
              <thead className="table-light">
                <tr>
                  <th className="avatar-column">Student</th>
                  <th className="message-column">Message</th>
                  <th className="time-column">Time</th>
                  <th className="status-column">Status</th>
                  <th className="action-column">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((item) => (
                    <EnquiryRow 
                      key={item.id} 
                      {...item} 
                      onViewDetails={handleViewDetails} 
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      <div className="empty-state">
                        <FaSearch className="empty-icon" />
                        <h5 className="empty-title">No enquiries found</h5>
                        <p className="empty-description">Try adjusting your search or filter to find what you're looking for.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
          
          {filteredData.length > itemsPerPage && (
            <div className="d-flex justify-content-center mt-4">
              <Pagination>{renderPaginationItems()}</Pagination>
            </div>
          )}
          
          <div className="d-flex justify-content-between align-items-center mt-2 text-body-secondary small">
            <div>
              Showing {Math.min(filteredData.length, 1 + indexOfFirstItem)} to {Math.min(filteredData.length, indexOfLastItem)} of {filteredData.length} entries
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Detail Modal */}
      <EnquiryDetailModal 
        show={showDetailModal} 
        onHide={handleCloseModal} 
        enquiry={selectedEnquiry}
      />
    </>
  );
};

export default EnquiriesPage; 