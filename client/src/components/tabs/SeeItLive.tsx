import { useState, useMemo } from 'react';
import CanvasVisualizer from '../canvas/CanvasVisualizer';
import type { ProgramData } from '../../types';
import * as algos from '../../algorithms';

interface SeeItLiveProps {
  program: ProgramData;
}

// Default parameters for each algorithm
const DEFAULT_PARAMS: Record<string, any> = {
  'direct-line': { x1: -100, y1: -50, x2: 150, y2: 80 },
  'dda-line': { x1: -120, y1: -60, x2: 140, y2: 70 },
  'bresenham-line': { x1: -100, y1: -40, x2: 160, y2: 90 },
  'line-rotation': { x1: 0, y1: 0, x2: 120, y2: 0, angle: 45 },
  'arc-drawing': { cx: 0, cy: 0, r: 100, startAngle: 30, endAngle: 150 },
  'midpoint-circle': { cx: 0, cy: 0, r: 100 },
  'bresenham-circle': { cx: 0, cy: 0, r: 100 },
  'midpoint-ellipse': { cx: 0, cy: 0, rx: 150, ry: 80 },
  'point-translation': { x: 50, y: 50, tx: 100, ty: 60 },
  'line-translation': { x1: -80, y1: -40, x2: 20, y2: 60, tx: 120, ty: 30 },
  'triangle-translation': { v: [{ x: -50, y: 30 }, { x: 30, y: 30 }, { x: -10, y: 100 }], tx: 120, ty: -30 },
  'triangle-scaling': { v: [{ x: 20, y: 20 }, { x: 80, y: 20 }, { x: 50, y: 80 }], sx: 2, sy: 1.5 },
  'triangle-xshear': { v: [{ x: -60, y: -40 }, { x: 0, y: -40 }, { x: -30, y: 40 }], shx: 0.5 },
  'triangle-yshear': { v: [{ x: -60, y: -40 }, { x: 0, y: -40 }, { x: -30, y: 40 }], shy: 0.5 },
  'triangle-rotation': { v: [{ x: 50, y: 20 }, { x: 120, y: 20 }, { x: 85, y: 80 }], angle: 45 },
  'rectangle-scaling': { v: [{ x: 20, y: 20 }, { x: 100, y: 20 }, { x: 100, y: 70 }, { x: 20, y: 70 }], sx: 1.8, sy: 1.5 },
  'rectangle-xshear': { v: [{ x: -60, y: -30 }, { x: 40, y: -30 }, { x: 40, y: 30 }, { x: -60, y: 30 }], shx: 0.5 },
  'rectangle-yshear': { v: [{ x: -60, y: -30 }, { x: 40, y: -30 }, { x: 40, y: 30 }, { x: -60, y: 30 }], shy: 0.4 },
  'rectangle-rotation': { v: [{ x: 30, y: 20 }, { x: 120, y: 20 }, { x: 120, y: 70 }, { x: 30, y: 70 }], angle: 45 },
  'sector-drawing': { cx: 0, cy: 0, r: 120, startAngle: 30, endAngle: 120 },
};

