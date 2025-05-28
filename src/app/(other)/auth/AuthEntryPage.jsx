import AuthLayout from './components/AuthLayout';
import { Col } from 'react-bootstrap';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '@/helpers/authService';

export default function AuthEntryPage() {
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  const handleMobileSubmit = async () => {
    setLoading(true);
    setErr('');
    try {
      await authService.requestOTP(mobile);
      navigate('/auth/verify-otp', { state: { mobile } });
    } catch (e) {
      setErr('Failed to send OTP. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Col xs={12} lg={6} className="m-auto">
        <div className="p-5">
          <h2>Sign in or Register</h2>
          <label>Enter your mobile number</label>
          <input
            className="form-control mb-3"
            value={mobile}
            onChange={e => setMobile(e.target.value)}
            placeholder="Mobile number"
            maxLength={15}
          />
          <button className="btn btn-primary w-100" disabled={loading} onClick={handleMobileSubmit}>Continue</button>
          {err && <div style={{ color: 'red' }}>{err}</div>}
          <hr />
          <button className="btn btn-outline-secondary w-100" onClick={() => navigate('/auth/email-login')}>Sign in with Email</button>
        </div>
      </Col>
    </AuthLayout>
  );
}
