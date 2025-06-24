import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { Form, Button, Card, Alert, Spinner, Badge, Modal, Row, Col } from 'react-bootstrap';
import { FaPlus, FaTrash, FaExclamationTriangle, FaCheckCircle, FaInfoCircle, FaStar, FaCalculator, FaDollarSign } from 'react-icons/fa';

const PricingPlans = memo(({ 
  setActiveStep, 
  setProgress, 
  courseId, 
  isNewCourse,
  courseCreated 
}) => {
  // State management
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  
  // Modal state for plan recommendations
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [showPlanPreview, setShowPlanPreview] = useState(false);
  
  // Recommended plans
  const recommendations = [
    { 
      duration: 1, 
      unit: 'months', 
      price: 29.99, 
      discount: 0, 
      title: '1 Month Access',
      description: 'Perfect for trying out the course'
    },
    { 
      duration: 6, 
      unit: 'months', 
      price: 149.99, 
      discount: 15, 
      title: '6 Months Access', 
      isRecommended: true,
      description: 'Most popular choice with great value'
    },
    { 
      duration: 1, 
      unit: 'years', 
      price: 299.99, 
      discount: 25, 
      title: '1 Year Access',
      description: 'Best value for committed learners'
    }
  ];

  // Load pricing plans on component mount
  useEffect(() => {
    if (courseId && !isNewCourse) {
      fetchPricingPlans();
    } else if (courseCreated) {
      // For newly created courses, start with empty plans
      setPlans([]);
    }
  }, [courseId, isNewCourse, courseCreated]);

  const fetchPricingPlans = async () => {
    try {
      setLoading(true);
      setErrors({});
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock existing plans
      const mockPlans = [
        {
          id: 1,
          duration: 3,
          unit: 'months',
          price: 79.99,
          discount: 10,
          is_promoted: false,
          effective_price: 71.99
        }
      ];
      
      setPlans(mockPlans);
    } catch (err) {
      console.error('Failed to fetch plans:', err);
      setErrors({ fetch: 'Failed to load pricing plans. Please try again.' });
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
  const calculateEffectivePrice = useCallback((price, discount) => {
    const numPrice = parseFloat(price) || 0;
    const numDiscount = parseFloat(discount) || 0;
    return (numPrice - (numPrice * numDiscount) / 100).toFixed(2);
  }, []);

  const handleChange = useCallback((index, field, value) => {
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
    
    // Clear errors for this plan
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
  }, [calculateEffectivePrice]);

  const handleAddPlan = useCallback(() => {
    const newPlan = {
      duration: 1,
      unit: 'months',
      price: '',
      discount: '',
      is_promoted: false,
      effective_price: '0.00',
      isNew: true
    };
    setPlans(prev => [...prev, newPlan]);
  }, []);

  const handleRemovePlan = useCallback(async (index) => {
    const plan = plans[index];
    
    if (plan.id) {
      // Existing plan - confirm deletion
      if (!window.confirm('Are you sure you want to delete this pricing plan?')) {
        return;
      }
      
      try {
        setDeleting(index);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setPlans(prev => prev.filter((_, i) => i !== index));
        setSuccessMessage('Pricing plan deleted successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        console.error('Failed to delete plan:', err);
        setErrors(prev => ({ 
          ...prev, 
          [index]: { delete: 'Failed to delete plan. Please try again.' } 
        }));
      } finally {
        setDeleting(null);
      }
    } else {
      // New plan - just remove from state
      setPlans(prev => prev.filter((_, i) => i !== index));
    }
  }, [plans]);

  const handleAddRecommendation = useCallback((recommendation) => {
    const newPlan = {
      ...recommendation,
      effective_price: calculateEffectivePrice(recommendation.price, recommendation.discount),
      is_promoted: recommendation.isRecommended || false,
      isNew: true
    };
    setPlans(prev => [...prev, newPlan]);
    setShowRecommendations(false);
  }, [calculateEffectivePrice]);

  const handleSavePlans = async () => {
    if (!validateAllPlans()) {
      return;
    }

    // Check if this is a new course
    if (isNewCourse && !courseCreated) {
      setErrors({ 
        general: 'Please save the course basic information first before adding pricing plans.' 
      });
      return;
    }

    if (!courseId) {
      setErrors({ general: 'Course ID is missing. Please ensure the course is created first.' });
      return;
    }
    
    try {
      setSaving(true);
      setErrors({});
      
      // Simulate API calls for each plan
      const results = [];
      for (const [index, plan] of plans.entries()) {
        try {
          // Validate required fields
          if (!plan.duration || !plan.unit || !plan.price) {
            throw new Error('Missing required fields: duration, unit, or price');
          }

          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          results.push({ index, success: true, id: Math.floor(Math.random() * 1000) });
        } catch (err) {
          results.push({ index, success: false, error: err.message });
        }
      }
      
      const successful = results.filter(r => r.success);
      const failed = results.filter(r => !r.success);
      
      if (failed.length === 0) {
        setSuccessMessage(`Successfully saved ${successful.length} pricing plan(s)`);
        // Update plans with IDs for new plans
        setPlans(prev => prev.map((plan, index) => {
          const result = results.find(r => r.index === index);
          if (result && result.success && plan.isNew) {
            return { ...plan, id: result.id, isNew: false };
          }
          return plan;
        }));
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        // Handle partial failures
        const errorObj = {};
        failed.forEach(({ index, error }) => {
          errorObj[index] = { save: error };
        });
        setErrors(errorObj);
        
        if (successful.length > 0) {
          setSuccessMessage(`Saved ${successful.length} plans, but ${failed.length} failed`);
          setTimeout(() => setSuccessMessage(''), 5000);
        }
      }
      
    } catch (err) {
      console.error('Failed to save plans:', err);
      setErrors({ 
        general: 'Failed to save pricing plans. Please try again.' 
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
      {isNewCourse && !courseCreated && (
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
          <Card className="mb-3 border" key={index}>
            <Card.Body className="p-4">
              {/* Plan Header */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0 d-flex align-items-center">
                  <FaDollarSign className="me-2 text-primary" />
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

              <Row className="g-3">
                {/* Duration */}
                <Col md={2}>
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
                </Col>

                {/* Unit */}
                <Col md={2}>
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
                </Col>

                {/* Original Price */}
                <Col md={2}>
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
                </Col>

                {/* Discount */}
                <Col md={2}>
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
                </Col>

                {/* Effective Price */}
                <Col md={2}>
                  <Form.Group>
                    <Form.Label>Final Price</Form.Label>
                    <div className="form-control bg-success bg-opacity-10 border-success text-success fw-bold">
                      ${calculateEffectivePrice(plan.price, plan.discount)}
                    </div>
                  </Form.Group>
                </Col>

                {/* Promoted Toggle */}
                <Col md={2} className="d-flex align-items-end">
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
                </Col>
              </Row>

              {/* Plan Preview */}
              <div className="mt-3 p-3 bg-light rounded">
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
          <Button 
            variant="outline-primary" 
            onClick={handleAddPlan} 
            disabled={saving}
          >
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
            variant="outline-secondary" 
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
              Next: Content
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
          
          <Row className="g-3">
            {recommendations.map((rec, index) => (
              <Col key={index} md={4}>
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
                    <p className="small text-muted mb-3">{rec.description}</p>
                    <Button
                      variant={rec.isRecommended ? 'warning' : 'outline-primary'}
                      size="sm"
                      onClick={() => handleAddRecommendation(rec)}
                    >
                      Add This Plan
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Modal.Body>
      </Modal>
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.courseId === nextProps.courseId &&
    prevProps.isNewCourse === nextProps.isNewCourse &&
    prevProps.courseCreated === nextProps.courseCreated
  );
});

PricingPlans.displayName = 'PricingPlans';

export default PricingPlans;