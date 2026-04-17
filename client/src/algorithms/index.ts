import type { AlgorithmStep } from '../types';

// ===================== LINE ALGORITHMS =====================

export function directLineAlgorithm(x1: number, y1: number, x2: number, y2: number): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  if (x2 === x1) {
    const dir = y2 > y1 ? 1 : -1;
    for (let y = y1; dir > 0 ? y <= y2 : y >= y2; y += dir) {
      steps.push({ x: x1, y, label: `x=${x1}, y=${y}` });
    }
    return steps;
  }
  const m = (y2 - y1) / (x2 - x1);
  const c = y1 - m * x1;
  const dir = x2 > x1 ? 1 : -1;
  for (let x = x1; dir > 0 ? x <= x2 : x >= x2; x += dir) {
    const y = Math.round(m * x + c);
    steps.push({ x, y, label: `y = ${m.toFixed(2)}×${x} + ${c.toFixed(2)} = ${y}`, decisionParam: m });
  }
  return steps;
}

export function ddaLineAlgorithm(x1: number, y1: number, x2: number, y2: number): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const dx = x2 - x1;
  const dy = y2 - y1;
  const numSteps = Math.max(Math.abs(dx), Math.abs(dy));
  if (numSteps === 0) {
    steps.push({ x: x1, y: y1, label: 'Single point' });
    return steps;
  }
  const xInc = dx / numSteps;
  const yInc = dy / numSteps;
  let x = x1, y = y1;
  for (let i = 0; i <= numSteps; i++) {
    steps.push({
      x: Math.round(x), y: Math.round(y),
      label: `Step ${i}: (${x.toFixed(2)}, ${y.toFixed(2)}) → pixel (${Math.round(x)}, ${Math.round(y)})`,
      decisionParam: i,
    });
    x += xInc;
    y += yInc;
  }
  return steps;
}

export function bresenhamLineAlgorithm(x1: number, y1: number, x2: number, y2: number): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const dx = Math.abs(x2 - x1);
  const dy = Math.abs(y2 - y1);
  const sx = x1 < x2 ? 1 : -1;
  const sy = y1 < y2 ? 1 : -1;

  let steep = dy > dx;
  let err = (steep ? dy : dx);
  let p = 2 * (steep ? dx : dy) - err;
  let x = x1, y = y1;

  const majorSteps = steep ? dy : dx;
  steps.push({ x, y, label: `Start (${x},${y}), p₀ = ${p}`, decisionParam: p });

  for (let i = 0; i < majorSteps; i++) {
    if (steep) {
      y += sy;
      if (p < 0) {
        p += 2 * dx;
      } else {
        x += sx;
        p += 2 * dx - 2 * dy;
      }
    } else {
      x += sx;
      if (p < 0) {
        p += 2 * dy;
      } else {
        y += sy;
        p += 2 * dy - 2 * dx;
      }
    }
    steps.push({
      x, y,
      label: `(${x},${y}), p = ${p}`,
      decisionParam: p,
    });
  }
  return steps;
}

// ===================== CURVE ALGORITHMS =====================

export function midpointCircleAlgorithm(cx: number, cy: number, r: number): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  let x = 0, y = r;
  let p = 1 - r;

  const addOctants = (px: number, py: number, param: number) => {
    const points = [
      { x: cx + px, y: cy + py }, { x: cx - px, y: cy + py },
      { x: cx + px, y: cy - py }, { x: cx - px, y: cy - py },
      { x: cx + py, y: cy + px }, { x: cx - py, y: cy + px },
      { x: cx + py, y: cy - px }, { x: cx - py, y: cy - px },
    ];
    points.forEach((pt, i) => {
      steps.push({
        x: pt.x, y: pt.y,
        label: `Octant ${i + 1}: (${pt.x},${pt.y}), p=${param}`,
        decisionParam: param,
        highlight: i === 0,
      });
    });
  };

  addOctants(x, y, p);
  while (x < y) {
    x++;
    if (p < 0) {
      p = p + 2 * x + 1;
    } else {
      y--;
      p = p + 2 * x - 2 * y + 1;
    }
    addOctants(x, y, p);
  }
  return steps;
}

