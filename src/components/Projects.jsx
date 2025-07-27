import React, { useContext, useState, useEffect } from 'react';
import { ThemeContext } from './ThemeContext';

const Projects = () => {
  const { theme } = useContext(ThemeContext);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const projects = [
    {
      title: "Testing",
      description: "",
      image: "/images/shinobu.png",
      status: "in-progress",
      tech: [""],
      links: { github: "#" }
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-400/20';
      case 'in-progress': return 'text-yellow-400 bg-yellow-400/20';
      case 'planned': return 'text-blue-400 bg-blue-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
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
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-[var(--accent)] rounded-full blur-3xl animate-bounce-subtle"></div>
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-[var(--accent-secondary)] rounded-full blur-3xl animate-bounce-subtle" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Header */}
        <div className={`text-center mb-16 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h1 className="text-4xl md:text-6xl font-bold text-[var(--text)] mb-4">
            My <span className="gradient-text">Projects</span>
          </h1>
          <div className="h-1 w-32 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-secondary)] mx-auto mb-6 rounded-full"></div>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            Here's a collection of projects I've worked on, ranging from anime-related applications to web development experiments.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className={`glass-effect rounded-2xl overflow-hidden border border-[var(--border)] group hover:glow-effect transform transition-all duration-500 hover:scale-105 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
              style={{transitionDelay: `${index * 100}ms`}}
            >
              {/* Project Image */}
              <div className="relative overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-transparent opacity-60"></div>
                
                {/* Status Badge */}
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(project.status)}`}>
                  <i className={`${getStatusIcon(project.status)} mr-1`}></i>
                  {project.status.replace('-', ' ').toUpperCase()}
                </div>
              </div>

              {/* Project Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-[var(--text)] mb-2 group-hover:text-[var(--accent)] transition-colors">
                  {project.title}
                </h3>
                <p className="text-[var(--text-secondary)] mb-4 text-sm leading-relaxed">
                  {project.description}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-2 py-1 bg-[var(--bg-secondary)] text-[var(--accent)] text-xs rounded-full border border-[var(--border)]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="flex gap-3">
                  {project.links.github && (
                    <a
                      href={project.links.github}
                      className="flex-1 px-4 py-2 bg-[var(--bg-secondary)] text-[var(--text)] hover:text-[var(--text-hover)] rounded-lg border border-[var(--border)] hover:border-[var(--accent)] transition-all duration-300 text-center text-sm"
                    >
                      <i className="fab fa-github mr-1"></i>Code
                    </a>
                  )}
                  {project.links.demo && (
                    <a
                      href={project.links.demo}
                      className="flex-1 px-4 py-2 bg-[var(--accent)] text-[var(--bg-primary)] hover:bg-[var(--accent-secondary)] rounded-lg transition-all duration-300 text-center text-sm font-semibold"
                    >
                      <i className="fas fa-external-link-alt mr-1"></i>Demo
                    </a>
                  )}
                  {Object.keys(project.links).length === 0 && (
                    <div className="flex-1 px-4 py-2 bg-[var(--bg-secondary)]/50 text-[var(--text-secondary)] rounded-lg text-center text-sm border border-[var(--border)] cursor-not-allowed">
                      <i className="fas fa-lock mr-1"></i>Coming Soon
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className={`text-center mt-16 transform transition-all duration-1000 delay-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="glass-effect rounded-2xl p-8 border border-[var(--border)] inline-block hover:glow-effect transition-all duration-300">
            <h3 className="text-xl font-semibold text-[var(--text)] mb-4">Interested in collaborating?</h3>
            <p className="text-[var(--text-secondary)] mb-6">I'm always open to new ideas and projects!</p>
            <a
              href="https://github.com/kirixenyt"
              target="_blank"
              className="inline-flex items-center px-6 py-3 bg-[var(--accent)] text-[var(--bg-primary)] hover:bg-[var(--accent-secondary)] rounded-lg transition-all duration-300 font-semibold"
            >
              <i className="fab fa-github mr-2"></i>
              View More on GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;