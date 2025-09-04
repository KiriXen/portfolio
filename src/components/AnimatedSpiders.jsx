import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from './ThemeContext';

const CustomSpider = ({ color = "currentColor", size = 24, className = "", ...props }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      {...props}
    >
      <defs>
        <radialGradient id="spiderGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity="1"/>
          <stop offset="70%" stopColor={color} stopOpacity="0.8"/>
          <stop offset="100%" stopColor={color} stopOpacity="0.6"/>
        </radialGradient>
      </defs>
      
      <ellipse cx="12" cy="14" rx="3" ry="4" fill="url(#spiderGradient)" stroke={color} strokeWidth="0.5"/>
      <ellipse cx="12" cy="9" rx="2.5" ry="3" fill="url(#spiderGradient)" stroke={color} strokeWidth="0.4"/>
      <circle cx="12" cy="7" r="1.5" fill="url(#spiderGradient)" stroke={color} strokeWidth="0.3"/>
      
      <path d="M9 11 Q6 8 4 10 Q3 11 5 12" stroke={color} strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      <path d="M15 11 Q18 8 20 10 Q21 11 19 12" stroke={color} strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      
      <path d="M9 13 Q5 12 3 15 Q2 16 4 17" stroke={color} strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      <path d="M15 13 Q19 12 21 15 Q22 16 20 17" stroke={color} strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      
      <path d="M9 15 Q6 16 4 19 Q3 20 5 21" stroke={color} strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      <path d="M15 15 Q18 16 20 19 Q21 20 19 21" stroke={color} strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      
      <path d="M10 16 Q7 18 5 22 Q4 23 6 23" stroke={color} strokeWidth="1.1" fill="none" strokeLinecap="round"/>
      <path d="M14 16 Q17 18 19 22 Q20 23 18 23" stroke={color} strokeWidth="1.1" fill="none" strokeLinecap="round"/>
      
      <circle cx="11" cy="6.5" r="0.4" fill="white" opacity="0.9"/>
      <circle cx="13" cy="6.5" r="0.4" fill="white" opacity="0.9"/>
      <circle cx="10.5" cy="7.5" r="0.3" fill="white" opacity="0.7"/>
      <circle cx="13.5" cy="7.5" r="0.3" fill="white" opacity="0.7"/>
      
      <path d="M11 5.5 Q10.5 4.5 11.5 4" stroke={color} strokeWidth="0.8" fill="none" strokeLinecap="round"/>
      <path d="M13 5.5 Q13.5 4.5 12.5 4" stroke={color} strokeWidth="0.8" fill="none" strokeLinecap="round"/>
      
      <ellipse cx="12" cy="13" rx="1" ry="1.5" fill={color} opacity="0.3"/>
      <circle cx="12" cy="11" r="0.8" fill={color} opacity="0.2"/>
    </svg>
  );
};

