import React, { useContext } from 'react';
import { ThemeContext } from './ThemeContext';
import { FaSpider, FaGithub, FaYoutube, FaHeart } from 'react-icons/fa';

const Footer = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <footer className="bg-[var(--bg-primary)] py-8 relative overflow-hidden">
      {/* Subtle Spider Web Background */}
      <div className="spider-web opacity-5"></div>
      
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center relative z-10 space-y-6 md:space-y-0">
        <div className="text-[var(--text)] text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start mb-3">
            <FaSpider className="text-[var(--accent)] mr-2 text-lg animate-spider-swing" />
            <h3 className="gradient-text font-bold text-lg">Sammy's Portfolio</h3>
          </div>
          <p className="text-[var(--text-secondary)] text-xs flex items-center justify-center md:justify-start">
            Made with <FaHeart className="text-[var(--accent)] animate-pulse mx-1 text-sm" />
          </p>
        </div>
        
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-8">
            <a 
              href="https://github.com/kirixen" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[var(--text)] hover:text-[var(--accent)] transition-all duration-300 hover:scale-110 group"
              aria-label="GitHub Profile"
            >
              <FaGithub className="text-2xl group-hover:animate-spider-glitch" />
            </a>
            <a 
              href="https://www.youtube.com/@kirixenyt" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[var(--text)] hover:text-[var(--accent)] transition-all duration-300 hover:scale-110 group"
              aria-label="YouTube Channel"
            >
              <FaYoutube className="text-2xl group-hover:animate-electric-charge" />
            </a>
          </div>
          <div className="text-center">
            <p className="text-[var(--text-secondary)] text-sm font-medium">© 2025 Spider-Dev Portfolio</p>
          </div>
        </div>
      </div>
      
      {/* Subtle animated spider */}
      <div className="absolute bottom-4 right-6 opacity-40">
        <FaSpider className="text-[var(--accent)] text-sm animate-spider-swing" />
      </div>
    </footer>
  );
};

export default Footer;