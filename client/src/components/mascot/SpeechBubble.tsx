import { motion } from 'framer-motion';
import Graphy from './Graphy';
import type { GraphyMood } from '../../types';

interface SpeechBubbleProps {
  text: string;
  mood?: GraphyMood;
  graphySize?: number;
}

export default function SpeechBubble({ text, mood = 'happy', graphySize = 100 }: SpeechBubbleProps) {
  return (
    <div className="flex items-end gap-4">
      <Graphy mood={mood} size={graphySize} />
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'backOut' }}
        className="speech-bubble max-w-xl text-base leading-relaxed"
      >
        <p>{text}</p>
      </motion.div>
    </div>
  );
}
