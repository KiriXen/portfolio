import React, { useContext, useEffect, useState } from 'react';
import { ThemeContext } from './ThemeContext';

const Home = () => {
  const { theme } = useContext(ThemeContext);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] relative overflow-hidden">
      {/* Dynamic Background decoration */}
      <div className="absolute inset-0 opacity-5 sm:opacity-10">
        <div 
          className="absolute w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-[var(--accent)] rounded-full blur-2xl sm:blur-3xl animate-float"
          style={{
            top: `${20 + mousePosition.y * 0.1}%`,
            left: `${15 + mousePosition.x * 0.1}%`,
            animationDelay: '0s'
          }}
        ></div>
        <div 
          className="absolute w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-[var(--accent-secondary)] rounded-full blur-2xl sm:blur-3xl animate-float"
          style={{
            bottom: `${20 + mousePosition.y * 0.05}%`,
            right: `${15 + mousePosition.x * 0.05}%`,
            animationDelay: '1s'
          }}
        ></div>
        <div 
          className="absolute w-24 h-24 sm:w-36 sm:h-36 bg-[var(--accent)] rounded-full blur-xl sm:blur-2xl animate-pulse"
          style={{
            top: `${60 + mousePosition.y * 0.03}%`,
            right: `${30 + mousePosition.x * 0.03}%`,
            animationDelay: '2s'
          }}
        ></div>
      </div>
      
      <div className="container py-section relative z-10">
        {/* Hero Section */}
        <div className={`text-center transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="mb-6 sm:mb-8 md:mb-12">
            <span className="text-responsive-sm text-[var(--text-secondary)] mb-2 sm:mb-4 block animate-fade-in-down" style={{'--stagger-delay': '200ms'}}>
              Welcome to my portfolio
            </span>
            <h1 className="text-responsive-4xl sm:text-responsive-5xl lg:text-responsive-6xl font-bold text-[var(--text)] mb-4 sm:mb-6 animate-scale-in" style={{'--stagger-delay': '400ms'}}>
              Hi, I'm <span className="gradient-text">Sam</span>
            </h1>
            <div className="h-0.5 sm:h-1 w-16 sm:w-20 md:w-24 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-secondary)] mx-auto mb-4 sm:mb-6 rounded-full animate-fade-in" style={{'--stagger-delay': '600ms'}}></div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 mb-8 sm:mb-12 animate-fade-in-up" style={{'--stagger-delay': '800ms'}}>
            {[
              { icon: 'fas fa-code', text: 'Newbie Coder', delay: '900ms' },
              { icon: 'fas fa-tv', text: 'Anime Enthusiast', delay: '1000ms' },
              { icon: 'fas fa-book', text: 'Manga Reader', delay: '1100ms' }
            ].map((badge, index) => (
              <span 
                key={index}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[var(--bg-secondary)] text-[var(--accent)] rounded-full border border-[var(--border)] glass-effect hover-scale text-xs sm:text-sm md:text-base transition-all duration-300 animate-stagger"
                style={{'--stagger-delay': badge.delay}}
              >
                <i className={`${badge.icon} mr-1 sm:mr-2`}></i>
                <span className="hidden sm:inline">{badge.text}</span>
                <span className="sm:hidden">{badge.text.split(' ')[0]}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className={`flex flex-col lg:flex-row items-center justify-center gap-6 sm:gap-8 md:gap-12 mt-8 sm:mt-12 md:mt-16 transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {/* Image Section */}
          <div className="w-full max-w-sm lg:w-1/3 relative group animate-fade-in-left" style={{'--stagger-delay': '1200ms'}}>
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-secondary)] rounded-2xl blur opacity-20 group-hover:opacity-40 transition-all duration-500"></div>
            <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] group-hover:border-[var(--accent)]/50 transition-all duration-500">
              <img
                src="/images/albedo.png"
                alt="Albedo"
                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
            {/* Floating elements around image */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-[var(--accent)] rounded-full animate-pulse opacity-60"></div>
            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-[var(--accent-secondary)] rounded-full animate-bounce-subtle opacity-60"></div>
          </div>

          {/* Quote Section */}
          <div className="w-full lg:w-2/3 glass-effect rounded-2xl p-card border border-[var(--border)] hover-glow transition-all duration-500 animate-fade-in-right" style={{'--stagger-delay': '1400ms'}}>
            <div className="relative">
              <i className="fas fa-quote-left text-2xl sm:text-3xl md:text-4xl text-[var(--accent)] opacity-50 absolute -top-2 -left-2"></i>
              <h2 className="text-responsive-xl sm:text-responsive-2xl md:text-responsive-3xl font-bold text-[var(--text)] mb-4 sm:mb-6 pl-6 sm:pl-8 leading-tight">
                You can't change anything unless <span className="text-[var(--accent)]">you discard part of yourself too.</span>
              </h2>
              <p className="text-responsive-base sm:text-responsive-lg md:text-responsive-xl text-[var(--text-secondary)] mb-4 sm:mb-6 pl-6 sm:pl-8 leading-relaxed">
                To surpass monsters, <span className="text-[var(--accent-secondary)]">you must be willing to abandon your humanity.</span>
              </p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pl-6 sm:pl-8 gap-3 sm:gap-0">
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] italic">— Arima Kishou</p>
                <div className="flex gap-1.5 sm:gap-2">
                  {[0, 0.5, 1].map((delay, index) => (
                    <div 
                      key={index}
                      className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[var(--accent)] rounded-full animate-pulse" 
                      style={{animationDelay: `${delay}s`}}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className={`text-center mt-12 sm:mt-16 md:mt-20 transform transition-all duration-1000 delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="glass-effect rounded-2xl p-card border border-[var(--border)] inline-block hover-glow transition-all duration-500 animate-scale-in" style={{'--stagger-delay': '1600ms'}}>
            <h3 className="text-responsive-lg sm:text-responsive-xl font-semibold text-[var(--text)] mb-3 sm:mb-4">Let's Connect!</h3>
            <p className="text-responsive-sm text-[var(--text-secondary)] mb-4 sm:mb-6 max-w-sm mx-auto">
              Follow my journey in coding and anime
            </p>
            <div className="flex gap-3 sm:gap-4 justify-center">
              {[
                { href: 'https://github.com/kirixenyt', icon: 'fab fa-github', label: 'GitHub', delay: '1700ms' },
                { href: 'https://www.youtube.com/@kirixenyt', icon: 'fab fa-youtube', label: 'YouTube', delay: '1800ms' }
              ].map((social, index) => (
                <a 
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-[var(--bg-secondary)] text-[var(--text)] hover:text-[var(--text-hover)] rounded-lg sm:rounded-xl border border-[var(--border)] hover:border-[var(--accent)] transition-all duration-300 hover-lift animate-stagger"
                  style={{'--stagger-delay': social.delay}}
                  aria-label={social.label}
                >
                  <i className={`${social.icon} text-lg sm:text-xl group-hover:scale-110 transition-transform duration-300`}></i>
                  <span className="hidden sm:inline text-sm sm:text-base font-medium">{social.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
