import React, { useEffect, useRef } from 'react';
import { animations } from '../utils/animations';
import { useTheme } from '../context/ThemeContext';

// Efecto de cursor mágico que sigue el mouse
export const MagicCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement[]>([]);
  const { theme } = useTheme();

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // Crear trail de partículas
    for (let i = 0; i < 8; i++) {
      const trail = document.createElement('div');
      trail.style.cssText = `
        position: fixed;
        width: 4px;
        height: 4px;
        background: var(--accent-primary);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        opacity: ${0.8 - (i * 0.1)};
        transform: scale(${1 - (i * 0.1)});
        transition: all 0.1s ease-out;
      `;
      document.body.appendChild(trail);
      trailRef.current.push(trail);
    }

    let mouseX = 0;
    let mouseY = 0;
    const trailPositions: Array<{ x: number; y: number }> = [];

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      cursor.style.left = mouseX - 8 + 'px';
      cursor.style.top = mouseY - 8 + 'px';

      // Actualizar trail
      trailPositions.unshift({ x: mouseX, y: mouseY });
      if (trailPositions.length > 8) {
        trailPositions.pop();
      }

      trailRef.current.forEach((trail, index) => {
        if (trailPositions[index]) {
          trail.style.left = trailPositions[index].x - 2 + 'px';
          trail.style.top = trailPositions[index].y - 2 + 'px';
        }
      });
    };

    const handleMouseEnter = () => {
      cursor.style.opacity = '1';
    };

    const handleMouseLeave = () => {
      cursor.style.opacity = '0';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      trailRef.current.forEach(trail => {
        document.body.removeChild(trail);
      });
    };
  }, [theme]);

  return (
    <div
      ref={cursorRef}
      style={{
        position: 'fixed',
        width: '16px',
        height: '16px',
        background: 'radial-gradient(circle, var(--accent-primary), var(--accent-secondary))',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 9999,
        opacity: 0,
        mixBlendMode: 'difference',
        transition: 'opacity 0.3s ease',
      }}
    />
  );
};

// Efecto de sparkles que aparece en elementos interactivos
export const SparkleEffect: React.FC<{ trigger?: boolean; children: React.ReactNode }> = ({ 
  trigger = false, 
  children 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!trigger || !containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();

    // Crear sparkles
    for (let i = 0; i < 6; i++) {
      const sparkle = document.createElement('div');
      const size = Math.random() * 6 + 4;
      const x = Math.random() * rect.width;
      const y = Math.random() * rect.height;
      
      sparkle.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        width: ${size}px;
        height: ${size}px;
        background: var(--accent-secondary);
        border-radius: 50%;
        pointer-events: none;
        z-index: 1000;
      `;

      container.appendChild(sparkle);

      // Animar sparkle
      animations.createTimeline()
        .fromTo(sparkle, {
          scale: 0,
          opacity: 1,
        }, {
          scale: 1,
          duration: 0.2,
          ease: animations.ease.bounce,
        })
        .to(sparkle, {
          y: y - 20,
          x: x + (Math.random() - 0.5) * 40,
          scale: 0,
          opacity: 0,
          duration: 0.8,
          ease: animations.ease.smooth,
          onComplete: () => {
            container.removeChild(sparkle);
          }
        });
    }
  }, [trigger]);

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      {children}
    </div>
  );
};

// Efecto de ondas de color que se expande al hacer click
export const RippleEffect: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const createRipple = (e: React.MouseEvent) => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const ripple = document.createElement('div');
    ripple.style.cssText = `
      position: absolute;
      left: ${x}px;
      top: ${y}px;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: radial-gradient(circle, var(--accent-tertiary) 0%, transparent 70%);
      pointer-events: none;
      z-index: 0;
      transform: scale(0);
      opacity: 0.6;
    `;

    container.appendChild(ripple);

    animations.createTimeline()
      .to(ripple, {
        scale: 2,
        opacity: 0,
        duration: 0.6,
        ease: animations.ease.smooth,
        onComplete: () => {
          container.removeChild(ripple);
        }
      });
  };

  return (
    <div 
      ref={containerRef} 
      style={{ position: 'relative', overflow: 'hidden' }}
      onMouseDown={createRipple}
    >
      {children}
    </div>
  );
};

// Efecto de texto que se escribe solo
export const TypewriterEffect: React.FC<{ 
  text: string; 
  speed?: number; 
  startDelay?: number 
}> = ({ text, speed = 50, startDelay = 0 }) => {
  const [displayText, setDisplayText] = React.useState('');
  const [currentIndex, setCurrentIndex] = React.useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentIndex < text.length) {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }
    }, currentIndex === 0 ? startDelay : speed);

    return () => clearTimeout(timer);
  }, [currentIndex, text, speed, startDelay]);

  return (
    <span>
      {displayText}
      <span 
        style={{ 
          opacity: currentIndex < text.length ? 1 : 0,
          animation: 'blink 1s infinite',
        }}
      >
        |
      </span>
      <style>
        {`
          @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
          }
        `}
      </style>
    </span>
  );
};

// Efecto de brillo que se mueve por el elemento
export const ShineEffect: React.FC<{ children: React.ReactNode; delay?: number }> = ({ 
  children, 
  delay = 0 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    
    const tl = animations.createTimeline({ 
      repeat: -1, 
      repeatDelay: 3,
      delay 
    });

    tl.fromTo(container, {
      backgroundPosition: '-200% 0',
    }, {
      backgroundPosition: '200% 0',
      duration: 1.5,
      ease: animations.ease.smooth,
    });

  }, [delay]);

  return (
    <div
      ref={containerRef}
      style={{
        background: `linear-gradient(
          90deg, 
          transparent 0%, 
          var(--accent-tertiary) 50%, 
          transparent 100%
        )`,
        backgroundSize: '200% 100%',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        position: 'relative',
      }}
    >
      {children}
    </div>
  );
}; 