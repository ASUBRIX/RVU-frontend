import AuthLayout from './components/AuthLayout'
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { RecaptchaVerifier, signInWithPhoneNumber, onAuthStateChanged } from 'firebase/auth'
import { auth } from '../../../firebase'
import { setConfirmationResult } from './confirmationResultHolder'
import './MobileLoginPage.css'

export default function MobileLoginPage() {
  const [mobile, setMobile] = useState('')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')
  const navigate = useNavigate()
  const confirmationResultRef = useRef(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {})
    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear()
        window.recaptchaVerifier = null
      }
      unsubscribe()
    }
  }, [])

  // Set up recaptcha only once
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {},
        recaptchaParameters: {
          type: 'image',
          size: 'invisible',
          badge: 'bottomright',
        },
      })
    }
  }

  const handleMobileSubmit = async () => {
    setLoading(true)
    setErr('')
    try {
      if (!/^[6-9]\d{9}$/.test(mobile)) {
        setErr('Please enter a valid 10-digit Indian mobile number.')
        setLoading(false)
        return
      }

      setupRecaptcha()
      await new Promise((resolve) => setTimeout(resolve, 300))
      const appVerifier = window.recaptchaVerifier

      const phoneNumber = '+91' + mobile
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      confirmationResultRef.current = confirmationResult
      setConfirmationResult(confirmationResult)

      navigate('/auth/verify-otp', {
        state: { mobile },
      })
    } catch (e) {
      let errorMessage = 'Failed to send OTP. Try again.'
      switch (e.code) {
        case 'auth/invalid-phone-number':
          errorMessage = 'Invalid phone number format.'
          break
        case 'auth/too-many-requests':
          errorMessage = 'Too many requests. Please try again later.'
          break
        case 'auth/quota-exceeded':
          errorMessage = 'SMS quota exceeded. Please try again later.'
          break
        case 'auth/captcha-check-failed':
          errorMessage = 'Captcha verification failed. Please try again.'
          break
        default:
          errorMessage = e.message || errorMessage
      }
      setErr(errorMessage)
      window.recaptchaVerifier && window.recaptchaVerifier.clear()
      window.recaptchaVerifier = null
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div className="mobile-login-wrapper d-flex align-items-center justify-content-center">
        <div className="mobile-login-box p-4 rounded shadow">
          <h2 className="mb-4 text-center title-gradient">Sign In with Mobile</h2>
          <label className="form-label">Enter your mobile number</label>
          <input
            className="form-control mb-3"
            value={mobile}
            onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
            placeholder="Mobile number"
            maxLength={10}
            inputMode="numeric"
            pattern="[0-9]*"
            autoFocus
          />
          <button
            className="btn btn-primary w-100 mb-3 custom-signin-btn"
            disabled={loading}
            onClick={handleMobileSubmit}
          >
            {loading ? 'Sending OTP...' : 'Continue'}
          </button>
          <div id="recaptcha-container"></div>
          {err && <div className="text-danger mt-2 text-center">{err}</div>}
        </div>
      </div>
    </AuthLayout>
  )
}
