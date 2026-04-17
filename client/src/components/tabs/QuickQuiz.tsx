import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ProgramData } from '../../types';
import { useSound } from '../../hooks/useSound';
import { fireConfetti } from '../../hooks/useConfetti';
import { useAuthStore } from '../../store';
import { api } from '../../services/api';
import Graphy from '../mascot/Graphy';

interface QuickQuizProps {
  program: ProgramData;
}

export default function QuickQuiz({ program }: QuickQuizProps) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [quizDone, setQuizDone] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>([null, null, null]);
  const { playSound } = useSound();
  const { isAuthenticated, addXP } = useAuthStore();

  const question = program.quiz[currentQ];

  // Timer
  useEffect(() => {
    if (showResult || quizDone) return;
    if (timeLeft <= 0) {
      handleAnswer(-1); // Time's up
      return;
    }
    const t = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, showResult, quizDone]);

  const handleAnswer = useCallback((idx: number) => {
    if (showResult) return;
    setSelected(idx);
    setShowResult(true);

    const isCorrect = idx === question.correct;
    if (isCorrect) {
      setScore(prev => prev + 10);
      playSound('correct');
    } else {
      playSound('wrong');
    }

    const newAnswers = [...answers];
    newAnswers[currentQ] = idx;
    setAnswers(newAnswers);
  }, [showResult, question, currentQ, answers, playSound]);

  const handleNext = () => {
    if (currentQ < 2) {
      setCurrentQ(prev => prev + 1);
      setSelected(null);
      setShowResult(false);
      setTimeLeft(30);
    } else {
      setQuizDone(true);
      const finalScore = score;
      if (finalScore === 30) fireConfetti();

      // Save score to backend
      if (isAuthenticated) {
        const xpEarned = finalScore === 30 ? 50 : finalScore >= 20 ? 30 : 10;
        api.saveScore({
          program: program.id,
          type: 'quiz',
          score: finalScore,
          xpEarned,
        }).catch(() => {});
        addXP(xpEarned, 'quiz', program.id);
      }
    }
  };

  const handleRetry = () => {
    setCurrentQ(0);
    setSelected(null);
    setShowResult(false);
    setScore(0);
    setTimeLeft(30);
    setQuizDone(false);
    setAnswers([null, null, null]);
  };

  if (quizDone) {
    const xpEarned = score === 30 ? 50 : score >= 20 ? 30 : 10;
    const mood = score === 30 ? 'celebrating' : score >= 20 ? 'happy' : 'thinking';
    const message = score === 30
      ? '🎉 PERFECT SCORE! You absolutely nailed it!'
      : score >= 20
      ? '👏 Great job! Almost perfect!'
      : '💪 Keep practicing, you\'ll get there!';

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8 space-y-6"
      >
        <Graphy mood={mood as any} size={120} className="mx-auto" />
        <h2 className="text-3xl font-bold gradient-text">{message}</h2>

        <div className="inline-flex gap-8 p-6 rounded-2xl" style={{ background: '#161B22', border: '1px solid #30363D' }}>
          <div>
            <div className="text-4xl font-bold" style={{ color: score === 30 ? '#3FB950' : '#D29922' }}>
              {score}/30
            </div>
            <div className="text-sm" style={{ color: '#8B949E' }}>Score</div>
          </div>
          <div>
            <div className="text-4xl font-bold" style={{ color: '#00B4D8' }}>+{xpEarned}</div>
            <div className="text-sm" style={{ color: '#8B949E' }}>XP Earned</div>
          </div>
        </div>

        {/* Review answers */}
        <div className="max-w-lg mx-auto space-y-3 text-left">
          {program.quiz.map((q, i) => {
            const userAnswer = answers[i];
            const isCorrect = userAnswer === q.correct;
            return (
              <div key={i} className="p-3 rounded-lg" style={{
                background: '#161B22',
                border: `1px solid ${isCorrect ? '#3FB950' : '#F85149'}40`,
              }}>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <span>{isCorrect ? '✅' : '❌'}</span>
                  <span>{q.question}</span>
                </div>
                <div className="text-xs mt-1" style={{ color: '#8B949E' }}>
                  Correct: {q.options[q.correct]} — {q.explanation}
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={handleRetry}
          className="px-6 py-3 rounded-xl font-bold transition-all hover:scale-105"
          style={{ background: 'linear-gradient(135deg, #00B4D8, #7B2FBE)', color: '#0D1117' }}
        >
          🔄 Try Again
        </button>
      </motion.div>
    );
  }

  const isCorrect = selected === question.correct;
  const timerColor = timeLeft > 15 ? '#3FB950' : timeLeft > 5 ? '#D29922' : '#F85149';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex gap-3">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-10 h-10 rounded-full flex items-center justify-center text-base font-bold"
              style={{
                background: i === currentQ ? '#00B4D8' : i < currentQ ? '#3FB950' : '#30363D',
                color: '#0D1117',
              }}
            >
              {i < currentQ ? '✓' : i + 1}
            </div>
          ))}
        </div>

        {/* Timer */}
        <motion.div
          animate={{ scale: timeLeft <= 5 ? [1, 1.1, 1] : 1 }}
          transition={{ repeat: timeLeft <= 5 ? Infinity : 0, duration: 0.5 }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full"
          style={{ background: `${timerColor}20`, color: timerColor }}
        >
          <span>⏱</span>
          <span className="font-mono font-bold">{timeLeft}s</span>
        </motion.div>

        <div className="text-sm font-bold" style={{ color: '#D29922' }}>
          Score: {score}/30
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="rounded-xl p-8"
          style={{ background: '#161B22', border: '1px solid #30363D' }}
        >
          <h3 className="text-xl font-bold mb-8">
            <span style={{ color: '#00B4D8' }}>Q{currentQ + 1}.</span> {question.question}
          </h3>

          <div className="space-y-4">
            {question.options.map((option, i) => {
              let bg = '#0D1117';
              let border = '#30363D';
              let textColor = '#E6EDF3';

              if (showResult) {
                if (i === question.correct) {
                  bg = '#3FB95020';
                  border = '#3FB950';
                  textColor = '#3FB950';
                } else if (i === selected && !isCorrect) {
                  bg = '#F8514920';
                  border = '#F85149';
                  textColor = '#F85149';
                }
              } else if (i === selected) {
                bg = '#00B4D820';
                border = '#00B4D8';
              }

              return (
                <motion.button
                  key={i}
                  whileHover={!showResult ? { scale: 1.02 } : {}}
                  whileTap={!showResult ? { scale: 0.98 } : {}}
                  onClick={() => !showResult && handleAnswer(i)}
                  className="w-full text-left p-4 rounded-lg transition-all flex items-center gap-3"
                  style={{ background: bg, border: `1px solid ${border}`, color: textColor }}
                  disabled={showResult}
                >
                  <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background: `${border}40`, color: textColor }}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="text-sm">{option}</span>
                  {showResult && i === question.correct && <span className="ml-auto">✅</span>}
                  {showResult && i === selected && !isCorrect && i !== question.correct && <span className="ml-auto">❌</span>}
                </motion.button>
              );
            })}
          </div>

          {/* Explanation */}
          <AnimatePresence>
            {showResult && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 p-4 rounded-lg"
                style={{ background: isCorrect ? '#3FB95010' : '#F8514910', border: `1px solid ${isCorrect ? '#3FB950' : '#F85149'}30` }}
              >
                <div className="flex items-start gap-2">
                  <span className="text-lg">{isCorrect ? '🎉' : '💡'}</span>
                  <p className="text-sm" style={{ color: '#8B949E' }}>{question.explanation}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      {/* Next button */}
      {showResult && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-end">
          <button
            onClick={handleNext}
            className="px-6 py-2.5 rounded-lg font-bold transition-all hover:scale-105"
            style={{ background: '#00B4D8', color: '#0D1117' }}
          >
            {currentQ < 2 ? 'Next Question →' : 'See Results 🏆'}
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
