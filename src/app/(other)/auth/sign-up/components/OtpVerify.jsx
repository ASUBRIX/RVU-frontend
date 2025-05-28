import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import authService from '@/helpers/authService';

export default function OtpVerify() {
  const location = useLocation();
  const navigate = useNavigate();
  const mobile = location.state?.mobile || '';
  const [otp, setOtp] = useState('');
  const [err, setErr] = useState('');

  const handleOtpSubmit = async () => {
    try {
      const res = await authService.verifyOTP({ phone_number: mobile, otp });
      if (res.user) {
        // Existing user: direct to dashboard or home
        // Save auth_key as needed
        navigate('/dashboard');
      } else {
        // New user: go to registration details page
        navigate('/auth/complete-registration', { state: { mobile } });
      }
    } catch (e) {
      setErr('Invalid or expired OTP.');
    }
  };

  return (
    <div>
      <h2>Verify OTP</h2>
      <p>OTP sent to {mobile}</p>
      <input
        value={otp}
        onChange={e => setOtp(e.target.value)}
        placeholder="Enter OTP"
      />
      <button onClick={handleOtpSubmit}>Verify</button>
      {err && <div style={{ color: 'red' }}>{err}</div>}
    </div>
  );
}
