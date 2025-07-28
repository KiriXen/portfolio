import React, { useState, useContext, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ThemeContext } from './ThemeContext';
import NProgress from 'nprogress';

const Header = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme } = useContext(ThemeContext);
  const location = useLocation();

  useEffect(() => {
    NProgress.start();
    setTimeout(() => NProgress.done(), 500);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDropdown = (e) => {
    e.preventDefault();
    setDropdownOpen(!isDropdownOpen);
  };

  const navItems = [
    { path: '/', label: 'Home', icon: 'fa-solid fa-house' },
    { path: '/about', label: 'About', icon: 'fa-regular fa-user' },
    { path: '/projects', label: 'Projects', icon: 'fa-solid fa-laptop-code' },
    { path: '/playground', label: 'Playground', icon: 'fa-solid fa-code' },
    { path: '/settings', label: 'Settings', icon: 'fa-solid fa-gear' },
  ];

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'glass-effect border-b border-[var(--border)] shadow-lg backdrop-blur-md' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto">
        <div className="flex justify-between items-center py-3 md:py-4">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-xl sm:text-2xl font-bold gradient-text hover:scale-105 transition-all duration-300 animate-fade-in-left"
          >
            <span className="hidden sm:inline">Sam's Portfolio</span>
            <span className="sm:hidden">Sam</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 animate-fade-in-down">
            {navItems.map((item, index) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 lg:px-4 py-2 text-sm lg:text-base rounded-lg transition-all duration-300 group relative overflow-hidden ${
                  location.pathname === item.path
                    ? 'text-[var(--accent)] bg-[var(--accent)]/10 glow-effect'
                    : 'text-[var(--text)] hover:text-[var(--text-hover)] hover:bg-[var(--bg-secondary)]/50'
                }`}
                style={{ '--stagger-delay': `${index * 100}ms` }}
              >
                <i className={`${item.icon} mr-2 text-sm lg:text-base group-hover:scale-110 transition-transform duration-300`}></i>
                <span className="relative z-10">{item.label}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent)]/0 via-[var(--accent)]/10 to-[var(--accent)]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden animate-fade-in-right">
            <button 
              onClick={toggleDropdown} 
              className="p-2 text-[var(--text)] hover:text-[var(--text-hover)] hover:bg-[var(--bg-secondary)]/50 rounded-lg transition-all duration-300 relative overflow-hidden group"
              aria-label="Toggle menu"
            >
              <div className="relative z-10">
                <i className={`fas text-xl transition-all duration-300 ${
                  isDropdownOpen ? 'fa-times rotate-180' : 'fa-bars rotate-0'
                }`}></i>
              </div>
              <div className="absolute inset-0 bg-[var(--accent)]/20 scale-0 group-hover:scale-100 rounded-lg transition-transform duration-300 origin-center"></div>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isDropdownOpen 
            ? 'max-h-64 opacity-100' 
            : 'max-h-0 opacity-0'
        }`}>
          <div className="glass-effect border-t border-[var(--border)]/30 backdrop-blur-md">
            {navItems.map((item, index) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setDropdownOpen(false)}
                className={`flex items-center py-3 px-4 transition-all duration-300 border-b border-[var(--border)]/20 last:border-b-0 group relative overflow-hidden ${
                  location.pathname === item.path
                    ? 'text-[var(--accent)] bg-[var(--accent)]/10'
                    : 'text-[var(--text)] hover:text-[var(--text-hover)] hover:bg-[var(--bg-secondary)]/30'
                }`}
                style={{ 
                  animationDelay: `${index * 50}ms`,
                  transform: isDropdownOpen ? 'translateX(0)' : 'translateX(-20px)',
                  transition: `all 0.3s ease ${index * 50}ms`
                }}
              >
                <i className={`${item.icon} mr-3 text-lg group-hover:scale-110 transition-transform duration-300`}></i>
                <span className="text-base font-medium relative z-10">{item.label}</span>
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--accent)] scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center"></div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;