export function bresenhamCircleAlgorithm(cx: number, cy: number, r: number): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  let x = 0, y = r;
  let d = 3 - 2 * r;

  const addOctants = (px: number, py: number, param: number) => {
    [
      [cx + px, cy + py], [cx - px, cy + py],
      [cx + px, cy - py], [cx - px, cy - py],
      [cx + py, cy + px], [cx - py, cy + px],
      [cx + py, cy - px], [cx - py, cy - px],
    ].forEach(([x, y], i) => {
      steps.push({ x, y, label: `(${x},${y}) d=${param}`, decisionParam: param, highlight: i === 0 });
    });
  };

  while (x <= y) {
    addOctants(x, y, d);
    if (d < 0) {
      d = d + 4 * x + 6;
    } else {
      d = d + 4 * (x - y) + 10;
      y--;
    }
    x++;
  }
  return steps;
}

export function midpointEllipseAlgorithm(cx: number, cy: number, rx: number, ry: number): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  let x = 0, y = ry;
  const rx2 = rx * rx, ry2 = ry * ry;
  let p1 = ry2 - rx2 * ry + 0.25 * rx2;

  const addQuadrants = (px: number, py: number, param: number, region: number) => {
    [
      [cx + px, cy + py], [cx - px, cy + py],
      [cx + px, cy - py], [cx - px, cy - py],
    ].forEach(([x, y]) => {
      steps.push({ x, y, label: `R${region} (${x},${y}) p=${param.toFixed(1)}`, decisionParam: param });
    });
  };

  // Region 1
  while (2 * ry2 * x < 2 * rx2 * y) {
    addQuadrants(x, y, p1, 1);
    if (p1 < 0) {
      x++;
      p1 += 2 * ry2 * x + ry2;
    } else {
      x++; y--;
      p1 += 2 * ry2 * x - 2 * rx2 * y + ry2;
    }
  }

  // Region 2
  let p2 = ry2 * (x + 0.5) * (x + 0.5) + rx2 * (y - 1) * (y - 1) - rx2 * ry2;
  while (y >= 0) {
    addQuadrants(x, y, p2, 2);
    if (p2 > 0) {
      y--;
      p2 -= 2 * rx2 * y + rx2;
    } else {
      x++; y--;
      p2 += 2 * ry2 * x - 2 * rx2 * y + rx2;
    }
  }
  return steps;
}

export function arcAlgorithm(cx: number, cy: number, r: number, startAngle: number, endAngle: number): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  for (let a = startAngle; a <= endAngle; a++) {
    const rad = (a * Math.PI) / 180;
    const x = Math.round(cx + r * Math.cos(rad));
    const y = Math.round(cy - r * Math.sin(rad));
    steps.push({ x, y, label: `θ=${a}°, (${x},${y})`, decisionParam: a });
  }
  return steps;
}

