import { getConfirmationResult } from './confirmationResultHolder';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import AuthLayout from './components/AuthLayout';
import httpClient from '../../../helpers/httpClient';
import { useAuthContext } from '../../../context/useAuthContext';
import './MobileLoginPage.css'; // Reuse the same CSS

export default function OtpVerifyPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const mobile = location.state?.mobile || '';
  const [otp, setOtp] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuthContext();
  const confirmationResult = getConfirmationResult();

  const handleOtpSubmit = async () => {
    setErr('');
    setLoading(true);
    try {
      if (!confirmationResult) {
        setErr('Session expired. Please re-enter your mobile number.');
        setLoading(false);
        return;
      }

      const result = await confirmationResult.confirm(otp);
      const firebaseUser = result.user;
      const idToken = await firebaseUser.getIdToken();

      const response = await httpClient.post('/api/users/check-user', {
        phone_number: firebaseUser.phoneNumber,
        idToken,
      });

      if (response.data.user && response.data.accessToken) {
        localStorage.setItem('token', response.data.accessToken);
        login(response.data.user, response.data.accessToken);
        navigate('/home');
      } else {
        navigate('/auth/complete-registration', {
          state: { mobile: firebaseUser.phoneNumber },
        });
      }
    } catch (e) {
      setErr('Invalid or expired OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="mobile-login-wrapper d-flex align-items-center justify-content-center">
        <div className="mobile-login-box p-4 rounded">
          <h2 className="mb-3 text-center title-gradient">Verify OTP</h2>
          <p className="mb-3 text-center">
            Enter the OTP sent to <strong>{mobile}</strong>
          </p>
          <input
            className="form-control mb-3"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="Enter OTP"
            maxLength={6}
            inputMode="numeric"
          />
          <button
            className="btn btn-primary w-100 custom-signin-btn"
            onClick={handleOtpSubmit}
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>
          {err && <div className="text-danger mt-2 text-center">{err}</div>}
        </div>
      </div>
    </AuthLayout>
  );
}
