import React, { useEffect, useRef } from 'react';
import './SuccessPage.css';

const SuccessPage = () => {
  const confettiContainerRef = useRef(null);

  useEffect(() => {
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
  }, []);

  return (
    <div className="success-container">
      <div ref={confettiContainerRef} className="confetti-container"></div>
      <div className="success-message">
        <h1>Success!</h1>
        <p>You have successfully completed the 2 step authentication.</p>
      </div>
    </div>
  );
};

export default SuccessPage;