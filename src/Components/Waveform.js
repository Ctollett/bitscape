import React, { useEffect, useRef } from 'react';

const Visualizer = ({ analyser }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;

    const render = () => {
      if (!analyser) return;
      requestAnimationFrame(render);

      const waveform = analyser.getValue();
      ctx.clearRect(0, 0, WIDTH, HEIGHT);
      ctx.beginPath();
      for (let i = 0; i < waveform.length; i++) {
        const x = (i / waveform.length) * WIDTH;
        const y = (waveform[i] + 1) / 2 * HEIGHT;
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    };

    render();
  }, [analyser]);

  return <canvas ref={canvasRef} width="300" height="100" />;
};

export default Visualizer;