export function sectorAlgorithm(cx: number, cy: number, r: number, startAngle: number, endAngle: number): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];

  // First radius line
  const rad1 = (startAngle * Math.PI) / 180;
  const sx = Math.round(cx + r * Math.cos(rad1));
  const sy = Math.round(cy - r * Math.sin(rad1));
  const dxLine1 = sx - cx, dyLine1 = sy - cy;
  const stepsLine1 = Math.max(Math.abs(dxLine1), Math.abs(dyLine1));
  for (let i = 0; i <= stepsLine1; i++) {
    const t = stepsLine1 === 0 ? 0 : i / stepsLine1;
    steps.push({
      x: Math.round(cx + dxLine1 * t),
      y: Math.round(cy + dyLine1 * t),
      label: `Radius 1: step ${i}`,
    });
  }

  // Arc
  for (let a = startAngle; a <= endAngle; a++) {
    const rad = (a * Math.PI) / 180;
    steps.push({
      x: Math.round(cx + r * Math.cos(rad)),
      y: Math.round(cy - r * Math.sin(rad)),
      label: `Arc θ=${a}°`,
      decisionParam: a,
    });
  }

  // Second radius line
  const rad2 = (endAngle * Math.PI) / 180;
  const ex = Math.round(cx + r * Math.cos(rad2));
  const ey = Math.round(cy - r * Math.sin(rad2));
  const dxLine2 = cx - ex, dyLine2 = cy - ey;
  const stepsLine2 = Math.max(Math.abs(dxLine2), Math.abs(dyLine2));
  for (let i = 0; i <= stepsLine2; i++) {
    const t = stepsLine2 === 0 ? 0 : i / stepsLine2;
    steps.push({
      x: Math.round(ex + dxLine2 * t),
      y: Math.round(ey + dyLine2 * t),
      label: `Radius 2: step ${i}`,
    });
  }
  return steps;
}

// ===================== TRANSFORMATION ALGORITHMS =====================

interface Point { x: number; y: number }

export function pointTranslation(p: Point, tx: number, ty: number): { original: Point; transformed: Point; steps: AlgorithmStep[] } {
  const transformed = { x: p.x + tx, y: p.y + ty };
  return {
    original: p,
    transformed,
    steps: [
      { x: p.x, y: p.y, label: `Original: (${p.x}, ${p.y})` },
      { x: transformed.x, y: transformed.y, label: `Translated: (${p.x}+${tx}, ${p.y}+${ty}) = (${transformed.x}, ${transformed.y})` },
    ],
  };
}

export function lineTranslation(p1: Point, p2: Point, tx: number, ty: number) {
  return {
    original: [p1, p2],
    transformed: [{ x: p1.x + tx, y: p1.y + ty }, { x: p2.x + tx, y: p2.y + ty }],
  };
}

export function polygonTranslation(vertices: Point[], tx: number, ty: number) {
  return {
    original: vertices,
    transformed: vertices.map(v => ({ x: v.x + tx, y: v.y + ty })),
  };
}

export function polygonScaling(vertices: Point[], sx: number, sy: number, fixed?: Point) {
  const fx = fixed?.x ?? 0;
  const fy = fixed?.y ?? 0;
  return {
    original: vertices,
    transformed: vertices.map(v => ({
      x: Math.round(fx + (v.x - fx) * sx),
      y: Math.round(fy + (v.y - fy) * sy),
    })),
  };
}

export function polygonXShear(vertices: Point[], shx: number) {
  return {
    original: vertices,
    transformed: vertices.map(v => ({
      x: Math.round(v.x + shx * v.y),
      y: v.y,
    })),
  };
}

export function polygonYShear(vertices: Point[], shy: number) {
  return {
    original: vertices,
    transformed: vertices.map(v => ({
      x: v.x,
      y: Math.round(v.y + shy * v.x),
    })),
  };
}

export function polygonRotation(vertices: Point[], angleDeg: number, pivot?: Point) {
  const cx = pivot?.x ?? Math.round(vertices.reduce((s, v) => s + v.x, 0) / vertices.length);
  const cy = pivot?.y ?? Math.round(vertices.reduce((s, v) => s + v.y, 0) / vertices.length);
  const rad = (angleDeg * Math.PI) / 180;
  return {
    original: vertices,
    transformed: vertices.map(v => ({
      x: Math.round(cx + (v.x - cx) * Math.cos(rad) - (v.y - cy) * Math.sin(rad)),
      y: Math.round(cy + (v.x - cx) * Math.sin(rad) + (v.y - cy) * Math.cos(rad)),
    })),
    pivot: { x: cx, y: cy },
  };
}

export function lineRotation(p1: Point, p2: Point, angleDeg: number, pivot?: Point) {
  return polygonRotation([p1, p2], angleDeg, pivot || p1);
}
