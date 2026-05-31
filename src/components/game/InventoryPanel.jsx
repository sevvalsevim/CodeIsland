import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ITEMS } from '@/lib/gameData';
import { X, Lock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function InventoryPanel({ isOpen, onClose, inventory, usedItems, onUseItem, isAtShip }) {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={e => e.stopPropagation()}
        className="bg-card border border-border/50 rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-hidden"
      >
        <div className="flex items-center justify-between p-4 border-b border-border/30">
          <h2 className="font-pixel text-sm text-primary">📦 Envanter</h2>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground font-main">
              {inventory.length}/{ITEMS.length} eşya
            </span>
            <Button variant="ghost" size="icon" onClick={onClose} className="w-8 h-8">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="p-4 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
            {ITEMS.map((item) => {
              const owned = inventory.includes(item.id);
              const used = usedItems.includes(item.id);

              return (
                <motion.div
                  key={item.id}
                  whileHover={owned && !used ? { scale: 1.05 } : {}}
                  className={`relative aspect-square rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all ${
                    used
                      ? 'bg-primary/10 border-primary/30'
                      : owned
                        ? 'bg-muted/50 border-secondary/50 cursor-pointer hover:border-secondary'
                        : 'bg-muted/20 border-border/20 opacity-40'
                  }`}
                  onClick={() => {
                    if (owned && !used && isAtShip && onUseItem) {
                      onUseItem(item.id);
                    }
                  }}
                >
                  <span className={`text-2xl ${!owned ? 'grayscale' : ''}`}>
                    {owned ? item.emoji : '❓'}
                  </span>
                  <span className="text-[9px] font-main text-muted-foreground text-center leading-tight px-1">
                    {owned ? item.name : '???'}
                  </span>

                  {!owned && (
                    <Lock className="absolute top-1 right-1 w-3 h-3 text-muted-foreground/40" />
                  )}
                  {used && (
                    <CheckCircle className="absolute top-1 right-1 w-3 h-3 text-primary" />
                  )}
                </motion.div>
              );
            })}
          </div>

          {isAtShip && inventory.length > usedItems.length && (
            <p className="text-xs text-center text-secondary mt-4 font-main">
              💡 Eşyalara tıklayarak gemiyi tamir edebilirsin!
            </p>
          )}

          {!isAtShip && inventory.length > 0 && (
            <p className="text-xs text-center text-muted-foreground mt-4 font-main">
              🚢 Eşyaları kullanmak için iskeleye git!
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
