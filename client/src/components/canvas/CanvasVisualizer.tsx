import { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import type { AlgorithmStep } from '../../types';

interface CanvasVisualizerProps {
  steps: AlgorithmStep[];
  width?: number;
  height?: number;
  showGrid?: boolean;
  originX?: number;
  originY?: number;
  scale?: number;
  originalShape?: { x: number; y: number }[];
  transformedShape?: { x: number; y: number }[];
  isTransformation?: boolean;
}

export default function CanvasVisualizer({
  steps,
  width = 600,
  height = 500,
  showGrid = true,
  originX,
  originY,
  scale = 1,
  originalShape,
  transformedShape,
  isTransformation = false,
}: CanvasVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(50);
  const animRef = useRef<number | null>(null);
  const lastTimeRef = useRef(0);

  const ox = originX ?? width / 2;
  const oy = originY ?? height / 2;

  const toScreen = useCallback((x: number, y: number) => ({
    sx: ox + x * scale,
    sy: oy - y * scale,
  }), [ox, oy, scale]);

  // Draw grid
  const drawGrid = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = '#1F2937';
    ctx.lineWidth = 0.5;
    const gridSpacing = 20 * scale;

    for (let x = ox % gridSpacing; x < width; x += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = oy % gridSpacing; y < height; y += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, oy);
    ctx.lineTo(width, oy);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(ox, 0);
    ctx.lineTo(ox, height);
    ctx.stroke();

    // Axis labels
    ctx.fillStyle = '#6B7280';
    ctx.font = '10px Inter, sans-serif';
    ctx.fillText('X', width - 15, oy - 5);
    ctx.fillText('Y', ox + 5, 12);

    // Tick marks
    ctx.fillStyle = '#4B5563';
    ctx.font = '9px JetBrains Mono, monospace';
    for (let i = -Math.floor(ox / gridSpacing); i <= Math.floor((width - ox) / gridSpacing); i++) {
      if (i === 0) continue;
      const x = ox + i * gridSpacing;
      ctx.fillText(`${i * 20}`, x - 8, oy + 14);
    }
    for (let i = -Math.floor((height - oy) / gridSpacing); i <= Math.floor(oy / gridSpacing); i++) {
      if (i === 0) continue;
      const y = oy - i * gridSpacing;
      ctx.fillText(`${i * 20}`, ox + 4, y + 3);
    }
  }, [width, height, ox, oy, scale]);

  // Draw pixel with glow
  const drawPixel = useCallback((ctx: CanvasRenderingContext2D, sx: number, sy: number, color: string, isHighlight: boolean, pixelSize = 3) => {
    if (isHighlight) {
      ctx.shadowColor = '#FFD700';
      ctx.shadowBlur = 15;
      ctx.fillStyle = '#FFD700';
      ctx.fillRect(sx - pixelSize, sy - pixelSize, pixelSize * 2, pixelSize * 2);
      ctx.shadowBlur = 0;
    } else {
      ctx.fillStyle = color;
      ctx.fillRect(sx - pixelSize / 2, sy - pixelSize / 2, pixelSize, pixelSize);
    }
  }, []);

  // Draw polygon shape
  const drawShape = useCallback((ctx: CanvasRenderingContext2D, vertices: { x: number; y: number }[], color: string, dashed = false) => {
    if (vertices.length < 2) return;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    if (dashed) ctx.setLineDash([8, 4]);
    else ctx.setLineDash([]);

    ctx.beginPath();
    const first = toScreen(vertices[0].x, vertices[0].y);
    ctx.moveTo(first.sx, first.sy);
    for (let i = 1; i < vertices.length; i++) {
      const pt = toScreen(vertices[i].x, vertices[i].y);
      ctx.lineTo(pt.sx, pt.sy);
    }
    if (vertices.length > 2) ctx.closePath();
    ctx.stroke();
    ctx.setLineDash([]);

    // Vertex dots
    vertices.forEach((v, i) => {
      const pt = toScreen(v.x, v.y);
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(pt.sx, pt.sy, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#E6EDF3';
      ctx.font = '10px Inter';
      ctx.fillText(`(${v.x},${v.y})`, pt.sx + 6, pt.sy - 6);
    });
  }, [toScreen]);

  // Main render
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 0, width, height);

    if (showGrid) drawGrid(ctx);

    // Draw original shape
    if (originalShape) drawShape(ctx, originalShape, '#FFFFFF');

    // Draw transformed shape
    if (transformedShape) drawShape(ctx, transformedShape, '#00FFFF', true);

    // Draw algorithm steps up to current step
    if (steps.length > 0 && !isTransformation) {
      const stepsToShow = steps.slice(0, currentStep + 1);
      stepsToShow.forEach((step, i) => {
        const { sx, sy } = toScreen(step.x, step.y);
        const isLast = i === stepsToShow.length - 1;
        drawPixel(ctx, sx, sy, '#00B4D8', isLast);
      });
    }
  }, [steps, currentStep, width, height, showGrid, drawGrid, drawPixel, toScreen, originalShape, transformedShape, drawShape, isTransformation]);

  useEffect(() => {
    render();
  }, [render]);

  // Animation loop
  useEffect(() => {
    if (!isPlaying || steps.length === 0) return;

    const interval = Math.max(10, 500 - speed * 4.5);
    const animate = (time: number) => {
      if (time - lastTimeRef.current >= interval) {
        lastTimeRef.current = time;
        setCurrentStep(prev => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [isPlaying, speed, steps.length]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === 'Space') { e.preventDefault(); setIsPlaying(p => !p); }
      if (e.code === 'KeyR') { setCurrentStep(0); setIsPlaying(false); }
      if (e.code === 'ArrowRight') setCurrentStep(p => Math.min(p + 1, steps.length - 1));
      if (e.code === 'ArrowLeft') setCurrentStep(p => Math.max(p - 1, 0));
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [steps.length]);

  const currentStepData = steps[currentStep];

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      {/* Canvas */}
      <div className="flex-1">
        <div className="canvas-container">
          <canvas ref={canvasRef} width={width} height={height} className="w-full h-auto" />
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{ background: isPlaying ? '#F85149' : '#00B4D8', color: '#0D1117' }}
          >
            {isPlaying ? '⏸ Pause' : '▶ Play'}
          </button>
          <button
            onClick={() => setCurrentStep(p => Math.min(p + 1, steps.length - 1))}
            className="px-3 py-2 rounded-lg text-sm transition-all hover:bg-[#1C2333]"
            style={{ background: '#161B22', border: '1px solid #30363D' }}
          >
            Step →
          </button>
          <button
            onClick={() => { setCurrentStep(0); setIsPlaying(false); }}
            className="px-3 py-2 rounded-lg text-sm transition-all hover:bg-[#1C2333]"
            style={{ background: '#161B22', border: '1px solid #30363D' }}
          >
            ↺ Reset
          </button>
          <button
            onClick={() => setSpeed(s => s <= 20 ? 20 : 20)}
            className={`px-3 py-2 rounded-lg text-sm transition-all ${speed <= 20 ? 'text-[#FFD700]' : ''}`}
            style={{ background: '#161B22', border: '1px solid #30363D' }}
          >
            🐌 Slow Mo
          </button>

          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs" style={{ color: '#6B7280' }}>Speed</span>
            <input
              type="range" min="5" max="100" value={speed}
              onChange={(e) => setSpeed(parseInt(e.target.value))}
              className="w-24 accent-[#00B4D8]"
            />
          </div>
        </div>

        {/* Progress bar */}
        {steps.length > 0 && (
          <div className="mt-2">
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#30363D' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #00B4D8, #7B2FBE)' }}
                animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
            <div className="flex justify-between text-xs mt-1" style={{ color: '#6B7280' }}>
              <span>Step {currentStep + 1} / {steps.length}</span>
              <span>⌨ Space=Play/Pause, R=Reset, ←→=Step</span>
            </div>
          </div>
        )}
      </div>

      {/* Decision Parameter Panel */}
      {currentStepData && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:w-64 p-4 rounded-xl"
          style={{ background: '#161B22', border: '1px solid #30363D' }}
        >
          <h3 className="text-sm font-bold mb-3" style={{ color: '#00B4D8' }}>
            📊 Current Step
          </h3>

          <div className="space-y-3">
            <div className="p-2 rounded-lg" style={{ background: '#0D1117' }}>
              <span className="text-xs block" style={{ color: '#8B949E' }}>Pixel Position</span>
              <span className="font-mono text-sm font-bold">
                ({currentStepData.x}, {currentStepData.y})
              </span>
            </div>

            {currentStepData.decisionParam !== undefined && (
              <div className="p-2 rounded-lg" style={{ background: '#0D1117' }}>
                <span className="text-xs block" style={{ color: '#8B949E' }}>Decision Parameter</span>
                <span className="font-mono text-sm font-bold" style={{
                  color: currentStepData.decisionParam < 0 ? '#F85149' : '#3FB950'
                }}>
                  p = {currentStepData.decisionParam}
                </span>
              </div>
            )}

            {currentStepData.label && (
              <div className="p-2 rounded-lg" style={{ background: '#0D1117' }}>
                <span className="text-xs block" style={{ color: '#8B949E' }}>Details</span>
                <span className="font-mono text-xs break-all">{currentStepData.label}</span>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
