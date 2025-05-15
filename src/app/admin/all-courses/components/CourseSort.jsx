// === Updated CourseSort.jsx ===
import { Form } from 'react-bootstrap';

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'name', label: 'Course Name' },
  { value: 'price_low_high', label: 'Price (Low to High)' },
  { value: 'price_high_low', label: 'Price (High to Low)' },
  { value: 'top_selling', label: 'Top Selling' },
  { value: 'most_popular', label: 'Most Popular' }
];

const CourseSort = ({ sortBy, setSortBy }) => {
  return (
    <Form.Select
      value={sortBy}
      onChange={(e) => setSortBy(e.target.value)}
      className="form-select border-0 bg-light shadow-none"
      size="sm"
    >
      {sortOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Form.Select>
  );
};

export default CourseSort;