export default function SeeItLive({ program }: SeeItLiveProps) {
  const params = DEFAULT_PARAMS[program.id] || {};
  const [inputParams, setInputParams] = useState(params);

  const { steps, originalShape, transformedShape, isTransformation } = useMemo(() => {
    const p = inputParams;
    let steps: any[] = [];
    let originalShape: any = undefined;
    let transformedShape: any = undefined;
    let isTransformation = false;

    switch (program.id) {
      case 'direct-line':
        steps = algos.directLineAlgorithm(p.x1, p.y1, p.x2, p.y2);
        break;
      case 'dda-line':
        steps = algos.ddaLineAlgorithm(p.x1, p.y1, p.x2, p.y2);
        break;
      case 'bresenham-line':
        steps = algos.bresenhamLineAlgorithm(p.x1, p.y1, p.x2, p.y2);
        break;
      case 'line-rotation': {
        const res = algos.lineRotation({ x: p.x1, y: p.y1 }, { x: p.x2, y: p.y2 }, p.angle);
        originalShape = res.original;
        transformedShape = res.transformed;
        isTransformation = true;
        break;
      }
      case 'arc-drawing':
        steps = algos.arcAlgorithm(p.cx, p.cy, p.r, p.startAngle, p.endAngle);
        break;
      case 'midpoint-circle':
        steps = algos.midpointCircleAlgorithm(p.cx, p.cy, p.r);
        break;
      case 'bresenham-circle':
        steps = algos.bresenhamCircleAlgorithm(p.cx, p.cy, p.r);
        break;
      case 'midpoint-ellipse':
        steps = algos.midpointEllipseAlgorithm(p.cx, p.cy, p.rx, p.ry);
        break;
      case 'point-translation': {
        const res = algos.pointTranslation({ x: p.x, y: p.y }, p.tx, p.ty);
        originalShape = [res.original];
        transformedShape = [res.transformed];
        steps = res.steps;
        isTransformation = true;
        break;
      }
      case 'line-translation': {
        const res = algos.lineTranslation({ x: p.x1, y: p.y1 }, { x: p.x2, y: p.y2 }, p.tx, p.ty);
        originalShape = res.original;
        transformedShape = res.transformed;
        isTransformation = true;
        break;
      }
      case 'triangle-translation': {
        const res = algos.polygonTranslation(p.v, p.tx, p.ty);
        originalShape = res.original;
        transformedShape = res.transformed;
        isTransformation = true;
        break;
      }
      case 'triangle-scaling': {
        const res = algos.polygonScaling(p.v, p.sx, p.sy);
        originalShape = res.original;
        transformedShape = res.transformed;
        isTransformation = true;
        break;
      }
      case 'triangle-xshear': {
        const res = algos.polygonXShear(p.v, p.shx);
        originalShape = res.original;
        transformedShape = res.transformed;
        isTransformation = true;
        break;
      }
      case 'triangle-yshear': {
        const res = algos.polygonYShear(p.v, p.shy);
        originalShape = res.original;
        transformedShape = res.transformed;
        isTransformation = true;
        break;
      }
      case 'triangle-rotation': {
        const res = algos.polygonRotation(p.v, p.angle);
        originalShape = res.original;
        transformedShape = res.transformed;
        isTransformation = true;
        break;
      }
      case 'rectangle-scaling': {
        const res = algos.polygonScaling(p.v, p.sx, p.sy);
        originalShape = res.original;
        transformedShape = res.transformed;
        isTransformation = true;
        break;
      }
      case 'rectangle-xshear': {
        const res = algos.polygonXShear(p.v, p.shx);
        originalShape = res.original;
        transformedShape = res.transformed;
        isTransformation = true;
        break;
      }
      case 'rectangle-yshear': {
        const res = algos.polygonYShear(p.v, p.shy);
        originalShape = res.original;
        transformedShape = res.transformed;
        isTransformation = true;
        break;
      }
      case 'rectangle-rotation': {
        const res = algos.polygonRotation(p.v, p.angle);
        originalShape = res.original;
        transformedShape = res.transformed;
        isTransformation = true;
        break;
      }
      case 'sector-drawing':
        steps = algos.sectorAlgorithm(p.cx, p.cy, p.r, p.startAngle, p.endAngle);
        break;
    }

    return { steps, originalShape, transformedShape, isTransformation };
  }, [program.id, inputParams]);

  // Build parameter controls
  const paramControls = useMemo(() => {
    const controls: { key: string; label: string; min: number; max: number; step: number }[] = [];
    const p = inputParams;
    if ('x1' in p) controls.push({ key: 'x1', label: 'X₁', min: -200, max: 200, step: 5 });
    if ('y1' in p) controls.push({ key: 'y1', label: 'Y₁', min: -200, max: 200, step: 5 });
    if ('x2' in p) controls.push({ key: 'x2', label: 'X₂', min: -200, max: 200, step: 5 });
    if ('y2' in p) controls.push({ key: 'y2', label: 'Y₂', min: -200, max: 200, step: 5 });
    if ('cx' in p) controls.push({ key: 'cx', label: 'Center X', min: -150, max: 150, step: 5 });
    if ('cy' in p) controls.push({ key: 'cy', label: 'Center Y', min: -150, max: 150, step: 5 });
    if ('r' in p) controls.push({ key: 'r', label: 'Radius', min: 20, max: 200, step: 5 });
    if ('rx' in p) controls.push({ key: 'rx', label: 'Radius X', min: 20, max: 200, step: 5 });
    if ('ry' in p) controls.push({ key: 'ry', label: 'Radius Y', min: 20, max: 200, step: 5 });
    if ('tx' in p) controls.push({ key: 'tx', label: 'Translate X', min: -200, max: 200, step: 10 });
    if ('ty' in p) controls.push({ key: 'ty', label: 'Translate Y', min: -200, max: 200, step: 10 });
    if ('sx' in p) controls.push({ key: 'sx', label: 'Scale X', min: 0.2, max: 3, step: 0.1 });
    if ('sy' in p) controls.push({ key: 'sy', label: 'Scale Y', min: 0.2, max: 3, step: 0.1 });
    if ('shx' in p) controls.push({ key: 'shx', label: 'Shear X', min: -2, max: 2, step: 0.1 });
    if ('shy' in p) controls.push({ key: 'shy', label: 'Shear Y', min: -2, max: 2, step: 0.1 });
    if ('angle' in p) controls.push({ key: 'angle', label: 'Angle °', min: -360, max: 360, step: 5 });
    if ('startAngle' in p) controls.push({ key: 'startAngle', label: 'Start °', min: 0, max: 360, step: 5 });
    if ('endAngle' in p) controls.push({ key: 'endAngle', label: 'End °', min: 0, max: 360, step: 5 });
    return controls;
  }, [inputParams]);

  return (
    <div className="space-y-8">
      {/* Parameter Controls */}
      <div className="rounded-xl p-6" style={{ background: '#161B22', border: '1px solid #30363D' }}>
        <h3 className="text-base font-bold mb-4 flex items-center gap-2" style={{ color: '#00B4D8' }}>
          <span>🎮</span> Parameters — drag to change!
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {paramControls.map(ctrl => (
            <div key={ctrl.key}>
              <label className="text-xs font-mono block mb-1" style={{ color: '#8B949E' }}>{ctrl.label}</label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={ctrl.min} max={ctrl.max} step={ctrl.step}
                  value={inputParams[ctrl.key]}
                  onChange={(e) => setInputParams((prev: any) => ({ ...prev, [ctrl.key]: parseFloat(e.target.value) }))}
                  className="flex-1 accent-[#00B4D8]"
                />
                <span className="text-xs font-mono w-12 text-right" style={{ color: '#E6EDF3' }}>
                  {inputParams[ctrl.key]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      {isTransformation && (
        <div className="flex gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 rounded" style={{ background: '#FFFFFF' }}></div>
            <span style={{ color: '#8B949E' }}>Original (White)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 rounded" style={{ background: '#00FFFF', borderTop: '1px dashed #00FFFF' }}></div>
            <span style={{ color: '#8B949E' }}>Transformed (Cyan)</span>
          </div>
        </div>
      )}

      {/* Canvas */}
      <CanvasVisualizer
        steps={steps}
        originalShape={originalShape}
        transformedShape={transformedShape}
        isTransformation={isTransformation}
        width={640}
        height={480}
      />
    </div>
  );
}
