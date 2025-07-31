import React from 'react';
import { useContext } from 'react';
import { ThemeContext } from './ThemeContext';
import useGitHubStats from '../hooks/Stats';

const GitHubStats = () => {
  const { theme } = useContext(ThemeContext);
  const { user, repos, totalStars, totalForks, totalCommits, languages, loading, error, refreshStats } = useGitHubStats();

  if (loading) {
    return (
      <div className="glass-effect rounded-2xl p-card border border-[var(--border)] animate-pulse">
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: theme.accent, borderTopColor: 'transparent' }}></div>
            <p className="text-[var(--text-secondary)] text-sm">Loading GitHub stats...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-effect rounded-2xl p-card border border-red-500/30 bg-red-500/5">
        <div className="text-center py-6">
          <i className="fas fa-exclamation-triangle text-red-400 text-2xl mb-3"></i>
          <p className="text-red-400 mb-4">Failed to load GitHub stats</p>
          <button
            onClick={refreshStats}
            className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const getLanguageColor = (language) => {
    const colors = {
      JavaScript: '#f7df1e',
      TypeScript: '#3178c6',
      React: '#61dafb',
      HTML: '#e34c26',
      CSS: '#1572b6',
      Python: '#3776ab',
      Java: '#ed8b00',
      'C++': '#00599c',
      PHP: '#777bb4',
      Ruby: '#cc342d',
      Go: '#00add8',
      Rust: '#000000',
      Swift: '#fa7343',
      Kotlin: '#7f52ff',
      Vue: '#4fc08d',
      Angular: '#dd0031',
      Svelte: '#ff3e00',
    };
    return colors[language] || theme.accent;
  };

  return (
    <div className="space-y-6">
      <div className="glass-effect rounded-2xl p-card border border-[var(--border)] hover-glow transition-all duration-500">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-responsive-xl sm:text-responsive-2xl font-bold text-[var(--text)] flex items-center">
            <i className="fab fa-github mr-3 text-[var(--accent)] text-xl sm:text-2xl"></i>
            <span>GitHub Stats</span>
          </h2>
          <button
            onClick={refreshStats}
            className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
            title="Refresh stats"
          >
            <i className="fas fa-sync-alt"></i>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="flex-shrink-0">
            <img
              src={user.avatar_url}
              alt={user.name || user.login}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-[var(--accent)]/30"
            />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-lg sm:text-xl font-bold text-[var(--text)] mb-2">
              {user.name || user.login}
            </h3>
            <p className="text-[var(--text-secondary)] mb-3">
              {user.bio || 'Passionate developer'}
            </p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-sm">
              <div className="flex items-center gap-2">
                <i className="fas fa-users text-[var(--accent)]"></i>
                <span className="text-[var(--text)]">{formatNumber(user.followers)} followers</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="fas fa-user-plus text-[var(--accent)]"></i>
                <span className="text-[var(--text)]">{formatNumber(user.following)} following</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="fas fa-calendar text-[var(--accent)]"></i>
                <span className="text-[var(--text)]">
                  Joined {new Date(user.created_at).getFullYear()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-effect rounded-xl p-4 border border-[var(--border)] text-center hover-lift transition-all duration-300">
          <i className="fas fa-code-branch text-2xl text-[var(--accent)] mb-2"></i>
          <div className="text-xl sm:text-2xl font-bold text-[var(--text)]">{user.public_repos}</div>
          <div className="text-xs sm:text-sm text-[var(--text-secondary)]">Repositories</div>
        </div>
        
        <div className="glass-effect rounded-xl p-4 border border-[var(--border)] text-center hover-lift transition-all duration-300">
          <i className="fas fa-star text-2xl text-yellow-400 mb-2"></i>
          <div className="text-xl sm:text-2xl font-bold text-[var(--text)]">{formatNumber(totalStars)}</div>
          <div className="text-xs sm:text-sm text-[var(--text-secondary)]">Total Stars</div>
        </div>
        
        <div className="glass-effect rounded-xl p-4 border border-[var(--border)] text-center hover-lift transition-all duration-300">
          <i className="fas fa-code-branch text-2xl text-green-400 mb-2"></i>
          <div className="text-xl sm:text-2xl font-bold text-[var(--text)]">{formatNumber(totalForks)}</div>
          <div className="text-xs sm:text-sm text-[var(--text-secondary)]">Total Forks</div>
        </div>
        
        <div className="glass-effect rounded-xl p-4 border border-[var(--border)] text-center hover-lift transition-all duration-300">
          <i className="fas fa-commit text-2xl text-purple-400 mb-2"></i>
          <div className="text-xl sm:text-2xl font-bold text-[var(--text)]">{formatNumber(totalCommits)}+</div>
          <div className="text-xs sm:text-sm text-[var(--text-secondary)]">Recent Commits</div>
        </div>
      </div>

      {Object.keys(languages).length > 0 && (
        <div className="glass-effect rounded-2xl p-card border border-[var(--border)] hover-glow transition-all duration-500">
          <h3 className="text-lg sm:text-xl font-bold text-[var(--text)] mb-4 flex items-center">
            <i className="fas fa-code mr-3 text-[var(--accent)]"></i>
            Top Languages
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.entries(languages).map(([language, count]) => (
              <div
                key={language}
                className="flex items-center gap-3 p-3 bg-[var(--bg-secondary)]/30 rounded-lg border border-[var(--border)] hover:border-[var(--accent)]/50 transition-all duration-300"
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: getLanguageColor(language) }}
                ></div>
                <span className="text-[var(--text)] font-medium flex-1">{language}</span>
                <span className="text-[var(--text-secondary)] text-sm">{count} repos</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {repos.length > 0 && (
        <div className="glass-effect rounded-2xl p-card border border-[var(--border)] hover-glow transition-all duration-500">
          <h3 className="text-lg sm:text-xl font-bold text-[var(--text)] mb-4 flex items-center">
            <i className="fas fa-folder mr-3 text-[var(--accent)]"></i>
            Recent Projects
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {repos.slice(0, 4).map((repo) => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 bg-[var(--bg-secondary)]/30 rounded-lg border border-[var(--border)] hover:border-[var(--accent)]/50 transition-all duration-300 hover-lift group"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                    {repo.name}
                  </h4>
                  <i className="fas fa-external-link-alt text-[var(--text-secondary)] text-xs"></i>
                </div>
                
                {repo.description && (
                  <p className="text-[var(--text-secondary)] text-sm mb-3 line-clamp-2">
                    {repo.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    {repo.language && (
                      <div className="flex items-center gap-1">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: getLanguageColor(repo.language) }}
                        ></div>
                        <span className="text-[var(--text-secondary)]">{repo.language}</span>
                      </div>
                    )}
                    {repo.stargazers_count > 0 && (
                      <div className="flex items-center gap-1">
                        <i className="fas fa-star text-yellow-400"></i>
                        <span className="text-[var(--text-secondary)]">{repo.stargazers_count}</span>
                      </div>
                    )}
                    {repo.forks_count > 0 && (
                      <div className="flex items-center gap-1">
                        <i className="fas fa-code-branch text-green-400"></i>
                        <span className="text-[var(--text-secondary)]">{repo.forks_count}</span>
                      </div>
                    )}
                  </div>
                  <span className="text-[var(--text-secondary)]">
                    {new Date(repo.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </a>
            ))}
          </div>
          
          <div className="mt-4 text-center">
            <a
              href={`https://github.com/${user.login}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent)]/10 text-[var(--accent)] rounded-lg hover:bg-[var(--accent)]/20 transition-all duration-300"
            >
              <span>View all repositories</span>
              <i className="fas fa-arrow-right"></i>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default GitHubStats;
