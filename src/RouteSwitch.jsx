import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, ThemeContext } from './components/ThemeContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import About from './components/About';
import Projects from './components/Projects';
import Settings from './components/Settings';
import AnimatedSpiders from './components/AnimatedSpiders';
import CodePlayground from './components/CodePlayground';

const GlobalEffects = () => {
  const { settings } = useContext(ThemeContext);
  
  return (
    <>
      <AnimatedSpiders />
    </>
  );
};

const RouteSwitch = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="relative">
          <Header />
          <GlobalEffects />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/playground" element={<CodePlayground />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default RouteSwitch;