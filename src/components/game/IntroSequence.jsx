import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { INTRO_MESSAGES } from '@/lib/gameData';
import { soundManager } from '@/lib/soundManager';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function IntroSequence({ onComplete }) {
  const [step, setStep] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    soundManager.init();
  }, []);

  useEffect(() => {
    const message = INTRO_MESSAGES[step];
    let index = 0;
    setDisplayedText('');
    setIsTyping(true);

    const interval = setInterval(() => {
      if (index < message.length) {
        setDisplayedText(message.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 35);

    return () => clearInterval(interval);
  }, [step]);

  const handleNext = () => {
    soundManager.playClick();
    if (step < INTRO_MESSAGES.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    soundManager.playClick();
    onComplete();
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-[#0a1628] via-[#0d1f3c] to-[#1a0f2e] flex items-center justify-center z-50">
      {/* Yıldız arka planı */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 60}%`,
              animationDelay: `${Math.random() * 3}s`,
              animation: `pulse ${2 + Math.random() * 3}s ease-in-out infinite`
            }}
          />
        ))}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#1a3a2a] to-transparent" />

      <div className="relative max-w-2xl w-full mx-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center gap-6"
          >
            <motion.div
              className="text-8xl"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              🧙‍♂️
            </motion.div>

            <div className="text-center mb-2">
              <span className="font-pixel text-primary text-xs tracking-widest uppercase">
                Profesör Kodhan
              </span>
            </div>

            <div className="relative bg-card/90 backdrop-blur-md border border-border/50 rounded-2xl p-6 shadow-2xl shadow-primary/5 max-w-lg w-full">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-card/90 border-l border-t border-border/50 rotate-45" />
              <p className="text-foreground font-main text-base leading-relaxed min-h-[60px] relative z-10">
                {displayedText}
                {isTyping && (
                  <span className="inline-block w-2 h-4 bg-primary ml-1 animate-pulse" />
                )}
              </p>
            </div>

            <div className="flex gap-1.5 mt-2">
              {INTRO_MESSAGES.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === step ? 'bg-primary scale-125' : i < step ? 'bg-primary/50' : 'bg-muted'
                  }`}
                />
              ))}
            </div>

            <div className="flex gap-3 mt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkip}
                className="text-muted-foreground hover:text-foreground font-main text-xs"
              >
                Atla
              </Button>
              <Button
                onClick={handleNext}
                className="bg-primary hover:bg-primary/80 text-primary-foreground font-main px-6 gap-2"
                disabled={isTyping}
              >
                {step === INTRO_MESSAGES.length - 1 ? 'Başla!' : 'İleri'}
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
