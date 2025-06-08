import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

interface HoverAnimationOptions {
  scale?: number;
  duration?: number;
  ease?: string;
  rotationX?: number;
  rotationY?: number;
  shadowStrength?: number;
}

export function useHoverAnimation<T extends HTMLElement = HTMLElement>(options: HoverAnimationOptions = {}) {
  const elementRef = useRef<T>(null);
  const {
    scale = 1.05,
    duration = 0.3,
    ease = 'power2.out',
    rotationX = 5,
    rotationY = 5,
    shadowStrength = 0.15,
  } = options;

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleMouseEnter = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const rotX = ((e.clientY - centerY) / rect.height) * rotationX;
      const rotY = ((e.clientX - centerX) / rect.width) * rotationY;

      gsap.to(element, {
        scale,
        rotationX: -rotX,
        rotationY: rotY,
        duration,
        ease,
        transformOrigin: 'center',
        boxShadow: `0 10px 30px rgba(0, 0, 0, ${shadowStrength})`,
      });
    };

    const handleMouseLeave = () => {
      gsap.to(element, {
        scale: 1,
        rotationX: 0,
        rotationY: 0,
        duration,
        ease,
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      });
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [scale, duration, ease, rotationX, rotationY, shadowStrength]);

  return elementRef;
} 