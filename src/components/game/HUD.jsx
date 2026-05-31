import React, { useEffect, useState } from 'react';
import { Heart, Package, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { soundManager } from '@/lib/soundManager';

export default function HUD({ lives, maxLives, solvedCount, totalQuestions, onInventoryClick, lastLifeLostTime }) {
  const [muted, setMuted] = useState(false);
  const [regenTimer, setRegenTimer] = useState('');

  useEffect(() => {
    if (!lastLifeLostTime || lives >= maxLives) {
      setRegenTimer('');
      return;
    }
    const interval = setInterval(() => {
      const elapsed = Date.now() - lastLifeLostTime;
      const nextRegenIn = 20 * 60 * 1000 - (elapsed % (20 * 60 * 1000));
      const mins = Math.floor(nextRegenIn / 60000);
      const secs = Math.floor((nextRegenIn % 60000) / 1000);
      setRegenTimer(`${mins}:${secs.toString().padStart(2, '0')}`);
    }, 1000);
    return () => clearInterval(interval);
  }, [lastLifeLostTime, lives, maxLives]);

  const toggleMute = () => {
    setMuted(!muted);
    soundManager.setVolume(muted ? 0.3 : 0);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-40 pointer-events-none">
      <div className="flex justify-between items-start p-3 md:p-4">
        {/* Canlar */}
        <div className="pointer-events-auto bg-card/80 backdrop-blur-md rounded-xl border border-border/50 px-3 py-2 flex items-center gap-2">
          <div className="flex gap-0.5">
            {Array.from({ length: maxLives }).map((_, i) => (
              <Heart
                key={i}
                className={`w-5 h-5 transition-all duration-300 ${
                  i < lives ? 'text-red-500 fill-red-500' : 'text-muted-foreground/30'
                }`}
              />
            ))}
          </div>
          {regenTimer && (
            <span className="text-xs text-muted-foreground font-main ml-1">
              +1 {regenTimer}
            </span>
          )}
        </div>

        {/* İlerleme & Kontroller */}
        <div className="flex items-center gap-2">
          <div className="pointer-events-auto bg-card/80 backdrop-blur-md rounded-xl border border-border/50 px-3 py-2">
            <span className="font-pixel text-xs text-primary">{solvedCount}</span>
            <span className="font-main text-xs text-muted-foreground">/{totalQuestions}</span>
          </div>

          <Button
            onClick={onInventoryClick}
            variant="outline"
            size="sm"
            className="pointer-events-auto bg-card/80 backdrop-blur-md border-border/50 gap-1.5"
          >
            <Package className="w-4 h-4" />
            <span className="text-xs font-main hidden sm:inline">Envanter</span>
          </Button>

          <Button
            onClick={toggleMute}
            variant="ghost"
            size="icon"
            className="pointer-events-auto bg-card/80 backdrop-blur-md border border-border/50 w-9 h-9"
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
