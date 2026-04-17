import confetti from 'canvas-confetti';

export function fireConfetti() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#00B4D8', '#7B2FBE', '#3FB950', '#FFD700', '#F85149', '#DB61A2'],
  });
}

export function fireCelebration() {
  const duration = 3000;
  const end = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#00B4D8', '#7B2FBE', '#3FB950'],
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#FFD700', '#F85149', '#DB61A2'],
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };

  frame();
}

export function fireStars() {
  confetti({
    particleCount: 50,
    spread: 360,
    ticks: 100,
    gravity: 0.2,
    origin: { x: 0.5, y: 0.5 },
    shapes: ['star'],
    colors: ['#FFD700', '#FFA500', '#FF6347'],
    scalar: 1.5,
  });
}
