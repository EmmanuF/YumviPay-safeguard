
import React, { useEffect, useRef } from 'react';

interface Bubble {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  speedX: number;
  speedY: number;
  color: string;
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
    
    // Create more bubbles with enhanced visual properties
    const bubbles: Bubble[] = [];
    const bubblesCount = Math.floor(canvas.width * canvas.height / 5000); // Increase bubble count
    
    // Enhanced color palette for bubbles
    const colors = [
      'rgba(180, 140, 240, 0.3)', // Light purple (more opaque)
      'rgba(160, 120, 250, 0.25)',  // Medium purple
      'rgba(140, 100, 230, 0.2)', // Deeper purple
      'rgba(200, 180, 250, 0.35)',  // Very light purple (more visible)
      'rgba(190, 220, 255, 0.25)'   // Light blue tint
    ];
    
    for (let i = 0; i < bubblesCount; i++) {
      bubbles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 15 + 5, // Larger bubbles
        opacity: Math.random() * 0.2 + 0.2, // More opaque
        speedX: (Math.random() - 0.5) * 0.5, // Slightly faster
        speedY: (Math.random() - 0.5) * 0.5, // Slightly faster
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
    
    // Gradient animation variables
    let gradientAngle = 0;
    
    const drawBubbles = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw animated gradient background
      gradientAngle = (gradientAngle + 0.3) % 360; // Slightly faster gradient animation
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 3;
      
      // Create more dynamic moving gradient
      const gradient = ctx.createRadialGradient(
        centerX + Math.sin(gradientAngle * 0.015) * 120,
        centerY + Math.cos(gradientAngle * 0.015) * 60,
        0,
        centerX,
        centerY,
        canvas.width * 0.7
      );
      
      gradient.addColorStop(0, '#F5EEFE');
      gradient.addColorStop(0.5, '#F2EBFD');
      gradient.addColorStop(1, '#FFFFFF');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw bubbles with enhanced visual properties
      for (const bubble of bubbles) {
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
        ctx.fillStyle = bubble.color;
        ctx.fill();
        
        // Add subtle glow effect
        ctx.shadowColor = bubble.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // Move bubbles with enhanced motion
        bubble.x += bubble.speedX + Math.sin(gradientAngle * 0.015) * 0.15;
        bubble.y += bubble.speedY + Math.cos(gradientAngle * 0.015) * 0.15;
        
        // Bounce off edges
        if (bubble.x < 0 || bubble.x > canvas.width) bubble.speedX *= -1;
        if (bubble.y < 0 || bubble.y > canvas.height) bubble.speedY *= -1;
        
        // Occasionally change bubble size for pulsing effect
        if (Math.random() < 0.02) {
          bubble.radius = bubble.radius * (0.95 + Math.random() * 0.12);
        }
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
