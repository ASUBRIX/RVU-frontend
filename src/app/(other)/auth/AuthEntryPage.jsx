import AuthLayout from './components/AuthLayout';
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
      <div className="p-4">
        <h2 className="mb-4">Sign in or Register</h2>
        <label className="mb-2">Enter your mobile number</label>
        <input
          className="form-control mb-3"
          value={mobile}
          onChange={e => setMobile(e.target.value)}
          placeholder="Mobile number"
          maxLength={15}
        />
        <button
          className="btn btn-primary w-100 mb-3"
          disabled={loading}
          onClick={handleMobileSubmit}
        >
          Continue
        </button>
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
