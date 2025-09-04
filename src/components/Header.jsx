import React, { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaCog, FaSpider, FaHome, FaFolderOpen, FaUser, FaGamepad } from 'react-icons/fa';
import { ThemeContext } from './ThemeContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { theme } = useContext(ThemeContext);

  const navItems = [
    { path: '/', label: 'Home', icon: <FaHome className="text-lg" /> },
    { path: '/projects', label: 'Projects', icon: <FaFolderOpen className="text-lg" /> },
    { path: '/about', label: 'About', icon: <FaUser className="text-lg" /> },
    { path: '/settings', label: 'Settings', icon: <FaCog className="text-lg" /> },
    { path: '/playground', label: 'Playground', icon: <FaGamepad className="text-lg" />, desktopOnly: true },
  ];

  const mobileNavItems = navItems.filter(item => !item.desktopOnly);
  const desktopNavItems = navItems;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 glass" style={{ position: 'fixed !important', top: '0 !important' }}>
        <div className="spider-web pointer-events-none"></div>
        
        <div className="absolute top-0 left-0 w-16 h-16 opacity-20 pointer-events-none">
          <svg width="64" height="64" viewBox="0 0 64 64" className="text-spider-red/30">
            <g stroke="currentColor" strokeWidth="0.5" fill="none">
              <line x1="0" y1="0" x2="32" y2="32" />
              <line x1="0" y1="16" x2="16" y2="0" />
              <line x1="8" y1="0" x2="0" y2="8" />
              <path d="M 0 0 Q 8 8 16 0" />
              <path d="M 0 8 Q 8 16 16 8" />
            </g>
          </svg>
        </div>
        
        <div className="absolute top-0 right-0 w-16 h-16 opacity-20 transform scale-x-[-1] pointer-events-none">
          <svg width="64" height="64" viewBox="0 0 64 64" className="text-spider-red/30">
            <g stroke="currentColor" strokeWidth="0.5" fill="none">
              <line x1="0" y1="0" x2="32" y2="32" />
              <line x1="0" y1="16" x2="16" y2="0" />
              <line x1="8" y1="0" x2="0" y2="8" />
              <path d="M 0 0 Q 8 8 16 0" />
              <path d="M 0 8 Q 8 16 16 8" />
            </g>
          </svg>
        </div>
        
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center justify-between h-16">
            <Link
              to="/"
              className="flex items-center space-x-2 cursor-pointer group"
            >
              <div className="relative p-2 rounded-lg bg-gradient-to-br from-miles-electric via-gwen-pink to-miles-purple transform group-hover:rotate-12 transition-all duration-web group-hover:scale-110">
                <FaSpider className="text-spider-black text-xl animate-electric-charge" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-bold gradient-text tracking-wide">
                  Sammy
                </h1>
              </div>
            </Link>

            <div className="hidden md:flex items-center space-x-6">
              {desktopNavItems.map((item, index) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    relative flex items-center space-x-2 px-4 py-2 rounded-lg font-medium
                    transition-all duration-web transform hover:scale-105
                    ${location.pathname === item.path 
                      ? 'text-miles-electric bg-miles-electric/10' 
                      : 'text-text-secondary hover:text-miles-electric'
                    }
                    group
                  `}
                  style={{
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  {item.icon}
                  <span className="relative">
                    {item.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-miles-electric to-gwen-pink group-hover:w-full transition-all duration-web"></span>
                  </span>
                  {location.pathname === item.path && (
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-miles-electric/20 to-gwen-pink/20 animate-web-pulse"></div>
                  )}
                </Link>
              ))}
            </div>

            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-lg text-text-secondary hover:text-miles-electric hover:bg-miles-electric/10 transition-all duration-web hover:scale-110 group"
            >
              {isMenuOpen ? (
                <FaTimes className="text-xl group-hover:animate-spider-glitch" />
              ) : (
                <FaBars className="text-xl group-hover:animate-spider-swing" />
              )}
            </button>
          </div>
        </nav>

        {isMenuOpen && (
          <div className="md:hidden glass">
            <div className="spider-web opacity-20"></div>
            <div className="px-4 py-4 space-y-2 relative z-10">
              {mobileNavItems.map((item, index) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium text-left
                    transition-all duration-web transform hover:scale-105 hover:translate-x-2
                    ${location.pathname === item.path 
                      ? 'text-miles-electric bg-miles-electric/10' 
                      : 'text-text-secondary hover:text-miles-electric hover:bg-miles-electric/5'
                    }
                    group animate-fade-in-up
                  `}
                  style={{
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  {item.icon}
                  <span className="relative">
                    {item.label}
                    {location.pathname === item.path && (
                      <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-miles-electric to-gwen-pink animate-web-pulse"></span>
                    )}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;