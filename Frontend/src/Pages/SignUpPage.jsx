import React from 'react';
import './SignUpPage.css';

import { useNavigate } from 'react-router-dom';

const SignUpPage = () => {

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!showOtpInput) {  // to sign up
      try { 
        const response = await fetch('http://localhost:5000/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ userName, email, password})
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.msg || 'Failed to sign up');
        }

        showOtpInput(true);

      } catch (err) {
        setError(err.message);
      }
    } else { // to verify otp
      try {
        const response = await fetch('http://localhost:5000/api/auth/verify-otp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
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
      }
      catch (err) {
        console.log(err);
        setError(err.message);
      }
    }
  }

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        {!showOtpInput ? (
          <>
            <h2>Create Account</h2>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input type="text" id="username" name="username" value={userName} onChange={(e) => setUserName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" name="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="confirm-password">Confirm Password</label>
              <input type="password" id="confirm-password" name="confirm-password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
            </div>
            <button type="submit" className="signup-btn">Sign Up</button>
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

export default SignUpPage;