import { Form, InputGroup } from 'react-bootstrap';
import { FiSearch } from 'react-icons/fi';

const CourseSearch = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="search-input">
      <div className="input-group">
        <span className="input-group-text border-end-0">
          <FiSearch className="text-muted" />
        </span>
        <Form.Control
          type="text"
          placeholder="Search courses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border-start-0 ps-0 rounded-end"
        />
      </div>
    </div>
  );
};

export default CourseSearch; 