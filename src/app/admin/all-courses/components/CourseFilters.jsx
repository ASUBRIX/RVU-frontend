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
      // Clear subcategory when category changes
      ...(field === 'category' && { subCategory: '' })
    }));
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await getCourseCategories();
        console.log('Categories API response:', response);
        
        // Handle different response structures
        let categoriesData = [];
        
        if (response?.success && response?.data) {
          // If response has success flag and data property
          categoriesData = response.data;
        } else if (Array.isArray(response)) {
          // If response is directly an array
          categoriesData = response;
        } else if (response?.data && Array.isArray(response.data)) {
          // If response.data is an array
          categoriesData = response.data;
        }
        
        // Sort categories alphabetically by title
        const sortedCategories = categoriesData
          .filter(cat => cat && cat.title) // Filter out invalid entries
          .sort((a, b) => {
            const titleA = (a.title || '').toLowerCase();
            const titleB = (b.title || '').toLowerCase();
            return titleA.localeCompare(titleB);
          })
          .map(category => ({
            ...category,
            // Sort subcategories alphabetically too
            subcategories: (category.subcategories || [])
              .filter(sub => sub && sub.title) // Filter out invalid subcategories
              .sort((a, b) => {
                const titleA = (a.title || '').toLowerCase();
                const titleB = (b.title || '').toLowerCase();
                return titleA.localeCompare(titleB);
              })
          }));
        
        console.log('Processed and sorted categories:', sortedCategories);
        setCategories(sortedCategories);
        
      } catch (err) {
        console.error('Failed to load categories:', err);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, []);

  // Get subcategories for the selected category
  const getSubcategoriesForSelectedCategory = () => {
    if (!filters?.category) return [];
    
    const selectedCategory = categories.find(cat => 
      cat.title === filters.category || cat.id === filters.category
    );
    
    return selectedCategory?.subcategories || [];
  };

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
          <div className="d-flex align-items-center">
            <Spinner animation="border" size="sm" className="me-2" />
            <span className="text-muted small">Loading categories...</span>
          </div>
        ) : (
          <Form.Select
            value={filters?.category || ''}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="form-select border-0 bg-light rounded-3 shadow-none"
            size="sm"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id || category.title} value={category.title}>
                {category.title}
                {category.subcategories && category.subcategories.length > 0 && 
                  ` (${category.subcategories.length} subcategories)`
                }
              </option>
            ))}
          </Form.Select>
        )}
        
        {/* Show category count */}
        {!loading && categories.length > 0 && (
          <small className="text-muted mt-1 d-block">
            {categories.length} categories available
          </small>
        )}
        
        {/* Show error if no categories */}
        {!loading && categories.length === 0 && (
          <small className="text-warning mt-1 d-block">
            No categories found
          </small>
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
          <option value="">
            {!filters?.category ? 'Select a category first' : 'All Sub Categories'}
          </option>
          {getSubcategoriesForSelectedCategory().map((subcat) => (
            <option key={subcat.id || subcat.title} value={subcat.title}>
              {subcat.title}
            </option>
          ))}
        </Form.Select>
        
        {/* Show subcategory count */}
        {filters?.category && (
          <small className="text-muted mt-1 d-block">
            {getSubcategoriesForSelectedCategory().length} subcategories available
          </small>
        )}
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
          
          {/* Add "Clear Features" option */}
          {filters?.status && (
            <div className="form-check">
              <input
                type="radio"
                className="form-check-input"
                id="feature-clear"
                name="feature"
                value=""
                checked={!filters?.status}
                onChange={(e) => handleFilterChange('status', '')}
              />
              <label className="form-check-label text-muted" htmlFor="feature-clear">
                Clear selection
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="active-filters mt-4 pt-4 border-top">
          <div className="d-flex align-items-center mb-3">
            <span className="text-muted small fw-medium">Active Filters</span>
          </div>
          <div className="d-flex flex-wrap gap-2">
            {Object.entries(filters || {}).map(([key, value]) => {
              if (!value) return null;
              
              // Create more readable labels
              const getFilterLabel = (key, value) => {
                switch (key) {
                  case 'category':
                    return `Category: ${value}`;
                  case 'subCategory':
                    return `Subcategory: ${value}`;
                  case 'status':
                    const featureLabel = featureOptions.find(f => f.value === value)?.label;
                    return `Feature: ${featureLabel || value}`;
                  default:
                    return value;
                }
              };
              
              return (
                <span 
                  key={key} 
                  className="badge bg-primary bg-opacity-10 text-primary rounded-pill d-flex align-items-center"
                  style={{ fontSize: '0.75rem' }}
                >
                  {getFilterLabel(key, value)}
                  <button
                    className="btn btn-link btn-sm text-primary p-0 ms-2 d-flex align-items-center"
                    style={{ lineHeight: 1 }}
                    onClick={() => handleFilterChange(key, '')}
                    title={`Remove ${key} filter`}
                  >
                    <FiX size={12} />
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