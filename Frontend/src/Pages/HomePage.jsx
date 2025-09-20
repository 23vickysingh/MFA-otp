import React from 'react';
import './HomePage.css';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="button-container">
        <button className="btn btn-primary" onClick={() => navigate('/signin')}>Sign In</button>
        <button className="btn btn-secondary" onClick={() => navigate('/register')}>Sign Up</button>
      </div>
    </div>
  );
};

export default HomePage;
