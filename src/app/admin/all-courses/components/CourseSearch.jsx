// === Updated CourseSearch.jsx ===
import { Form, InputGroup } from 'react-bootstrap';
import { FiSearch } from 'react-icons/fi';

const CourseSearch = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="search-input">
      <InputGroup>
        <InputGroup.Text className="border-end-0">
          <FiSearch className="text-muted" />
        </InputGroup.Text>
        <Form.Control
          type="text"
          placeholder="Search courses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border-start-0 ps-0 rounded-end"
        />
      </InputGroup>
    </div>
  );
};

export default CourseSearch;
