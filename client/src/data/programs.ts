import type { ProgramData } from '../types';

export const PROGRAM_LIST: { id: string; shortTitle: string; icon: string; category: string }[] = [
  { id: 'direct-line', shortTitle: 'Direct Line', icon: '📏', category: 'line' },
  { id: 'dda-line', shortTitle: 'DDA Line', icon: '🐜', category: 'line' },
  { id: 'bresenham-line', shortTitle: 'Bresenham Line', icon: '⚡', category: 'line' },
  { id: 'line-rotation', shortTitle: 'Line Rotation', icon: '🔄', category: 'transformation' },
  { id: 'arc-drawing', shortTitle: 'Arc Drawing', icon: '🌙', category: 'curve' },
  { id: 'midpoint-circle', shortTitle: 'Mid-Point Circle', icon: '⭕', category: 'curve' },
  { id: 'bresenham-circle', shortTitle: 'Bresenham Circle', icon: '🔵', category: 'curve' },
  { id: 'midpoint-ellipse', shortTitle: 'Mid-Point Ellipse', icon: '🥚', category: 'curve' },
  { id: 'point-translation', shortTitle: 'Point Translation', icon: '📍', category: 'transformation' },
  { id: 'line-translation', shortTitle: 'Line Translation', icon: '↗️', category: 'transformation' },
  { id: 'triangle-translation', shortTitle: 'Triangle Translation', icon: '🔺', category: 'transformation' },
  { id: 'triangle-scaling', shortTitle: 'Triangle Scaling', icon: '🔍', category: 'transformation' },
  { id: 'triangle-xshear', shortTitle: 'Triangle X-Shear', icon: '↔️', category: 'transformation' },
  { id: 'triangle-yshear', shortTitle: 'Triangle Y-Shear', icon: '↕️', category: 'transformation' },
  { id: 'triangle-rotation', shortTitle: 'Triangle Rotation', icon: '🌀', category: 'transformation' },
  { id: 'rectangle-scaling', shortTitle: 'Rectangle Scaling', icon: '⬜', category: 'transformation' },
  { id: 'rectangle-xshear', shortTitle: 'Rectangle X-Shear', icon: '▱', category: 'transformation' },
  { id: 'rectangle-yshear', shortTitle: 'Rectangle Y-Shear', icon: '▰', category: 'transformation' },
  { id: 'rectangle-rotation', shortTitle: 'Rectangle Rotation', icon: '🔲', category: 'transformation' },
  { id: 'sector-drawing', shortTitle: 'Sector Drawing', icon: '🍕', category: 'curve' },
];

