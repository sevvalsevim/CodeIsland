import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { soundManager } from '@/lib/soundManager';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

export default function VictoryScreen({ onRestart }) {
  useEffect(() => {
    soundManager.stopAmbient();
    soundManager.playVictory();
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-[#0a2444] via-[#0d3366] to-[#1a4488] flex items-center justify-center overflow-hidden">
      {/* Havai fişek efekti */}
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-secondary rounded-full"
          initial={{ x: '50%', y: '50%', opacity: 0, scale: 0 }}
          animate={{
            x: `${Math.random() * 100}%`,
            y: `${Math.random() * 100}%`,
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0]
          }}
          transition={{
            duration: 2,
            delay: Math.random() * 2,
            repeat: Infinity,
            repeatDelay: Math.random() * 3
          }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center z-10 px-4"
      >
        <motion.div
          className="text-8xl md:text-[140px] mb-6"
          animate={{ x: [0, 200, 400], y: [0, -10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        >
          ⛵
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="font-pixel text-xl md:text-2xl text-secondary mb-4"
        >
          🎉 TEBRİKLER! 🎉
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="font-main text-foreground/80 text-base md:text-lg mb-2 max-w-md mx-auto"
        >
          Gemiyi başarıyla tamir ettin ve adadan kurtuldun!
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="font-main text-muted-foreground text-sm mb-8 max-w-md mx-auto"
        >
          Python bilginle tüm zorlukları aştın. Profesör Kodhan seninle gurur duyuyor! 🧙‍♂️
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <Button
            onClick={onRestart}
            variant="outline"
            className="font-main gap-2 border-secondary/50 text-secondary hover:bg-secondary/10"
          >
            <RotateCcw className="w-4 h-4" />
            Tekrar Oyna
          </Button>
        </motion.div>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 h-16">
        <div className="animate-wave h-full bg-gradient-to-t from-accent/30 to-transparent" />
      </div>
    </div>
  );
}
