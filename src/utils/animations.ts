import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Registrar plugins de GSAP
gsap.registerPlugin(ScrollTrigger);

// Configuración de animaciones con el tema del proyecto
export const animations = {
  // Duraciones basadas en los design tokens
  duration: {
    fast: 0.15,
    normal: 0.2,
    slow: 0.3,
    slower: 0.5,
  },

  // Easings personalizados que mantienen la suavidad del tema
  ease: {
    smooth: 'power2.out',
    bounce: 'back.out(1.7)',
    elastic: 'elastic.out(1, 0.3)',
    warm: 'power3.inOut', // Curva suave para el tema cálido
  },

  // Animación de entrada para cards
  fadeInUp: (element: gsap.DOMTarget, delay = 0) => {
    return gsap.fromTo(element, 
      { 
        opacity: 0, 
        y: 30,
        scale: 0.95,
      },
      { 
        opacity: 1, 
        y: 0,
        scale: 1,
        duration: animations.duration.slow,
        ease: animations.ease.smooth,
        delay,
      }
    );
  },

  // Animación de hover para elementos interactivos
  hoverScale: (element: gsap.DOMTarget) => {
    const tl = gsap.timeline({ paused: true });
    
    tl.to(element, {
      scale: 1.05,
      duration: animations.duration.normal,
      ease: animations.ease.warm,
    });

    return {
      play: () => tl.play(),
      reverse: () => tl.reverse(),
    };
  },

  // Animación de pulso suave para elementos destacados
  gentlePulse: (element: gsap.DOMTarget) => {
    return gsap.to(element, {
      scale: 1.02,
      duration: 1.5,
      ease: animations.ease.warm,
      yoyo: true,
      repeat: -1,
    });
  },

  // Animación de aparición en cascada para listas
  staggerIn: (elements: gsap.DOMTarget, delay = 0.1) => {
    return gsap.fromTo(elements,
      { 
        opacity: 0, 
        y: 20,
        x: -10,
      },
      { 
        opacity: 1, 
        y: 0,
        x: 0,
        duration: animations.duration.slow,
        ease: animations.ease.smooth,
        stagger: delay,
      }
    );
  },

  // Animación de ondas para fondos
  waveFloat: (element: gsap.DOMTarget) => {
    return gsap.to(element, {
      y: -5,
      duration: 2,
      ease: animations.ease.warm,
      yoyo: true,
      repeat: -1,
    });
  },

  // Animación de rotación suave para iconos
  rotateIcon: (element: gsap.DOMTarget, rotation = 360) => {
    return gsap.to(element, {
      rotation,
      duration: animations.duration.slower,
      ease: animations.ease.smooth,
    });
  },

  // Animación de desenrollado para formularios
  slideDown: (element: gsap.DOMTarget) => {
    return gsap.fromTo(element,
      {
        height: 0,
        opacity: 0,
        overflow: 'hidden',
      },
      {
        height: 'auto',
        opacity: 1,
        duration: animations.duration.slow,
        ease: animations.ease.smooth,
      }
    );
  },

  // Animación de color para transiciones de tema
  colorTransition: (element: gsap.DOMTarget, newColor: string) => {
    return gsap.to(element, {
      color: newColor,
      duration: animations.duration.normal,
      ease: animations.ease.smooth,
    });
  },

  // Animación de respiración para elementos de foco
  breathe: (element: gsap.DOMTarget) => {
    return gsap.to(element, {
      scale: 1.03,
      duration: 2,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });
  },

  // Animación de entrada desde los lados
  slideInFromSide: (element: gsap.DOMTarget, direction: 'left' | 'right' = 'left') => {
    const x = direction === 'left' ? -50 : 50;
    
    return gsap.fromTo(element,
      { 
        x,
        opacity: 0,
      },
      { 
        x: 0,
        opacity: 1,
        duration: animations.duration.slow,
        ease: animations.ease.smooth,
      }
    );
  },

  // Timeline para animaciones complejas
  createTimeline: (options?: gsap.TimelineVars) => {
    return gsap.timeline(options);
  },

  // Animación de scroll reveal
  scrollReveal: (element: gsap.DOMTarget, options?: ScrollTrigger.StaticVars) => {
    return ScrollTrigger.create({
      trigger: element,
      start: 'top 85%',
      end: 'bottom 15%',
      animation: animations.fadeInUp(element),
      toggleActions: 'play none none reverse',
      ...options,
    });
  },

  // Limpieza de animaciones
  killAll: () => {
    gsap.killTweensOf('*');
    ScrollTrigger.getAll().forEach(st => st.kill());
  },
}; 