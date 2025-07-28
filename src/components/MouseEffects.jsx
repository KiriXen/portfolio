import React, { useEffect, useRef, useState, useContext, useCallback, useMemo } from 'react';
import { ThemeContext } from './ThemeContext';

const MouseEffects = () => {
  const { settings } = useContext(ThemeContext);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMoving, setIsMoving] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const lastTimeRef = useRef(0);
  const moveTimeoutRef = useRef(null);
  
  const trailsRef = useRef([]);
  const particlesRef = useRef([]);
  const ripplesRef = useRef([]);
  const lastMouseRef = useRef({ x: 0, y: 0 });
  const velocityRef = useRef({ x: 0, y: 0 });

  const cursorSize = useMemo(() => {
    const sizeMap = {
      small: { width: 12, height: 12, dot: 4 },
      medium: { width: 16, height: 16, dot: 6 },
      large: { width: 24, height: 24, dot: 8 }
    };
    return sizeMap[settings.cursorSize] || sizeMap.medium;
  }, [settings.cursorSize]);

  const cursorStyle = useMemo(() => {
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
  }, [settings.cursorStyle, settings.cursorColor]);

  const getHueFromColor = useCallback((color) => {
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
  }, []);

  const handleMouseMove = useCallback((e) => {
    const newPos = { x: e.clientX, y: e.clientY };
    
    velocityRef.current = {
      x: newPos.x - lastMouseRef.current.x,
      y: newPos.y - lastMouseRef.current.y
    };
    
    lastMouseRef.current = newPos;
    setMousePos(newPos);
    setIsMoving(true);

    if (settings.cursorTrail) {
      const maxTrails = settings.cursorSize === 'large' ? 12 : settings.cursorSize === 'small' ? 6 : 8;
      trailsRef.current.push({ 
        ...newPos, 
        id: Date.now(), 
        opacity: 1,
        size: Math.abs(velocityRef.current.x) + Math.abs(velocityRef.current.y) 
      });
      
      if (trailsRef.current.length > maxTrails) {
        trailsRef.current = trailsRef.current.slice(-maxTrails);
      }
    }

    if (settings.particleEffects) {
      const speed = Math.sqrt(velocityRef.current.x ** 2 + velocityRef.current.y ** 2);
      if (speed > 2 && Math.random() < 0.15) {
        particlesRef.current.push({
          x: newPos.x + (Math.random() - 0.5) * 10,
          y: newPos.y + (Math.random() - 0.5) * 10,
          id: Date.now(),
          vx: (Math.random() - 0.5) * 2 + velocityRef.current.x * 0.1,
          vy: (Math.random() - 0.5) * 2 + velocityRef.current.y * 0.1,
          life: 1,
          size: Math.random() * 2 + 1,
          hue: getHueFromColor(settings.cursorColor)
        });
        
        if (particlesRef.current.length > 10) {
          particlesRef.current = particlesRef.current.slice(-10);
        }
      }
    }

    if (moveTimeoutRef.current) {
      clearTimeout(moveTimeoutRef.current);
    }
    moveTimeoutRef.current = setTimeout(() => setIsMoving(false), 150);
  }, [settings.cursorTrail, settings.particleEffects, settings.cursorSize, getHueFromColor, settings.cursorColor]);

  const handleMouseDown = useCallback((e) => {
    setIsClicking(true);
    
    ripplesRef.current.push({
      x: e.clientX,
      y: e.clientY,
      id: Date.now(),
      scale: 0,
      opacity: 0.8
    });
    
    if (ripplesRef.current.length > 3) {
      ripplesRef.current = ripplesRef.current.slice(-3);
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsClicking(false);
  }, []);

  const animate = useCallback((currentTime) => {
    const deltaTime = currentTime - lastTimeRef.current;
    
    if (deltaTime < 16.67) {
      animationRef.current = requestAnimationFrame(animate);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      animationRef.current = requestAnimationFrame(animate);
      return;
    }

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (settings.cursorTrail && trailsRef.current.length > 0) {
      trailsRef.current = trailsRef.current.map(trail => ({
        ...trail,
        opacity: trail.opacity - 0.12
      })).filter(trail => trail.opacity > 0);

      trailsRef.current.forEach((trail, index) => {
        const baseSize = settings.cursorSize === 'large' ? 20 : settings.cursorSize === 'small' ? 8 : 12;
        const size = (index / trailsRef.current.length) * baseSize + 2;
        
        ctx.save();
        ctx.globalAlpha = trail.opacity * 0.6;
        ctx.beginPath();
        ctx.arc(trail.x, trail.y, size, 0, Math.PI * 2);
        
        switch (settings.cursorStyle) {
          case 'neon':
            ctx.fillStyle = settings.cursorColor;
            ctx.shadowColor = settings.cursorColor;
            ctx.shadowBlur = 10;
            break;
          case 'gaming':
            ctx.fillStyle = `hsl(${(index * 30) % 360}, 70%, 60%)`;
            break;
          default:
            ctx.fillStyle = settings.cursorColor + '60';
        }
        
        ctx.fill();
        ctx.restore();
      });
    }

    if (settings.particleEffects && particlesRef.current.length > 0) {
      particlesRef.current = particlesRef.current.map(particle => ({
        ...particle,
        x: particle.x + particle.vx,
        y: particle.y + particle.vy,
        life: particle.life - 0.04,
        vx: particle.vx * 0.95,
        vy: particle.vy * 0.95
      })).filter(particle => particle.life > 0);

      particlesRef.current.forEach(particle => {
        ctx.save();
        ctx.globalAlpha = particle.life * 0.8;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${particle.hue}, 70%, 60%)`;
        ctx.fill();
        ctx.restore();
      });
    }

    if (ripplesRef.current.length > 0) {
      ripplesRef.current = ripplesRef.current.map(ripple => ({
        ...ripple,
        scale: ripple.scale + 3,
        opacity: ripple.opacity - 0.06
      })).filter(ripple => ripple.opacity > 0 && ripple.scale < 80);

      ripplesRef.current.forEach(ripple => {
        ctx.save();
        ctx.globalAlpha = ripple.opacity * 0.4;
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.scale, 0, Math.PI * 2);
        ctx.strokeStyle = settings.cursorColor;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
      });
    }

    lastTimeRef.current = currentTime;
    animationRef.current = requestAnimationFrame(animate);
  }, [settings]);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mousedown', handleMouseDown, { passive: true });
    document.addEventListener('mouseup', handleMouseUp, { passive: true });
    
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (moveTimeoutRef.current) {
        clearTimeout(moveTimeoutRef.current);
      }
    };
  }, [handleMouseMove, handleMouseDown, handleMouseUp, animate]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateCanvasSize = () => {
      const { innerWidth, innerHeight } = window;
      canvas.width = innerWidth;
      canvas.height = innerHeight;
    };

    updateCanvasSize();

    if (window.ResizeObserver) {
      const resizeObserver = new ResizeObserver(updateCanvasSize);
      resizeObserver.observe(document.body);
      return () => resizeObserver.disconnect();
    } else {
      window.addEventListener('resize', updateCanvasSize, { passive: true });
      return () => window.removeEventListener('resize', updateCanvasSize);
    }
  }, []);

  if (!settings.mouseEffects) {
    return null;
  }

  return (
    <>
      {/* Canvas for particle effects with optimized rendering */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-40"
        style={{ 
          mixBlendMode: settings.cursorStyle === 'neon' ? 'screen' : 'normal',
          willChange: 'transform'
        }}
      />

      {/* Custom cursor with GPU acceleration */}
      <div
        className="fixed pointer-events-none z-50"
        style={{
          left: mousePos.x,
          top: mousePos.y,
          transform: `translate(-50%, -50%) scale(${isMoving ? 1.1 : 1}) ${isClicking ? 'scale(0.9)' : ''}`,
          width: cursorSize.width,
          height: cursorSize.height,
          transition: 'transform 0.1s cubic-bezier(0.4, 0, 0.2, 1)',
          willChange: 'transform',
          ...cursorStyle
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

      {/* Optimized global cursor styles */}
      <style jsx global>{`
        * {
          cursor: none !important;
        }
        
        a, button, [role="button"], input, textarea, select, 
        [tabindex], [onclick] {
          cursor: none !important;
        }
        
        /* Reduce paint complexity for better performance */
        body {
          cursor: none !important;
        }
      `}</style>
    </>
  );
};

export default MouseEffects;