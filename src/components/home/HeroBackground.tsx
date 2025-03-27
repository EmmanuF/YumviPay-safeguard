
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
    
    // Create bubbles with light purple color - increased number and visibility
    const bubbles: Bubble[] = [];
    // Increase density of bubbles significantly
    const bubblesCount = Math.floor(canvas.width * canvas.height / 6000); 
    
    for (let i = 0; i < bubblesCount; i++) {
      bubbles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        // Increase size range for better visibility
        radius: Math.random() * 8 + 3, 
        // Increase opacity range for better visibility (15-30%)
        opacity: Math.random() * 0.15 + 0.15, 
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.5) * 0.4
      });
    }
    
    const drawBubbles = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw background gradient with slightly deeper color
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 3,
        0,
        canvas.width / 2,
        canvas.height / 3,
        canvas.width * 0.7
      );
      // Make the center color slightly more vibrant
      gradient.addColorStop(0, '#F5EEFE');
      gradient.addColorStop(1, '#FFFFFF');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw bubbles with more vibrant purple
      for (const bubble of bubbles) {
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
        // Use a slightly more vibrant purple color
        ctx.fillStyle = `rgba(198, 162, 247, ${bubble.opacity})`;
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
