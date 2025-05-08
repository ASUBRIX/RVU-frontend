import React, { useState } from 'react'
import { Button, Card, Toast, ToastContainer } from 'react-bootstrap'
import { FaShareAlt } from 'react-icons/fa'
import creatorLogo from '@/assets/images/logo-transparent.png'

const PriceCard = () => {
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [selectedCoupon, setSelectedCoupon] = useState(null)
  const [price, setPrice] = useState(275.98)
  const originalPrice = 275.98

  const coupons = [
    {
      code: 'WELCOME20',
      description: '20% off your first purchase',
      expiry: '12/31/2024',
      discount: 0.2, // 20% discount
    },
    {
      code: 'SUMMER10',
      description: '10% off summer collection',
      expiry: '8/31/2024',
      discount: 0.1, // 10% discount
    },
  ]

  const applyCoupon = (coupon) => {
    if (selectedCoupon === coupon.code) {
      setSelectedCoupon(null)
      setPrice(originalPrice)
    } else {
      setSelectedCoupon(coupon.code)
      const newPrice = originalPrice * (1 - coupon.discount)
      setPrice(newPrice)
    }

    setToastMessage(`Coupon ${coupon.code} applied!`)
    setShowToast(true)
  }

  return (
    <Card className="price-card border p-4 rounded-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="price">${price.toFixed(2)}</h2>
        <Button variant="light" className="share-button">
          <FaShareAlt />
        </Button>
      </div>

      <Button variant="success" className="buy-button">
        <div className="d-flex justify-content-center align-items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
          </svg>
          <span className="fw-medium">Buy now</span>
        </div>
      </Button>

      <div className="coupons-section">
        <h5 className="mb-3">Available Offers</h5>
        <div className="coupons-container">
          {coupons.map((coupon, index) => (
            <div
              key={index}
              className={`coupon-card ${selectedCoupon === coupon.code ? 'selected' : ''}`}
              onClick={() => applyCoupon(coupon)}>
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <div className={`coupon-icon ${index % 2 === 0 ? 'purple' : 'yellow'}`}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round">
                      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                      <line x1="7" y1="7" x2="7.01" y2="7"></line>
                    </svg>
                  </div>
                  <div className="coupon-info">
                    <h6 className="code">{coupon.code}</h6>
                    <p className="description">{coupon.description}</p>
                  </div>
                </div>
                {coupon.expiry && (
                  <div className="expiry">
                    Expires
                    <span>{coupon.expiry}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="creator-info">
        <div className="avatar">
          <img src={creatorLogo} alt="avatar" />
        </div>
        <div className="info">
          <h6>By Jacqueline Miller</h6>
          <p>Founder Eduport company</p>
        </div>
      </div>

      <ToastContainer position="bottom-end" className="p-3">
        <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
          <Toast.Header closeButton={false}>
            <strong className="me-auto">Notification</strong>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </Card>
  )
}

export default PriceCard
