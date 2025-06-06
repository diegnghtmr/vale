import React, { useEffect, useRef } from 'react';
import { animations } from '../utils/animations';

interface AnimatedIconProps {
  size?: number;
  color?: string;
  className?: string;
  isActive?: boolean;
}

// Icono de calendario animado con hojas que se mueven
export const CalendarIcon: React.FC<AnimatedIconProps> = ({ 
  size = 24, 
  color = 'var(--accent-primary)', 
  className = '',
  isActive = false 
}) => {
  const iconRef = useRef<SVGSVGElement>(null);
  const leafRef = useRef<SVGGElement>(null);

  useEffect(() => {
    if (iconRef.current && leafRef.current) {
      const tl = animations.createTimeline({ repeat: -1, yoyo: true });
      
      tl.to(leafRef.current, {
        rotation: 5,
        duration: 2,
        ease: animations.ease.warm,
      })
      .to(iconRef.current, {
        scale: isActive ? 1.1 : 1,
        duration: 0.3,
        ease: animations.ease.bounce,
      }, 0);
    }
  }, [isActive]);

  return (
    <svg
      ref={iconRef}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={{ color }}
    >
      <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
      <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
      <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
      <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
      <g ref={leafRef} style={{ transformOrigin: '12px 12px' }}>
        <circle cx="8" cy="14" r="1" fill="currentColor" opacity="0.7"/>
        <circle cx="12" cy="14" r="1" fill="currentColor" opacity="0.5"/>
        <circle cx="16" cy="14" r="1" fill="currentColor" opacity="0.7"/>
        <circle cx="8" cy="18" r="1" fill="currentColor" opacity="0.5"/>
        <circle cx="12" cy="18" r="1" fill="currentColor" opacity="0.7"/>
      </g>
    </svg>
  );
};

// Icono de subida con partículas flotantes
export const UploadIcon: React.FC<AnimatedIconProps> = ({ 
  size = 24, 
  color = 'var(--accent-primary)', 
  className = '',
  isActive = false 
}) => {
  const arrowRef = useRef<SVGGElement>(null);
  const particlesRef = useRef<SVGGElement>(null);

  useEffect(() => {
    if (arrowRef.current && particlesRef.current) {
      const tl = animations.createTimeline({ repeat: -1 });
      
      tl.to(arrowRef.current, {
        y: -3,
        duration: 1,
        ease: animations.ease.warm,
        yoyo: true,
        repeat: 1,
      })
      .to(particlesRef.current.children, {
        opacity: 0.8,
        scale: 1.2,
        duration: 0.5,
        stagger: 0.1,
        ease: animations.ease.smooth,
        yoyo: true,
        repeat: 1,
      }, 0);

      if (isActive) {
        animations.gentlePulse(arrowRef.current);
      }
    }
  }, [isActive]);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={{ color }}
    >
      <g ref={arrowRef}>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2"/>
        <polyline points="7,10 12,5 17,10" stroke="currentColor" strokeWidth="2"/>
        <line x1="12" y1="5" x2="12" y2="15" stroke="currentColor" strokeWidth="2"/>
      </g>
      <g ref={particlesRef}>
        <circle cx="6" cy="8" r="1" fill="currentColor" opacity="0.3"/>
        <circle cx="18" cy="8" r="1" fill="currentColor" opacity="0.3"/>
        <circle cx="9" cy="6" r="0.8" fill="currentColor" opacity="0.2"/>
        <circle cx="15" cy="6" r="0.8" fill="currentColor" opacity="0.2"/>
      </g>
    </svg>
  );
};

// Icono de descarga con ondas
export const DownloadIcon: React.FC<AnimatedIconProps> = ({ 
  size = 24, 
  color = 'var(--accent-primary)', 
  className = '',
  isActive = false 
}) => {
  const waveRef = useRef<SVGGElement>(null);
  const arrowRef = useRef<SVGGElement>(null);

  useEffect(() => {
    if (waveRef.current && arrowRef.current) {
      const tl = animations.createTimeline({ repeat: -1 });
      
      tl.to(waveRef.current.children, {
        scaleY: 1.3,
        duration: 1.5,
        stagger: 0.2,
        ease: animations.ease.warm,
        yoyo: true,
        repeat: 1,
      })
      .to(arrowRef.current, {
        y: 2,
        duration: 1,
        ease: animations.ease.smooth,
        yoyo: true,
        repeat: 1,
      }, 0);
    }
  }, [isActive]);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={{ color }}
    >
      <g ref={arrowRef}>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2"/>
        <polyline points="7,10 12,15 17,10" stroke="currentColor" strokeWidth="2"/>
        <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2"/>
      </g>
      <g ref={waveRef}>
        <line x1="4" y1="18" x2="4" y2="20" stroke="currentColor" strokeWidth="1" opacity="0.4"/>
        <line x1="8" y1="18" x2="8" y2="20" stroke="currentColor" strokeWidth="1" opacity="0.6"/>
        <line x1="16" y1="18" x2="16" y2="20" stroke="currentColor" strokeWidth="1" opacity="0.6"/>
        <line x1="20" y1="18" x2="20" y2="20" stroke="currentColor" strokeWidth="1" opacity="0.4"/>
      </g>
    </svg>
  );
};

