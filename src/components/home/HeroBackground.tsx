
import React, { useEffect, useRef } from 'react';

interface Bubble {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  speedX: number;
  speedY: number;
}

const HeroBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = Math.max(800, window.innerHeight * 0.75);
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Create bubbles with light purple color
    const bubbles: Bubble[] = [];
    const bubblesCount = Math.floor(canvas.width * canvas.height / 15000);
    
    for (let i = 0; i < bubblesCount; i++) {
      bubbles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 5 + 2,
        opacity: Math.random() * 0.15 + 0.05, // 5-15% opacity
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3
      });
    }
    
    const drawBubbles = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw background gradient
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 3,
        0,
        canvas.width / 2,
        canvas.height / 3,
        canvas.width * 0.7
      );
      gradient.addColorStop(0, '#F9F6FD');
      gradient.addColorStop(1, '#FFFFFF');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw bubbles
      for (const bubble of bubbles) {
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(214, 188, 250, ${bubble.opacity})`;
        ctx.fill();
        
        // Move bubbles
        bubble.x += bubble.speedX;
        bubble.y += bubble.speedY;
        
        // Bounce off edges
        if (bubble.x < 0 || bubble.x > canvas.width) bubble.speedX *= -1;
        if (bubble.y < 0 || bubble.y > canvas.height) bubble.speedY *= -1;
      }
      
      requestAnimationFrame(drawBubbles);
    };
    
    const animationFrame = requestAnimationFrame(drawBubbles);
    
    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="absolute top-0 left-0 w-full h-full z-0"
      style={{ 
        pointerEvents: 'none',
        mixBlendMode: 'normal'
      }}
    />
  );
};

export default HeroBackground;
