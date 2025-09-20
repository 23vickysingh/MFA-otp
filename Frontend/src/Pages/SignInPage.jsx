import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignInPage.css';

const SignInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    if (!showOtpInput) {
      // Step 1: Send email and password to /login
      try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.msg || 'Failed to sign in');
        }

        // On success, show OTP input
        setShowOtpInput(true);
      } catch (err) {
        setError(err.message);
      }
    } else {
      // Step 2: Send email and OTP to /verify-otp
      try {
        const response = await fetch('http://localhost:5000/api/auth/verify-otp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, otp }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.msg || 'Failed to verify OTP');
        }

        // On successful OTP verification, store JWT and redirect
        localStorage.setItem('token', data.token);
        navigate('/success'); // Redirect to a success page
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <div className="signin-container">
      <form className="signin-form" onSubmit={handleSubmit}>
        <h2>Welcome Back</h2>
        {error && <p className="error-message">{error}</p>}

        {!showOtpInput ? (
          <>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="signin-btn">Sign In</button>
          </>
        ) : (
          <>
            <p>An OTP has been sent (check backend console).</p>
            <div className="form-group">
              <label htmlFor="otp">Enter OTP</label>
              <input type="text" id="otp" name="otp" value={otp} onChange={(e) => setOtp(e.target.value)} required />
            </div>
            <button type="submit" className="signin-btn">Verify OTP</button>
          </>
        )}
      </form>
    </div>
  );
};

export default SignInPage;