// Icono de curso con efecto de libro que se abre
export const CourseIcon: React.FC<AnimatedIconProps> = ({ 
  size = 24, 
  color = 'var(--accent-primary)', 
  className = '',
  isActive = false 
}) => {
  const bookRef = useRef<SVGGElement>(null);
  const pagesRef = useRef<SVGGElement>(null);

  useEffect(() => {
    if (bookRef.current && pagesRef.current) {
      const tl = animations.createTimeline({ repeat: -1 });
      
      tl.to(pagesRef.current, {
        scaleX: 1.1,
        duration: 2,
        ease: animations.ease.warm,
        yoyo: true,
        repeat: 1,
      })
      .to(bookRef.current, {
        rotationY: isActive ? 5 : 0,
        duration: 0.5,
        ease: animations.ease.smooth,
      }, 0);
    }
  }, [isActive]);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={{ color }}
    >
      <g ref={bookRef}>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" strokeWidth="2"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="currentColor" strokeWidth="2" fill="none"/>
      </g>
      <g ref={pagesRef}>
        <line x1="8" y1="7" x2="16" y2="7" stroke="currentColor" strokeWidth="1" opacity="0.6"/>
        <line x1="8" y1="10" x2="14" y2="10" stroke="currentColor" strokeWidth="1" opacity="0.6"/>
        <line x1="8" y1="13" x2="16" y2="13" stroke="currentColor" strokeWidth="1" opacity="0.6"/>
        <line x1="8" y1="16" x2="12" y2="16" stroke="currentColor" strokeWidth="1" opacity="0.6"/>
      </g>
    </svg>
  );
};

// Icono de tema con sol/luna que giran
export const ThemeIcon: React.FC<AnimatedIconProps & { isDark?: boolean }> = ({ 
  size = 24, 
  color = 'var(--accent-primary)', 
  className = '',
  isDark = false 
}) => {
  const iconRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (iconRef.current) {
      animations.rotateIcon(iconRef.current, isDark ? 180 : 0);
    }
  }, [isDark]);

  return (
    <svg
      ref={iconRef}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={{ color }}
    >
      {isDark ? (
        // Luna
        <path 
          d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" 
          stroke="currentColor" 
          strokeWidth="2" 
          fill="currentColor"
          opacity="0.8"
        />
      ) : (
        // Sol
        <g>
          <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.8"/>
          <line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" strokeWidth="2"/>
          <line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" strokeWidth="2"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" strokeWidth="2"/>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" strokeWidth="2"/>
          <line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" strokeWidth="2"/>
          <line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="2"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" strokeWidth="2"/>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" strokeWidth="2"/>
        </g>
      )}
    </svg>
  );
};

// Icono de éxito con check animado
export const SuccessIcon: React.FC<AnimatedIconProps> = ({ 
  size = 24, 
  color = 'var(--success)', 
  className = '' 
}) => {
  const checkRef = useRef<SVGPathElement>(null);
  const circleRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    if (checkRef.current && circleRef.current) {
      const tl = animations.createTimeline();
      
      tl.fromTo(circleRef.current, 
        { strokeDasharray: 100, strokeDashoffset: 100 },
        { strokeDashoffset: 0, duration: 0.5, ease: animations.ease.smooth }
      )
      .fromTo(checkRef.current,
        { strokeDasharray: 20, strokeDashoffset: 20 },
        { strokeDashoffset: 0, duration: 0.3, ease: animations.ease.smooth }
      );
    }
  }, []);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={{ color }}
    >
      <circle 
        ref={circleRef}
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="2" 
        fill="none"
      />
      <path 
        ref={checkRef}
        d="M9 12l2 2 4-4" 
        stroke="currentColor" 
        strokeWidth="2"
        fill="none"
      />
    </svg>
  );
}; 