import React, { useEffect, useRef } from 'react';
import { animations } from '../utils/animations';
import { useTheme } from '../context/ThemeContext';

interface FloatingParticlesProps {
  count?: number;
  maxSize?: number;
  minSize?: number;
}

export const FloatingParticles: React.FC<FloatingParticlesProps> = ({
  count = 12,
  maxSize = 6,
  minSize = 2,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const particles: HTMLDivElement[] = [];

    // Limpiar partículas existentes
    container.innerHTML = '';

    // Crear partículas
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      const size = Math.random() * (maxSize - minSize) + minSize;
      
      // Posición aleatoria
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      
      // Colores cálidos basados en el tema
      const warmColors = theme === 'light' 
        ? ['var(--accent-tertiary)', 'var(--border-secondary)', 'var(--bg-secondary)']
        : ['var(--accent-tertiary)', 'var(--border-primary)', 'var(--bg-secondary)'];
      
      const color = warmColors[Math.floor(Math.random() * warmColors.length)];
      
      particle.style.cssText = `
        position: absolute;
        left: ${x}%;
        top: ${y}%;
        width: ${size}px;
        height: ${size}px;
        background-color: ${color};
        border-radius: 50%;
        opacity: 0.3;
        pointer-events: none;
        will-change: transform;
      `;
      
      container.appendChild(particle);
      particles.push(particle);
      
      // Animación individual para cada partícula
      const duration = 15 + Math.random() * 10; // Entre 15-25 segundos
      const delay = Math.random() * 5; // Delay aleatorio
      const amplitude = 20 + Math.random() * 30; // Amplitud del movimiento
      
      const tl = animations.createTimeline({ repeat: -1, delay });
      
      tl.to(particle, {
        y: `-=${amplitude}`,
        duration: duration / 2,
        ease: 'sine.inOut',
      })
      .to(particle, {
        x: `+=${Math.random() * 20 - 10}`,
        duration: duration / 4,
        ease: animations.ease.warm,
      }, 0)
      .to(particle, {
        scale: 1 + Math.random() * 0.3,
        duration: duration / 3,
        ease: animations.ease.warm,
        yoyo: true,
        repeat: 1,
      }, duration / 6)
      .to(particle, {
        y: `+=${amplitude}`,
        duration: duration / 2,
        ease: 'sine.inOut',
      })
      .to(particle, {
        x: `-=${Math.random() * 20 - 10}`,
        duration: duration / 4,
        ease: animations.ease.warm,
      }, duration / 2);
    }

    // Cleanup
    return () => {
      particles.forEach(() => {
        animations.killAll();
      });
    };
  }, [count, maxSize, minSize, theme]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: -1,
        overflow: 'hidden',
      }}
      aria-hidden="true"
    />
  );
};

// Componente de ondas decorativas para secciones
export const DecorativeWaves: React.FC<{ className?: string }> = ({ className = '' }) => {
  const waveRef = useRef<SVGGElement>(null);

  useEffect(() => {
    if (waveRef.current) {
      // Animación muy sutil de flotación
      const tl = animations.createTimeline({ repeat: -1, yoyo: true });
      tl.to(waveRef.current, {
        y: -5,
        duration: 6,
        ease: 'sine.inOut',
      });
    }
  }, []);

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '-40px', // Extender hacia abajo del viewport
        left: 0,
        width: '100%',
        height: '200px', // Aumentar altura
        pointerEvents: 'none',
        zIndex: -1,
        // Quitar overflow: hidden para que las ondas se vean completas
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1200 200"
        preserveAspectRatio="none"
        style={{ 
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '100%'
        }}
      >
        <g ref={waveRef}>
          {/* Primera onda - más profunda */}
          <path
            d="M0,80 C300,50 600,110 1200,80 L1200,200 L0,200 Z"
            fill="var(--accent-primary)"
            opacity="0.08"
          />
          {/* Segunda onda - intermedia */}
          <path
            d="M0,95 C300,65 600,125 1200,95 L1200,200 L0,200 Z"
            fill="var(--accent-secondary)"
            opacity="0.06"
          />
          {/* Tercera onda - más sutil */}
          <path
            d="M0,110 C300,80 600,140 1200,110 L1200,200 L0,200 Z"
            fill="var(--accent-tertiary)"
            opacity="0.04"
          />
        </g>
      </svg>
    </div>
  );
};

// Componente de ondas que responden al scroll
export const ScrollResponsiveWaves: React.FC = () => {
  const waveRef = useRef<SVGGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!waveRef.current || !containerRef.current) return;

    let ticking = false;

    const updateWaves = () => {
      const scrolled = window.scrollY;
      const rate = scrolled * -0.2; // Velocidad de paralaje

      if (waveRef.current) {
        waveRef.current.style.transform = `translateY(${rate}px)`;
      }
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateWaves);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Animación de ondas con movimiento horizontal
    const tl = animations.createTimeline({ repeat: -1, yoyo: true });
    tl.to(waveRef.current, {
      x: 30,
      duration: 8,
      ease: 'sine.inOut',
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '200px',
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: -2
      }}
    >
      <svg
        width="120%"
        height="100%"
        viewBox="0 0 1400 300"
        preserveAspectRatio="none"
        style={{ 
          opacity: 0.05,
          marginLeft: '-10%'
        }}
      >
        <g ref={waveRef}>
          {/* Ondas de fondo que se mueven con el scroll */}
          <path
            d="M0,180 C350,120 700,240 1400,180 L1400,300 L0,300 Z"
            fill="var(--accent-primary)"
            opacity="0.6"
          />
          <path
            d="M0,210 C350,150 700,270 1400,210 L1400,300 L0,300 Z"
            fill="var(--accent-secondary)"
            opacity="0.4"
          />
        </g>
      </svg>
    </div>
  );
}; 