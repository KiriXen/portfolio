import React, { useContext, useEffect, useState } from 'react';
import { ThemeContext } from './ThemeContext';

const About = () => {
  const { theme } = useContext(ThemeContext);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const skills = ['React', 'JavaScript', 'CSS', 'HTML', 'Node.js', 'Git'];
  const interests = ['Anime', 'Manga', 'Light Novels', 'Gaming', 'Programming', 'Design'];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-[var(--accent)] rounded-full blur-3xl animate-bounce-subtle"></div>
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-[var(--accent-secondary)] rounded-full blur-3xl animate-bounce-subtle" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Header */}
        <div className={`text-center mb-16 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h1 className="text-4xl md:text-6xl font-bold text-[var(--text)] mb-4">
            About <span className="gradient-text">Me</span>
          </h1>
          <div className="h-1 w-24 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-secondary)] mx-auto mb-6 rounded-full"></div>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            Get to know more about who I am and what drives my passion for coding and creativity
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          <div className={`flex flex-col lg:flex-row items-center gap-12 mb-16 transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            {/* Image Section */}
            <div className="lg:w-1/3 relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-secondary)] rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
              <img
                src="/images/shinobu.png"
                alt="Shinobu"
                className="relative w-full rounded-2xl shadow-2xl transform group-hover:scale-105 transition-all duration-500 border border-[var(--border)]"
              />
            </div>

            {/* Bio Section */}
            <div className="lg:w-2/3 space-y-6">
              <div className="glass-effect rounded-2xl p-8 border border-[var(--border)]">
                <h2 className="text-2xl font-bold text-[var(--text)] mb-4 flex items-center">
                  <i className="fas fa-user-circle mr-3 text-[var(--accent)]"></i>
                  Who I Am
                </h2>
                <p className="text-lg text-[var(--text)] mb-4 leading-relaxed">
                  Hi! My name is <span className="text-[var(--accent)] font-semibold">Sam</span>, a passionate newcomer to the world of coding. 
                  I embarked on this journey to create applications that align with my personal interests and hobbies.
                </p>
                <p className="text-lg text-[var(--text)] leading-relaxed">
                  What started as curiosity has evolved into a genuine passion for web development, 
                  where I combine creativity with technical skills to build meaningful digital experiences.
                </p>
              </div>

              <div className="glass-effect rounded-2xl p-8 border border-[var(--border)]">
                <h2 className="text-2xl font-bold text-[var(--text)] mb-6 flex items-center">
                  <i className="fas fa-heart mr-3 text-[var(--accent)]"></i>
                  What I Love
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {interests.map((interest, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-[var(--bg-secondary)]/30 rounded-lg border border-[var(--border)]">
                      <div className="w-2 h-2 bg-[var(--accent)] rounded-full"></div>
                      <span className="text-[var(--text)]">{interest}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className={`mb-16 transform transition-all duration-1000 delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="glass-effect rounded-2xl p-8 border border-[var(--border)]">
              <h2 className="text-2xl font-bold text-[var(--text)] mb-6 flex items-center justify-center">
                <i className="fas fa-code mr-3 text-[var(--accent)]"></i>
                Technical Skills
              </h2>
              <div className="flex flex-wrap justify-center gap-4">
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    className="px-6 py-3 bg-[var(--bg-secondary)] text-[var(--accent)] rounded-full border border-[var(--border)] hover:glow-effect transition-all duration-300 hover:scale-105"
                  >
                    <span className="font-semibold">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className={`transform transition-all duration-1000 delay-900 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="glass-effect rounded-2xl p-8 border border-[var(--border)] text-center hover:glow-effect transition-all duration-300">
              <h2 className="text-2xl font-bold text-[var(--text)] mb-4 flex items-center justify-center">
                <i className="fas fa-handshake mr-3 text-[var(--accent)]"></i>
                Let's Connect
              </h2>
              <p className="text-lg text-[var(--text-secondary)] mb-6">
                I'm always excited to connect with fellow developers and anime enthusiasts!
              </p>
              <div className="flex justify-center gap-6">
                <a 
                  href="https://github.com/kirixenyt" 
                  target="_blank" 
                  className="group flex items-center gap-3 px-6 py-3 bg-[var(--bg-secondary)] text-[var(--text)] hover:text-[var(--text-hover)] rounded-lg border border-[var(--border)] hover:border-[var(--accent)] transition-all duration-300 hover:scale-105"
                >
                  <i className="fab fa-github text-2xl group-hover:scale-110 transition-transform"></i>
                  <span className="font-semibold">GitHub</span>
                </a>
                <a 
                  href="https://www.youtube.com/@kirixenyt" 
                  target="_blank" 
                  className="group flex items-center gap-3 px-6 py-3 bg-[var(--bg-secondary)] text-[var(--text)] hover:text-[var(--text-hover)] rounded-lg border border-[var(--border)] hover:border-[var(--accent)] transition-all duration-300 hover:scale-105"
                >
                  <i className="fab fa-youtube text-2xl group-hover:scale-110 transition-transform"></i>
                  <span className="font-semibold">YouTube</span>
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