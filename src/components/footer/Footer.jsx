import React from 'react';
import './footer.css';

function Footer() {
  // Automatically gets the current year
  const currentYear = new Date().getFullYear();

  return (
    <footer className="simple-footer">
      <div className="simple-footer-container">
        <p>&copy; {currentYear} Kotdwar. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;