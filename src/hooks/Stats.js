import { useState, useEffect } from 'react';
import safeLocalStorage from '../utils/safeLocalStorage';

const GITHUB_USERNAME = 'KiriXen';
const CACHE_DURATION = 30 * 60 * 1000;
const GITHUB_API_BASE = 'https://api.github.com';

const useGitHubStats = () => {
  const [stats, setStats] = useState({
    user: null,
    repos: [],
    totalStars: 0,
    totalForks: 0,
    totalCommits: 0,
    languages: {},
    loading: true,
    error: null
  });

  const getCachedData = (key) => {
    const cached = safeLocalStorage.getJSON(`github_${key}`);
    if (cached && cached.timestamp && cached.data) {
      if (Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data;
      }
    }
    return null;
  };

  const setCachedData = (key, data) => {
    safeLocalStorage.setJSON(`github_${key}`, {
      data,
      timestamp: Date.now()
    });
  };

  const fetchWithCache = async (endpoint, cacheKey) => {
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const response = await fetch(`${GITHUB_API_BASE}${endpoint}`);
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    setCachedData(cacheKey, data);
    return data;
  };

  const fetchGitHubStats = async () => {
    try {
      setStats(prev => ({ ...prev, loading: true, error: null }));

      const userData = await fetchWithCache(`/users/${GITHUB_USERNAME}`, 'user');
      
      const reposData = await fetchWithCache(`/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`, 'repos');
      
      let totalStars = 0;
      let totalForks = 0;
      const languages = {};
      
      reposData.forEach(repo => {
        totalStars += repo.stargazers_count;
        totalForks += repo.forks_count;
        
        if (repo.language) {
          languages[repo.language] = (languages[repo.language] || 0) + 1;
        }
      });

      const sortedLanguages = Object.entries(languages)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .reduce((obj, [lang, count]) => {
          obj[lang] = count;
          return obj;
        }, {});

      let totalCommits = 0;
      try {
        const eventsData = await fetchWithCache(`/users/${GITHUB_USERNAME}/events?per_page=100`, 'events');
        totalCommits = eventsData.filter(event => event.type === 'PushEvent').length;
      } catch (error) {
        console.warn('Could not fetch commit data:', error);
      }

      setStats({
        user: userData,
        repos: reposData.slice(0, 6),
        totalStars,
        totalForks,
        totalCommits,
        languages: sortedLanguages,
        loading: false,
        error: null
      });

    } catch (error) {
      console.error('Error fetching GitHub stats:', error);
      setStats(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }));
    }
  };

  useEffect(() => {
    fetchGitHubStats();
  }, []);

  const refreshStats = () => {
    ['user', 'repos', 'events'].forEach(key => {
      safeLocalStorage.removeItem(`github_${key}`);
    });
    fetchGitHubStats();
  };

  return { ...stats, refreshStats };
};

export default useGitHubStats;
