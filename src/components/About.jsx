import React, { useContext, useEffect, useState } from 'react';
import { ThemeContext } from './ThemeContext';
import GitHubStats from './GitHubStats';

const About = () => {
  const { theme } = useContext(ThemeContext);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredSkill, setHoveredSkill] = useState(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const skills = [
    { name: 'React', level: 70, icon: 'fab fa-react', color: 'from-blue-400 to-cyan-400' },
    { name: 'JavaScript', level: 75, icon: 'fab fa-js-square', color: 'from-yellow-400 to-orange-400' },  
    { name: 'CSS', level: 80, icon: 'fab fa-css3-alt', color: 'from-blue-500 to-purple-500' },
    { name: 'HTML', level: 85, icon: 'fab fa-html5', color: 'from-red-500 to-pink-500' },
    { name: 'Node.js', level: 60, icon: 'fab fa-node-js', color: 'from-green-400 to-emerald-400' },
    { name: 'Git', level: 65, icon: 'fab fa-git-alt', color: 'from-orange-500 to-red-500' }
  ];
  
  const interests = [
    { name: 'Anime', icon: 'fas fa-tv', color: 'from-pink-500 to-rose-500' },
    { name: 'Manga', icon: 'fas fa-book', color: 'from-indigo-500 to-purple-500' },
    { name: 'Light Novels', icon: 'fas fa-book-open', color: 'from-violet-500 to-purple-500' },
    { name: 'Gaming', icon: 'fas fa-gamepad', color: 'from-green-500 to-teal-500' },
    { name: 'Programming', icon: 'fas fa-code', color: 'from-blue-500 to-cyan-500' },
    { name: 'Design', icon: 'fas fa-paint-brush', color: 'from-red-500 to-pink-500' }
  ];

  return (
    <div className="page-container">
      <div className="absolute inset-0 opacity-5 sm:opacity-10">
        <div className="absolute top-1/4 left-1/6 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 bg-[var(--accent)] rounded-full blur-2xl sm:blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/6 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-[var(--accent-secondary)] rounded-full blur-2xl sm:blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-2/3 left-1/2 w-24 h-24 sm:w-32 sm:h-32 bg-[var(--accent)] rounded-full blur-xl sm:blur-2xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="page-content">{/* Applied page-content class for proper spacing */}
        <div className={`text-center mb-6 sm:mb-8 md:mb-10 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--text)] mb-3 sm:mb-4 animate-scale-in">
            About <span className="gradient-text">Me</span>
          </h1>
          <div className="h-0.5 sm:h-1 w-16 sm:w-20 md:w-24 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-secondary)] mx-auto mb-3 sm:mb-4 rounded-full animate-fade-in"></div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className={`flex flex-col lg:flex-row items-center gap-6 sm:gap-8 md:gap-12 mb-8 sm:mb-12 md:mb-16 transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="w-full max-w-sm lg:w-1/3 relative group animate-fade-in-left" style={{'--stagger-delay': '500ms'}}>
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-secondary)] rounded-2xl blur opacity-20 group-hover:opacity-40 transition-all duration-500"></div>
              <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] group-hover:border-[var(--accent)]/50 transition-all duration-500">
                <img
                  src="/images/sam.jpg"
                  alt="Sam"
                  className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <div className="absolute -top-4 -right-4 w-6 h-6 sm:w-8 sm:h-8 bg-[var(--accent)] rounded-full animate-pulse opacity-60"></div>
              <div className="absolute -bottom-4 -left-4 w-4 h-4 sm:w-6 sm:h-6 bg-[var(--accent-secondary)] rounded-full animate-bounce-subtle opacity-60"></div>
            </div>

            <div className="w-full lg:w-2/3 space-y-4 sm:space-y-6 animate-fade-in-right" style={{'--stagger-delay': '700ms'}}>
              <div className="glass-effect rounded-2xl p-card border border-[var(--border)] hover-glow transition-all duration-500">
                <h2 className="text-responsive-xl sm:text-responsive-2xl font-bold text-[var(--text)] mb-3 sm:mb-4 flex items-center">
                  <i className="fas fa-user-circle mr-2 sm:mr-3 text-[var(--accent)] text-xl sm:text-2xl"></i>
                  <span>Who I Am</span>
                </h2>
                <p className="text-responsive-base sm:text-responsive-lg text-[var(--text)] mb-3 sm:mb-4 leading-relaxed">
                  Supp cuhh, the name is <span className="text-[var(--accent)] font-semibold">Sam</span>, yuhhh.
                </p>
              </div>

              <div className="glass-effect rounded-2xl p-card border border-[var(--border)] hover:border-[var(--accent)]/50 transition-all duration-500 group">
                <h2 className="text-responsive-xl sm:text-responsive-2xl font-bold text-[var(--text)] mb-4 sm:mb-6 flex items-center group-hover:text-[var(--accent)] transition-colors duration-500">
                  <i className="fas fa-heart mr-2 sm:mr-3 text-[var(--accent)] text-xl sm:text-2xl group-hover:animate-pulse"></i>
                  <span>What I Love</span>
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                  {interests.map((interest, index) => (
                    <div 
                      key={index} 
                      className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-[var(--bg-secondary)]/30 rounded-lg border border-[var(--border)] hover:border-[var(--accent)]/50 hover:scale-110 hover:shadow-lg transition-all duration-500 animate-scale-in group/item relative overflow-hidden"
                      style={{ animationDelay: `${800 + index * 100}ms` }}
                    >
                      <i className={`${interest.icon} text-[var(--accent)] text-sm sm:text-base group-hover/item:rotate-12 transition-transform duration-300 relative z-10`}></i>
                      <span className="text-[var(--text)] text-xs sm:text-sm md:text-base font-medium relative z-10 group-hover/item:font-semibold transition-all duration-300">{interest.name}</span>
                      <div className={`absolute inset-0 bg-gradient-to-r ${interest.color} opacity-0 group-hover/item:opacity-20 transition-opacity duration-500`}></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className={`mb-8 sm:mb-12 md:mb-16 transform transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <GitHubStats />
          </div>

          <div className={`transform transition-all duration-1000 delay-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="glass-effect rounded-2xl p-card border border-[var(--border)] text-center hover-glow transition-all duration-500 animate-scale-in" style={{'--stagger-delay': '1800ms'}}>
              <h2 className="text-responsive-xl sm:text-responsive-2xl font-bold text-[var(--text)] mb-3 sm:mb-4 flex items-center justify-center">
                <i className="fas fa-handshake mr-2 sm:mr-3 text-[var(--accent)] text-xl sm:text-2xl"></i>
                <span>Let's Connect</span>
              </h2>
              <p className="text-responsive-base sm:text-responsive-lg text-[var(--text-secondary)] mb-4 sm:mb-6 leading-relaxed">
                I'm always excited to connect with fellow developers and anime enthusiasts!
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 md:gap-6">
                <a 
                  href="https://github.com/kirixen" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 bg-[var(--bg-secondary)] text-[var(--text)] hover:text-[var(--text-hover)] rounded-lg sm:rounded-xl border border-[var(--border)] hover:border-[var(--accent)] transition-all duration-300 hover-lift animate-stagger"
                  style={{'--stagger-delay': '1900ms'}}
                  aria-label="GitHub Profile"
                >
                  <i className="fab fa-github text-lg sm:text-xl md:text-2xl group-hover:scale-110 transition-transform"></i>
                  <span className="font-semibold text-sm sm:text-base">GitHub</span>
                </a>
                <a 
                  href="https://www.youtube.com/@kirixenyt" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 bg-[var(--bg-secondary)] text-[var(--text)] hover:text-[var(--text-hover)] rounded-lg sm:rounded-xl border border-[var(--border)] hover:border-[var(--accent)] transition-all duration-300 hover-lift animate-stagger"
                  style={{'--stagger-delay': '2000ms'}}
                  aria-label="YouTube Channel"
                >
                  <i className="fab fa-youtube text-lg sm:text-xl md:text-2xl group-hover:scale-110 transition-transform"></i>
                  <span className="font-semibold text-sm sm:text-base">YouTube</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;