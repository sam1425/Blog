import React, { useEffect, useRef } from 'react';

const FpsCounter: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = 0;
    let fps = 0;
    let animationFrameId: number;

    const update = (timestamp: number) => {
      if (lastTime) {
        const deltaTime = timestamp - lastTime;
        fps = Math.round(1000 / deltaTime);
      }
      lastTime = timestamp;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = '24px Arial';
      ctx.fillStyle = 'white';
      ctx.fillText(`FPS: ${fps}`, 10, 30);

      animationFrameId = requestAnimationFrame(update);
    };

    animationFrameId = requestAnimationFrame(update);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 9999,
      }}
      width={window.innerWidth}
      height={window.innerHeight}
    />
  );
};

export default FpsCounter;
