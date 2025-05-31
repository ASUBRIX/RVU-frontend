import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import authService from '@/helpers/authService';
import AuthLayout from './components/AuthLayout'; 

export default function OtpVerifyPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const mobile = location.state?.mobile || '';
  const [otp, setOtp] = useState('');
  const [err, setErr] = useState('');

const handleOtpSubmit = async () => {
  try {
    const res = await authService.verifyOTP({ phone_number: mobile, otp });
    if (res.user && res.accessToken) {
      localStorage.setItem('token', res.accessToken);
      navigate('/home');
    } else {
      navigate('/auth/complete-registration', { state: { mobile } });
    }
  } catch (e) {
    setErr('Invalid or expired OTP.');
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
            onChange={e => setOtp(e.target.value)}
            placeholder="Enter OTP"
            maxLength={6}
          />
          <button className="btn btn-primary w-100" onClick={handleOtpSubmit}>
            Verify
          </button>
          {err && <div style={{ color: 'red', marginTop: 12 }}>{err}</div>}
        </div>
      </div>
    </AuthLayout>
  );
}

