import { useState, useEffect, useCallback, useMemo } from 'react';
import { Form, Button, Card, Alert, Spinner, Badge, Modal } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { FaPlus, FaTrash, FaExclamationTriangle, FaCheckCircle, FaInfoCircle, FaStar, FaCalculator } from 'react-icons/fa';
import { getPricingPlans, createPricingPlan, updatePricingPlan, deletePricingPlan } from '@/helpers/pricingPlansApi';

const PricingPlans = ({ setActiveStep, setProgress, courseId: propCourseId }) => {
  const { courseId: paramCourseId } = useParams();
  const navigate = useNavigate();
  
  // Use courseId from props first (passed from EditCourse), then from URL params
  const rawCourseId = propCourseId || paramCourseId;
  
  // Handle "new" course creation
  const isNewCourse = rawCourseId === 'new';
  const courseId = isNewCourse ? null : rawCourseId;
  
  console.log('🔢 PricingPlans - PropCourseId:', propCourseId);
  console.log('🔢 PricingPlans - ParamCourseId:', paramCourseId);
  console.log('🔢 PricingPlans - Is New Course:', isNewCourse);
  console.log('🔢 PricingPlans - Final CourseId:', courseId);
  
  // State management
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  
  // Modal state for plan recommendations
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [recommendations] = useState([
    { duration: 30, unit: 'days', price: 29.99, discount: 0, title: '1 Month Access' },
    { duration: 6, unit: 'months', price: 149.99, discount: 15, title: '6 Months Access', isRecommended: true },
    { duration: 1, unit: 'years', price: 299.99, discount: 20, title: '1 Year Access' }
  ]);

  // Load pricing plans on component mount
  useEffect(() => {
    console.log('CourseId from props:', propCourseId);
    console.log('CourseId from params:', paramCourseId);
    console.log('Final courseId:', courseId);
    console.log('Is new course:', isNewCourse);
    
    if (courseId && !isNewCourse) {
      fetchPricingPlans();
    } else if (isNewCourse) {
      console.log('🆕 New course - skipping pricing plans fetch');
      setPlans([]); // Start with empty plans for new course
    }
  }, [courseId, propCourseId, paramCourseId, isNewCourse]);

  const fetchPricingPlans = async () => {
    try {
      setLoading(true);
      setErrors({});
      const res = await getPricingPlans(courseId);
      setPlans(res.data || []);
    } catch (err) {
      console.error('Failed to fetch plans:', err);
      setErrors({ fetch: err.response?.data?.error || err.message || 'Failed to load pricing plans' });
    } finally {
      setLoading(false);
    }
  };

  // Validation functions
  const validatePlan = useCallback((plan, index) => {
    const planErrors = {};
    
    if (!plan.duration || plan.duration <= 0) {
      planErrors.duration = 'Duration must be greater than 0';
    }
    
    if (!plan.price || plan.price < 0) {
      planErrors.price = 'Price must be a positive number';
    }
    
    if (plan.discount && (plan.discount < 0 || plan.discount > 100)) {
      planErrors.discount = 'Discount must be between 0 and 100';
    }
    
    if (!plan.unit || !['days', 'months', 'years'].includes(plan.unit)) {
      planErrors.unit = 'Please select a valid unit';
    }
    
    // Check for duplicate plans (same duration and unit)
    const duplicates = plans.filter((p, i) => 
      i !== index && 
      p.duration === plan.duration && 
      p.unit === plan.unit
    );
    
    if (duplicates.length > 0) {
      planErrors.duplicate = `A plan for ${plan.duration} ${plan.unit} already exists`;
    }
    
    return planErrors;
  }, [plans]);

  const validateAllPlans = useCallback(() => {
    const allErrors = {};
    let hasErrors = false;
    
    plans.forEach((plan, index) => {
      const planErrors = validatePlan(plan, index);
      if (Object.keys(planErrors).length > 0) {
        allErrors[index] = planErrors;
        hasErrors = true;
      }
    });
    
    if (plans.length === 0) {
      allErrors.general = 'Please add at least one pricing plan';
      hasErrors = true;
    }
    
    setErrors(allErrors);
    return !hasErrors;
  }, [plans, validatePlan]);

  // Plan manipulation functions
  const handleChange = (index, field, value) => {
    setPlans(prev => prev.map((plan, i) => {
      if (i === index) {
        const updatedPlan = { ...plan, [field]: value };
        
        // Auto-calculate effective price when price or discount changes
        if (field === 'price' || field === 'discount') {
          updatedPlan.effective_price = calculateEffectivePrice(
            field === 'price' ? value : plan.price,
            field === 'discount' ? value : plan.discount
          );
        }
        
        return updatedPlan;
      }
      return plan;
    }));
    
    // Mark field as touched and clear errors
    setTouched(prev => ({ ...prev, [`${index}-${field}`]: true }));
    setErrors(prev => {
      const newErrors = { ...prev };
      if (newErrors[index]) {
        delete newErrors[index][field];
        if (Object.keys(newErrors[index]).length === 0) {
          delete newErrors[index];
        }
      }
      return newErrors;
    });
  };

  const calculateEffectivePrice = (price, discount) => {
    const numPrice = parseFloat(price) || 0;
    const numDiscount = parseFloat(discount) || 0;
    return (numPrice - (numPrice * numDiscount) / 100).toFixed(2);
  };

  const handleAddPlan = () => {
    const newPlan = {
      duration: 1,
      unit: 'months',
      price: '',
      discount: '',
      is_promoted: false,
      effective_price: '0.00',
      isNew: true // Flag for new plans
    };
    setPlans([...plans, newPlan]);
  };

  const handleRemovePlan = async (index) => {
    const plan = plans[index];
    
    if (plan.id) {
      // Existing plan - need to delete from backend
      if (!window.confirm('Are you sure you want to delete this pricing plan?')) {
        return;
      }
      
      try {
        setDeleting(index);
        await deletePricingPlan(plan.id);
        setPlans(prev => prev.filter((_, i) => i !== index));
        setSuccessMessage('Pricing plan deleted successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        console.error('Failed to delete plan:', err);
        setErrors(prev => ({ 
          ...prev, 
          [index]: { delete: err.response?.data?.error || err.message } 
        }));
      } finally {
        setDeleting(null);
      }
    } else {
      // New plan - just remove from state
      setPlans(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleAddRecommendation = (recommendation) => {
    const newPlan = {
      ...recommendation,
      effective_price: calculateEffectivePrice(recommendation.price, recommendation.discount),
      is_promoted: recommendation.isRecommended || false,
      isNew: true
    };
    setPlans(prev => [...prev, newPlan]);
    setShowRecommendations(false);
  };

  // Clean and prepare plan data for API
  const preparePlanData = (plan) => {
    // Ensure courseId is available and valid
    const validCourseId = courseId || plan.course_id;
    if (!validCourseId) {
      throw new Error('Course ID is required but not found');
    }

    const cleanedPlan = {
      course_id: parseInt(validCourseId),
      duration: parseInt(plan.duration),
      unit: plan.unit,
      price: parseFloat(plan.price),
      discount: plan.discount ? parseFloat(plan.discount) : null,
      is_promoted: Boolean(plan.is_promoted),
      effective_price: parseFloat(calculateEffectivePrice(plan.price, plan.discount))
    };

    // Validate required fields
    if (!cleanedPlan.course_id || isNaN(cleanedPlan.course_id)) {
      throw new Error('Invalid course_id');
    }
    if (!cleanedPlan.duration || isNaN(cleanedPlan.duration)) {
      throw new Error('Invalid duration');
    }
    if (!cleanedPlan.price || isNaN(cleanedPlan.price)) {
      throw new Error('Invalid price');
    }
    if (!cleanedPlan.unit) {
      throw new Error('Unit is required');
    }

    // Remove any undefined, null, or NaN values
    Object.keys(cleanedPlan).forEach(key => {
      if (cleanedPlan[key] === undefined || 
          (typeof cleanedPlan[key] === 'number' && isNaN(cleanedPlan[key]))) {
        if (key === 'discount') {
          cleanedPlan[key] = null;
        } else if (key === 'is_promoted') {
          cleanedPlan[key] = false;
        } else if (key === 'effective_price') {
          cleanedPlan[key] = 0;
        } else {
          delete cleanedPlan[key];
        }
      }
    });

    console.log('Course ID from params:', courseId);
    console.log('Prepared plan data:', cleanedPlan);
    return cleanedPlan;
  };

  const handleSavePlans = async () => {
    if (!validateAllPlans()) {
      return;
    }

    // Check if this is a new course
    if (isNewCourse) {
      setErrors({ 
        general: 'Please save the course basic information first before adding pricing plans. You cannot add pricing plans to a course that hasn\'t been created yet.' 
      });
      return;
    }

    // Debug: Check if courseId is available
    console.log('CourseId from useParams:', courseId);
    if (!courseId) {
      setErrors({ general: 'Course ID is missing. Please ensure you are accessing this page from a valid course.' });
      return;
    }
    
    try {
      setSaving(true);
      setErrors({});
      
      const results = [];
      const errors = [];
      
      for (const [index, plan] of plans.entries()) {
        try {
          // Validate required fields before sending
          if (!plan.duration || !plan.unit || !plan.price) {
            errors.push({ 
              index, 
              error: 'Missing required fields: duration, unit, or price' 
            });
            continue;
          }

          const planData = preparePlanData(plan);
          
          let result;
          if (plan.id) {
            // Update existing plan
            result = await updatePricingPlan(plan.id, planData);
          } else {
            // Create new plan
            result = await createPricingPlan(planData);
          }
          results.push(result);
        } catch (err) {
          console.error(`Error saving plan ${index}:`, err);
          const errorMessage = err.response?.data?.error || 
                             err.response?.data?.details || 
                             err.message || 
                             'Unknown error occurred';
          errors.push({ index, error: errorMessage });
        }
      }
      
      if (errors.length === 0) {
        setSuccessMessage(`Successfully saved ${results.length} pricing plan(s)`);
        await fetchPricingPlans(); // Refresh data
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        const errorObj = {};
        errors.forEach(({ index, error }) => {
          errorObj[index] = { save: error };
        });
        setErrors(errorObj);
        
        // If some plans were saved successfully, show partial success
        if (results.length > 0) {
          setSuccessMessage(`Saved ${results.length} plans, but ${errors.length} failed`);
          setTimeout(() => setSuccessMessage(''), 5000);
        }
      }
      
    } catch (err) {
      console.error('Failed to save plans:', err);
      setErrors({ 
        general: err.response?.data?.error || err.message || 'Failed to save pricing plans' 
      });
    } finally {
      setSaving(false);
    }
  };

  // Calculated statistics
  const stats = useMemo(() => {
    if (plans.length === 0) return null;
    
    const prices = plans.map(p => parseFloat(p.effective_price) || 0);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const avgDiscount = plans.reduce((sum, p) => sum + (parseFloat(p.discount) || 0), 0) / plans.length;
    const promotedCount = plans.filter(p => p.is_promoted).length;
    
    return {
      minPrice: minPrice.toFixed(2),
      maxPrice: maxPrice.toFixed(2),
      avgDiscount: avgDiscount.toFixed(1),
      promotedCount,
      totalPlans: plans.length
    };
  }, [plans]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" className="mb-3" />
        <h6 className="text-muted">Loading pricing plans...</h6>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-2">Pricing Plans</h4>
          <p className="text-muted mb-0">Set up flexible pricing options for your course</p>
        </div>
        
        {/* Statistics */}
        {stats && (
          <div className="text-end">
            <small className="text-muted d-block">
              {stats.totalPlans} plan{stats.totalPlans !== 1 ? 's' : ''} • 
              ${stats.minPrice} - ${stats.maxPrice} • 
              Avg. {stats.avgDiscount}% discount
            </small>
            {stats.promotedCount > 0 && (
              <small className="text-warning">
                <FaStar className="me-1" />
                {stats.promotedCount} promoted
              </small>
            )}
          </div>
        )}
      </div>

      {/* Success Message */}
      {successMessage && (
        <Alert variant="success" className="mb-4">
          <FaCheckCircle className="me-2" />
          {successMessage}
        </Alert>
      )}

      {/* New Course Warning */}
      {isNewCourse && (
        <Alert variant="info" className="mb-4">
          <FaInfoCircle className="me-2" />
          <strong>New Course:</strong> You're creating a new course. Please complete the basic information step first, then return here to set up pricing plans.
          <div className="mt-2">
            <Button 
              variant="outline-info" 
              size="sm"
              onClick={() => setActiveStep(1)}
            >
              Go to Basic Information
            </Button>
          </div>
        </Alert>
      )}

      {/* General Errors */}
      {errors.general && (
        <Alert variant="danger" className="mb-4">
          <FaExclamationTriangle className="me-2" />
          {errors.general}
        </Alert>
      )}

      {errors.fetch && (
        <Alert variant="warning" className="mb-4">
          <FaExclamationTriangle className="me-2" />
          {errors.fetch}
          <Button
            variant="outline-warning"
            size="sm"
            className="ms-2"
            onClick={fetchPricingPlans}
          >
            Retry
          </Button>
        </Alert>
      )}

      <Form>
        {/* Pricing Plans */}
        {plans.map((plan, index) => (
          <Card className="mb-3" key={index}>
            <Card.Body className="p-3">
              {/* Plan Header */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0">
                  Plan {index + 1}
                  {plan.is_promoted && (
                    <Badge bg="warning" className="ms-2">
                      <FaStar className="me-1" />
                      Promoted
                    </Badge>
                  )}
                  {plan.isNew && (
                    <Badge bg="success" className="ms-2">New</Badge>
                  )}
                </h6>
                
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleRemovePlan(index)}
                  disabled={deleting === index || saving}
                >
                  {deleting === index ? (
                    <Spinner size="sm" />
                  ) : (
                    <FaTrash />
                  )}
                </Button>
              </div>

              {/* Plan Error */}
              {errors[index] && (
                <Alert variant="danger" className="mb-3">
                  {Object.values(errors[index]).map((error, i) => (
                    <div key={i}>{error}</div>
                  ))}
                </Alert>
              )}

              <div className="row g-3">
                {/* Duration */}
                <div className="col-md-2">
                  <Form.Group>
                    <Form.Label>Duration <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="number"
                      min="1"
                      value={plan.duration}
                      onChange={(e) => handleChange(index, 'duration', parseInt(e.target.value) || '')}
                      isInvalid={errors[index]?.duration}
                      disabled={saving}
                    />
                  </Form.Group>
                </div>

                {/* Unit */}
                <div className="col-md-2">
                  <Form.Group>
                    <Form.Label>Unit <span className="text-danger">*</span></Form.Label>
                    <Form.Select
                      value={plan.unit}
                      onChange={(e) => handleChange(index, 'unit', e.target.value)}
                      isInvalid={errors[index]?.unit}
                      disabled={saving}
                    >
                      <option value="days">Days</option>
                      <option value="months">Months</option>
                      <option value="years">Years</option>
                    </Form.Select>
                  </Form.Group>
                </div>

                {/* Original Price */}
                <div className="col-md-2">
                  <Form.Group>
                    <Form.Label>Price ($) <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="number"
                      min="0"
                      step="0.01"
                      value={plan.price}
                      onChange={(e) => handleChange(index, 'price', parseFloat(e.target.value) || '')}
                      isInvalid={errors[index]?.price}
                      disabled={saving}
                    />
                  </Form.Group>
                </div>

                {/* Discount */}
                <div className="col-md-2">
                  <Form.Group>
                    <Form.Label>Discount (%)</Form.Label>
                    <Form.Control
                      type="number"
                      min="0"
                      max="100"
                      value={plan.discount}
                      onChange={(e) => handleChange(index, 'discount', parseFloat(e.target.value) || '')}
                      isInvalid={errors[index]?.discount}
                      disabled={saving}
                    />
                  </Form.Group>
                </div>

                {/* Effective Price */}
                <div className="col-md-2">
                  <Form.Group>
                    <Form.Label>Final Price</Form.Label>
                    <div className="form-control bg-light border-success text-success fw-bold">
                      ${calculateEffectivePrice(plan.price, plan.discount)}
                    </div>
                  </Form.Group>
                </div>

                {/* Promoted Toggle */}
                <div className="col-md-2 d-flex align-items-end">
                  <Form.Group className="w-100">
                    <Form.Check
                      type="switch"
                      id={`promoted-${index}`}
                      label="Promoted"
                      checked={plan.is_promoted}
                      onChange={(e) => handleChange(index, 'is_promoted', e.target.checked)}
                      disabled={saving}
                    />
                  </Form.Group>
                </div>
              </div>

              {/* Plan Preview */}
              <div className="mt-3 p-2 bg-light rounded">
                <small className="text-muted">
                  <strong>Preview:</strong> {plan.duration} {plan.unit} access for{' '}
                  {plan.discount ? (
                    <>
                      <span className="text-decoration-line-through">${plan.price}</span>{' '}
                      <span className="text-success fw-bold">
                        ${calculateEffectivePrice(plan.price, plan.discount)}
                      </span>{' '}
                      <span className="text-warning">({plan.discount}% off)</span>
                    </>
                  ) : (
                    <span className="fw-bold">${plan.price}</span>
                  )}
                  {plan.is_promoted && <span className="text-warning ms-2">⭐ Most Popular</span>}
                </small>
              </div>
            </Card.Body>
          </Card>
        ))}

        {/* Add Plan Buttons */}
        <div className="d-flex gap-2 mb-4">
          <Button variant="outline-primary" onClick={handleAddPlan} disabled={saving}>
            <FaPlus className="me-2" />
            Add Custom Plan
          </Button>
          <Button 
            variant="outline-secondary" 
            onClick={() => setShowRecommendations(true)}
            disabled={saving}
          >
            <FaCalculator className="me-2" />
            Use Recommended Plans
          </Button>
        </div>

        {/* Info Box */}
        {plans.length > 0 && (
          <Alert variant="info" className="mb-4">
            <FaInfoCircle className="me-2" />
            <strong>Tip:</strong> Offering multiple pricing options can increase conversions. 
            Consider a short-term trial, a popular mid-term option, and a discounted long-term plan.
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="d-flex justify-content-between mt-4">
          <Button 
            variant="light" 
            onClick={() => setActiveStep(1)}
            disabled={saving}
          >
            Previous
          </Button>
          <div className="d-flex gap-2">
            <Button 
              variant="outline-primary" 
              onClick={handleSavePlans}
              disabled={saving || plans.length === 0}
            >
              {saving ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Saving...
                </>
              ) : (
                'Save Plans'
              )}
            </Button>
            <Button 
              variant="primary" 
              onClick={() => { 
                if (validateAllPlans()) {
                  setProgress(75); 
                  setActiveStep(3); 
                }
              }}
              disabled={saving || plans.length === 0}
            >
              Next
            </Button>
          </div>
        </div>
      </Form>

      {/* Recommendations Modal */}
      <Modal show={showRecommendations} onHide={() => setShowRecommendations(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Recommended Pricing Plans</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-muted mb-4">
            Choose from these proven pricing strategies that work well for online courses:
          </p>
          
          <div className="row g-3">
            {recommendations.map((rec, index) => (
              <div key={index} className="col-md-4">
                <Card className={`h-100 ${rec.isRecommended ? 'border-warning' : ''}`}>
                  <Card.Body className="text-center">
                    {rec.isRecommended && (
                      <Badge bg="warning" className="mb-2">
                        <FaStar className="me-1" />
                        Recommended
                      </Badge>
                    )}
                    <h6>{rec.title}</h6>
                    <div className="my-3">
                      <div className="h4 text-success mb-0">
                        ${calculateEffectivePrice(rec.price, rec.discount)}
                      </div>
                      {rec.discount > 0 && (
                        <>
                          <small className="text-decoration-line-through text-muted">
                            ${rec.price}
                          </small>
                          <div>
                            <Badge bg="danger">{rec.discount}% OFF</Badge>
                          </div>
                        </>
                      )}
                    </div>
                    <div className="text-muted small mb-3">
                      {rec.duration} {rec.unit} access
                    </div>
                    <Button
                      variant={rec.isRecommended ? 'warning' : 'outline-primary'}
                      size="sm"
                      onClick={() => handleAddRecommendation(rec)}
                    >
                      Add This Plan
                    </Button>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default PricingPlans;