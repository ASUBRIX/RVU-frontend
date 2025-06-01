import { useLocation, useNavigate } from 'react-router-dom';
import AuthLayout from './components/AuthLayout';
import { useState } from 'react';
import { getConfirmationResult } from './confirmationResultHolder';

export default function OtpVerifyPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const mobile = location.state?.mobile || '';
  const [otp, setOtp] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  // Always get confirmationResult from the holder module
  const confirmationResult = getConfirmationResult();

  const handleOtpSubmit = async () => {
    setErr('');
    setLoading(true);
    try {
      if (!confirmationResult) {
        setErr("Session expired. Please re-enter your mobile number.");
        setLoading(false);
        return;
      }

      // Confirm the code
      const result = await confirmationResult.confirm(otp);
      const firebaseUser = result.user;

      // You can get the phone number from firebaseUser.phoneNumber
      // OPTIONAL: Call your backend to check if user exists in your DB
      // If not, show registration form; if exists, set token and redirect home

      // For demo, just go to home
      navigate('/home');
    } catch (e) {
      setErr('Invalid or expired OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
        <div className="p-4 border rounded" style={{ minWidth: 320 }}>
          <h2 className="mb-3">Verify OTP</h2>
          <p className="mb-2">OTP sent to <strong>{mobile}</strong></p>
          <input
            className="form-control mb-3"
            value={otp}
            onChange={e => setOtp(e.target.value.replace(/\D/, '').slice(0, 6))}
            placeholder="Enter OTP"
            maxLength={6}
          />
          <button
            className="btn btn-primary w-100"
            onClick={handleOtpSubmit}
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>
          {err && <div style={{ color: 'red', marginTop: 12 }}>{err}</div>}
        </div>
      </div>
    </AuthLayout>
  );
}
