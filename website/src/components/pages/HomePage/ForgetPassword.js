import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ForgetPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      setMessage('');
      return;
    }
    
    setError('');
    setMessage('✅ Password reset link has been sent to your email!');
    
    setTimeout(() => {
      navigate('/login');
    }, 1800);
  };

  return (
    <section className='login-card'>
      <div className="signup-container">
        <h2>Forgot Password</h2>
        <p className="text-muted text-center mb-4" style={{color: '#6c757d'}}>
          Enter your email and we'll send you a reset link
        </p>

        {message && <div style={{ color: 'green', textAlign: 'center', marginBottom: '20px', fontWeight: 'bold' }}>{message}</div>}
        {error && <div style={{ color: 'red', textAlign: 'center', marginBottom: '20px', fontWeight: 'bold' }}>{error}</div>}

        <form onSubmit={handleSubmit} className='login-form'>
          <div style={{ marginBottom: '20px' }}>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '12px', fontSize: '16px' }}
              required
            />
          </div>

          <button type="submit" style={{ width: '100%' }}>
            Send Reset Link
          </button>
        </form>

        <p className="text-center mt-4">
          Remember your password?{' '}
          <a href="/login" style={{ color: '#007bff' }}>Back to Login</a>
        </p>
      </div>
    </section>
  );
}

export default ForgetPassword;