const AnimatedSpiders = () => {
  const { theme } = useContext(ThemeContext);
  const [mouseX, setMouseX] = useState(0);
  const [autoSwing, setAutoSwing] = useState(0);
  const [spiders] = useState([
    {
      id: 1,
      x: 20,
      threadLength: 180,
      spiderSize: 35,
      swingPhase: 0,
      swingSpeed: 2.5,
    },
    {
      id: 2, 
      x: 80,
      threadLength: 160,
      spiderSize: 32,
      swingPhase: Math.PI,
      swingSpeed: 3.2,
    }
  ]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const centerX = window.innerWidth / 2;
      const mousePosition = (e.clientX - centerX) / centerX;
      setMouseX(mousePosition * 8);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    let animationFrame;
    
    const animate = () => {
      const time = Date.now() / 1000;
      
      const baseSwing = Math.sin(time * 0.8) * 6;
      setAutoSwing(baseSwing);
      
      animationFrame = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, []);

  const createHangingWeb = (spider) => {
    const webX = 60;
    
    return (
      <svg
        key={`web-${spider.id}`}
        width="120"
        height="80"
        viewBox="0 0 120 80"
        className="absolute"
        style={{
          left: `${spider.x - 12}%`,
          top: '75px',
          filter: `drop-shadow(0 0 12px ${theme?.accent || '#ff6b6b'}60)`
        }}
      >
        <defs>
          <radialGradient id={`webGradient-${spider.id}`} cx="50%" cy="30%">
            <stop offset="0%" stopColor={theme?.accent || '#ff6b6b'} stopOpacity="0.8"/>
            <stop offset="70%" stopColor={theme?.accent || '#ff6b6b'} stopOpacity="0.4"/>
            <stop offset="100%" stopColor={theme?.accent || '#ff6b6b'} stopOpacity="0.1"/>
          </radialGradient>
        </defs>
        
        <g stroke={`url(#webGradient-${spider.id})`} fill="none" strokeLinecap="round">
          <path
            d={`M ${webX-25},15 Q ${webX-12},8 ${webX},12 Q ${webX+12},8 ${webX+25},15`}
            strokeWidth="2"
            opacity="0.9"
          />
          <path
            d={`M ${webX-20},25 Q ${webX-8},18 ${webX},22 Q ${webX+8},18 ${webX+20},25`}
            strokeWidth="1.8"
            opacity="0.8"
          />
          <path
            d={`M ${webX-15},35 Q ${webX-5},28 ${webX},32 Q ${webX+5},28 ${webX+15},35`}
            strokeWidth="1.5"
            opacity="0.7"
          />
          <path
            d={`M ${webX-10},45 Q ${webX-3},38 ${webX},42 Q ${webX+3},38 ${webX+10},45`}
            strokeWidth="1.2"
            opacity="0.6"
          />
          
          <line x1={webX-25} y1="15" x2={webX} y2="50" strokeWidth="1.5" opacity="0.6"/>
          <line x1={webX-12} y1="8" x2={webX} y2="50" strokeWidth="1.8" opacity="0.7"/>
          <line x1={webX} y1="12" x2={webX} y2="50" strokeWidth="2" opacity="0.8"/>
          <line x1={webX+12} y1="8" x2={webX} y2="50" strokeWidth="1.8" opacity="0.7"/>
          <line x1={webX+25} y1="15" x2={webX} y2="50" strokeWidth="1.5" opacity="0.6"/>
          
          <line x1={webX-20} y1="25" x2={webX+15} y2="35" strokeWidth="1" opacity="0.5"/>
          <line x1={webX+20} y1="25" x2={webX-15} y2="35" strokeWidth="1" opacity="0.5"/>
          <line x1={webX-15} y1="35" x2={webX+10} y2="45" strokeWidth="1" opacity="0.4"/>
          <line x1={webX+15} y1="35" x2={webX-10} y2="45" strokeWidth="1" opacity="0.4"/>
          
          <line x1={webX-25} y1="15" x2={webX-30} y2="5" strokeWidth="1" opacity="0.4"/>
          <line x1={webX-12} y1="8" x2={webX-8} y2="0" strokeWidth="1.2" opacity="0.5"/>
          <line x1={webX} y1="12" x2={webX} y2="0" strokeWidth="1.5" opacity="0.6"/>
          <line x1={webX+12} y1="8" x2={webX+8} y2="0" strokeWidth="1.2" opacity="0.5"/>
          <line x1={webX+25} y1="15" x2={webX+30} y2="5" strokeWidth="1" opacity="0.4"/>
        </g>
        
        <g>
          <circle cx={webX+8} cy="22" r="1.5" fill={theme.primary} opacity="0.8">
            <animate attributeName="opacity" values="0.8;0.4;0.8" dur="4s" repeatCount="indefinite"/>
          </circle>
          <circle cx={webX+8} cy="22" r="0.6" fill="white" opacity="0.3"/>
          
          <circle cx={webX-5} cy="32" r="1.2" fill={theme.primary} opacity="0.7">
            <animate attributeName="opacity" values="0.7;0.3;0.7" dur="5s" repeatCount="indefinite"/>
          </circle>
          <circle cx={webX-5} cy="32" r="0.5" fill="white" opacity="0.2"/>
          
          <circle cx={webX+3} cy="42" r="1" fill={theme.primary} opacity="0.6">
            <animate attributeName="opacity" values="0.6;0.2;0.6" dur="6s" repeatCount="indefinite"/>
          </circle>
          <circle cx={webX+3} cy="42" r="0.4" fill="white" opacity="0.2"/>
        </g>
        
        <circle cx={webX} cy="35" r="8" fill="none" stroke={theme?.accent || '#ff6b6b'} strokeWidth="0.3" opacity="0.2">
          <animate attributeName="r" values="8;12;8" dur="4s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.2;0;0.2" dur="4s" repeatCount="indefinite"/>
        </circle>
      </svg>
    );
  };

  return (
    <div className="fixed top-0 left-0 right-0 pointer-events-none z-40" style={{ height: '300px' }}>
      {spiders.map(spider => createHangingWeb(spider))}
      
      {spiders.map(spider => {
        const time = Date.now() / 1000;
        const individualSwing = Math.sin(time * (2 * Math.PI / spider.swingSpeed) + spider.swingPhase) * 8;
        const totalSwing = autoSwing + individualSwing + (mouseX * 0.3);
        const threadSwing = totalSwing * 0.6;
        
        return (
          <div
            key={spider.id}
            className="absolute"
            style={{
              left: `${spider.x}%`,
              top: '60px',
              transform: `rotate(${totalSwing}deg)`,
              transformOrigin: 'top center'
            }}
          >
            <div
              className="w-0.5 bg-gradient-to-b from-transparent via-current to-transparent relative"
              style={{
                height: `${spider.threadLength}px`,
                color: theme?.accent || '#ff6b6b',
                opacity: 0.7,
                transform: `rotate(${threadSwing}deg)`,
                background: `linear-gradient(to bottom, transparent 0%, ${theme?.accent || '#ff6b6b'}60 20%, ${theme?.accent || '#ff6b6b'}80 80%, transparent 100%)`
              }}
            >
              <div className="absolute left-0 top-0 w-full h-full bg-gradient-to-b from-white/20 to-transparent opacity-30"></div>
              
              <div 
                className="absolute left-1/2 top-1/4 w-1 h-1 bg-white rounded-full opacity-40"
                style={{
                  transform: `translateX(-50%) translateX(${Math.sin(totalSwing * 0.1) * 2}px)`,
                  animationDelay: `${spider.id * 0.5}s`
                }}
              />
            </div>
            
            <div
              style={{
                transform: `translate(-50%, 0) rotate(${totalSwing * 0.8}deg)`,
                transformOrigin: 'center top'
              }}
            >
              <CustomSpider
                color={theme.primary}
                size={spider.spiderSize}
                className="drop-shadow-lg"
                style={{
                  transform: `rotate(${Math.sin(totalSwing * 0.05) * 3}deg)`,
                  filter: `drop-shadow(${Math.sin(totalSwing * 0.1) * 2}px ${Math.cos(totalSwing * 0.1) * 1}px 8px rgba(0,0,0,0.3))`
                }}
              />
              
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at 50% 50%, ${theme?.accent || '#ff6b6b'}20 0%, transparent 60%)`,
                  transform: `scale(${1 + Math.abs(totalSwing) * 0.02})`,
                  opacity: Math.abs(totalSwing) * 0.02
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AnimatedSpiders;
