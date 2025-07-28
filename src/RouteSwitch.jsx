import React, { useEffect, useContext } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider, ThemeContext } from './components/ThemeContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import About from './components/About';
import Projects from './components/Projects';
import Settings from './components/Settings';
import MusicPlayer from './components/MusicPlayer';
import MouseEffects from './components/MouseEffects';
import { initAnalytics, trackPageView, trackPerformance } from './utils/analytics';

const RouteTracker = () => {
  const location = useLocation();
  
  useEffect(() => {
    try {
      initAnalytics();
    } catch (error) {
      console.warn('Analytics init failed:', error);
    }
  }, []);

  useEffect(() => {
    try {
      trackPageView(location.pathname);
      trackPerformance();
    } catch (error) {
      console.warn('Page tracking failed:', error);
    }
  }, [location]);
  
  return null;
};

const GlobalEffects = () => {
  const { settings } = useContext(ThemeContext);
  
  return (
    <>
      {settings.animations && settings.mouseEffects && <MouseEffects />}
    </>
  );
};

const RouteSwitch = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="relative">
          <Header />
          <RouteTracker />
          <GlobalEffects />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
          <Footer />

          <MusicPlayer />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default RouteSwitch;