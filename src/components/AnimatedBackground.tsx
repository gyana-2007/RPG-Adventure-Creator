'use client';

import React, { useEffect, useRef, useState } from 'react';

export const AnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [isHovering, setIsHovering] = useState(false);

  // Lantern glow follows mouse gently
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      setIsHovering(true);
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Floating ambient embers / stardust canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Generate tasteful small ambient motes (30 particles)
    const particleCount = Math.min(32, Math.floor(width / 45));
    const particles: Array<{
      x: number;
      y: number;
      radius: number;
      speedY: number;
      speedX: number;
      opacity: number;
      baseOpacity: number;
      pulseSpeed: number;
      pulsePhase: number;
      hue: 'amber' | 'arcane' | 'cyan';
    }> = [];

    const hues: Array<'amber' | 'arcane' | 'cyan'> = ['amber', 'amber', 'arcane', 'cyan'];

    for (let i = 0; i < particleCount; i++) {
      const baseOpacity = 0.15 + Math.random() * 0.35;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 0.8 + Math.random() * 1.6,
        speedY: -(0.15 + Math.random() * 0.35), // gentle upward drift
        speedX: (Math.random() - 0.5) * 0.2, // soft swaying
        opacity: baseOpacity,
        baseOpacity,
        pulseSpeed: 0.015 + Math.random() * 0.02,
        pulsePhase: Math.random() * Math.PI * 2,
        hue: hues[Math.floor(Math.random() * hues.length)],
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        // Move particle
        p.y += p.speedY;
        p.x += p.speedX;
        p.pulsePhase += p.pulseSpeed;

        // Subtle pulsing opacity
        p.opacity = p.baseOpacity + Math.sin(p.pulsePhase) * 0.15;

        // Wrap around smoothly
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        // Color based on hue
        let colorStr = `rgba(234, 179, 8, ${Math.max(0, p.opacity)})`; // warm amber
        if (p.hue === 'arcane') {
          colorStr = `rgba(168, 85, 247, ${Math.max(0, p.opacity * 0.9)})`; // arcane violet
        } else if (p.hue === 'cyan') {
          colorStr = `rgba(6, 182, 212, ${Math.max(0, p.opacity * 0.8)})`; // glowing cyan
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = colorStr;
        ctx.shadowColor = p.hue === 'arcane' ? '#a855f7' : p.hue === 'cyan' ? '#06b6d4' : '#eab308';
        ctx.shadowBlur = p.radius * 3.5;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* 1. Deep Base Ambient Atmosphere */}
      <div className="absolute inset-0 bg-[#0a0e17]" />

      {/* 2. Soft, slow-morphing Aurora Orbs with hardware-accelerated transforms */}
      <div className="absolute -top-[20%] -left-[10%] h-[600px] w-[600px] rounded-full bg-purple-900/20 blur-[130px] animate-aurora-slow mix-blend-screen" />
      <div className="absolute top-[30%] -right-[15%] h-[650px] w-[650px] rounded-full bg-amber-600/15 blur-[140px] animate-aurora-reverse mix-blend-screen" />
      <div className="absolute -bottom-[20%] left-[20%] h-[550px] w-[550px] rounded-full bg-cyan-900/15 blur-[120px] animate-aurora-pulse mix-blend-screen" />
      <div className="absolute top-[65%] left-[5%] h-[400px] w-[400px] rounded-full bg-indigo-950/25 blur-[110px] animate-aurora-slow mix-blend-screen" />

      {/* 3. Subtle Cartographer / Dungeon Grid Pattern (Fades softly in the center) */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `radial-gradient(rgba(240, 246, 252, 0.7) 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* 4. Radial Vignette Mask so center workspace content stays crisp and readable */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 30%, transparent 0%, rgba(10, 14, 23, 0.4) 60%, rgba(10, 14, 23, 0.85) 100%)',
        }}
      />

      {/* 5. Interactive Lantern Aura (follows mouse smoothly with soft warmth) */}
      {isHovering && (
        <div
          className="absolute h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full transition-opacity duration-700 ease-out"
          style={{
            left: `${mousePos.x}px`,
            top: `${mousePos.y}px`,
            background:
              'radial-gradient(circle, rgba(234, 179, 8, 0.045) 0%, rgba(168, 85, 247, 0.02) 40%, transparent 70%)',
          }}
        />
      )}

      {/* 6. Lightweight Ambient Embers Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full opacity-70"
      />
    </div>
  );
};
