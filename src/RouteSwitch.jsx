import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeContext';
import Home from './components/Home';
import About from './components/About';
import Projects from './components/Projects';
import Settings from './components/Settings';
import Header from './components/Header';
import Footer from './components/Footer';

const RouteSwitch = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default RouteSwitch;