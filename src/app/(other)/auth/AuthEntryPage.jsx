import AuthLayout from './components/AuthLayout';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RecaptchaVerifier, signInWithPhoneNumber, onAuthStateChanged } from "firebase/auth"; 
import { auth } from '../../../firebase'; 
import { setConfirmationResult } from './confirmationResultHolder';

export default function AuthEntryPage() {
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const navigate = useNavigate();
  const confirmationResultRef = useRef(null);

  // Only run on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("User:", user);
    });
    // Cleanup recaptcha and listener on unmount
    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
      unsubscribe();
    };
  }, []);

  // Set up recaptcha only once
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response) => {}
      }, auth);
    }
  };

  const handleMobileSubmit = async () => {
    setLoading(true);
    setErr('');
    try {
      // Validate phone input (India)
      if (!/^[6-9]\d{9}$/.test(mobile)) {
        setErr('Please enter a valid 10-digit Indian mobile number.');
        setLoading(false);
        return;
      }

      setupRecaptcha();
      await new Promise(resolve => setTimeout(resolve, 300)); // Give recaptcha a moment
      const appVerifier = window.recaptchaVerifier;

      const phoneNumber = '+91' + mobile;
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      confirmationResultRef.current = confirmationResult;
      setConfirmationResult(confirmationResult); // Store for OTP step

      navigate('/auth/verify-otp', {
        state: { mobile }
      });
    } catch (e) {
      let errorMessage = 'Failed to send OTP. Try again.';
      switch (e.code) {
        case 'auth/invalid-phone-number':
          errorMessage = 'Invalid phone number format.'; break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many requests. Please try again later.'; break;
        case 'auth/quota-exceeded':
          errorMessage = 'SMS quota exceeded. Please try again later.'; break;
        case 'auth/captcha-check-failed':
          errorMessage = 'Captcha verification failed. Please try again.'; break;
        default:
          errorMessage = e.message || errorMessage;
      }
      setErr(errorMessage);
      window.recaptchaVerifier && window.recaptchaVerifier.clear();
      window.recaptchaVerifier = null;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="p-4">
        <h2 className="mb-4">Sign in or Register</h2>
        <label className="mb-2">Enter your mobile number</label>
        <input
          className="form-control mb-3"
          value={mobile}
          onChange={e => setMobile(e.target.value.replace(/\D/,''))}
          placeholder="Mobile number"
          maxLength={10}
        />
        <button
          className="btn btn-primary w-100 mb-3"
          disabled={loading}
          onClick={handleMobileSubmit}
        >
          {loading ? "Sending..." : "Continue"}
        </button>
        <div id="recaptcha-container"></div>
        {err && <div className="text-danger mb-3">{err}</div>}
        <hr />
        <button
          className="btn btn-outline-secondary w-100"
          onClick={() => navigate('/auth/email-login')}
        >
          Sign in with Email
        </button>
      </div>
    </AuthLayout>
  );
}
