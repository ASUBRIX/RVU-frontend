import { Form, Button, Card } from 'react-bootstrap'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const PricingPlans = ({ setActiveStep, setProgress }) => {
  const navigate = useNavigate()
  const [validityType, setValidityType] = useState('single')
  const [multiPlans, setMultiPlans] = useState([
    { duration: '', unit: 'days', price: '', discount: 0, isPromoted: false },
    { duration: '', unit: 'days', price: '', discount: 0, isPromoted: false },
  ])

  const calculateEffectivePrice = (price, discount) => {
    const numPrice = parseFloat(price) || 0
    const numDiscount = parseFloat(discount) || 0
    return (numPrice - (numPrice * numDiscount) / 100).toFixed(2)
  }

  const handleMultiPlanChange = (index, field, value) => {
    setMultiPlans((prev) => prev.map((plan, i) => (i === index ? { ...plan, [field]: value } : plan)))
  }

  return (
    <div>
      <h4 className="mb-4">Pricing Plans</h4>

      <Form>
        {/* Validity Type Selection */}
        <Form.Group className="mb-4">
          <Form.Label className="fw-medium">Course Duration Type</Form.Label>
          <div className="row g-3">
            {['single', 'multi', 'lifetime', 'expiry'].map((type) => (
              <div className="col-md-3" key={type}>
                <Card
                  className={`h-100 cursor-pointer ${validityType === type ? 'border-dark' : 'border-light'}`}
                  onClick={() => setValidityType(type)}>
                  <Card.Body className="p-3">
                    <div className="form-check">
                      <input
                        type="radio"
                        className="form-check-input"
                        name="validityType"
                        id={`validity-${type}`}
                        checked={validityType === type}
                        onChange={() => setValidityType(type)}
                      />
                      <label className="form-check-label fw-medium" htmlFor={`validity-${type}`}>
                        {type.charAt(0).toUpperCase() + type.slice(1)} Validity
                      </label>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </div>
        </Form.Group>

        {/* Single Validity */}
        {validityType === 'single' && (
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body className="p-4">
              <div className="row g-4">
                <div className="col-md-3">
                  <Form.Group>
                    <Form.Label className="fw-medium">Duration</Form.Label>
                    <Form.Control type="number" className="bg-light border-0" placeholder="Enter duration" />
                  </Form.Group>
                </div>
                <div className="col-md-3">
                  <Form.Group>
                    <Form.Label className="fw-medium">Unit</Form.Label>
                    <Form.Select className="bg-light border-0">
                      <option value="days">Days</option>
                      <option value="months">Months</option>
                      <option value="years">Years</option>
                    </Form.Select>
                  </Form.Group>
                </div>
                <div className="col-md-2">
                  <Form.Group>
                    <Form.Label className="fw-medium">Price ($)</Form.Label>
                    <Form.Control type="number" className="bg-light border-0" placeholder="0.00" />
                  </Form.Group>
                </div>
                <div className="col-md-2">
                  <Form.Group>
                    <Form.Label className="fw-medium">Discount (%)</Form.Label>
                    <Form.Control type="number" className="bg-light border-0" placeholder="0" />
                  </Form.Group>
                </div>
                <div className="col-md-2">
                  <Form.Group>
                    <Form.Label className="fw-medium">Effective Price</Form.Label>
                    <Form.Control type="text" className="bg-light border-0" value="$0.00" disabled />
                  </Form.Group>
                </div>
              </div>
            </Card.Body>
          </Card>
        )}

        {/* Multi Validity */}
        {validityType === 'multi' && (
          <div className="mb-4">
            {multiPlans.map((plan, index) => (
              <Card key={index} className="border-0 shadow-sm mb-3">
                <Card.Body className="p-4">
                  <div className="row g-4">
                    <div className="col-md-2">
                      <Form.Group>
                        <Form.Label className="fw-medium">Duration</Form.Label>
                        <Form.Control
                          type="number"
                          className="bg-light border-0"
                          value={plan.duration}
                          onChange={(e) => handleMultiPlanChange(index, 'duration', e.target.value)}
                        />
                      </Form.Group>
                    </div>
                    <div className="col-md-2">
                      <Form.Group>
                        <Form.Label className="fw-medium">Unit</Form.Label>
                        <Form.Select
                          className="bg-light border-0"
                          value={plan.unit}
                          onChange={(e) => handleMultiPlanChange(index, 'unit', e.target.value)}>
                          <option value="days">Days</option>
                          <option value="months">Months</option>
                          <option value="years">Years</option>
                        </Form.Select>
                      </Form.Group>
                    </div>
                    <div className="col-md-2">
                      <Form.Group>
                        <Form.Label className="fw-medium">Price ($)</Form.Label>
                        <Form.Control
                          type="number"
                          className="bg-light border-0"
                          value={plan.price}
                          onChange={(e) => handleMultiPlanChange(index, 'price', e.target.value)}
                        />
                      </Form.Group>
                    </div>
                    <div className="col-md-2">
                      <Form.Group>
                        <Form.Label className="fw-medium">Discount (%)</Form.Label>
                        <Form.Control
                          type="number"
                          className="bg-light border-0"
                          value={plan.discount}
                          onChange={(e) => handleMultiPlanChange(index, 'discount', e.target.value)}
                        />
                      </Form.Group>
                    </div>
                    <div className="col-md-2">
                      <Form.Group>
                        <Form.Label className="fw-medium">Effective Price</Form.Label>
                        <Form.Control
                          type="text"
                          className="bg-light border-0"
                          value={`$${calculateEffectivePrice(plan.price, plan.discount)}`}
                          disabled
                        />
                      </Form.Group>
                    </div>
                    <div className="col-md-2 d-flex align-items-end">
                      <Form.Check
                        type="checkbox"
                        label="Promote Plan"
                        checked={plan.isPromoted}
                        onChange={(e) => handleMultiPlanChange(index, 'isPromoted', e.target.checked)}
                      />
                    </div>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        )}

        {/* Lifetime Validity */}
        {validityType === 'lifetime' && (
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body className="p-4">
              <div className="row g-4">
                <div className="col-md-4">
                  <Form.Group>
                    <Form.Label className="fw-medium">Price ($)</Form.Label>
                    <Form.Control type="number" className="bg-light border-0" placeholder="0.00" />
                  </Form.Group>
                </div>
                <div className="col-md-4">
                  <Form.Group>
                    <Form.Label className="fw-medium">Discount (%)</Form.Label>
                    <Form.Control type="number" className="bg-light border-0" placeholder="0" />
                  </Form.Group>
                </div>
                <div className="col-md-4">
                  <Form.Group>
                    <Form.Label className="fw-medium">Effective Price</Form.Label>
                    <Form.Control type="text" className="bg-light border-0" value="$0.00" disabled />
                  </Form.Group>
                </div>
              </div>
            </Card.Body>
          </Card>
        )}

        {/* Expiry Date */}
        {validityType === 'expiry' && (
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body className="p-4">
              <div className="row g-4">
                <div className="col-md-3">
                  <Form.Group>
                    <Form.Label className="fw-medium">Expiry Date</Form.Label>
                    <Form.Control type="date" className="bg-light border-0" />
                  </Form.Group>
                </div>
                <div className="col-md-3">
                  <Form.Group>
                    <Form.Label className="fw-medium">Price ($)</Form.Label>
                    <Form.Control type="number" className="bg-light border-0" placeholder="0.00" />
                  </Form.Group>
                </div>
                <div className="col-md-3">
                  <Form.Group>
                    <Form.Label className="fw-medium">Discount (%)</Form.Label>
                    <Form.Control type="number" className="bg-light border-0" placeholder="0" />
                  </Form.Group>
                </div>
                <div className="col-md-3">
                  <Form.Group>
                    <Form.Label className="fw-medium">Effective Price</Form.Label>
                    <Form.Control type="text" className="bg-light border-0" value="$0.00" disabled />
                  </Form.Group>
                </div>
              </div>
            </Card.Body>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="d-flex justify-content-between mt-4">
          <Button variant="light" className="px-4 border-theme-secondary text-theme-secondary" onClick={() => setActiveStep(1)}>
            Previous
          </Button>

          <div className="d-flex gap-3">
             <Button
              variant="light"
              className="px-4 border-theme-secondary text-theme-secondary"
              onClick={() => {
                if (window.confirm('Are you sure you want to cancel? Unsaved changes will be lost.')) {
                  navigate('/admin/all-courses')
                }
              }}>
              Cancel
            </Button>

            <Button
              variant="light"
              className="px-4 bg-theme-secondary text-white"
              onClick={() => {
                setProgress(75)
                setActiveStep(3)
              }}>
              Next
            </Button>
          </div>
        </div>
      </Form>
    </div>
  )
}

export default PricingPlans
