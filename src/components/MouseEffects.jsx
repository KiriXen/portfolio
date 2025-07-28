import React, { useEffect, useRef, useState, useContext } from 'react';
import { ThemeContext } from './ThemeContext';

const MouseEffects = () => {
  const { settings } = useContext(ThemeContext);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMoving, setIsMoving] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [trails, setTrails] = useState([]);
  const [particles, setParticles] = useState([]);
  const [ripples, setRipples] = useState([]);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const lastTimeRef = useRef(0);

  useEffect(() => {
    let moveTimeout;

    const handleMouseMove = (e) => {
      const newPos = { x: e.clientX, y: e.clientY };
      setMousePos(newPos);
      setIsMoving(true);

      if (settings.cursorTrail) {
        setTrails(prev => {
          const maxTrails = settings.cursorSize === 'large' ? 15 : settings.cursorSize === 'small' ? 5 : 10;
          const newTrails = [...prev, { ...newPos, id: Date.now(), opacity: 1 }];
          return newTrails.slice(-maxTrails);
        });
      }

      if (settings.particleEffects && Math.random() < 0.2) {
        setParticles(prev => {
          const newParticles = [...prev, {
            x: newPos.x,
            y: newPos.y,
            id: Date.now(),
            vx: (Math.random() - 0.5) * 3,
            vy: (Math.random() - 0.5) * 3,
            life: 1,
            size: Math.random() * 2 + 1,
            hue: getHueFromColor(settings.cursorColor)
          }];
          return newParticles.slice(-15);
        });
      }

      clearTimeout(moveTimeout);
      moveTimeout = setTimeout(() => setIsMoving(false), 100);
    };

    const handleMouseDown = (e) => {
      setIsClicking(true);
      
      setRipples(prev => [...prev, {
        x: e.clientX,
        y: e.clientY,
        id: Date.now(),
        scale: 0,
        opacity: 1
      }]);
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    const animate = (currentTime) => {
      if (currentTime - lastTimeRef.current > 16.67) {
        setTrails(prev => 
          prev.map(trail => ({
            ...trail,
            opacity: trail.opacity - 0.08
          })).filter(trail => trail.opacity > 0)
        );

        setParticles(prev => 
          prev.map(particle => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            life: particle.life - 0.03,
            vx: particle.vx * 0.97,
            vy: particle.vy * 0.97
          })).filter(particle => particle.life > 0)
        );

        setRipples(prev => 
          prev.map(ripple => ({
            ...ripple,
            scale: ripple.scale + 2,
            opacity: ripple.opacity - 0.05
          })).filter(ripple => ripple.opacity > 0 && ripple.scale < 100)
        );

        lastTimeRef.current = currentTime;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      clearTimeout(moveTimeout);
    };
  }, [settings]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    const drawEffects = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (settings.cursorTrail) {
        trails.forEach((trail, index) => {
          const baseSize = settings.cursorSize === 'large' ? 25 : settings.cursorSize === 'small' ? 10 : 15;
          const size = (index / trails.length) * baseSize + 3;
          ctx.save();
          ctx.globalAlpha = trail.opacity * 0.5;
          ctx.beginPath();
          ctx.arc(trail.x, trail.y, size, 0, Math.PI * 2);
          
          switch (settings.cursorStyle) {
            case 'neon':
              ctx.fillStyle = settings.cursorColor;
              ctx.shadowColor = settings.cursorColor;
              ctx.shadowBlur = 15;
              break;
            case 'gaming':
              ctx.fillStyle = `hsl(${(index * 20) % 360}, 70%, 60%)`;
              break;
            default:
              ctx.fillStyle = settings.cursorColor + '80';
          }
          
          ctx.fill();
          ctx.restore();
        });
      }

      if (settings.particleEffects) {
        particles.forEach(particle => {
          ctx.save();
          ctx.globalAlpha = particle.life;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fillStyle = `hsl(${particle.hue}, 70%, 60%)`;
          ctx.fill();
          ctx.restore();
        });
      }

      ripples.forEach(ripple => {
        ctx.save();
        ctx.globalAlpha = ripple.opacity * 0.3;
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.scale, 0, Math.PI * 2);
        ctx.strokeStyle = settings.cursorColor;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
      });
    };

    const drawInterval = setInterval(drawEffects, 16.67);
    return () => clearInterval(drawInterval);
  }, [trails, particles, ripples, settings]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getHueFromColor = (color) => {
    const colorMap = {
      '#64ffda': 180,
      '#bb86fc': 270,
      '#ff6b6b': 0,
      '#4ecdc4': 180,
      '#45b7d1': 200,
      '#96ceb4': 140,
      '#ffeaa7': 50,
      '#fd79a8': 320
    };
    return colorMap[color] || 180;
  };

  const getCursorSize = () => {
    const sizeMap = {
      small: { width: 12, height: 12, dot: 4 },
      medium: { width: 16, height: 16, dot: 6 },
      large: { width: 24, height: 24, dot: 8 }
    };
    return sizeMap[settings.cursorSize] || sizeMap.medium;
  };

  const cursorSize = getCursorSize();

  const getCursorStyle = () => {
    switch (settings.cursorStyle) {
      case 'classic':
        return {
          background: settings.cursorColor,
          border: `2px solid white`,
          borderRadius: '50%'
        };
      case 'gaming':
        return {
          background: `linear-gradient(45deg, ${settings.cursorColor}, #ff6b6b)`,
          border: '2px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '4px',
          boxShadow: `0 0 20px ${settings.cursorColor}50`
        };
      case 'minimal':
        return {
          background: 'transparent',
          border: `2px solid ${settings.cursorColor}`,
          borderRadius: '50%'
        };
      case 'neon':
        return {
          background: settings.cursorColor,
          border: `2px solid ${settings.cursorColor}`,
          borderRadius: '50%',
          boxShadow: `0 0 20px ${settings.cursorColor}, 0 0 40px ${settings.cursorColor}40`,
          filter: 'brightness(1.2)'
        };
      default:
        return {
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          border: `2px solid ${settings.cursorColor}40`,
          borderRadius: '50%',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
        };
    }
  };

  return (
    <>
      {/* Canvas for particle effects */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-40"
        style={{ mixBlendMode: settings.cursorStyle === 'neon' ? 'screen' : 'normal' }}
      />

      {/* Custom cursor */}
      <div
        className="fixed pointer-events-none z-50 transition-all duration-150 ease-out"
        style={{
          left: mousePos.x,
          top: mousePos.y,
          transform: `translate(-50%, -50%) scale(${isMoving ? 1.2 : 1}) ${isClicking ? 'scale(0.8)' : ''}`,
          width: cursorSize.width,
          height: cursorSize.height,
          ...getCursorStyle()
        }}
      >
        {/* Inner dot for some styles */}
        {(settings.cursorStyle === 'modern' || settings.cursorStyle === 'classic') && (
          <div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              width: cursorSize.dot,
              height: cursorSize.dot,
              background: settings.cursorStyle === 'modern' ? settings.cursorColor : 'white'
            }}
          />
        )}
      </div>

      {/* Global cursor styles */}
      <style jsx global>{`
        * {
          cursor: none !important;
        }
        
        a, button, [role="button"], input, textarea, select {
          cursor: none !important;
        }
        
        a:hover, button:hover, [role="button"]:hover {
          cursor: none !important;
        }
      `}</style>
    </>
  );
};

export default MouseEffects;