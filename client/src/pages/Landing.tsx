import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Graphy from '../components/mascot/Graphy';

export default function Landing() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Animated background shapes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const shapes: { x: number; y: number; vx: number; vy: number; type: string; size: number; color: string; angle: number }[] = [];
    const colors = ['#00B4D8', '#7B2FBE', '#3FB950', '#D29922', '#F85149', '#DB61A2'];

    for (let i = 0; i < 15; i++) {
      shapes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        type: ['circle', 'triangle', 'line', 'rect'][Math.floor(Math.random() * 4)],
        size: 15 + Math.random() * 30,
        color: colors[Math.floor(Math.random() * colors.length)],
        angle: Math.random() * Math.PI * 2,
      });
    }

    let animId: number;
    const animate = () => {
      ctx.fillStyle = 'rgba(13, 17, 23, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      shapes.forEach(s => {
        s.x += s.vx;
        s.y += s.vy;
        s.angle += 0.01;
        if (s.x < 0 || s.x > canvas.width) s.vx *= -1;
        if (s.y < 0 || s.y > canvas.height) s.vy *= -1;

        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.angle);
        ctx.strokeStyle = s.color;
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.3;

        if (s.type === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, s.size, 0, Math.PI * 2);
          ctx.stroke();
        } else if (s.type === 'triangle') {
          ctx.beginPath();
          ctx.moveTo(0, -s.size);
          ctx.lineTo(s.size, s.size);
          ctx.lineTo(-s.size, s.size);
          ctx.closePath();
          ctx.stroke();
        } else if (s.type === 'line') {
          ctx.beginPath();
          ctx.moveTo(-s.size, 0);
          ctx.lineTo(s.size, 0);
          ctx.stroke();
        } else {
          ctx.strokeRect(-s.size / 2, -s.size / 2, s.size, s.size);
        }
        ctx.restore();
      });

      animId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animId);
  }, []);

  const features = [
    { icon: '🎮', title: 'Interactive Visualizations', desc: 'Watch algorithms draw pixel by pixel with play/pause controls' },
    { icon: '🏆', title: 'Gamified Learning', desc: 'Earn XP, level up, collect badges, and climb the leaderboard' },
    { icon: '🤝', title: 'Compete with Friends', desc: 'Add friends, challenge them, and compare scores' },
    { icon: '💻', title: 'Master C++ Code', desc: 'Real BCA-ready C++ code with line-by-line explanations' },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: '#0D1117' }}>
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-[5%] py-4" style={{ background: '#0D1117', borderBottom: '1px solid #30363D' }}>
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎨</span>
          <span className="text-xl font-bold gradient-text">GraphicsLab</span>
        </div>
        <div className="flex items-center gap-[10px]">
          <Link
            to="/login"
            className="bg-transparent border-[1.5px] border-white/25 text-inherit px-[22px] py-[9px] rounded-lg font-[600] transition-all hover:border-white hover:bg-[rgba(255,255,255,0.06)] flex items-center"
          >
            Log In
          </Link>
          <Link
            to="/signup"
            className="bg-[#00B4D8] border-[1.5px] border-[#00B4D8] text-[#080c14] px-[22px] py-[9px] rounded-lg font-[700] transition-all hover:bg-transparent hover:text-[#00B4D8] flex items-center"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative z-10 flex flex-col items-center text-center w-full max-w-[1200px] mx-auto px-[5%] py-[80px] pt-[calc(80px+64px)]">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <Graphy mood="celebrating" size={140} className="mx-auto mb-6" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl md:text-6xl font-black mb-4 leading-tight"
        >
          Learn Computer Graphics
          <br />
          <span className="gradient-text">Like Never Before</span> 🎮
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-lg max-w-xl mb-8"
          style={{ color: '#8B949E' }}
        >
          20 interactive algorithms • Step-by-step visualizations • Real C++ code • Gamified quizzes • Built for BCA students
        </motion.p>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="flex gap-4">
          <Link
            to="/signup"
            className="px-8 py-4 rounded-xl text-lg font-bold transition-all hover:scale-105 animate-pulse-glow"
            style={{ background: 'linear-gradient(135deg, #00B4D8, #7B2FBE)', color: '#0D1117' }}
          >
            🚀 Get Started Free
          </Link>
          <Link
            to="/dashboard"
            className="px-8 py-4 rounded-xl text-lg font-medium transition-all hover:bg-[#1C2333]"
            style={{ border: '1px solid #30363D', color: '#E6EDF3' }}
          >
            Try Without Login
          </Link>
        </motion.div>
      </div>

      {/* Features */}
      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-[5%] py-[80px]">
        <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-6 min-gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + i * 0.1 }}
              className="card-hover rounded-xl p-[24px] text-center hover:-translate-y-1 transition duration-200 ease-in-out"
              style={{ background: '#161B22' }}
            >
              <div className="text-4xl mb-5">{f.icon}</div>
              <h3 className="font-bold mb-5" style={{ color: '#E6EDF3' }}>{f.title}</h3>
              <p className="text-sm" style={{ color: '#8B949E' }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Program preview cards */}
      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-[5%] py-[80px]">
        <h2 className="text-2xl font-bold text-center mb-8 gradient-text">20 Programs, 5 Tabs Each</h2>
        <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-6 min-gap-6">
          {[
            { icon: '🤔', title: 'Kid-Friendly Theory', desc: 'Graphy explains concepts with real-world analogies', color: '#3FB950' },
            { icon: '▶️', title: 'Live Visualization', desc: 'Watch algorithms draw pixel by pixel on canvas', color: '#00B4D8' },
            { icon: '❓', title: 'Quizzes & Challenges', desc: 'Test your knowledge and earn XP points', color: '#7B2FBE' },
          ].map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 + i * 0.15 }}
              className="rounded-xl p-[24px] hover:-translate-y-1 transition duration-200 ease-in-out"
              style={{ background: '#161B22', border: `1px solid ${card.color}40` }}
            >
              <div className="text-5xl mb-5">{card.icon}</div>
              <h3 className="font-bold text-lg mb-5" style={{ color: card.color }}>{card.title}</h3>
              <p className="text-sm" style={{ color: '#8B949E' }}>{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 text-sm" style={{ color: '#6B7280', borderTop: '1px solid #30363D' }}>
        GraphicsLab 🎨 — Made with 💖 for BCA Students
      </footer>
    </div>
  );
}
