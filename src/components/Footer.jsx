import React, { useContext } from 'react';
import { ThemeContext } from './ThemeContext';

const Footer = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <footer className="bg-[var(--bg-primary)]/95 backdrop-blur-md py-4">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="text-[var(--text)] text-sm">
          <p>Developed by Sam</p>
          <p>Copyright © 2025</p>
        </div>
        <div className="flex space-x-4 mt-2 md:mt-0">
          <a href="https://github.com/kirixen" target="_blank" className="text-[var(--text)] hover:text-[var(--text-hover)] transition">
            <i className="fa-brands fa-github text-xl"></i>
          </a>
          <a href="https://www.youtube.com/@kirixenyt" target="_blank" className="text-[var(--text)] hover:text-[var(--text-hover)] transition">
            <i className="fa-brands fa-youtube text-xl"></i>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;