export const PROGRAMS: Record<string, ProgramData> = {
  'direct-line': {
    id: 'direct-line',
    title: 'Direct Line Drawing (Slope-Intercept Method)',
    shortTitle: 'Direct Line',
    icon: '📏',
    category: 'line',
    analogy: "Imagine you have a ruler and you want to draw a line from one dot to another on graph paper. You just use the formula y = mx + c — like following a recipe! For every x, you calculate y, plot the dot, and connect them. It's the simplest way to draw a line, just like connecting dots in a coloring book! 🎨",
    theory: "The Direct Line algorithm uses the slope-intercept form of a line equation: y = mx + c. Given two endpoints (x1,y1) and (x2,y2), we calculate the slope m = (y2-y1)/(x2-x1) and intercept c = y1 - m*x1. Then for each x from x1 to x2, we compute y = mx + c and plot the pixel at (x, round(y)). This method is straightforward but involves floating-point multiplication for every pixel, making it slower than incremental methods like DDA or Bresenham.",
    algorithmSteps: [
      'Read two endpoints (x1, y1) and (x2, y2)',
      'Calculate slope: m = (y2 - y1) / (x2 - x1)',
      'Calculate y-intercept: c = y1 - m * x1',
      'For x = x1 to x2, compute y = m * x + c',
      'Plot pixel at (x, round(y))',
      'Repeat until x reaches x2',
    ],
    cppCode: `#include <graphics.h>
#include <conio.h>
#include <stdio.h>
#include <math.h>

int main() {
    int gd = DETECT, gm;
    initgraph(&gd, &gm, "C:\\\\TURBOC3\\\\BGI");

    int x1, y1, x2, y2;
    printf("Enter x1, y1: ");
    scanf("%d %d", &x1, &y1);
    printf("Enter x2, y2: ");
    scanf("%d %d", &x2, &y2);

    float m = (float)(y2 - y1) / (x2 - x1);
    float c = y1 - m * x1;

    for (int x = x1; x <= x2; x++) {
        int y = (int)(m * x + c + 0.5);
        putpixel(x, y, WHITE);
    }

    getch();
    closegraph();
    return 0;
}`,
    lineExplanations: {
      1: 'Include graphics library for drawing functions',
      2: 'Include conio for getch() — waits for key press',
      3: 'Include stdio for printf/scanf input/output',
      4: 'Include math for mathematical functions',
      6: 'Main function — program starts here',
      7: 'gd=DETECT auto-detects graphics driver, gm is graphics mode',
      8: 'Initialize graphics window with detected driver',
      10: 'Declare variables for two endpoints of the line',
      11: 'Prompt user to enter first point coordinates',
      12: 'Read x1 and y1 from keyboard',
      13: 'Prompt user to enter second point coordinates',
      14: 'Read x2 and y2 from keyboard',
      16: 'Calculate slope m = rise/run = (y2-y1)/(x2-x1)',
      17: 'Calculate y-intercept c using point-slope form: c = y1 - m*x1',
      19: 'Loop from x1 to x2, incrementing x by 1 each time',
      20: 'Calculate y using line equation, +0.5 for rounding',
      21: 'Plot a white pixel at position (x, y) on screen',
      24: 'Wait for user to press a key before closing',
      25: 'Close the graphics window and free memory',
      26: 'Return 0 — program completed successfully',
    },
    keyLines: [16, 17, 19, 20, 21],
    complexity: 'O(|x2 - x1|)',
    quiz: [
      {
        question: 'What formula does the Direct Line method use to draw a line?',
        options: ['y = mx + c', 'y = x² + bx + c', 'x² + y² = r²', 'y = sin(x)'],
        correct: 0,
        explanation: 'The Direct Line method uses the slope-intercept form y = mx + c, where m is the slope and c is the y-intercept.',
      },
      {
        question: 'What is the main disadvantage of the Direct Line method?',
        options: ['It cannot draw vertical lines', 'It uses floating-point multiplication for every pixel', 'It only works in black and white', 'It requires a GPU'],
        correct: 1,
        explanation: 'For every pixel, the algorithm computes y = mx + c which involves a floating-point multiplication, making it slower than incremental methods.',
      },
      {
        question: 'If slope m = 2 and c = 3, what is y when x = 5?',
        options: ['10', '13', '8', '15'],
        correct: 1,
        explanation: 'Using y = mx + c: y = 2 × 5 + 3 = 10 + 3 = 13.',
      },
    ],
    challengeType: 'calculate',
    challengeTitle: 'Connect the Dots',
    challengeDescription: 'Given 5 random points on a line with y = mx + c, predict the y value for each x coordinate. Type your answers!',
  },

  'dda-line': {
    id: 'dda-line',
    title: 'DDA Line Drawing Algorithm',
    shortTitle: 'DDA Line',
    icon: '🐜',
    category: 'line',
    analogy: "Imagine an ant 🐜 walking from your house to school. Instead of calculating the exact path for every step, the ant takes tiny, equal-sized steps — each time moving a little bit in x and a little bit in y. That's DDA! It's like walking in a straight line by taking baby steps. Each step is the same size, making it super smooth! 🚶‍♂️",
    theory: "DDA (Digital Differential Analyzer) is an incremental scan-conversion algorithm. It calculates the next point based on the previous point. Given endpoints (x1,y1) and (x2,y2), it finds the number of steps as max(|dx|, |dy|), then increments x by dx/steps and y by dy/steps at each iteration. While simpler than the direct method, it still uses floating-point arithmetic.",
    algorithmSteps: [
      'Read endpoints (x1, y1) and (x2, y2)',
      'Calculate dx = x2 - x1, dy = y2 - y1',
      'Find steps = max(|dx|, |dy|)',
      'Calculate xIncrement = dx / steps',
      'Calculate yIncrement = dy / steps',
      'Start at (x1, y1)',
      'For i = 0 to steps: plot(round(x), round(y)), then x += xIncrement, y += yIncrement',
    ],
    cppCode: `#include <graphics.h>
#include <conio.h>
#include <stdio.h>
#include <math.h>

int main() {
    int gd = DETECT, gm;
    initgraph(&gd, &gm, "C:\\\\TURBOC3\\\\BGI");

    int x1, y1, x2, y2;
    printf("Enter x1, y1: ");
    scanf("%d %d", &x1, &y1);
    printf("Enter x2, y2: ");
    scanf("%d %d", &x2, &y2);

    int dx = x2 - x1;
    int dy = y2 - y1;
    int steps = abs(dx) > abs(dy) ? abs(dx) : abs(dy);

    float xInc = (float)dx / steps;
    float yInc = (float)dy / steps;

    float x = x1, y = y1;
    for (int i = 0; i <= steps; i++) {
        putpixel((int)(x + 0.5), (int)(y + 0.5), WHITE);
        x += xInc;
        y += yInc;
    }

    getch();
    closegraph();
    return 0;
}`,
    lineExplanations: {
      1: 'Include graphics library for putpixel and drawing',
      6: 'Main function entry point',
      7: 'Auto-detect graphics driver and mode',
      8: 'Open a graphics window',
      10: 'Declare endpoint coordinates',
      16: 'Calculate horizontal distance dx',
      17: 'Calculate vertical distance dy',
      18: 'Steps = whichever distance is larger (ensures no gaps)',
      20: 'How much to move in x per step (could be fractional)',
      21: 'How much to move in y per step (could be fractional)',
      23: 'Start position at first endpoint',
      24: 'Loop from step 0 to total steps',
      25: 'Plot pixel at rounded position — +0.5 for proper rounding',
      26: 'Move x position by the increment',
      27: 'Move y position by the increment',
    },
    keyLines: [16, 17, 18, 20, 21, 25],
    complexity: 'O(max(|dx|, |dy|))',
    quiz: [
      {
        question: 'What does DDA stand for?',
        options: ['Digital Differential Analyzer', 'Direct Drawing Algorithm', 'Display Data Accelerator', 'Digital Display Adapter'],
        correct: 0,
        explanation: 'DDA stands for Digital Differential Analyzer — it analyzes the difference between endpoints to draw a line incrementally.',
      },
      {
        question: 'What type of arithmetic does DDA use?',
        options: ['Only integer arithmetic', 'Floating-point arithmetic', 'Binary arithmetic', 'Hexadecimal arithmetic'],
        correct: 1,
        explanation: 'DDA uses floating-point arithmetic for the increments (xInc and yInc), which is why Bresenham is often preferred for performance.',
      },
      {
        question: 'For endpoints (2,3) and (12,7), how many steps will DDA take?',
        options: ['4', '7', '10', '14'],
        correct: 2,
        explanation: 'dx=10, dy=4. Steps = max(|10|, |4|) = 10. DDA takes 10 steps.',
      },
    ],
    challengeType: 'calculate',
    challengeTitle: 'Count the Steps',
    challengeDescription: 'Given two endpoints, calculate how many steps DDA would take. Enter the answer!',
  },

  'bresenham-line': {
    id: 'bresenham-line',
    title: "Bresenham's Line Drawing Algorithm",
    shortTitle: 'Bresenham Line',
    icon: '⚡',
    category: 'line',
    analogy: "Think of walking on a sidewalk made of square tiles 🧱. You want to walk from one corner to another in a straight line, but you can only step on whole tiles — no stepping on cracks! At each tile, you decide: 'Should I go right, or right AND up?' You make this decision using a simple number (the decision parameter). If it's positive, go diagonal. If negative, go straight. No fractions needed — just whole numbers! ⚡",
    theory: "Bresenham's algorithm is the most efficient line drawing algorithm — it uses ONLY integer arithmetic (addition and subtraction). It works by maintaining a decision parameter 'p' that determines whether the next pixel should be at (x+1, y) or (x+1, y+1). Initial p = 2dy - dx. If p < 0, choose (x+1, y) and p += 2dy. If p >= 0, choose (x+1, y+1) and p += 2dy - 2dx.",
    algorithmSteps: [
      'Read endpoints (x1, y1) and (x2, y2)',
      'Calculate dx = x2 - x1, dy = y2 - y1',
      'Calculate initial decision parameter: p = 2dy - dx',
      'Plot first point (x1, y1)',
      'For each step from x1 to x2:',
      '  If p < 0: next point is (x+1, y), update p = p + 2dy',
      '  If p >= 0: next point is (x+1, y+1), update p = p + 2dy - 2dx',
      'Plot the chosen pixel and repeat',
    ],
    cppCode: `#include <graphics.h>
#include <conio.h>
#include <stdio.h>
#include <math.h>

int main() {
    int gd = DETECT, gm;
    initgraph(&gd, &gm, "C:\\\\TURBOC3\\\\BGI");

    int x1, y1, x2, y2;
    printf("Enter x1, y1: ");
    scanf("%d %d", &x1, &y1);
    printf("Enter x2, y2: ");
    scanf("%d %d", &x2, &y2);

    int dx = abs(x2 - x1);
    int dy = abs(y2 - y1);
    int p = 2 * dy - dx;

    int x = x1, y = y1;
    int xEnd = x2;

    int sx = (x2 > x1) ? 1 : -1;
    int sy = (y2 > y1) ? 1 : -1;

    putpixel(x, y, WHITE);

    for (int i = 0; i < dx; i++) {
        x += sx;
        if (p < 0) {
            p = p + 2 * dy;
        } else {
            y += sy;
            p = p + 2 * dy - 2 * dx;
        }
        putpixel(x, y, WHITE);
    }

    getch();
    closegraph();
    return 0;
}`,
    lineExplanations: {
      16: 'Calculate absolute horizontal distance',
      17: 'Calculate absolute vertical distance',
      18: 'Initial decision parameter p = 2dy - dx (the magic number!)',
      20: 'Start at the first endpoint',
      23: 'Direction: +1 if going right, -1 if going left',
      24: 'Direction: +1 if going down, -1 if going up',
      26: 'Plot the starting pixel',
      28: 'Loop for dx steps (one step per x increment)',
      29: 'Always move one step in x direction',
      30: 'Check the decision parameter',
      31: 'p < 0: stay at same y, just update p by adding 2dy',
      33: 'p >= 0: also move one step in y direction',
      34: 'Update p by adding 2dy - 2dx',
      36: 'Plot the pixel at the new position',
    },
    keyLines: [18, 30, 31, 33, 34, 36],
    complexity: 'O(|dx|)',
    quiz: [
      {
        question: "What type of arithmetic does Bresenham's algorithm use?",
        options: ['Floating-point', 'Integer only', 'Complex numbers', 'Rational fractions'],
        correct: 1,
        explanation: "Bresenham's key advantage is that it uses ONLY integer arithmetic — addition and subtraction. No multiplication or division needed per pixel!",
      },
      {
        question: 'What is the initial decision parameter in Bresenham\'s Line algorithm?',
        options: ['p = dx - 2dy', 'p = 2dy - dx', 'p = dy - dx', 'p = 2dx - dy'],
        correct: 1,
        explanation: 'The initial decision parameter p = 2dy - dx. This value determines the first choice between the two pixel options.',
      },
      {
        question: 'When the decision parameter p >= 0, what happens?',
        options: ['Only x increments', 'Both x and y increment', 'Only y increments', 'Nothing changes'],
        correct: 1,
        explanation: 'When p >= 0, the next pixel is (x+1, y+1) — both x and y increment (diagonal step).',
      },
    ],
    challengeType: 'pixel-picker',
    challengeTitle: 'Pixel Picker',
    challengeDescription: 'A grid is shown with two endpoints marked. Click on the pixels that Bresenham\'s algorithm would choose to draw the line!',
  },

  'line-rotation': {
    id: 'line-rotation',
    title: '2D Line Rotation',
    shortTitle: 'Line Rotation',
    icon: '🔄',
    category: 'transformation',
    analogy: "Imagine a clock hand ⏰. It's stuck at one end (the center) and spins around. That's rotation! We take each point on the line and spin it by an angle around a center point using sin and cos — like a merry-go-round 🎠 for pixels!",
    theory: "2D rotation transforms each point (x, y) around a pivot point (px, py) by angle θ. The formula is: x' = px + (x-px)cos(θ) - (y-py)sin(θ), y' = py + (x-px)sin(θ) + (y-py)cos(θ). The angle is typically given in degrees and must be converted to radians. Positive angle = counter-clockwise rotation.",
    algorithmSteps: [
      'Read line endpoints (x1,y1) and (x2,y2)',
      'Read rotation angle θ and pivot point (px, py)',
      'Convert θ from degrees to radians: θ_rad = θ × π / 180',
      'For each endpoint (x, y):',
      '  x\' = px + (x - px) × cos(θ) - (y - py) × sin(θ)',
      '  y\' = py + (x - px) × sin(θ) + (y - py) × cos(θ)',
      'Draw original line and rotated line',
    ],
    cppCode: `#include <graphics.h>
#include <conio.h>
#include <stdio.h>
#include <math.h>

int main() {
    int gd = DETECT, gm;
    initgraph(&gd, &gm, "C:\\\\TURBOC3\\\\BGI");

    int x1, y1, x2, y2;
    float angle;

    printf("Enter line endpoints (x1 y1 x2 y2): ");
    scanf("%d %d %d %d", &x1, &y1, &x2, &y2);
    printf("Enter rotation angle (degrees): ");
    scanf("%f", &angle);

    // Draw original line in white
    line(x1, y1, x2, y2);
    outtextxy(x1, y1 - 10, "Original");

    float rad = angle * 3.14159 / 180.0;
    int px = x1, py = y1; // Rotate around first point

    int nx1 = px + (int)((x1 - px) * cos(rad) - (y1 - py) * sin(rad));
    int ny1 = py + (int)((x1 - px) * sin(rad) + (y1 - py) * cos(rad));
    int nx2 = px + (int)((x2 - px) * cos(rad) - (y2 - py) * sin(rad));
    int ny2 = py + (int)((x2 - px) * sin(rad) + (y2 - py) * cos(rad));

    setcolor(YELLOW);
    line(nx1, ny1, nx2, ny2);
    outtextxy(nx2, ny2 - 10, "Rotated");

    getch();
    closegraph();
    return 0;
}`,
    lineExplanations: {
      11: 'angle will store the rotation angle in degrees',
      19: 'Draw the original line in default white color',
      22: 'Convert degrees to radians (computer trig functions use radians)',
      23: 'Pivot point — we rotate around the first endpoint',
      25: 'Apply rotation formula to first point (stays same since it\'s the pivot)',
      26: 'Calculate new y of first point',
      27: 'Apply rotation formula to second point — this is where the magic happens!',
      28: 'Calculate new y of second point using sin and cos',
      30: 'Change drawing color to yellow for the rotated line',
      31: 'Draw the rotated line in yellow',
    },
    keyLines: [22, 25, 26, 27, 28, 31],
    complexity: 'O(1)',
    quiz: [
      {
        question: 'What trigonometric functions are used in 2D rotation?',
        options: ['tan and cot', 'sin and cos', 'sec and cosec', 'log and exp'],
        correct: 1,
        explanation: 'The rotation formula uses sin(θ) and cos(θ) to compute the new coordinates after rotation.',
      },
      {
        question: 'What must you convert the angle to before using sin/cos in C++?',
        options: ['Degrees', 'Radians', 'Gradians', 'Percentage'],
        correct: 1,
        explanation: 'C++ math functions like sin() and cos() expect angles in radians, not degrees. Convert using: radians = degrees × π / 180.',
      },
      {
        question: 'If a point (3, 0) is rotated 90° counter-clockwise around origin, where does it go?',
        options: ['(0, 3)', '(0, -3)', '(-3, 0)', '(3, 3)'],
        correct: 0,
        explanation: 'Using rotation: x\' = 3cos(90°) - 0sin(90°) = 0, y\' = 3sin(90°) + 0cos(90°) = 3. So (3,0) → (0,3).',
      },
    ],
    challengeType: 'direction',
    challengeTitle: 'Where Does It Point?',
    challengeDescription: 'An arrow points right. Rotate it by the given angle. Click the correct direction it would point!',
  },

  'arc-drawing': {
    id: 'arc-drawing',
    title: 'Arc Drawing Algorithm',
    shortTitle: 'Arc Drawing',
    icon: '🌙',
    category: 'curve',
    analogy: "Think of a rainbow 🌈 — it's not a full circle, just a piece of one! An arc is like eating only a slice of a pizza 🍕 instead of the whole thing. We draw part of a circle from one angle to another, like the curve of a smile 😊!",
    theory: "An arc is a portion of a circle defined by its center (cx, cy), radius r, start angle θ1, and end angle θ2. For each angle θ from θ1 to θ2, we compute x = cx + r×cos(θ) and y = cy + r×sin(θ) to plot points along the arc. The angular increment determines the smoothness of the arc.",
    algorithmSteps: [
      'Read center (cx, cy), radius r',
      'Read start angle θ1 and end angle θ2',
      'Convert angles to radians',
      'For θ = θ1 to θ2 (with small increment):',
      '  x = cx + r × cos(θ)',
      '  y = cy + r × sin(θ)',
      '  Plot pixel at (x, y)',
    ],
    cppCode: `#include <graphics.h>
#include <conio.h>
#include <stdio.h>
#include <math.h>

int main() {
    int gd = DETECT, gm;
    initgraph(&gd, &gm, "C:\\\\TURBOC3\\\\BGI");

    int cx, cy, r;
    int startAngle, endAngle;

    printf("Enter center (cx cy): ");
    scanf("%d %d", &cx, &cy);
    printf("Enter radius: ");
    scanf("%d", &r);
    printf("Enter start angle and end angle: ");
    scanf("%d %d", &startAngle, &endAngle);

    // Using built-in arc function
    arc(cx, cy, startAngle, endAngle, r);

    // Manual method using parametric form
    setcolor(YELLOW);
    for (int angle = startAngle; angle <= endAngle; angle++) {
        float rad = angle * 3.14159 / 180.0;
        int x = cx + (int)(r * cos(rad));
        int y = cy - (int)(r * sin(rad));
        putpixel(x, y, YELLOW);
    }

    getch();
    closegraph();
    return 0;
}`,
    lineExplanations: {
      10: 'Declare center coordinates and radius',
      11: 'Arc needs start and end angles (in degrees)',
      21: 'Built-in arc() function — draws arc directly',
      24: 'Manual approach: loop through each degree from start to end',
      25: 'Convert current angle to radians for cos/sin',
      26: 'Calculate x using parametric circle formula',
      27: 'Calculate y (negative because screen y-axis is inverted)',
      28: 'Plot each point of the arc',
    },
    keyLines: [21, 24, 25, 26, 27, 28],
    complexity: 'O(θ2 - θ1)',
    quiz: [
      {
        question: 'An arc is a portion of which shape?',
        options: ['Rectangle', 'Circle', 'Triangle', 'Square'],
        correct: 1,
        explanation: 'An arc is a part (segment) of a circle\'s circumference, defined by start and end angles.',
      },
      {
        question: 'What parameters define an arc?',
        options: ['Center, radius, start angle, end angle', 'Width and height', 'Two diagonal corners', 'Three random points'],
        correct: 0,
        explanation: 'An arc needs: center point (cx,cy), radius r, start angle θ1, and end angle θ2.',
      },
      {
        question: 'A semicircle is an arc from 0° to what angle?',
        options: ['90°', '180°', '270°', '360°'],
        correct: 1,
        explanation: 'A semicircle (half circle) spans 180 degrees — from 0° to 180°.',
      },
    ],
    challengeType: 'drag-match',
    challengeTitle: 'Match the Arc',
    challengeDescription: 'Given a center, radius, start and end angle, drag to create an arc that matches the target!',
  },

  'midpoint-circle': {
    id: 'midpoint-circle',
    title: 'Mid-Point Circle Drawing Algorithm',
    shortTitle: 'Mid-Point Circle',
    icon: '⭕',
    category: 'curve',
    analogy: "Imagine drawing a circle with Lego blocks 🧱 — you can only use whole blocks, no cutting! The midpoint algorithm is like a smart builder who looks at the midpoint between two possible block positions and asks: 'Is this midpoint inside or outside the circle?' If inside, choose the outer block. If outside, choose the inner one. Plus, thanks to symmetry, you only need to figure out 1/8 of the circle and mirror the rest — like folding a pizza 🍕 8 times!",
    theory: "The Mid-Point Circle algorithm uses the implicit equation of a circle: f(x,y) = x² + y² - r². Starting from (0, r), it evaluates a decision parameter at the midpoint between two candidate pixels. If the midpoint is inside the circle (p < 0), choose the outer pixel; otherwise, choose the inner pixel. It exploits 8-way symmetry: computing one octant gives all 8 symmetric points.",
    algorithmSteps: [
      'Read center (cx, cy) and radius r',
      'Start at (x=0, y=r)',
      'Calculate initial decision parameter: p = 1 - r',
      'Plot 8 symmetric points',
      'While x < y:',
      '  If p < 0: x++, p += 2x + 1',
      '  Else: x++, y--, p += 2x - 2y + 1',
      '  Plot 8 symmetric points for (x, y)',
    ],
    cppCode: `#include <graphics.h>
#include <conio.h>
#include <stdio.h>

void plotCirclePoints(int cx, int cy, int x, int y) {
    putpixel(cx + x, cy + y, WHITE);
    putpixel(cx - x, cy + y, WHITE);
    putpixel(cx + x, cy - y, WHITE);
    putpixel(cx - x, cy - y, WHITE);
    putpixel(cx + y, cy + x, WHITE);
    putpixel(cx - y, cy + x, WHITE);
    putpixel(cx + y, cy - x, WHITE);
    putpixel(cx - y, cy - x, WHITE);
}

int main() {
    int gd = DETECT, gm;
    initgraph(&gd, &gm, "C:\\\\TURBOC3\\\\BGI");

    int cx, cy, r;
    printf("Enter center (cx cy) and radius r: ");
    scanf("%d %d %d", &cx, &cy, &r);

    int x = 0, y = r;
    int p = 1 - r;

    plotCirclePoints(cx, cy, x, y);

    while (x < y) {
        x++;
        if (p < 0) {
            p = p + 2 * x + 1;
        } else {
            y--;
            p = p + 2 * x - 2 * y + 1;
        }
        plotCirclePoints(cx, cy, x, y);
    }

    getch();
    closegraph();
    return 0;
}`,
    lineExplanations: {
      5: 'Helper function to plot all 8 symmetric points at once',
      6: 'Octant 1: (cx+x, cy+y) — bottom right',
      7: 'Octant 2: (cx-x, cy+y) — bottom left',
      8: 'Octant 3: (cx+x, cy-y) — top right',
      9: 'Octant 4: (cx-x, cy-y) — top left',
      10: 'Octant 5: swap x,y → (cx+y, cy+x)',
      11: 'Octant 6: (cx-y, cy+x)',
      12: 'Octant 7: (cx+y, cy-x)',
      13: 'Octant 8: (cx-y, cy-x)',
      23: 'Start at top of circle: x=0, y=radius',
      24: 'Initial decision parameter p = 1 - r',
      28: 'Continue while in the first octant (x < y)',
      29: 'Always increment x',
      30: 'Check decision parameter',
      31: 'p < 0: midpoint inside circle, choose outer pixel, update p',
      33: 'p >= 0: midpoint outside, decrement y too',
      34: 'Update p for diagonal move',
    },
    keyLines: [23, 24, 28, 30, 31, 33, 34],
    complexity: 'O(r)',
    quiz: [
      {
        question: 'How many symmetric points does the Mid-Point Circle algorithm exploit?',
        options: ['2', '4', '6', '8'],
        correct: 3,
        explanation: 'A circle has 8-way symmetry. Computing one octant (1/8th) gives all 8 symmetric points automatically!',
      },
      {
        question: 'What is the initial decision parameter in the Mid-Point Circle algorithm?',
        options: ['p = r', 'p = 1 - r', 'p = 2r - 1', 'p = 0'],
        correct: 1,
        explanation: 'The initial decision parameter p = 1 - r. This comes from evaluating the circle equation at the first midpoint.',
      },
      {
        question: 'The algorithm starts at which point relative to the center?',
        options: ['(r, 0) — rightmost point', '(0, r) — topmost point', '(r, r) — diagonal', '(0, 0) — center'],
        correct: 1,
        explanation: 'The algorithm starts at (0, r) and works its way to the 45° line where x = y.',
      },
    ],
    challengeType: 'octant-mirror',
    challengeTitle: 'Octant Mirror',
    challengeDescription: 'One octant of the circle is plotted. Click the 7 symmetric mirror points on the grid!',
  },

  'bresenham-circle': {
    id: 'bresenham-circle',
    title: "Bresenham's Circle Drawing Algorithm",
    shortTitle: 'Bresenham Circle',
    icon: '🔵',
    category: 'curve',
    analogy: "It's like drawing a circle with Lego blocks 🧱 — we only use whole blocks, no cutting allowed! Bresenham's circle is very similar to the midpoint method but uses a slightly different decision formula. Think of it as having TWO helpers: one wants to go East, the other wants to go Southeast. You pick whoever stays closest to the real circle! 🎯",
    theory: "Bresenham's Circle algorithm is nearly identical to the Mid-Point method but derives the decision parameter differently. Starting from (0, r), the initial decision parameter d = 3 - 2r. If d < 0, the next point is (x+1, y) and d += 4x + 6. If d >= 0, the next point is (x+1, y-1) and d += 4(x-y) + 10. It also uses 8-way symmetry.",
    algorithmSteps: [
      'Read center (cx, cy) and radius r',
      'Initialize x = 0, y = r',
      'Calculate decision parameter: d = 3 - 2r',
      'While x <= y:',
      '  Plot 8 symmetric points',
      '  If d < 0: d = d + 4x + 6',
      '  Else: d = d + 4(x - y) + 10, y--',
      '  x++',
    ],
    cppCode: `#include <graphics.h>
#include <conio.h>
#include <stdio.h>

void drawCirclePoints(int cx, int cy, int x, int y) {
    putpixel(cx + x, cy + y, WHITE);
    putpixel(cx - x, cy + y, WHITE);
    putpixel(cx + x, cy - y, WHITE);
    putpixel(cx - x, cy - y, WHITE);
    putpixel(cx + y, cy + x, WHITE);
    putpixel(cx - y, cy + x, WHITE);
    putpixel(cx + y, cy - x, WHITE);
    putpixel(cx - y, cy - x, WHITE);
}

int main() {
    int gd = DETECT, gm;
    initgraph(&gd, &gm, "C:\\\\TURBOC3\\\\BGI");

    int cx, cy, r;
    printf("Enter center (cx cy) and radius r: ");
    scanf("%d %d %d", &cx, &cy, &r);

    int x = 0, y = r;
    int d = 3 - 2 * r;

    while (x <= y) {
        drawCirclePoints(cx, cy, x, y);

        if (d < 0) {
            d = d + 4 * x + 6;
        } else {
            d = d + 4 * (x - y) + 10;
            y--;
        }
        x++;
    }

    getch();
    closegraph();
    return 0;
}`,
    lineExplanations: {
      5: 'Helper to plot all 8 symmetric octant points',
      23: 'Initialize x=0, y=r (start at top of circle)',
      24: 'Bresenham\'s initial decision parameter d = 3 - 2r',
      26: 'Loop while in first octant (x <= y)',
      27: 'Plot all 8 symmetric points for current (x,y)',
      29: 'If d < 0: midpoint is inside circle',
      30: 'Move East: update d by 4x + 6',
      32: 'Move South-East: update d by 4(x-y) + 10',
      33: 'Decrement y (move inward)',
      35: 'Always increment x (move right)',
    },
    keyLines: [23, 24, 26, 29, 30, 32, 33],
    complexity: 'O(r)',
    quiz: [
      {
        question: 'What is the initial decision parameter in Bresenham\'s Circle algorithm?',
        options: ['d = 1 - r', 'd = 3 - 2r', 'd = 2r - 3', 'd = r - 1'],
        correct: 1,
        explanation: 'Bresenham\'s Circle uses d = 3 - 2r as the initial decision parameter.',
      },
      {
        question: 'When d >= 0 in Bresenham\'s Circle, which direction do we move?',
        options: ['East only', 'South only', 'South-East (diagonal)', 'North-East'],
        correct: 2,
        explanation: 'When d >= 0, we move South-East: x increments and y decrements (x++, y--).',
      },
      {
        question: 'How does Bresenham\'s Circle differ from the Mid-Point method?',
        options: ['Uses floating-point', 'Different initial d formula', 'Doesn\'t use symmetry', 'Draws ovals instead'],
        correct: 1,
        explanation: 'Both are very similar and use integer arithmetic + 8-way symmetry, but they derive d differently: Mid-Point uses p=1-r, Bresenham uses d=3-2r.',
      },
    ],
    challengeType: 'pick-correct',
    challengeTitle: 'Pixel Picker Circle',
    challengeDescription: 'Show a grid with the center marked. Click which pixels Bresenham would choose for the first octant!',
  },

  'midpoint-ellipse': {
    id: 'midpoint-ellipse',
    title: 'Mid-Point Ellipse Drawing Algorithm',
    shortTitle: 'Mid-Point Ellipse',
    icon: '🥚',
    category: 'curve',
    analogy: "An ellipse is like a squished circle — imagine sitting on a round balloon 🎈! It has two radiuses: one wide (rx) and one tall (ry). Unlike a circle with 8-way symmetry, an ellipse only has 4-way symmetry. The algorithm works in TWO regions: first going mostly horizontal, then mostly vertical, like driving around an oval racetrack 🏁!",
    theory: "The Mid-Point Ellipse algorithm draws an ellipse with semi-major axis rx and semi-minor axis ry. It divides the quadrant into two regions: Region 1 (where the slope < 1, moving mostly in x) and Region 2 (slope >= 1, moving mostly in y). Each region has its own decision parameter. 4-way symmetry is used to plot all four quadrants.",
    algorithmSteps: [
      'Read center (cx, cy) and radii rx, ry',
      'Region 1: Start at (0, ry), slope < 1',
      '  p1 = ry² - rx²·ry + rx²/4',
      '  While 2·ry²·x < 2·rx²·y:',
      '    If p1 < 0: x++, p1 += 2·ry²·x + ry²',
      '    Else: x++, y--, p1 += 2·ry²·x - 2·rx²·y + ry²',
      'Region 2: Continue until y = 0',
      '  p2 = ry²(x+0.5)² + rx²(y-1)² - rx²·ry²',
      '  While y >= 0:',
      '    If p2 > 0: y--, update p2',
      '    Else: x++, y--, update p2',
    ],
    cppCode: `#include <graphics.h>
#include <conio.h>
#include <stdio.h>

void plotEllipsePoints(int cx, int cy, int x, int y) {
    putpixel(cx + x, cy + y, WHITE);
    putpixel(cx - x, cy + y, WHITE);
    putpixel(cx + x, cy - y, WHITE);
    putpixel(cx - x, cy - y, WHITE);
}

int main() {
    int gd = DETECT, gm;
    initgraph(&gd, &gm, "C:\\\\TURBOC3\\\\BGI");

    int cx, cy, rx, ry;
    printf("Enter center (cx cy): ");
    scanf("%d %d", &cx, &cy);
    printf("Enter rx and ry: ");
    scanf("%d %d", &rx, &ry);

    int x = 0, y = ry;
    float p1 = ry * ry - rx * rx * ry + 0.25 * rx * rx;

    // Region 1
    while (2.0 * ry * ry * x < 2.0 * rx * rx * y) {
        plotEllipsePoints(cx, cy, x, y);
        if (p1 < 0) {
            x++;
            p1 += 2 * ry * ry * x + ry * ry;
        } else {
            x++;
            y--;
            p1 += 2 * ry * ry * x - 2 * rx * rx * y + ry * ry;
        }
    }

    // Region 2
    float p2 = ry * ry * (x + 0.5) * (x + 0.5) + rx * rx * (y - 1.0) * (y - 1.0) - (float)rx * rx * ry * ry;
    while (y >= 0) {
        plotEllipsePoints(cx, cy, x, y);
        if (p2 > 0) {
            y--;
            p2 -= 2 * rx * rx * y + rx * rx;
        } else {
            x++;
            y--;
            p2 += 2 * ry * ry * x - 2 * rx * rx * y + rx * rx;
        }
    }

    getch();
    closegraph();
    return 0;
}`,
    lineExplanations: {
      5: 'Plot 4 symmetric points for the ellipse (4-way, not 8-way!)',
      22: 'Start at top: x=0, y=ry',
      23: 'Region 1 initial decision parameter',
      26: 'Region 1 boundary: when tangent slope reaches -1',
      28: 'p1 < 0: midpoint inside ellipse, move East',
      31: 'p1 >= 0: midpoint outside, move South-East',
      37: 'Region 2 starts where Region 1 left off',
      38: 'Region 2 initial decision parameter',
      39: 'Continue until we reach the x-axis (y=0)',
      41: 'p2 > 0: midpoint outside, move South',
      44: 'p2 <= 0: midpoint inside, move South-East',
    },
    keyLines: [22, 23, 26, 37, 38, 39],
    complexity: 'O(rx + ry)',
    quiz: [
      {
        question: 'How many regions does the Mid-Point Ellipse algorithm divide the quadrant into?',
        options: ['1', '2', '4', '8'],
        correct: 1,
        explanation: 'The quadrant is divided into 2 regions: Region 1 (slope < 1) and Region 2 (slope >= 1).',
      },
      {
        question: 'What symmetry does an ellipse have?',
        options: ['8-way', '4-way', '2-way', 'No symmetry'],
        correct: 1,
        explanation: 'Unlike a circle (8-way), an ellipse has only 4-way symmetry because rx ≠ ry.',
      },
      {
        question: 'What distinguishes Region 1 from Region 2?',
        options: ['Color', 'The magnitude of the slope (< 1 vs >= 1)', 'Speed', 'Region 1 is inside the ellipse'],
        correct: 1,
        explanation: 'Region 1 is where |slope| < 1 (moving mostly in x), Region 2 is where |slope| >= 1 (moving mostly in y).',
      },
    ],
    challengeType: 'pick-correct',
    challengeTitle: 'Pick the Ellipse',
    challengeDescription: 'Given rx=100 and ry=50, pick which of 4 drawn shapes is the correctly proportioned ellipse!',
  },

  'point-translation': {
    id: 'point-translation',
    title: 'Point Translation',
    shortTitle: 'Point Translation',
    icon: '📍',
    category: 'transformation',
    analogy: "It's like picking up a sticker 📍 from one spot on your notebook and placing it somewhere else! You just slide it — no rotating, no resizing. If you move it 3 squares right and 2 squares up, every part of the sticker moves the same amount. That's translation! ✨",
    theory: "Translation is the simplest geometric transformation. It moves a point (x, y) by adding translation distances: x' = x + tx, y' = y + ty, where (tx, ty) is the translation vector. In matrix form: [x' y' 1] = [x y 1] × Translation Matrix.",
    algorithmSteps: [
      'Read original point (x, y)',
      'Read translation vector (tx, ty)',
      'Calculate new position: x\' = x + tx',
      'Calculate new position: y\' = y + ty',
      'Plot original point and translated point',
    ],
    cppCode: `#include <graphics.h>
#include <conio.h>
#include <stdio.h>

int main() {
    int gd = DETECT, gm;
    initgraph(&gd, &gm, "C:\\\\TURBOC3\\\\BGI");

    int x, y, tx, ty;

    printf("Enter point (x y): ");
    scanf("%d %d", &x, &y);
    printf("Enter translation (tx ty): ");
    scanf("%d %d", &tx, &ty);

    // Draw original point
    setcolor(WHITE);
    circle(x, y, 5);
    outtextxy(x + 10, y, "Original");

    // Calculate translated point
    int nx = x + tx;
    int ny = y + ty;

    // Draw translated point
    setcolor(YELLOW);
    circle(nx, ny, 5);
    outtextxy(nx + 10, ny, "Translated");

    // Draw arrow showing movement
    setlinestyle(DASHED_LINE, 0, 1);
    line(x, y, nx, ny);

    getch();
    closegraph();
    return 0;
}`,
    lineExplanations: {
      10: 'Declare original point and translation values',
      18: 'Draw a small circle at original position',
      22: 'THE KEY LINE: new x = old x + translation in x',
      23: 'THE KEY LINE: new y = old y + translation in y',
      26: 'Yellow color to distinguish the translated point',
      27: 'Draw circle at the new translated position',
      31: 'Draw a dashed arrow showing the movement path',
    },
    keyLines: [22, 23, 27],
    complexity: 'O(1)',
    quiz: [
      {
        question: 'What is the formula for translating a point (x, y) by (tx, ty)?',
        options: ['x\' = x × tx, y\' = y × ty', 'x\' = x + tx, y\' = y + ty', 'x\' = x - tx, y\' = y - ty', 'x\' = tx, y\' = ty'],
        correct: 1,
        explanation: 'Translation simply adds the translation vector: x\' = x + tx, y\' = y + ty.',
      },
      {
        question: 'If point (5, 3) is translated by (10, -7), what is the new position?',
        options: ['(15, -4)', '(-5, 10)', '(50, -21)', '(15, 10)'],
        correct: 0,
        explanation: 'x\' = 5 + 10 = 15, y\' = 3 + (-7) = -4. New position: (15, -4).',
      },
      {
        question: 'Does translation change the shape or size of an object?',
        options: ['Yes, it scales it', 'Yes, it rotates it', 'No, only position changes', 'Yes, it distorts it'],
        correct: 2,
        explanation: 'Translation only changes position — shape, size, and orientation all remain the same!',
      },
    ],
    challengeType: 'drag-target',
    challengeTitle: 'Treasure Map',
    challengeDescription: 'A point is at position A. Translate it by given (tx, ty). Drag the point to where it should land!',
  },

  'line-translation': {
    id: 'line-translation',
    title: 'Line Translation',
    shortTitle: 'Line Translation',
    icon: '↗️',
    category: 'transformation',
    analogy: "Imagine sliding a ruler 📏 across your desk without rotating it. Both ends of the ruler move by the same amount! That's line translation — every point on the line gets the same tx and ty added. The line keeps its length and angle, it just changes position! 🏃",
    theory: "Line translation moves both endpoints of a line by the same translation vector (tx, ty). For a line from (x1,y1) to (x2,y2): x1' = x1 + tx, y1' = y1 + ty, x2' = x2 + tx, y2' = y2 + ty. The line's length, slope, and orientation are preserved.",
    algorithmSteps: [
      'Read line endpoints (x1, y1) and (x2, y2)',
      'Read translation vector (tx, ty)',
      'x1\' = x1 + tx, y1\' = y1 + ty',
      'x2\' = x2 + tx, y2\' = y2 + ty',
      'Draw original and translated lines',
    ],
    cppCode: `#include <graphics.h>
#include <conio.h>
#include <stdio.h>

int main() {
    int gd = DETECT, gm;
    initgraph(&gd, &gm, "C:\\\\TURBOC3\\\\BGI");

    int x1, y1, x2, y2, tx, ty;

    printf("Enter line endpoints (x1 y1 x2 y2): ");
    scanf("%d %d %d %d", &x1, &y1, &x2, &y2);
    printf("Enter translation (tx ty): ");
    scanf("%d %d", &tx, &ty);

    // Draw original line
    setcolor(WHITE);
    line(x1, y1, x2, y2);
    outtextxy(x1, y1 - 10, "Original");

    // Translate both endpoints
    int nx1 = x1 + tx;
    int ny1 = y1 + ty;
    int nx2 = x2 + tx;
    int ny2 = y2 + ty;

    // Draw translated line
    setcolor(YELLOW);
    line(nx1, ny1, nx2, ny2);
    outtextxy(nx1, ny1 - 10, "Translated");

    getch();
    closegraph();
    return 0;
}`,
    lineExplanations: {
      17: 'Draw original line in white',
      21: 'Translate first endpoint: add tx to x1',
      22: 'Translate first endpoint: add ty to y1',
      23: 'Translate second endpoint: add tx to x2',
      24: 'Translate second endpoint: add ty to y2',
      27: 'Draw translated line in yellow for comparison',
    },
    keyLines: [21, 22, 23, 24, 27],
    complexity: 'O(1)',
    quiz: [
      {
        question: 'When translating a line, what stays the same?',
        options: ['Position', 'Color only', 'Length, slope, and orientation', 'Nothing'],
        correct: 2,
        explanation: 'Translation preserves length, slope, and orientation. Only the position changes.',
      },
      {
        question: 'To translate a line, you apply the translation to:',
        options: ['Only the first endpoint', 'Only the midpoint', 'Both endpoints equally', 'Random points on the line'],
        correct: 2,
        explanation: 'Both endpoints receive the same translation (tx, ty), which moves the entire line uniformly.',
      },
      {
        question: 'Line from (10,20) to (30,40) translated by (5,10) becomes:',
        options: ['(15,30) to (35,50)', '(50,200) to (150,400)', '(5,10) to (25,30)', '(15,30) to (30,40)'],
        correct: 0,
        explanation: '(10+5, 20+10) = (15, 30) and (30+5, 40+10) = (35, 50).',
      },
    ],
    challengeType: 'drag-target',
    challengeTitle: 'Slide the Line',
    challengeDescription: 'A line is shown. Drag it to the correct translated position based on the given (tx, ty)!',
  },

  'triangle-translation': {
    id: 'triangle-translation',
    title: 'Triangle Translation',
    shortTitle: 'Triangle Translation',
    icon: '🔺',
    category: 'transformation',
    analogy: "It's like picking up your toy car 🚗 and putting it somewhere else on the floor — the car doesn't change, just its location! With a triangle, you pick up the whole triangle (all 3 corners) and slide it to a new spot. Each corner moves by the same amount! 🔺➡️🔺",
    theory: "Triangle translation moves all three vertices by the same translation vector (tx, ty). For vertices (x1,y1), (x2,y2), (x3,y3): each new vertex is (xi + tx, yi + ty). The triangle's shape, size, angles, and orientation are all preserved.",
    algorithmSteps: [
      'Read three vertices: (x1,y1), (x2,y2), (x3,y3)',
      'Read translation vector (tx, ty)',
      'For each vertex i: xi\' = xi + tx, yi\' = yi + ty',
      'Draw original triangle',
      'Draw translated triangle',
    ],
    cppCode: `#include <graphics.h>
#include <conio.h>
#include <stdio.h>

int main() {
    int gd = DETECT, gm;
    initgraph(&gd, &gm, "C:\\\\TURBOC3\\\\BGI");

    int x1, y1, x2, y2, x3, y3, tx, ty;

    printf("Enter vertex 1 (x1 y1): ");
    scanf("%d %d", &x1, &y1);
    printf("Enter vertex 2 (x2 y2): ");
    scanf("%d %d", &x2, &y2);
    printf("Enter vertex 3 (x3 y3): ");
    scanf("%d %d", &x3, &y3);
    printf("Enter translation (tx ty): ");
    scanf("%d %d", &tx, &ty);

    // Draw original triangle
    setcolor(WHITE);
    line(x1, y1, x2, y2);
    line(x2, y2, x3, y3);
    line(x3, y3, x1, y1);
    outtextxy(x1, y1 - 10, "Original");

    // Translate all vertices
    int nx1 = x1 + tx, ny1 = y1 + ty;
    int nx2 = x2 + tx, ny2 = y2 + ty;
    int nx3 = x3 + tx, ny3 = y3 + ty;

    // Draw translated triangle
    setcolor(YELLOW);
    line(nx1, ny1, nx2, ny2);
    line(nx2, ny2, nx3, ny3);
    line(nx3, ny3, nx1, ny1);
    outtextxy(nx1, ny1 - 10, "Translated");

    getch();
    closegraph();
    return 0;
}`,
    lineExplanations: {
      21: 'Draw original triangle edges in white',
      27: 'Translate vertex 1: add (tx, ty)',
      28: 'Translate vertex 2: add (tx, ty)',
      29: 'Translate vertex 3: add (tx, ty)',
      32: 'Draw translated triangle edges in yellow',
    },
    keyLines: [27, 28, 29, 32, 33, 34],
    complexity: 'O(1)',
    quiz: [
      {
        question: 'How many vertices need to be translated for a triangle?',
        options: ['1', '2', '3', '6'],
        correct: 2,
        explanation: 'A triangle has 3 vertices, and all 3 must be translated by the same (tx, ty).',
      },
      {
        question: 'Triangle (0,0)(10,0)(5,10) translated by (20,30) becomes:',
        options: ['(20,30)(30,30)(25,40)', '(0,0)(30,30)(25,40)', '(20,30)(10,0)(5,10)', '(20,0)(30,30)(25,10)'],
        correct: 0,
        explanation: '(0+20, 0+30)=(20,30), (10+20, 0+30)=(30,30), (5+20, 10+30)=(25,40).',
      },
      {
        question: 'Does translation change the angles of a triangle?',
        options: ['Yes', 'No', 'Only right angles', 'Only acute angles'],
        correct: 1,
        explanation: 'Translation preserves all properties except position — angles, side lengths, and orientation remain unchanged.',
      },
    ],
    challengeType: 'drag-target',
    challengeTitle: 'Treasure Map',
    challengeDescription: 'A triangle is at position A. Translate it by the given (tx, ty). Drag the shape to where it should land!',
  },

  'triangle-scaling': {
    id: 'triangle-scaling',
    title: 'Triangle Scaling',
    shortTitle: 'Triangle Scaling',
    icon: '🔍',
    category: 'transformation',
    analogy: "Like zooming in on a photo 📸! When you pinch-to-zoom on your phone, everything gets bigger (or smaller) by the same factor. Scaling a triangle works the same way — multiply each coordinate by the scale factor. Sx=2 means double the width, Sy=2 means double the height! 🔍",
    theory: "Scaling multiplies each coordinate by a scale factor: x' = x × Sx, y' = y × Sy. When scaling about a fixed point (fx, fy): x' = fx + (x - fx) × Sx, y' = fy + (y - fy) × Sy. Uniform scaling (Sx = Sy) preserves the shape; non-uniform scaling distorts it.",
    algorithmSteps: [
      'Read three vertices and scale factors Sx, Sy',
      'Choose a fixed/reference point (often origin or centroid)',
      'For each vertex: x\' = fx + (x - fx) × Sx',
      'For each vertex: y\' = fy + (y - fy) × Sy',
      'Draw original and scaled triangles',
    ],
    cppCode: `#include <graphics.h>
#include <conio.h>
#include <stdio.h>

int main() {
    int gd = DETECT, gm;
    initgraph(&gd, &gm, "C:\\\\TURBOC3\\\\BGI");

    int x1, y1, x2, y2, x3, y3;
    float sx, sy;

    printf("Enter 3 vertices: ");
    scanf("%d %d %d %d %d %d", &x1, &y1, &x2, &y2, &x3, &y3);
    printf("Enter scale factors (sx sy): ");
    scanf("%f %f", &sx, &sy);

    // Draw original
    setcolor(WHITE);
    line(x1, y1, x2, y2);
    line(x2, y2, x3, y3);
    line(x3, y3, x1, y1);

    // Scale about origin
    int nx1 = (int)(x1 * sx), ny1 = (int)(y1 * sy);
    int nx2 = (int)(x2 * sx), ny2 = (int)(y2 * sy);
    int nx3 = (int)(x3 * sx), ny3 = (int)(y3 * sy);

    // Draw scaled
    setcolor(YELLOW);
    line(nx1, ny1, nx2, ny2);
    line(nx2, ny2, nx3, ny3);
    line(nx3, ny3, nx1, ny1);

    getch();
    closegraph();
    return 0;
}`,
    lineExplanations: {
      11: 'Scale factors: sx for horizontal, sy for vertical',
      23: 'Scale vertex 1: multiply each coordinate by its scale factor',
      24: 'Scale vertex 2',
      25: 'Scale vertex 3',
      28: 'Draw scaled triangle in yellow',
    },
    keyLines: [23, 24, 25, 28, 29, 30],
    complexity: 'O(1)',
    quiz: [
      {
        question: 'What is the scaling formula for a point (x, y) with factors (Sx, Sy)?',
        options: ['x\' = x + Sx', 'x\' = x × Sx, y\' = y × Sy', 'x\' = x / Sx', 'x\' = Sx, y\' = Sy'],
        correct: 1,
        explanation: 'Scaling multiplies: x\' = x × Sx, y\' = y × Sy.',
      },
      {
        question: 'If Sx = 0.5, what happens to the shape?',
        options: ['Doubles in width', 'Halves in width', 'Rotates 50°', 'Becomes invisible'],
        correct: 1,
        explanation: 'Sx = 0.5 means the shape becomes half as wide (shrinks horizontally).',
      },
      {
        question: 'Point (10, 20) scaled by Sx=3, Sy=2 becomes:',
        options: ['(30, 40)', '(13, 22)', '(30, 20)', '(10, 40)'],
        correct: 0,
        explanation: 'x\' = 10 × 3 = 30, y\' = 20 × 2 = 40.',
      },
    ],
    challengeType: 'pick-correct',
    challengeTitle: 'Which Triangle?',
    challengeDescription: '4 triangles are shown. Pick the one that is correctly scaled by the given Sx and Sy!',
  },

  'triangle-xshear': {
    id: 'triangle-xshear',
    title: 'Triangle X-Axis Shearing',
    shortTitle: 'Triangle X-Shear',
    icon: '↔️',
    category: 'transformation',
    analogy: "Imagine a stack of playing cards 🃏 on a table. Now push the top of the stack sideways while the bottom stays put — the stack tilts into a parallelogram! That's X-shearing: the top moves horizontally more than the bottom. It's like making italics in text — leaning sideways! _Lean_ ↔️",
    theory: "X-axis shearing shifts the x-coordinate proportionally to the y-coordinate: x' = x + Shx × y, y' = y (y stays the same). The shear factor Shx determines how much horizontal displacement occurs per unit of y. Positive Shx shears right, negative shears left.",
    algorithmSteps: [
      'Read three vertices and X-shear factor Shx',
      'For each vertex: x\' = x + Shx × y',
      'y\' remains unchanged',
      'Draw original and sheared triangles',
    ],
    cppCode: `#include <graphics.h>
#include <conio.h>
#include <stdio.h>

int main() {
    int gd = DETECT, gm;
    initgraph(&gd, &gm, "C:\\\\TURBOC3\\\\BGI");

    int x1, y1, x2, y2, x3, y3;
    float shx;

    printf("Enter 3 vertices: ");
    scanf("%d %d %d %d %d %d", &x1, &y1, &x2, &y2, &x3, &y3);
    printf("Enter X-shear factor: ");
    scanf("%f", &shx);

    setcolor(WHITE);
    line(x1, y1, x2, y2);
    line(x2, y2, x3, y3);
    line(x3, y3, x1, y1);

    int nx1 = (int)(x1 + shx * y1), ny1 = y1;
    int nx2 = (int)(x2 + shx * y2), ny2 = y2;
    int nx3 = (int)(x3 + shx * y3), ny3 = y3;

    setcolor(YELLOW);
    line(nx1, ny1, nx2, ny2);
    line(nx2, ny2, nx3, ny3);
    line(nx3, ny3, nx1, ny1);

    getch();
    closegraph();
    return 0;
}`,
    lineExplanations: {
      11: 'shx is the X-shear factor',
      21: 'X-shear: new x = old x + shx × old y. Y doesn\'t change!',
      22: 'Same formula for vertex 2',
      23: 'Same formula for vertex 3',
    },
    keyLines: [21, 22, 23],
    complexity: 'O(1)',
    quiz: [
      {
        question: 'In X-shearing, which coordinate changes?',
        options: ['Only y', 'Only x', 'Both x and y', 'Neither'],
        correct: 1,
        explanation: 'In X-shearing, only x changes: x\' = x + Shx × y. The y-coordinate stays the same.',
      },
      {
        question: 'What does a positive Shx value do?',
        options: ['Shears the shape to the left', 'Shears the shape to the right', 'Rotates the shape', 'Scales the shape'],
        correct: 1,
        explanation: 'Positive Shx shifts x-coordinates in the positive direction (right) proportional to y.',
      },
      {
        question: 'Point (10, 5) with X-shear factor 2 becomes:',
        options: ['(20, 5)', '(10, 15)', '(20, 10)', '(12, 5)'],
        correct: 0,
        explanation: 'x\' = 10 + 2 × 5 = 20, y\' = 5 (unchanged). Result: (20, 5).',
      },
    ],
    challengeType: 'pick-correct',
    challengeTitle: 'Lean Left or Right?',
    challengeDescription: 'Pick the correctly X-sheared triangle from 4 options!',
  },

  'triangle-yshear': {
    id: 'triangle-yshear',
    title: 'Triangle Y-Axis Shearing',
    shortTitle: 'Triangle Y-Shear',
    icon: '↕️',
    category: 'transformation',
    analogy: "Now imagine that same stack of cards 🃏, but this time you push it UP instead of sideways! The right side goes up while the left stays put. Y-shearing moves things vertically based on their horizontal position. It's like a skyscraper leaning in the wind 🏗️↕️!",
    theory: "Y-axis shearing shifts the y-coordinate proportionally to the x-coordinate: x' = x (x stays the same), y' = y + Shy × x. The shear factor Shy determines vertical displacement per unit of x.",
    algorithmSteps: [
      'Read three vertices and Y-shear factor Shy',
      'For each vertex: x\' = x (unchanged)',
      'For each vertex: y\' = y + Shy × x',
      'Draw original and sheared triangles',
    ],
    cppCode: `#include <graphics.h>
#include <conio.h>
#include <stdio.h>

int main() {
    int gd = DETECT, gm;
    initgraph(&gd, &gm, "C:\\\\TURBOC3\\\\BGI");

    int x1, y1, x2, y2, x3, y3;
    float shy;

    printf("Enter 3 vertices: ");
    scanf("%d %d %d %d %d %d", &x1, &y1, &x2, &y2, &x3, &y3);
    printf("Enter Y-shear factor: ");
    scanf("%f", &shy);

    setcolor(WHITE);
    line(x1, y1, x2, y2);
    line(x2, y2, x3, y3);
    line(x3, y3, x1, y1);

    int nx1 = x1, ny1 = (int)(y1 + shy * x1);
    int nx2 = x2, ny2 = (int)(y2 + shy * x2);
    int nx3 = x3, ny3 = (int)(y3 + shy * x3);

    setcolor(YELLOW);
    line(nx1, ny1, nx2, ny2);
    line(nx2, ny2, nx3, ny3);
    line(nx3, ny3, nx1, ny1);

    getch();
    closegraph();
    return 0;
}`,
    lineExplanations: {
      11: 'shy is the Y-shear factor',
      21: 'Y-shear: x stays same, new y = old y + shy × old x',
      22: 'Same for vertex 2',
      23: 'Same for vertex 3',
    },
    keyLines: [21, 22, 23],
    complexity: 'O(1)',
    quiz: [
      {
        question: 'In Y-shearing, which coordinate changes?',
        options: ['Only x', 'Only y', 'Both', 'Neither'],
        correct: 1,
        explanation: 'Y-shearing only changes y: y\' = y + Shy × x. The x-coordinate is unchanged.',
      },
      {
        question: 'Y-shearing transforms a rectangle into what shape?',
        options: ['Circle', 'Parallelogram', 'Triangle', 'Pentagon'],
        correct: 1,
        explanation: 'Shearing (both X and Y) turns rectangles into parallelograms by tilting opposite sides.',
      },
      {
        question: 'Point (4, 10) with Shy = 3 becomes:',
        options: ['(4, 22)', '(16, 10)', '(4, 10)', '(7, 13)'],
        correct: 0,
        explanation: 'x\' = 4 (unchanged), y\' = 10 + 3 × 4 = 22. Result: (4, 22).',
      },
    ],
    challengeType: 'pick-correct',
    challengeTitle: 'Up or Down Lean?',
    challengeDescription: 'Pick the correctly Y-sheared triangle from 4 options!',
  },

  'triangle-rotation': {
    id: 'triangle-rotation',
    title: 'Triangle Rotation',
    shortTitle: 'Triangle Rotation',
    icon: '🌀',
    category: 'transformation',
    analogy: "Put a paper triangle on the table and stick a pin through one corner 📌. Now spin the paper around that pin! The triangle rotates — each corner traces a circular arc. The pin point (pivot) stays fixed while everything else whirls around it like a spinning top! 🌀",
    theory: "Triangle rotation applies the rotation transformation to each vertex. Around a pivot point (px, py) by angle θ: x' = px + (x-px)cos(θ) - (y-py)sin(θ), y' = py + (x-px)sin(θ) + (y-py)cos(θ). Counter-clockwise rotation uses positive angles.",
    algorithmSteps: [
      'Read three vertices and rotation angle θ',
      'Choose pivot point (usually centroid or a vertex)',
      'Convert θ to radians',
      'For each vertex apply rotation formula',
      'Draw both original and rotated triangles',
    ],
    cppCode: `#include <graphics.h>
#include <conio.h>
#include <stdio.h>
#include <math.h>

int main() {
    int gd = DETECT, gm;
    initgraph(&gd, &gm, "C:\\\\TURBOC3\\\\BGI");

    int x1, y1, x2, y2, x3, y3;
    float angle;

    printf("Enter 3 vertices: ");
    scanf("%d %d %d %d %d %d", &x1, &y1, &x2, &y2, &x3, &y3);
    printf("Enter rotation angle (degrees): ");
    scanf("%f", &angle);

    setcolor(WHITE);
    line(x1, y1, x2, y2);
    line(x2, y2, x3, y3);
    line(x3, y3, x1, y1);

    float rad = angle * 3.14159 / 180.0;
    int px = (x1 + x2 + x3) / 3;
    int py = (y1 + y2 + y3) / 3;

    int nx1 = px + (int)((x1-px)*cos(rad) - (y1-py)*sin(rad));
    int ny1 = py + (int)((x1-px)*sin(rad) + (y1-py)*cos(rad));
    int nx2 = px + (int)((x2-px)*cos(rad) - (y2-py)*sin(rad));
    int ny2 = py + (int)((x2-px)*sin(rad) + (y2-py)*cos(rad));
    int nx3 = px + (int)((x3-px)*cos(rad) - (y3-py)*sin(rad));
    int ny3 = py + (int)((x3-px)*sin(rad) + (y3-py)*cos(rad));

    setcolor(YELLOW);
    line(nx1, ny1, nx2, ny2);
    line(nx2, ny2, nx3, ny3);
    line(nx3, ny3, nx1, ny1);

    getch();
    closegraph();
    return 0;
}`,
    lineExplanations: {
      22: 'Convert angle from degrees to radians',
      23: 'Calculate centroid x (average of all x-coordinates) as pivot',
      24: 'Calculate centroid y as pivot',
      26: 'Rotate vertex 1 using rotation matrix formula',
      28: 'Rotate vertex 2',
      30: 'Rotate vertex 3',
    },
    keyLines: [22, 23, 24, 26, 27, 28, 29, 30, 31],
    complexity: 'O(1)',
    quiz: [
      {
        question: 'What point is commonly used as the pivot for triangle rotation?',
        options: ['Origin', 'Centroid (center of triangle)', 'Screen center', 'Top-left corner'],
        correct: 1,
        explanation: 'The centroid (average of all vertices) is commonly used to rotate the triangle about its own center.',
      },
      {
        question: 'Rotating a triangle by 360° results in:',
        options: ['A circle', 'The same triangle', 'A bigger triangle', 'A line'],
        correct: 1,
        explanation: 'A full 360° rotation brings every point back to its original position.',
      },
      {
        question: 'What does rotating by 90° counter-clockwise do to point (1, 0) around origin?',
        options: ['(0, 1)', '(0, -1)', '(-1, 0)', '(1, 1)'],
        correct: 0,
        explanation: 'x\' = cos(90°)·1 - sin(90°)·0 = 0, y\' = sin(90°)·1 + cos(90°)·0 = 1. So (1,0) → (0,1).',
      },
    ],
    challengeType: 'pick-correct',
    challengeTitle: 'Spin It!',
    challengeDescription: 'Rotate the triangle by 90°. Click the correct resulting triangle from 4 options!',
  },

  'rectangle-scaling': {
    id: 'rectangle-scaling',
    title: 'Rectangle Scaling',
    shortTitle: 'Rectangle Scaling',
    icon: '⬜',
    category: 'transformation',
    analogy: "It's like resizing a window on your computer 💻! You grab the corner and drag — making it wider (Sx) or taller (Sy). If you double both, the window becomes 4 times bigger in area! Scaling a rectangle works just like pinch-to-zoom on a tablet 📱!",
    theory: "Rectangle scaling applies scale factors Sx and Sy to all four vertices. For scaling about origin: x' = x × Sx, y' = y × Sy. For a rectangle, we only need two opposite corners and the other two are derived.",
    algorithmSteps: [
      'Read rectangle (two corners or four vertices)',
      'Read scale factors Sx, Sy',
      'For each vertex: x\' = x × Sx, y\' = y × Sy',
      'Draw original and scaled rectangles',
    ],
    cppCode: `#include <graphics.h>
#include <conio.h>
#include <stdio.h>

int main() {
    int gd = DETECT, gm;
    initgraph(&gd, &gm, "C:\\\\TURBOC3\\\\BGI");

    int x1, y1, x2, y2;
    float sx, sy;

    printf("Enter top-left (x1 y1): ");
    scanf("%d %d", &x1, &y1);
    printf("Enter bottom-right (x2 y2): ");
    scanf("%d %d", &x2, &y2);
    printf("Enter scale factors (sx sy): ");
    scanf("%f %f", &sx, &sy);

    // Draw original
    setcolor(WHITE);
    rectangle(x1, y1, x2, y2);
    outtextxy(x1, y1 - 10, "Original");

    // Scale all corners
    int nx1 = (int)(x1 * sx), ny1 = (int)(y1 * sy);
    int nx2 = (int)(x2 * sx), ny2 = (int)(y2 * sy);

    // Draw scaled
    setcolor(YELLOW);
    rectangle(nx1, ny1, nx2, ny2);
    outtextxy(nx1, ny1 - 10, "Scaled");

    getch();
    closegraph();
    return 0;
}`,
    lineExplanations: {
      11: 'sx = horizontal scale, sy = vertical scale',
      24: 'Scale top-left corner by multiplying with scale factors',
      25: 'Scale bottom-right corner',
      28: 'Draw the scaled rectangle in yellow',
    },
    keyLines: [24, 25, 28],
    complexity: 'O(1)',
    quiz: [
      {
        question: 'Rectangle (10,10)-(50,30) scaled by Sx=2, Sy=3 becomes:',
        options: ['(20,30)-(100,90)', '(12,13)-(52,33)', '(5,3)-(25,10)', '(10,10)-(100,90)'],
        correct: 0,
        explanation: '(10×2, 10×3)=(20,30) and (50×2, 30×3)=(100,90).',
      },
      {
        question: 'Sx=1, Sy=1 means:',
        options: ['Double size', 'No change', 'Half size', 'Mirror'],
        correct: 1,
        explanation: 'Scale factors of 1 mean no change — the shape stays exactly the same size.',
      },
      {
        question: 'What happens when Sx = -1?',
        options: ['Rectangle disappears', 'Mirrors horizontally', 'Rotates 90°', 'Doubles in width'],
        correct: 1,
        explanation: 'Sx = -1 mirrors/reflects the shape across the y-axis (horizontal flip).',
      },
    ],
    challengeType: 'drag-resize',
    challengeTitle: 'Double It',
    challengeDescription: 'Scale the rectangle by Sx=2. Drag the corners to match the correct scaled size!',
  },

  'rectangle-xshear': {
    id: 'rectangle-xshear',
    title: 'Rectangle X-Axis Shearing',
    shortTitle: 'Rectangle X-Shear',
    icon: '▱',
    category: 'transformation',
    analogy: "Push the top of a book 📚 while holding the bottom — it tilts into a parallelogram! That's X-shearing a rectangle. The bottom edge stays put while the top slides sideways. The amount of slide depends on how high up the point is! ▱",
    theory: "X-shearing a rectangle applies x' = x + Shx × y to all four vertices. The y-coordinates remain unchanged. A rectangle becomes a parallelogram after shearing.",
    algorithmSteps: [
      'Read rectangle corners and Shx',
      'For each vertex: x\' = x + Shx × y, y\' = y',
      'Draw original rectangle and sheared parallelogram',
    ],
    cppCode: `#include <graphics.h>
#include <conio.h>
#include <stdio.h>

int main() {
    int gd = DETECT, gm;
    initgraph(&gd, &gm, "C:\\\\TURBOC3\\\\BGI");

    int x1, y1, x2, y2;
    float shx;

    printf("Enter rectangle (x1 y1 x2 y2): ");
    scanf("%d %d %d %d", &x1, &y1, &x2, &y2);
    printf("Enter X-shear factor: ");
    scanf("%f", &shx);

    // Original rectangle
    setcolor(WHITE);
    rectangle(x1, y1, x2, y2);

    // Shear 4 corners
    int ax = (int)(x1 + shx * y1), ay = y1;
    int bx = (int)(x2 + shx * y1), by = y1;
    int cx = (int)(x2 + shx * y2), cy = y2;
    int dx = (int)(x1 + shx * y2), dy = y2;

    setcolor(YELLOW);
    line(ax, ay, bx, by);
    line(bx, by, cx, cy);
    line(cx, cy, dx, dy);
    line(dx, dy, ax, ay);

    getch();
    closegraph();
    return 0;
}`,
    lineExplanations: {
      11: 'shx controls horizontal displacement',
      20: 'Shear top-left corner: x shifts by shx × y',
      21: 'Shear top-right corner',
      22: 'Shear bottom-right corner — shifts more (higher y)',
      23: 'Shear bottom-left corner',
      25: 'Draw as lines since it\'s no longer a rectangle',
    },
    keyLines: [20, 21, 22, 23],
    complexity: 'O(1)',
    quiz: [
      {
        question: 'X-shearing a rectangle turns it into:',
        options: ['A circle', 'A triangle', 'A parallelogram', 'A pentagon'],
        correct: 2,
        explanation: 'X-shearing tilts the rectangle sideways, creating a parallelogram.',
      },
      {
        question: 'In X-shear, which coordinate stays the same?',
        options: ['x', 'y', 'Both', 'Neither'],
        correct: 1,
        explanation: 'In X-shearing, y stays the same. Only x changes: x\' = x + Shx × y.',
      },
      {
        question: 'Rectangle corner (20, 10) with Shx = 0.5 becomes:',
        options: ['(25, 10)', '(20, 15)', '(10, 10)', '(30, 10)'],
        correct: 0,
        explanation: 'x\' = 20 + 0.5 × 10 = 25, y\' = 10. Result: (25, 10).',
      },
    ],
    challengeType: 'pick-correct',
    challengeTitle: 'Parallelogram Picker',
    challengeDescription: 'Pick which of 4 parallelograms is the correct X-shear of the rectangle!',
  },

  'rectangle-yshear': {
    id: 'rectangle-yshear',
    title: 'Rectangle Y-Axis Shearing',
    shortTitle: 'Rectangle Y-Shear',
    icon: '▰',
    category: 'transformation',
    analogy: "Imagine the Leaning Tower of Pisa 🗼 — it leans because the base is fixed but the top shifts upward! Y-shearing is the same: the left side stays put, and points move up or down depending on how far right they are. It's like wind pushing a building! 🏗️💨",
    theory: "Y-shearing applies y' = y + Shy × x to all vertices. X-coordinates remain unchanged. Like X-shear, it transforms a rectangle into a parallelogram, but the tilt is vertical instead of horizontal.",
    algorithmSteps: [
      'Read rectangle corners and Shy',
      'For each vertex: x\' = x, y\' = y + Shy × x',
      'Draw original and sheared shapes',
    ],
    cppCode: `#include <graphics.h>
#include <conio.h>
#include <stdio.h>

int main() {
    int gd = DETECT, gm;
    initgraph(&gd, &gm, "C:\\\\TURBOC3\\\\BGI");

    int x1, y1, x2, y2;
    float shy;

    printf("Enter rectangle (x1 y1 x2 y2): ");
    scanf("%d %d %d %d", &x1, &y1, &x2, &y2);
    printf("Enter Y-shear factor: ");
    scanf("%f", &shy);

    setcolor(WHITE);
    rectangle(x1, y1, x2, y2);

    int ax = x1, ay = (int)(y1 + shy * x1);
    int bx = x2, by = (int)(y1 + shy * x2);
    int cx = x2, cy = (int)(y2 + shy * x2);
    int dx = x1, dy = (int)(y2 + shy * x1);

    setcolor(YELLOW);
    line(ax, ay, bx, by);
    line(bx, by, cx, cy);
    line(cx, cy, dx, dy);
    line(dx, dy, ax, ay);

    getch();
    closegraph();
    return 0;
}`,
    lineExplanations: {
      11: 'shy controls vertical displacement based on x position',
      20: 'Y-shear top-left: y shifts by shy × x. x unchanged',
      21: 'Y-shear top-right: more shift since x2 > x1',
      22: 'Y-shear bottom-right',
      23: 'Y-shear bottom-left',
    },
    keyLines: [20, 21, 22, 23],
    complexity: 'O(1)',
    quiz: [
      {
        question: 'In Y-shearing, which coordinate changes?',
        options: ['x', 'y', 'Both', 'Neither'],
        correct: 1,
        explanation: 'In Y-shearing, y changes proportional to x: y\' = y + Shy × x.',
      },
      {
        question: 'Y-shearing a rectangle makes it lean in which direction?',
        options: ['Horizontally', 'Vertically', 'Diagonally', 'It doesn\'t lean'],
        correct: 1,
        explanation: 'Y-shearing tilts the shape vertically — like the Leaning Tower!',
      },
      {
        question: 'If Shy = 0, the sheared shape is:',
        options: ['A line', 'Same as original', 'Inverted', 'Doubled'],
        correct: 1,
        explanation: 'Shy = 0 means no shearing at all — y\' = y + 0 = y. Shape stays the same.',
      },
    ],
    challengeType: 'pick-correct',
    challengeTitle: 'Lean Tower',
    challengeDescription: 'Pick the correct Y-shear result from 4 options!',
  },

  'rectangle-rotation': {
    id: 'rectangle-rotation',
    title: 'Rectangle Rotation',
    shortTitle: 'Rectangle Rotation',
    icon: '🔲',
    category: 'transformation',
    analogy: "Put a square sticky note on your desk and spin it with your finger 🔲! After rotating 45°, the square looks like a diamond ♦️. Every corner follows a circular path around the center point (pivot). It's like a spinning wheel of fortune! 🎡",
    theory: "Rectangle rotation applies the 2D rotation formula to all four vertices around a pivot point. Each vertex (x,y) is transformed to (x',y') using: x' = px + (x-px)cos(θ) - (y-py)sin(θ), y' = py + (x-px)sin(θ) + (y-py)cos(θ).",
    algorithmSteps: [
      'Read rectangle corners and angle θ',
      'Choose pivot (typically center of rectangle)',
      'Convert θ to radians',
      'Apply rotation formula to all 4 corners',
      'Draw original and rotated rectangles',
    ],
    cppCode: `#include <graphics.h>
#include <conio.h>
#include <stdio.h>
#include <math.h>

int main() {
    int gd = DETECT, gm;
    initgraph(&gd, &gm, "C:\\\\TURBOC3\\\\BGI");

    int x1, y1, x2, y2;
    float angle;

    printf("Enter rectangle (x1 y1 x2 y2): ");
    scanf("%d %d %d %d", &x1, &y1, &x2, &y2);
    printf("Enter rotation angle: ");
    scanf("%f", &angle);

    setcolor(WHITE);
    rectangle(x1, y1, x2, y2);

    float rad = angle * 3.14159 / 180.0;
    int px = (x1 + x2) / 2, py = (y1 + y2) / 2;

    // Rotate 4 corners
    int corners[4][2] = {{x1,y1},{x2,y1},{x2,y2},{x1,y2}};
    int rotated[4][2];

    for (int i = 0; i < 4; i++) {
        int dx = corners[i][0] - px, dy = corners[i][1] - py;
        rotated[i][0] = px + (int)(dx * cos(rad) - dy * sin(rad));
        rotated[i][1] = py + (int)(dx * sin(rad) + dy * cos(rad));
    }

    setcolor(YELLOW);
    for (int i = 0; i < 4; i++) {
        int next = (i + 1) % 4;
        line(rotated[i][0], rotated[i][1], rotated[next][0], rotated[next][1]);
    }

    getch();
    closegraph();
    return 0;
}`,
    lineExplanations: {
      20: 'Convert angle to radians for trig functions',
      21: 'Pivot is center of rectangle',
      24: 'Store all 4 corners in an array',
      28: 'Calculate distance from pivot for each corner',
      29: 'Apply rotation formula: new x using cos and sin',
      30: 'Apply rotation formula: new y using sin and cos',
      33: 'Draw rotated rectangle by connecting corners',
    },
    keyLines: [20, 21, 28, 29, 30],
    complexity: 'O(1)',
    quiz: [
      {
        question: 'What shape does a rotated rectangle look like at 45°?',
        options: ['A circle', 'A diamond', 'A triangle', 'A square'],
        correct: 1,
        explanation: 'A rectangle (or square) rotated by 45° appears as a diamond shape ♦️.',
      },
      {
        question: 'The pivot point for rectangle rotation is usually:',
        options: ['Top-left corner', 'Center of rectangle', 'Bottom-right corner', 'Origin (0,0)'],
        correct: 1,
        explanation: 'The center of the rectangle is typically used as the pivot to rotate "in place".',
      },
      {
        question: 'Rotating a square by 90° gives:',
        options: ['A different square', 'The same square', 'A rectangle', 'A triangle'],
        correct: 1,
        explanation: 'A square rotated by 90° looks identical (same shape, same size). The vertices swap but the shape is the same.',
      },
    ],
    challengeType: 'pick-correct',
    challengeTitle: 'Spin the Box',
    challengeDescription: 'Rotate the rectangle by 45°. Click the correct result from 4 options!',
  },

  'sector-drawing': {
    id: 'sector-drawing',
    title: 'Sector Drawing Algorithm',
    shortTitle: 'Sector Drawing',
    icon: '🍕',
    category: 'curve',
    analogy: "A sector is a pizza slice 🍕! Take a full circle, cut two straight line from the center to the edge at two different angles, and the piece between them is a sector. It's like a pie chart slice — with the pointy end at the center and the curved part on the outside! 🥧",
    theory: "A sector (pie slice) is defined by a center point, radius, and two angles (start and end). It consists of two radius lines from the center to the arc, plus the arc itself. To draw: draw line from center to (cx + r×cos(θ1), cy + r×sin(θ1)), draw the arc from θ1 to θ2, then draw line from arc endpoint back to center.",
    algorithmSteps: [
      'Read center (cx, cy), radius r, start angle θ1, end angle θ2',
      'Draw line from center to (cx + r×cos(θ1), cy - r×sin(θ1))',
      'Draw arc from θ1 to θ2',
      'Draw line from (cx + r×cos(θ2), cy - r×sin(θ2)) back to center',
      'Optionally fill the sector with color',
    ],
    cppCode: `#include <graphics.h>
#include <conio.h>
#include <stdio.h>
#include <math.h>

int main() {
    int gd = DETECT, gm;
    initgraph(&gd, &gm, "C:\\\\TURBOC3\\\\BGI");

    int cx, cy, r, startAngle, endAngle;

    printf("Enter center (cx cy): ");
    scanf("%d %d", &cx, &cy);
    printf("Enter radius: ");
    scanf("%d", &r);
    printf("Enter start angle and end angle: ");
    scanf("%d %d", &startAngle, &endAngle);

    // Draw first radius line
    float rad1 = startAngle * 3.14159 / 180.0;
    int sx = cx + (int)(r * cos(rad1));
    int sy = cy - (int)(r * sin(rad1));
    line(cx, cy, sx, sy);

    // Draw arc
    arc(cx, cy, startAngle, endAngle, r);

    // Draw second radius line
    float rad2 = endAngle * 3.14159 / 180.0;
    int ex = cx + (int)(r * cos(rad2));
    int ey = cy - (int)(r * sin(rad2));
    line(cx, cy, ex, ey);

    // Fill sector
    setfillstyle(SOLID_FILL, YELLOW);
    int mx = cx + (int)(r/2 * cos((rad1+rad2)/2));
    int my = cy - (int)(r/2 * sin((rad1+rad2)/2));
    floodfill(mx, my, WHITE);

    getch();
    closegraph();
    return 0;
}`,
    lineExplanations: {
      20: 'Convert start angle to radians',
      21: 'Calculate start point on arc circumference (x)',
      22: 'Calculate start point on arc (y — negative due to screen coords)',
      23: 'Draw first radius from center to arc start',
      26: 'Draw the arc between the two angles',
      29: 'Convert end angle to radians',
      30: 'Calculate end point on circumference',
      32: 'Draw second radius from center to arc end',
      35: 'Fill the sector with yellow color',
    },
    keyLines: [20, 21, 22, 23, 26, 32],
    complexity: 'O(θ2 - θ1)',
    quiz: [
      {
        question: 'A sector consists of which components?',
        options: ['Just an arc', 'Two radius lines and an arc', 'A full circle', 'Two parallel lines'],
        correct: 1,
        explanation: 'A sector (pie slice) = two radius lines from center to edge + the arc connecting them.',
      },
      {
        question: 'A sector with startAngle=0 and endAngle=90 represents what fraction of a circle?',
        options: ['Full circle', 'Half circle', 'Quarter circle', 'Three-quarter circle'],
        correct: 2,
        explanation: '90° out of 360° = 1/4 = quarter circle.',
      },
      {
        question: 'What real-world chart uses sectors to show data?',
        options: ['Bar chart', 'Line chart', 'Pie chart', 'Scatter plot'],
        correct: 2,
        explanation: 'A pie chart uses sectors (slices) to represent proportions of a whole!',
      },
    ],
    challengeType: 'drag-angle',
    challengeTitle: 'Slice the Pie',
    challengeDescription: 'Drag the angle handles to draw a sector matching the given start and end angles!',
  },
};

export function getProgramById(id: string): ProgramData | undefined {
  return PROGRAMS[id];
}

export function getProgramsByCategory(category: string): ProgramData[] {
  return Object.values(PROGRAMS).filter(p => p.category === category);
}
