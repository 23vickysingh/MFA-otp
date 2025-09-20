import React, { useState, useEffect, useRef } from 'react';

import { useNavigate } from 'react-router-dom';
import './SuccessPage.css';

const SuccessPage = () => {
  const confettiContainerRef = useRef(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the token from local storage
    localStorage.removeItem('token');
    // Navigate to the home page
    navigate('/');
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        // This is a fallback; ProtectedRoute should have already handled this.
        navigate('/signin');
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/auth/user', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // This header sends the token to the backend for validation
            'x-auth-token': token,
          },
        });

        if (!response.ok) {
          // This will trigger if the backend returns a 401 for an invalid token
          throw new Error('Authentication failed. Please log in again.');
        }

        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error(error.message);
        // If the token is invalid, we clear it and redirect to the login page.
        localStorage.removeItem('token');
        navigate('/signin');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  // This effect runs the confetti animation once the user data is loaded and the component has rendered the success view.
  useEffect(() => {
    if (!loading && user && confettiContainerRef.current) {
      // --- Confetti Logic ---
      const confettiCount = 150;
      const container = confettiContainerRef.current;

      for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';

        const colors = ['#007bff', '#28a745', '#ffc107', '#dc3545', '#17a2b8', '#f8f9fa'];
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

        // Random final position (burst outwards)
        const x = (Math.random() - 0.5) * 2 * window.innerWidth;
        const y = (Math.random() - 0.5) * 2 * window.innerHeight;

        // Random animation duration and delay
        confetti.style.animationDuration = `${Math.random() * 3 + 2}s`; // 2-5 seconds
        confetti.style.animationDelay = `${Math.random() * 0.2}s`;

        confetti.style.setProperty('--x-end', `${x}px`);
        confetti.style.setProperty('--y-end', `${y}px`);

        container.appendChild(confetti);
      }
    }
  }, [loading, user]); // Depend on loading and user state

  return (
    <>
      {
        !!loading ? (
          <>
            <div className="success-container">
              <div className="success-message">
                <h1>Verifying...</h1>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="success-container">
              <div ref={confettiContainerRef} className="confetti-container"></div>
              <div className="success-message">
                <h1>Welcome, {user?.username}!</h1>
                <p>You have successfully completed the 2-step authentication.</p>
                <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
              </div>
            </div>
          </>
        )
      }
    </>
  );
};

export default SuccessPage;