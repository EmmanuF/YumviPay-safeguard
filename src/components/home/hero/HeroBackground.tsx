
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const HeroBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight * 0.85; // Cover hero section
    
    // Particles array
    const particles: Particle[] = [];
    const particleCount = width < 768 ? 30 : 60; // Fewer particles on mobile
    
    // Colors from our theme
    const colors = [
      'rgba(75, 0, 130, 0.2)', // Indigo
      'rgba(138, 43, 226, 0.15)', // Violet
      'rgba(0, 128, 0, 0.15)', // Green
      'rgba(110, 54, 229, 0.15)', // Purple
    ];
    
    // Particle class
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 15 + 5;
        this.speedX = Math.random() * 0.2 - 0.1;
        this.speedY = Math.random() * 0.2 - 0.1;
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Bounce off the edges
        if (this.x > width || this.x < 0) {
          this.speedX = -this.speedX;
        }
        
        if (this.y > height || this.y < 0) {
          this.speedY = -this.speedY;
        }
      }
      
      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
      }
    }
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
    
    // Animation loop
    const animate = () => {
      if (!ctx) return;
      
      // Clear canvas with radial gradient
      const gradient = ctx.createRadialGradient(
        width / 2, height / 2, 0,
        width / 2, height / 2, Math.max(width, height) / 1.5
      );
      gradient.addColorStop(0, '#F9F6FD'); // Soft lavender
      gradient.addColorStop(1, '#FDFDFD'); // Off-white
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      
      // Draw mesh grid (very subtle)
      ctx.strokeStyle = 'rgba(138, 43, 226, 0.03)';
      ctx.lineWidth = 0.5;
      
      // Horizontal lines
      const gridSize = 40;
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      
      // Vertical lines
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      
      // Update and draw particles
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight * 0.85;
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <div className="hero-background-container">
      <canvas 
        ref={canvasRef} 
        className="absolute top-0 left-0 w-full h-[85vh] -z-10"
        style={{ 
          mixBlendMode: 'soft-light',
        }}
      />
      
      {/* Additional decorative elements */}
      <div className="absolute top-[10%] right-[5%] w-64 h-64 rounded-full bg-primary-300/10 blur-3xl" />
      <div className="absolute top-[30%] left-[10%] w-40 h-40 rounded-full bg-secondary-300/10 blur-3xl" />
      <div className="absolute bottom-[15%] right-[20%] w-56 h-56 rounded-full bg-amber-300/10 blur-3xl" />
      
      {/* Moving blobs with framer-motion (subtle animation) */}
      <motion.div 
        className="absolute top-[15%] left-[15%] w-32 h-32 rounded-full bg-gradient-to-r from-primary-100/20 to-secondary-100/20 blur-2xl"
        animate={{ 
          x: [0, 20, 0],
          y: [0, 10, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
      />
      
      <motion.div 
        className="absolute bottom-[20%] left-[25%] w-48 h-48 rounded-full bg-gradient-to-r from-secondary-100/10 to-amber-100/10 blur-2xl"
        animate={{ 
          x: [0, -30, 0],
          y: [0, -15, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
      />
    </div>
  );
};

export default HeroBackground;
