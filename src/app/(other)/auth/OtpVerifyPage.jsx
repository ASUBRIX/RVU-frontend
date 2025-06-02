import { getConfirmationResult } from './confirmationResultHolder';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import AuthLayout from './components/AuthLayout';
import httpClient from "../../../helpers/httpClient"; // update this path as per your structure

export default function OtpVerifyPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const mobile = location.state?.mobile || '';
  const [otp, setOtp] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

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

      // 1. Confirm Firebase OTP
      const result = await confirmationResult.confirm(otp);
      const firebaseUser = result.user;

      // 2. Get Firebase ID token (for backend verification)
      const idToken = await firebaseUser.getIdToken();

      // 3. Call backend to check user
      const response = await httpClient.post('/api/users/check-user', {
        phone_number: firebaseUser.phoneNumber,
        idToken,
      });

      // 4. Redirect accordingly
      if (response.data.user && response.data.accessToken) {
        localStorage.setItem('token', response.data.accessToken);
        navigate('/home');
      } else {
        navigate('/auth/complete-registration', { state: { mobile: firebaseUser.phoneNumber } });
      }

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
