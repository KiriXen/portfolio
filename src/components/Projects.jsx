import React, { useContext, useState, useEffect } from 'react';
import { ThemeContext } from './ThemeContext';

const Projects = () => {
  const { theme } = useContext(ThemeContext);
  const [isVisible, setIsVisible] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const projects = [
    {
      title: "",
      description: "",
      image: "/images/albedo.png",
      status: "completed",
      tech: [""],
      links: { 
        github: "https://github.com/",
        demo: ""
      },
      category: "personal"
    }
  ];

  const categories = [
    { id: 'all', name: 'All Projects', icon: 'fas fa-th' },
    { id: 'web', name: 'Web Apps', icon: 'fas fa-globe' },
    { id: 'desktop', name: 'Desktop', icon: 'fas fa-desktop' },
    { id: 'personal', name: 'Personal', icon: 'fas fa-user' },
    { id: 'entertainment', name: 'Entertainment', icon: 'fas fa-gamepad' }
  ];

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(project => project.category === filter);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-400/20 border-green-400/30';
      case 'in-progress': return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30';
      case 'planned': return 'text-blue-400 bg-blue-400/20 border-blue-400/30';
      default: return 'text-gray-400 bg-gray-400/20 border-gray-400/30';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return 'fas fa-check-circle';
      case 'in-progress': return 'fas fa-clock';
      case 'planned': return 'fas fa-lightbulb';
      default: return 'fas fa-question-circle';
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] relative overflow-hidden">
      {/* Dynamic Background decoration */}
      <div className="absolute inset-0 opacity-5 sm:opacity-10">
        <div className="absolute top-1/4 right-1/6 w-48 h-48 sm:w-64 sm:h-64 md:w-72 md:h-72 bg-[var(--accent)] rounded-full blur-2xl sm:blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 left-1/6 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-[var(--accent-secondary)] rounded-full blur-2xl sm:blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-2/3 right-1/3 w-32 h-32 sm:w-40 sm:h-40 bg-[var(--accent)] rounded-full blur-xl sm:blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="container py-section relative z-10">
        {/* Header */}
        <div className={`text-center mb-8 sm:mb-12 md:mb-16 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h1 className="text-responsive-4xl sm:text-responsive-5xl md:text-responsive-6xl font-bold text-[var(--text)] mb-4 sm:mb-6 animate-scale-in">
            My <span className="gradient-text">Projects</span>
          </h1>
          <div className="h-0.5 sm:h-1 w-20 sm:w-24 md:w-32 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-secondary)] mx-auto mb-4 sm:mb-6 rounded-full animate-fade-in"></div>
          <p className="text-responsive-base sm:text-responsive-lg text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{'--stagger-delay': '200ms'}}>
            Here's a collection of projects I've worked on, ranging from anime-related applications to web development experiments.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className={`flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 mb-8 sm:mb-12 transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {categories.map((category, index) => (
            <button
              key={category.id}
              onClick={() => setFilter(category.id)}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border transition-all duration-300 text-xs sm:text-sm md:text-base font-medium hover-scale animate-stagger ${
                filter === category.id
                  ? 'bg-[var(--accent)] text-[var(--bg-primary)] border-[var(--accent)]'
                  : 'bg-[var(--bg-secondary)] text-[var(--text)] border-[var(--border)] hover:border-[var(--accent)]'
              }`}
              style={{'--stagger-delay': `${400 + index * 100}ms`}}
            >
              <i className={`${category.icon} text-xs sm:text-sm`}></i>
              <span className="hidden sm:inline">{category.name}</span>
              <span className="sm:hidden">{category.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {filteredProjects.map((project, index) => (
            <div
              key={index}
              className={`glass-effect rounded-2xl overflow-hidden border border-[var(--border)] group hover-glow transform transition-all duration-500 hover-lift ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
              style={{transitionDelay: `${600 + index * 100}ms`}}
            >
              {/* Project Image */}
              <div className="relative overflow-hidden h-40 sm:h-48 md:h-52">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)]/80 via-transparent to-transparent"></div>
                
                {/* Status Badge */}
                <div className={`absolute top-3 sm:top-4 right-3 sm:right-4 px-2 sm:px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm ${getStatusColor(project.status)}`}>
                  <i className={`${getStatusIcon(project.status)} mr-1`}></i>
                  <span className="hidden sm:inline">{project.status.replace('-', ' ').toUpperCase()}</span>
                  <span className="sm:hidden">{project.status === 'in-progress' ? 'WIP' : project.status.toUpperCase()}</span>
                </div>

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-[var(--accent)]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-white text-center">
                    <i className="fas fa-eye text-2xl sm:text-3xl mb-2"></i>
                    <p className="text-sm font-semibold">View Project</p>
                  </div>
                </div>
              </div>

              {/* Project Content */}
              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-[var(--text)] mb-2 sm:mb-3 group-hover:text-[var(--accent)] transition-colors leading-tight">
                  {project.title}
                </h3>
                <p className="text-[var(--text-secondary)] mb-3 sm:mb-4 text-sm sm:text-base leading-relaxed line-clamp-3">
                  {project.description}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
                  {project.tech.filter(tech => tech).map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-2 sm:px-3 py-1 bg-[var(--bg-secondary)] text-[var(--accent)] text-xs sm:text-sm rounded-full border border-[var(--border)] font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="flex gap-2 sm:gap-3">
                  {project.links.github && (
                    <a
                      href={project.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-3 sm:px-4 py-2 bg-[var(--bg-secondary)] text-[var(--text)] hover:text-[var(--text-hover)] rounded-lg border border-[var(--border)] hover:border-[var(--accent)] transition-all duration-300 text-center text-xs sm:text-sm font-medium group/btn"
                      aria-label={`View ${project.title} source code`}
                    >
                      <i className="fab fa-github mr-1 group-hover/btn:scale-110 transition-transform"></i>
                      <span>Code</span>
                    </a>
                  )}
                  {project.links.demo && (
                    <a
                      href={project.links.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-3 sm:px-4 py-2 bg-[var(--accent)] text-[var(--bg-primary)] hover:bg-[var(--accent-secondary)] rounded-lg transition-all duration-300 text-center text-xs sm:text-sm font-semibold group/btn"
                      aria-label={`View ${project.title} live demo`}
                    >
                      <i className="fas fa-external-link-alt mr-1 group-hover/btn:scale-110 transition-transform"></i>
                      <span>Demo</span>
                    </a>
                  )}
                  {Object.keys(project.links).length === 0 && (
                    <div className="flex-1 px-3 sm:px-4 py-2 bg-[var(--bg-secondary)]/50 text-[var(--text-secondary)] rounded-lg text-center text-xs sm:text-sm border border-[var(--border)] cursor-not-allowed font-medium">
                      <i className="fas fa-lock mr-1"></i>
                      <span>Coming Soon</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-12 sm:py-16">
            <div className="glass-effect rounded-2xl p-6 sm:p-8 border border-[var(--border)] inline-block">
              <i className="fas fa-search text-4xl sm:text-5xl text-[var(--text-secondary)] mb-4"></i>
              <h3 className="text-lg sm:text-xl font-semibold text-[var(--text)] mb-2">No projects found</h3>
              <p className="text-[var(--text-secondary)] text-sm sm:text-base">Try selecting a different category</p>
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className={`text-center mt-12 sm:mt-16 md:mt-20 transform transition-all duration-1000 delay-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="glass-effect rounded-2xl p-card border border-[var(--border)] inline-block hover-glow transition-all duration-500 animate-scale-in" style={{'--stagger-delay': '1200ms'}}>
            <h3 className="text-responsive-lg sm:text-responsive-xl font-semibold text-[var(--text)] mb-3 sm:mb-4">Interested in collaborating?</h3>
            <p className="text-[var(--text-secondary)] mb-4 sm:mb-6 text-responsive-sm max-w-md mx-auto leading-relaxed">
              I'm always open to new ideas and projects! Let's build something amazing together.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <a
                href="https://github.com/kirixen"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-[var(--accent)] text-[var(--bg-primary)] hover:bg-[var(--accent-secondary)] rounded-lg transition-all duration-300 font-semibold text-sm sm:text-base hover-lift"
                aria-label="View more projects on GitHub"
              >
                <i className="fab fa-github mr-2 group-hover:scale-110 transition-transform"></i>
                <span>View More on GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;