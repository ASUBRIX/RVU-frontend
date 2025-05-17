import { Form, Button, Card } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {getPricingPlans,createPricingPlan,updatePricingPlan,deletePricingPlan} from '../../../../helpers/pricingPlansApi';

const PricingPlans = ({ setActiveStep, setProgress }) => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    if (courseId) {
      getPricingPlans(courseId)
        .then(res => setPlans(res.data))
        .catch(err => console.error('Failed to fetch plans:', err));
    }
  }, [courseId]);

  const handleChange = (index, field, value) => {
    setPlans(prev => prev.map((plan, i) => i === index ? { ...plan, [field]: value } : plan));
  };

  const calculateEffectivePrice = (price, discount) => {
    const numPrice = parseFloat(price) || 0;
    const numDiscount = parseFloat(discount) || 0;
    return (numPrice - (numPrice * numDiscount) / 100).toFixed(2);
  };

  const handleAddPlan = () => {
    setPlans([...plans, { duration: '', unit: 'days', price: '', discount: '', is_promoted: false, effective_price: '' }]);
  };

  const handleRemovePlan = async (index) => {
    const plan = plans[index];
    if (plan.id) {
      try {
        await deletePricingPlan(plan.id);
        setPlans(prev => prev.filter((_, i) => i !== index));
      } catch (err) {
        console.error('Failed to delete plan:', err);
      }
    } else {
      setPlans(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSavePlans = async () => {
    try {
      for (const plan of plans) {
        const updatedPlan = {
          ...plan,
          effective_price: calculateEffectivePrice(plan.price, plan.discount)
        };
        if (plan.id) {
          await updatePricingPlan(plan.id, updatedPlan);
        } else {
          await createPricingPlan({ ...updatedPlan, course_id: courseId });
        }
      }
      alert('Plans saved');
    } catch (err) {
      console.error('Failed to save plans:', err);
      alert('Failed to save plans');
    }
  };

  return (
    <div>
      <h4 className="mb-4">Pricing Plans</h4>
      <Form>
        {plans.map((plan, index) => (
          <Card className="mb-3" key={index}>
            <Card.Body className="p-3">
              <div className="row g-3">
                <div className="col-md-2">
                  <Form.Group>
                    <Form.Label>Duration</Form.Label>
                    <Form.Control
                      type="number"
                      value={plan.duration}
                      onChange={(e) => handleChange(index, 'duration', e.target.value)}
                    />
                  </Form.Group>
                </div>
                <div className="col-md-2">
                  <Form.Group>
                    <Form.Label>Unit</Form.Label>
                    <Form.Select
                      value={plan.unit}
                      onChange={(e) => handleChange(index, 'unit', e.target.value)}>
                      <option value="days">Days</option>
                      <option value="months">Months</option>
                      <option value="years">Years</option>
                    </Form.Select>
                  </Form.Group>
                </div>
                <div className="col-md-2">
                  <Form.Group>
                    <Form.Label>Price ($)</Form.Label>
                    <Form.Control
                      type="number"
                      value={plan.price}
                      onChange={(e) => handleChange(index, 'price', e.target.value)}
                    />
                  </Form.Group>
                </div>
                <div className="col-md-2">
                  <Form.Group>
                    <Form.Label>Discount (%)</Form.Label>
                    <Form.Control
                      type="number"
                      value={plan.discount}
                      onChange={(e) => handleChange(index, 'discount', e.target.value)}
                    />
                  </Form.Group>
                </div>
                <div className="col-md-2">
                  <Form.Group>
                    <Form.Label>After Discount ($)</Form.Label>
                    <Form.Control
                      type="text"
                      value={`$${calculateEffectivePrice(plan.price, plan.discount)}`}
                      disabled
                    />
                  </Form.Group>
                </div>
                <div className="col-md-1 d-flex align-items-center">
                  <Form.Check
                    label="Promoted"
                    checked={plan.is_promoted}
                    onChange={(e) => handleChange(index, 'is_promoted', e.target.checked)}
                  />
                </div>
                <div className="col-md-1 d-flex align-items-center">
                  <Button variant="danger" onClick={() => handleRemovePlan(index)}>Remove</Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        ))}
        <Button variant="secondary" onClick={handleAddPlan}>Add Plan</Button>
        <div className="d-flex justify-content-between mt-4">
          <Button variant="light" onClick={() => setActiveStep(1)}>Previous</Button>
          <div className="d-flex gap-2">
            <Button variant="outline-primary" onClick={handleSavePlans}>Save</Button>
            <Button variant="primary" onClick={() => { setProgress(75); setActiveStep(3); }}>Next</Button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default PricingPlans;
