import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '@/helpers/authService';

export default function MobileOrEmailEntry() {
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  const handleMobileSubmit = async () => {
    setLoading(true);
    setErr('');
    try {
      await authService.requestOTP(mobile);
      // Save mobile to local/session storage as needed
      navigate('/auth/verify-otp', { state: { mobile } });
    } catch (e) {
      setErr('Failed to send OTP. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Sign in or Register</h2>
      <label>Enter your mobile number</label>
      <input
        value={mobile}
        onChange={e => setMobile(e.target.value)}
        placeholder="Mobile number"
      />
      <button disabled={loading} onClick={handleMobileSubmit}>Continue</button>
      {err && <div style={{ color: 'red' }}>{err}</div>}
      <hr />
      <button onClick={() => navigate('/auth/email-login')}>Sign in with Email</button>
    </div>
  );
}
