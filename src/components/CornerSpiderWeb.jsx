import React, { useContext } from 'react';
import { ThemeContext } from './ThemeContext';

const CornerSpiderWeb = () => {
  const { theme } = useContext(ThemeContext);
  
  // Generate organic radial anchor lines with natural curves and dripping effect
  const generateRadialLines = () => {
    const lines = [];
    const angles = [8, 18, 30, 42, 55, 68, 80]; // natural spacing
    
    angles.forEach((angle, index) => {
      const radians = (angle * Math.PI) / 180;
      const baseLength = 350 - (index * 25); // Extended for larger viewbox
      
      // Create curved, dripping effect with multiple segments
      const segments = 10;
      const points = [];
      
      for (let i = 0; i <= segments; i++) {
        const progress = i / segments;
        const currentLength = baseLength * progress;
        
        // Add dripping curves and natural sag (using deterministic values)
        const drip = Math.sin(progress * Math.PI * 2 + index) * (18 + (index * 2));
        const sag = progress * progress * (25 + (index * 3));
        
        const x = 400 - (currentLength + drip) * Math.cos(radians);
        const y = (currentLength + sag) * Math.sin(radians);
        
        points.push(`${i === 0 ? 'M' : 'L'} ${x},${y}`);
      }
      
      lines.push(
        <path
          key={`radial-${angle}`}
          d={points.join(' ')}
          fill="none"
          stroke="url(#webGradient)"
          strokeWidth={index === 3 ? "3" : "2.2"}
          opacity={0.95 - index * 0.08}
          strokeLinecap="round"
        />
      );
    });
    
    return lines;
  };
  
  // Generate dripping, sagging web arcs like in the image
  const generateDrippingWebs = () => {
    const webs = [];
    const radii = [60, 110, 170, 240, 320]; // Extended radii for larger web
    const angles = [8, 18, 30, 42, 55, 68, 80];
    
    radii.forEach((radius, radiusIndex) => {
      for (let i = 0; i < angles.length - 1; i++) {
        const angle1 = (angles[i] * Math.PI) / 180;
        const angle2 = (angles[i + 1] * Math.PI) / 180;
        
        const x1 = 400 - radius * Math.cos(angle1);
        const y1 = radius * Math.sin(angle1);
        const x2 = 400 - radius * Math.cos(angle2);
        const y2 = radius * Math.sin(angle2);
        
        // Create natural dripping sag between points (deterministic)
        const midAngle = (angle1 + angle2) / 2;
        const sagAmount = 18 + radiusIndex * 10 + (i * 3);
        const controlX = 400 - (radius + sagAmount) * Math.cos(midAngle);
        const controlY = (radius + sagAmount) * Math.sin(midAngle);
        
        webs.push(
          <path
            key={`web-${radiusIndex}-${i}`}
            d={`M ${x1},${y1} Q ${controlX},${controlY} ${x2},${y2}`}
            fill="none"
            stroke="url(#webGradient)"
            strokeWidth={radiusIndex < 2 ? "2" : "1.6"}
            opacity={0.8 - radiusIndex * 0.12}
            strokeLinecap="round"
          />
        );
      }
    });
    
    return webs;
  };
  
  // Generate hanging drip threads like in the image
  const generateDripThreads = () => {
    const drips = [];
    const dripPositions = [
      { x: 370, y: 70, length: 45 },
      { x: 330, y: 100, length: 40 },
      { x: 290, y: 130, length: 50 },
      { x: 250, y: 160, length: 35 },
      { x: 210, y: 190, length: 43 },
      { x: 170, y: 220, length: 30 },
      { x: 130, y: 250, length: 47 },
      { x: 350, y: 120, length: 25 },
      { x: 310, y: 160, length: 33 },
      { x: 230, y: 210, length: 38 },
    ];
    
    dripPositions.forEach((drip, index) => {
      // Create wavy dripping effect (deterministic)
      const points = [];
      const segments = 6;
      
      for (let i = 0; i <= segments; i++) {
        const progress = i / segments;
        const x = drip.x + Math.sin(progress * Math.PI * 3 + index) * (3 + (index % 3));
        const y = drip.y + progress * drip.length;
        points.push(`${i === 0 ? 'M' : 'L'} ${x},${y}`);
      }
      
      drips.push(
        <path
          key={`drip-${index}`}
          d={points.join(' ')}
          fill="none"
          stroke="url(#webGradient)"
          strokeWidth="1"
          opacity={0.6 - (index % 3) * 0.1}
          strokeLinecap="round"
        />
      );
    });
    
    return drips;
  };
  
  // Generate the dense center web structure like in the image
  const generateCenterWeb = () => {
    const center = [];
    const centerX = 400;
    const centerY = 0;
    
    // Dense center with multiple irregular connections
    const innerRadii = [25, 45, 70];
    const innerAngles = [10, 25, 40, 55, 70, 85];
    
    innerRadii.forEach((radius, rIndex) => {
      innerAngles.forEach((angle, aIndex) => {
        const radians = (angle * Math.PI) / 180;
        const x = centerX - radius * Math.cos(radians);
        const y = radius * Math.sin(radians);
        
        // Connect to nearby points with irregular curves
        if (aIndex < innerAngles.length - 1) {
          const nextAngle = (innerAngles[aIndex + 1] * Math.PI) / 180;
          const nextX = centerX - radius * Math.cos(nextAngle);
          const nextY = radius * Math.sin(nextAngle);
          
          const controlX = (x + nextX) / 2 + (rIndex * 3 - 3);
          const controlY = (y + nextY) / 2 + (aIndex * 2 - 1);
          
          center.push(
            <path
              key={`center-${rIndex}-${aIndex}`}
              d={`M ${x},${y} Q ${controlX},${controlY} ${nextX},${nextY}`}
              fill="none"
              stroke="url(#webGradient)"
              strokeWidth="1.5"
              opacity={0.9 - rIndex * 0.15}
              strokeLinecap="round"
            />
          );
        }
        
        // Connect to outer rings
        if (rIndex < innerRadii.length - 1) {
          const outerRadius = innerRadii[rIndex + 1];
          const outerX = centerX - outerRadius * Math.cos(radians);
          const outerY = outerRadius * Math.sin(radians);
          
          center.push(
            <line
              key={`center-radial-${rIndex}-${aIndex}`}
              x1={x} y1={y}
              x2={outerX} y2={outerY}
              stroke="url(#webGradient)"
              strokeWidth="1.2"
              opacity={0.8 - rIndex * 0.1}
              strokeLinecap="round"
            />
          );
        }
      });
    });
    
    return center;
  };
  
  return (
    <div className="fixed top-0 right-0 pointer-events-none z-40 overflow-hidden">
      <svg
        width="400"
        height="400"
        viewBox="0 0 400 400"
        className="absolute -top-5 -right-5 pointer-events-none opacity-75"
        style={{
          filter: `drop-shadow(0 0 12px ${theme.accent}40) drop-shadow(0 0 6px ${theme.primary}20)`,
          transform: 'rotate(-5deg)'
        }}
      >
        <defs>
          <radialGradient id="webGradient" cx="100%" cy="0%">
            <stop offset="0%" stopColor={theme.accent} stopOpacity="1"/>
            <stop offset="30%" stopColor={theme.accent} stopOpacity="0.8"/>
            <stop offset="70%" stopColor={theme.accent} stopOpacity="0.4"/>
            <stop offset="100%" stopColor={theme.accent} stopOpacity="0.1"/>
          </radialGradient>
          <filter id="webGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Enhanced structural elements with better scaling */}
        <g filter="url(#webGlow)">
          {generateRadialLines()}
          {generateDrippingWebs()}
          {generateCenterWeb()}
          {generateDripThreads()}
        </g>
        
        {/* Enhanced anchor spider at the perfect corner position */}
        <g transform="translate(390, 10)">
          <ellipse cx="0" cy="0" rx="7" ry="5" fill={theme.primary} opacity="0.95">
            <animate attributeName="rx" values="7;8.5;7" dur="4s" repeatCount="indefinite"/>
            <animate attributeName="ry" values="5;6;5" dur="4s" repeatCount="indefinite"/>
          </ellipse>
          {/* Enhanced spider legs with better proportions */}
          <g stroke={theme.primary} strokeWidth="1.2" opacity="0.9" strokeLinecap="round">
            <line x1="-10" y1="-3" x2="-16" y2="-6">
              <animate attributeName="x2" values="-16;-18;-16" dur="6s" repeatCount="indefinite"/>
            </line>
            <line x1="-10" y1="0" x2="-18" y2="0">
              <animate attributeName="x2" values="-18;-20;-18" dur="5s" repeatCount="indefinite"/>
            </line>
            <line x1="-10" y1="3" x2="-16" y2="6">
              <animate attributeName="x2" values="-16;-18;-16" dur="7s" repeatCount="indefinite"/>
            </line>
            <line x1="10" y1="-3" x2="16" y2="-6">
              <animate attributeName="x2" values="16;18;16" dur="5.5s" repeatCount="indefinite"/>
            </line>
            <line x1="10" y1="0" x2="18" y2="0">
              <animate attributeName="x2" values="18;20;18" dur="6.5s" repeatCount="indefinite"/>
            </line>
            <line x1="10" y1="3" x2="16" y2="6">
              <animate attributeName="x2" values="16;18;16" dur="4.5s" repeatCount="indefinite"/>
            </line>
          </g>
          {/* Spider eyes with subtle glow */}
          <circle cx="-2" cy="-2" r="1" fill={theme.accent} opacity="0.9">
            <animate attributeName="opacity" values="0.9;0.6;0.9" dur="8s" repeatCount="indefinite"/>
          </circle>
          <circle cx="2" cy="-2" r="1" fill={theme.accent} opacity="0.9">
            <animate attributeName="opacity" values="0.9;0.6;0.9" dur="7s" repeatCount="indefinite"/>
          </circle>
        </g>
        
        {/* Enhanced dewdrops with better positioning and effects */}
        <circle cx="320" cy="90" r="2.5" fill={theme.accent} opacity="0.7">
          <animate attributeName="opacity" values="0.7;1;0.7" dur="5s" repeatCount="indefinite"/>
          <animate attributeName="r" values="2.5;3;2.5" dur="5s" repeatCount="indefinite"/>
        </circle>
        <circle cx="250" cy="160" r="2" fill={theme.primary} opacity="0.6">
          <animate attributeName="opacity" values="0.6;0.9;0.6" dur="6s" repeatCount="indefinite"/>
          <animate attributeName="r" values="2;2.8;2" dur="6s" repeatCount="indefinite"/>
        </circle>
        <circle cx="180" cy="220" r="2.2" fill={theme.accent} opacity="0.5">
          <animate attributeName="opacity" values="0.5;0.8;0.5" dur="7s" repeatCount="indefinite"/>
          <animate attributeName="r" values="2.2;3;2.2" dur="7s" repeatCount="indefinite"/>
        </circle>
        
        {/* Subtle web shimmer effect */}
        <circle cx="300" cy="120" r="1" fill={theme.accent} opacity="0">
          <animate attributeName="opacity" values="0;0.8;0" dur="3s" repeatCount="indefinite" begin="0s"/>
          <animate attributeName="r" values="1;4;1" dur="3s" repeatCount="indefinite" begin="0s"/>
        </circle>
        <circle cx="220" cy="180" r="1" fill={theme.primary} opacity="0">
          <animate attributeName="opacity" values="0;0.6;0" dur="4s" repeatCount="indefinite" begin="1s"/>
          <animate attributeName="r" values="1;3;1" dur="4s" repeatCount="indefinite" begin="1s"/>
        </circle>
      </svg>
    </div>
  );
};

export default CornerSpiderWeb;
