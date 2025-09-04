import React, { useContext, useEffect, useState, useMemo } from 'react';
import { ThemeContext } from './ThemeContext';

const Home = () => {
  const { theme } = useContext(ThemeContext);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const isLowEndDevice = useMemo(() => {
    return navigator.hardwareConcurrency <= 4 || navigator.deviceMemory <= 4 ||
           (navigator.userAgent.includes('Intel') && navigator.hardwareConcurrency <= 8);
  }, []);

  const reduceMotion = useMemo(() => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    let lastUpdate = 0;
    const handleMouseMove = (e) => {
      const now = Date.now();
      if (isLowEndDevice && now - lastUpdate < 100) return;
      if (!isLowEndDevice && now - lastUpdate < 50) return;
      
      lastUpdate = now;
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    if (!reduceMotion) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
    }
    
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isLowEndDevice, reduceMotion]);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] relative overflow-hidden page-container">
      <div className="absolute inset-0 opacity-5 sm:opacity-10">
        <div className="absolute top-0 left-0 w-32 h-32 opacity-20">
          <svg viewBox="0 0 120 120" className="w-full h-full">
            <g stroke={theme.text} strokeWidth="1" fill="none" opacity="0.4">
              <line x1="0" y1="0" x2="60" y2="60" />
              <line x1="0" y1="30" x2="60" y2="60" />
              <line x1="30" y1="0" x2="60" y2="60" />
              <path d="M0,0 Q30,15 60,0" />
              <path d="M0,0 Q15,30 0,60" />
              <path d="M0,20 Q20,25 40,20" />
              <path d="M20,0 Q25,20 20,40" />
            </g>
          </svg>
        </div>
        
        <div className="absolute top-0 right-0 w-32 h-32 opacity-20 transform scale-x-[-1]">
          <svg viewBox="0 0 120 120" className="w-full h-full">
            <g stroke={theme.text} strokeWidth="1" fill="none" opacity="0.4">
              <line x1="0" y1="0" x2="60" y2="60" />
              <line x1="0" y1="30" x2="60" y2="60" />
              <line x1="30" y1="0" x2="60" y2="60" />
              <path d="M0,0 Q30,15 60,0" />
              <path d="M0,0 Q15,30 0,60" />
              <path d="M0,20 Q20,25 40,20" />
              <path d="M20,0 Q25,20 20,40" />
            </g>
          </svg>
        </div>

        <div className="absolute bottom-0 left-0 w-32 h-32 opacity-20 transform scale-y-[-1]">
          <svg viewBox="0 0 120 120" className="w-full h-full">
            <g stroke={theme.text} strokeWidth="1" fill="none" opacity="0.4">
              <line x1="0" y1="0" x2="60" y2="60" />
              <line x1="0" y1="30" x2="60" y2="60" />
              <line x1="30" y1="0" x2="60" y2="60" />
              <path d="M0,0 Q30,15 60,0" />
              <path d="M0,0 Q15,30 0,60" />
              <path d="M0,20 Q20,25 40,20" />
              <path d="M20,0 Q25,20 20,40" />
            </g>
          </svg>
        </div>

        <div className="absolute bottom-0 right-0 w-32 h-32 opacity-20 transform scale-[-1]">
          <svg viewBox="0 0 120 120" className="w-full h-full">
            <g stroke={theme.text} strokeWidth="1" fill="none" opacity="0.4">
              <line x1="0" y1="0" x2="60" y2="60" />
              <line x1="0" y1="30" x2="60" y2="60" />
              <line x1="30" y1="0" x2="60" y2="60" />
              <path d="M0,0 Q30,15 60,0" />
              <path d="M0,0 Q15,30 0,60" />
              <path d="M0,20 Q20,25 40,20" />
              <path d="M20,0 Q25,20 20,40" />
            </g>
          </svg>
        </div>
        
        {!reduceMotion && (
          <>
            <div 
              className="absolute w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-secondary)] rounded-full blur-2xl sm:blur-3xl animate-float"
              style={{
                top: `${20 + (isLowEndDevice ? 0 : mousePosition.y * 0.05)}%`,
                left: `${15 + (isLowEndDevice ? 0 : mousePosition.x * 0.05)}%`,
                animationDelay: '0s',
                animationDuration: isLowEndDevice ? '8s' : '6s',
                willChange: isLowEndDevice ? 'auto' : 'transform'
              }}
            ></div>
            <div 
              className="absolute w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-gradient-to-r from-[var(--accent-secondary)] to-[var(--accent)] rounded-full blur-2xl sm:blur-3xl animate-float"
              style={{
                bottom: `${20 + (isLowEndDevice ? 0 : mousePosition.y * 0.03)}%`,
                right: `${15 + (isLowEndDevice ? 0 : mousePosition.x * 0.03)}%`,
                animationDelay: '1s',
                animationDuration: isLowEndDevice ? '10s' : '8s',
                willChange: isLowEndDevice ? 'auto' : 'transform'
              }}
            ></div>
            {!isLowEndDevice && (
              <>
                <div 
                  className="absolute w-24 h-24 sm:w-36 sm:h-36 bg-gradient-to-r from-[var(--accent)] via-[var(--accent-secondary)] to-[var(--accent)] rounded-full blur-xl sm:blur-2xl animate-pulse"
                  style={{
                    top: `${60 + mousePosition.y * 0.02}%`,
                    right: `${30 + mousePosition.x * 0.02}%`,
                    animationDelay: '2s',
                    animationDuration: '4s'
                  }}
                ></div>
                <div 
                  className="absolute w-20 h-20 sm:w-28 sm:h-28 bg-[var(--accent-secondary)] rounded-full blur-xl animate-bounce"
                  style={{
                    bottom: `${40 + mousePosition.y * 0.01}%`,
                    left: `${40 + mousePosition.x * 0.01}%`,
                    animationDelay: '3s',
                    animationDuration: '3s'
                  }}
                ></div>
              </>
            )}
          </>
        )}
      </div>
      
      <div className="container page-content relative z-10">
        <div className={`text-center transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="mb-6 sm:mb-8 md:mb-12 relative">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-text mb-4 sm:mb-6 animate-scale-in-bounce animate-stagger-2 relative">
              Hi, I'm{' '}
              <span className="gradient-text animate-shimmer relative inline-block group">
                Sam
                <div className="absolute -inset-1 bg-gradient-to-r from-miles-electric via-gwen-pink to-miles-purple rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
              </span>
            </h1>
            
            <div className="relative mb-8 sm:mb-10">
              <div className="h-1 w-32 sm:w-40 md:w-48 bg-gradient-to-r from-miles-electric via-gwen-pink to-miles-purple mx-auto rounded-full animate-fade-in animate-stagger-3 animate-glow relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-slide-right"></div>
              </div>
              <div className="absolute left-1/2 transform -translate-x-1/2 -top-1 w-3 h-3 bg-[var(--accent)] rounded-full animate-pulse"></div>
              <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-1 w-2 h-2 bg-[var(--accent-secondary)] rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
            </div>
            
            <p className="text-sm sm:text-base md:text-lg text-text-secondary max-w-3xl mx-auto mb-6 sm:mb-8 animate-fade-in-up animate-stagger-4 leading-relaxed">
              With great power comes great responsibility... and great code!<br/>
            </p>
          </div>
        </div>

        <div className={`flex flex-col lg:flex-row items-center justify-center gap-8 sm:gap-12 md:gap-16 mt-12 sm:mt-16 md:mt-20 transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="w-full max-w-md lg:w-2/5 relative group animate-fade-in-left" style={{'--stagger-delay': '1200ms'}}>
            <div className="absolute -inset-1 bg-gradient-to-r from-[var(--accent)] via-[var(--accent-secondary)] to-[var(--accent)] rounded-3xl blur-lg opacity-30 group-hover:opacity-60 transition-all duration-700 animate-tilt"></div>
            <div className="relative overflow-hidden rounded-3xl border-2 border-[var(--border)] group-hover:border-[var(--accent)]/70 transition-all duration-700 bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-primary)]">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/5 to-transparent"></div>
              <img
                src="/images/albedo.png"
                alt="Albedo - The Overlord Character"
                className="w-full h-auto object-cover transform group-hover:scale-110 transition-transform duration-1000 relative z-10"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              <div className="absolute -top-3 -right-3 w-6 h-6 bg-[var(--accent)] rounded-full animate-pulse opacity-80 group-hover:animate-ping"></div>
              <div className="absolute -bottom-3 -left-3 w-4 h-4 bg-[var(--accent-secondary)] rounded-full animate-bounce-subtle opacity-80"></div>
              <div className="absolute top-1/4 -left-2 w-3 h-3 bg-gradient-to-r from-miles-electric to-gwen-pink rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
              <div className="absolute bottom-1/4 -right-2 w-3 h-3 bg-gradient-to-r from-gwen-pink to-miles-purple rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
            </div>
          </div>

          <div className="w-full lg:w-3/5 relative animate-fade-in-right" style={{'--stagger-delay': '1400ms'}}>
            <div className="absolute -inset-1 bg-gradient-to-r from-[var(--accent-secondary)] to-[var(--accent)] rounded-3xl blur opacity-20 group-hover:opacity-40 transition-all duration-700"></div>
            <div className="relative glass-effect rounded-3xl p-8 sm:p-10 md:p-12 border border-[var(--border)] hover-glow transition-all duration-700 group hover:border-[var(--accent)]/50 backdrop-blur-xl">
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-br from-[var(--accent)] to-[var(--accent-secondary)] rounded-full flex items-center justify-center shadow-lg">
                <i className="fas fa-quote-left text-white text-sm"></i>
              </div>
              
              <div className="relative">
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[var(--text)] mb-6 sm:mb-8 leading-tight group-hover:text-[var(--accent)] transition-colors duration-500">
                  And when I feel alone, like{' '}
                  <span className="text-[var(--accent)] relative">
                    no one understands what I'm going through,
                    <div className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-secondary)] group-hover:w-full transition-all duration-1000 rounded-full"></div>
                  </span>
                  {' '}I remember my friends who get it.
                </h2>
                
                <p className="text-sm sm:text-base md:text-lg text-[var(--text-secondary)] mb-8 leading-relaxed">
                  Sometimes the greatest strength comes from{' '}
                  <span className="text-[var(--accent-secondary)] font-semibold">
                    knowing you're not alone in your journey.
                  </span>
                </p>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 pt-6 border-t border-[var(--border)]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[var(--accent)] to-[var(--accent-secondary)] rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">MM</span>
                    </div>
                    <div>
                      <p className="text-sm sm:text-base text-[var(--text-secondary)] italic font-medium">— Miles Morales</p>
                      <p className="text-xs text-[var(--text-secondary)]/60">Spider-Man: Into the Spider-Verse</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 sm:gap-3">
                    {[0, 0.5, 1].map((delay, index) => (
                      <div 
                        key={index}
                        className="w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-secondary)] rounded-full animate-pulse" 
                        style={{animationDelay: `${delay}s`}}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={`text-center mt-16 sm:mt-20 md:mt-24 transform transition-all duration-1000 delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-miles-electric via-gwen-pink to-miles-purple rounded-3xl blur opacity-25 animate-tilt"></div>
            <div className="relative glass-effect rounded-3xl p-8 sm:p-10 md:p-12 border border-[var(--border)] hover-glow transition-all duration-700 animate-scale-in backdrop-blur-xl group" style={{'--stagger-delay': '1600ms'}}>
              
              <div className="mb-8">
                <div className="inline-flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[var(--accent)] to-[var(--accent-secondary)] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <span className="text-2xl">W</span>
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors duration-500">
                    Let's Connect!
                  </h3>
                </div>
                <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-md mx-auto leading-relaxed">
                  Join me on my journey through the{' '}
                  <span className="text-[var(--accent)]">multiverse</span> of coding and anime adventures
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
                {[
                  { 
                    href: 'https://github.com/kirixen', 
                    icon: 'fab fa-github', 
                    label: 'GitHub', 
                    delay: '1700ms',
                    color: 'from-gray-600 to-gray-800',
                    hoverColor: 'hover:from-miles-electric hover:to-gwen-pink',
                    description: 'Code Repository'
                  },
                  { 
                    href: 'https://www.youtube.com/@kirixenyt', 
                    icon: 'fab fa-youtube', 
                    label: 'YouTube', 
                    delay: '1800ms',
                    color: 'from-red-600 to-red-700',
                    hoverColor: 'hover:from-gwen-pink hover:to-miles-purple',
                    description: 'Video Content'
                  }
                ].map((social, index) => (
                  <div key={index} className="relative group/social">
                    <div className={`absolute -inset-0.5 bg-gradient-to-r ${social.color} rounded-2xl blur opacity-40 group-hover/social:opacity-100 transition duration-1000 group-hover/social:duration-200`}></div>
                    <a 
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`relative flex items-center gap-4 px-6 sm:px-8 py-4 sm:py-5 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border)] group-hover/social:border-[var(--accent)] transition-all duration-500 hover-lift animate-stagger backdrop-blur-sm group-hover/social:shadow-2xl`}
                      style={{'--stagger-delay': social.delay}}
                      aria-label={social.label}
                    >
                      <div className={`w-12 h-12 bg-gradient-to-br ${social.color} ${social.hoverColor} rounded-xl flex items-center justify-center group-hover/social:scale-110 transition-all duration-500 shadow-lg`}>
                        <i className={`${social.icon} text-white text-xl group-hover/social:animate-pulse`}></i>
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-sm sm:text-base font-bold text-[var(--text)] group-hover/social:text-[var(--accent)] transition-colors duration-300">
                          {social.label}
                        </span>
                        <span className="text-sm text-[var(--text-secondary)] opacity-80">
                          {social.description}
                        </span>
                        <div className="h-0.5 w-0 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-secondary)] group-hover/social:w-full transition-all duration-500 rounded-full mt-1"></div>
                      </div>
                      <div className="ml-auto">
                        <i className="fas fa-arrow-right text-[var(--text-secondary)] group-hover/social:text-[var(--accent)] group-hover/social:translate-x-1 transition-all duration-300"></i>
                      </div>
                    </a>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 flex items-center justify-center gap-2">
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent"></div>
                <span className="text-2xl">•</span>
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
