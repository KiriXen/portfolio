import React, { useState, useContext, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ThemeContext } from './ThemeContext';
import NProgress from 'nprogress';

const Header = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const { theme } = useContext(ThemeContext);
  const location = useLocation();

  useEffect(() => {
    NProgress.start();
    setTimeout(() => NProgress.done(), 500);
  }, [location]);

  const toggleDropdown = (e) => {
    e.preventDefault();
    setDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="sticky top-0 z-50 glass-effect border-b border-[var(--border)] shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold gradient-text hover:scale-105 transition-transform duration-300">
          Sam's Portfolio
        </Link>
        <div className="hidden md:flex space-x-1">
          <Link to="/" className="flex items-center px-4 py-2 text-[var(--text)] hover:text-[var(--text-hover)] hover:bg-[var(--bg-secondary)]/50 rounded-lg transition-all duration-300 group">
            <i className="fa-solid fa-house mr-2 group-hover:scale-110 transition-transform"></i>Home
          </Link>
          <Link to="/about" className="flex items-center px-4 py-2 text-[var(--text)] hover:text-[var(--text-hover)] hover:bg-[var(--bg-secondary)]/50 rounded-lg transition-all duration-300 group">
            <i className="fa-regular fa-user mr-2 group-hover:scale-110 transition-transform"></i>About
          </Link>
          <Link to="/projects" className="flex items-center px-4 py-2 text-[var(--text)] hover:text-[var(--text-hover)] hover:bg-[var(--bg-secondary)]/50 rounded-lg transition-all duration-300 group">
            <i className="fa-solid fa-laptop-code mr-2 group-hover:scale-110 transition-transform"></i>Projects
          </Link>
          <Link to="/settings" className="flex items-center px-4 py-2 text-[var(--text)] hover:text-[var(--text-hover)] hover:bg-[var(--bg-secondary)]/50 rounded-lg transition-all duration-300 group">
            <i className="fa-solid fa-gear mr-2 group-hover:scale-110 transition-transform"></i>Settings
          </Link>
        </div>
        <div className="md:hidden">
          <button onClick={toggleDropdown} className="p-2 text-[var(--text)] hover:text-[var(--text-hover)] hover:bg-[var(--bg-secondary)]/50 rounded-lg transition-all duration-300">
            <i className={`fas ${isDropdownOpen ? 'fa-times' : 'fa-bars'} text-2xl transition-transform duration-300`}></i>
          </button>
          {isDropdownOpen && (
            <div className="absolute top-full left-0 w-full glass-effect border-t border-[var(--border)] shadow-lg animate-slide-up">
              <Link to="/" className="block py-3 px-4 text-[var(--text)] hover:text-[var(--text-hover)] hover:bg-[var(--bg-secondary)]/50 transition-all duration-300 border-b border-[var(--border)]/30">
                <i className="fa-solid fa-house mr-3"></i>Home
              </Link>
              <Link to="/about" className="block py-3 px-4 text-[var(--text)] hover:text-[var(--text-hover)] hover:bg-[var(--bg-secondary)]/50 transition-all duration-300 border-b border-[var(--border)]/30">
                <i className="fa-regular fa-user mr-3"></i>About
              </Link>
              <Link to="/projects" className="block py-3 px-4 text-[var(--text)] hover:text-[var(--text-hover)] hover:bg-[var(--bg-secondary)]/50 transition-all duration-300 border-b border-[var(--border)]/30">
                <i className="fa-solid fa-laptop-code mr-3"></i>Projects
              </Link>
              <Link to="/settings" className="block py-3 px-4 text-[var(--text)] hover:text-[var(--text-hover)] hover:bg-[var(--bg-secondary)]/50 transition-all duration-300">
                <i className="fa-solid fa-gear mr-3"></i>Settings
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;