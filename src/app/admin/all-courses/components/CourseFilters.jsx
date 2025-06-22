import { useEffect, useState } from 'react';
import { Form, Spinner } from 'react-bootstrap';
import { BiCategory } from 'react-icons/bi';
import { MdOutlineCategory } from 'react-icons/md';
import { HiOutlineStatusOnline } from 'react-icons/hi';
import { FiX } from 'react-icons/fi';
import { getCourseCategories } from '@/helpers/courseApi';

const featureOptions = [
  { value: 'live', label: 'Live Class' },
  { value: 'test', label: 'Tests' },
  { value: 'free', label: 'Free Content' },
  { value: 'videos', label: 'Videos' },
];

const CourseFilters = ({ filters, setFilters }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await getCourseCategories();
        
        // Fix: Access response directly, not res.data
        // Also add safety check for array
        setCategories(Array.isArray(res) ? res : []);
      } catch (err) {
        console.error('Failed to load categories', err);
        // Set empty array on error to prevent crashes
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const hasActiveFilters = Object.values(filters || {}).some((value) => value !== '');

  return (
    <div className="filter-group">
      <div className="d-flex align-items-center mb-4">
        {hasActiveFilters && (
          <span className="ms-auto">
            <button
              className="btn btn-link btn-sm text-muted p-0 text-decoration-none d-flex align-items-center"
              onClick={() =>
                setFilters({
                  category: '',
                  subCategory: '',
                  status: '',
                })
              }
            >
              Clear all
              <FiX className="ms-1" size={16} />
            </button>
          </span>
        )}
      </div>

      {/* Categories */}
      <div className="filter-item mb-4">
        <div className="d-flex align-items-center mb-2">
          <BiCategory className="text-muted me-2" size={18} />
          <label className="form-label mb-0 text-muted small">Categories</label>
        </div>
        {loading ? (
          <Spinner animation="border" size="sm" />
        ) : (
          <Form.Select
            value={filters?.category || ''}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="form-select border-0 bg-light rounded-3 shadow-none"
            size="sm"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.title}>
                {category.title}
              </option>
            ))}
          </Form.Select>
        )}
      </div>

      {/* Sub Categories */}
      <div className="filter-item mb-4">
        <div className="d-flex align-items-center mb-2">
          <MdOutlineCategory className="text-muted me-2" size={18} />
          <label className="form-label mb-0 text-muted small">Sub Categories</label>
        </div>
        <Form.Select
          value={filters?.subCategory || ''}
          onChange={(e) => handleFilterChange('subCategory', e.target.value)}
          className="form-select border-0 bg-light rounded-3 shadow-none"
          size="sm"
          disabled={!filters?.category}
        >
          <option value="">All Sub Categories</option>
          {/* Get subcategories for selected category */}
          {filters?.category && 
            categories
              .find(cat => cat.title === filters.category)
              ?.subcategories?.map((subcat) => (
                <option key={subcat.id} value={subcat.title}>
                  {subcat.title}
                </option>
              ))
          }
        </Form.Select>
      </div>

      {/* Course Features */}
      <div className="filter-item mb-4">
        <div className="d-flex align-items-center mb-2">
          <HiOutlineStatusOnline className="text-muted me-2" size={18} />
          <label className="form-label mb-0 text-muted small">Course Features</label>
        </div>
        <div className="d-flex flex-column gap-2">
          {featureOptions.map((feature) => (
            <div key={feature.value} className="form-check">
              <input
                type="radio"
                className="form-check-input"
                id={`feature-${feature.value}`}
                name="feature"
                value={feature.value}
                checked={filters?.status === feature.value}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              />
              <label className="form-check-label" htmlFor={`feature-${feature.value}`}>
                {feature.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="active-filters mt-4 pt-4 border-top">
          <div className="d-flex align-items-center mb-3">
            <span className="text-muted small">Active Filters</span>
          </div>
          <div className="d-flex flex-wrap gap-2">
            {Object.entries(filters || {}).map(([key, value]) => {
              if (!value) return null;
              return (
                <span key={key} className="badge bg-primary bg-opacity-10 text-primary rounded-pill">
                  {value}
                  <button
                    className="btn btn-link btn-sm text-primary p-0 ms-2"
                    onClick={() => handleFilterChange(key, '')}
                  >
                    <FiX size={14} />
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseFilters;