import React, { useContext, useEffect, useState } from 'react';
import { ThemeContext } from './ThemeContext';

const Home = () => {
  const { theme } = useContext(ThemeContext);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[var(--accent)] rounded-full blur-3xl animate-bounce-subtle"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--accent-secondary)] rounded-full blur-3xl animate-bounce-subtle" style={{animationDelay: '1s'}}></div>
      </div>
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Hero Section */}
        <div className={`text-center transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="mb-6">
            <span className="text-lg text-[var(--text-secondary)] mb-2 block">Welcome to my portfolio</span>
            <h1 className="text-5xl md:text-7xl font-bold text-[var(--text)] mb-4">
              Hi, I'm <span className="gradient-text">Sam</span>
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-secondary)] mx-auto mb-6 rounded-full"></div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <span className="px-4 py-2 bg-[var(--bg-secondary)] text-[var(--accent)] rounded-full border border-[var(--border)] glass-effect">
              <i className="fas fa-code mr-2"></i>Newbie Coder
            </span>
            <span className="px-4 py-2 bg-[var(--bg-secondary)] text-[var(--accent)] rounded-full border border-[var(--border)] glass-effect">
              <i className="fas fa-tv mr-2"></i>Anime Enthusiast
            </span>
            <span className="px-4 py-2 bg-[var(--bg-secondary)] text-[var(--accent)] rounded-full border border-[var(--border)] glass-effect">
              <i className="fas fa-book mr-2"></i>Manga Reader
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className={`flex flex-col lg:flex-row items-center justify-center gap-12 mt-16 transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {/* Image Section */}
          <div className="lg:w-1/3 relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-secondary)] rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
            <img
              src="/images/albedo.png"
              alt="Albedo"
              className="relative w-full rounded-2xl shadow-2xl transform group-hover:scale-105 transition-all duration-500 border border-[var(--border)]"
            />
          </div>

          {/* Quote Section */}
          <div className="lg:w-2/3 glass-effect rounded-2xl p-8 border border-[var(--border)] hover:glow-effect transition-all duration-300">
            <div className="relative">
              <i className="fas fa-quote-left text-4xl text-[var(--accent)] opacity-50 absolute -top-2 -left-2"></i>
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--text)] mb-6 pl-8">
                You can't change anything unless <span className="text-[var(--accent)]">you discard part of yourself too.</span>
              </h2>
              <p className="text-lg md:text-xl text-[var(--text-secondary)] mb-6 pl-8">
                To surpass monsters, <span className="text-[var(--accent-secondary)]">you must be willing to abandon your humanity.</span>
              </p>
              <div className="flex items-center justify-between pl-8">
                <p className="text-sm text-[var(--text-secondary)] italic">— Arima Kishou</p>
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-[var(--accent)] rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-[var(--accent-secondary)] rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                  <div className="w-2 h-2 bg-[var(--accent)] rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className={`text-center mt-16 transform transition-all duration-1000 delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="glass-effect rounded-2xl p-8 border border-[var(--border)] inline-block hover:glow-effect transition-all duration-300">
            <h3 className="text-xl font-semibold text-[var(--text)] mb-4">Let's Connect!</h3>
            <div className="flex gap-4 justify-center">
              <a 
                href="https://github.com/kirixenyt" 
                target="_blank" 
                className="p-3 bg-[var(--bg-secondary)] text-[var(--text)] hover:text-[var(--text-hover)] rounded-full border border-[var(--border)] hover:border-[var(--accent)] transition-all duration-300 hover:scale-110"
              >
                <i className="fab fa-github text-xl"></i>
              </a>
              <a 
                href="https://www.youtube.com/@kirixenyt" 
                target="_blank" 
                className="p-3 bg-[var(--bg-secondary)] text-[var(--text)] hover:text-[var(--text-hover)] rounded-full border border-[var(--border)] hover:border-[var(--accent)] transition-all duration-300 hover:scale-110"
              >
                <i className="fab fa-youtube text-xl"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
