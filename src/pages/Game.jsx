// ============================================================
// Game Programming Dersi - Python Island Game
// Hazırlayanlar: Şevval Sevim, Ayşegül Yavuz, Mine Uyanık
//
// Ana oyun sayfası — tüm game state machine burada yönetilir.
// State Machine: intro → exploring → (victory | gameover)
// Design Patterns: State Machine, Observer (useEffect), Singleton (soundManager)
// ============================================================

import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { loadGameState, saveGameState, resetGameState } from '@/lib/gameStore';
import { ITEMS } from '@/lib/gameData';
import { soundManager } from '@/lib/soundManager';

import IntroSequence from '@/components/game/IntroSequence';
import IslandMap from '@/components/game/IslandMap';
import HUD from '@/components/game/HUD';
import QuestionModal from '@/components/game/QuestionModal';
import InventoryPanel from '@/components/game/InventoryPanel';
import ShipView from '@/components/game/ShipView';
import ShipButton from '@/components/game/ShipButton';
import VictoryScreen from '@/components/game/VictoryScreen';
import GameOverScreen from '@/components/game/GameOverScreen';

export default function Game() {
  // ── State ──────────────────────────────────────────────────
  const [gameState, setGameState] = useState(loadGameState);
  const [showInventory, setShowInventory] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [showShip, setShowShip] = useState(false);

  // ── Persistence ────────────────────────────────────────────
  useEffect(() => {
    saveGameState(gameState);
  }, [gameState]);

  // ── Can yenileme zamanlayıcısı (20 dk → +1 can) ───────────
  useEffect(() => {
    if (gameState.lives >= gameState.maxLives || !gameState.lastLifeLostTime) return;
    const interval = setInterval(() => {
      setGameState(prev => {
        const elapsed = Date.now() - prev.lastLifeLostTime;
        const livesRecovered = Math.floor(elapsed / (20 * 60 * 1000));
        if (livesRecovered > 0) {
          const newLives = Math.min(prev.maxLives, prev.lives + livesRecovered);
          return {
            ...prev,
            lives: newLives,
            lastLifeLostTime: newLives >= prev.maxLives ? null : Date.now()
          };
        }
        return prev;
      });
    }, 10000);
    return () => clearInterval(interval);
  }, [gameState.lives, gameState.lastLifeLostTime, gameState.maxLives]);

  // ── Event Handlers ─────────────────────────────────────────

  const handleIntroComplete = () => {
    soundManager.init();
    setGameState(prev => ({ ...prev, gamePhase: 'exploring' }));
  };

  // Hem harita tıklaması hem karakter E tuşu buraya gelir
  const handleLocationClick = useCallback((questionId) => {
    if (gameState.lives <= 0) return;
    // Eğer zaten çözülmüşse ignore
    if (gameState.solvedQuestions.includes(questionId)) return;
    setActiveQuestion(questionId);
  }, [gameState.lives, gameState.solvedQuestions]);

  const handleCorrectAnswer = useCallback((questionId) => {
    soundManager.playSuccess();
    setGameState(prev => ({
      ...prev,
      solvedQuestions: [...prev.solvedQuestions, questionId],
      inventory: [...prev.inventory, questionId],
    }));
    setActiveQuestion(null);
  }, []);

  const handleWrongAnswer = useCallback(() => {
    setGameState(prev => {
      const newLives = prev.lives - 1;
      if (newLives <= 0) {
        return { ...prev, lives: 0, gamePhase: 'gameover', lastLifeLostTime: Date.now() };
      }
      return {
        ...prev,
        lives: newLives,
        lastLifeLostTime: prev.lastLifeLostTime || Date.now()
      };
    });
    setActiveQuestion(null);
  }, []);

  const handleUseItem = useCallback((itemId) => {
    setGameState(prev => ({
      ...prev,
      usedItems: [...prev.usedItems, itemId],
      shipRepairProgress: ((prev.usedItems.length + 1) / ITEMS.length) * 100
    }));
  }, []);

  const handleVictory = () => {
    setGameState(prev => ({ ...prev, gamePhase: 'victory' }));
  };

  const handleRestart = () => {
    const fresh = resetGameState();
    setGameState(fresh);
    setShowShip(false);
    setActiveQuestion(null);
    setShowInventory(false);
  };

  // ── Computed ───────────────────────────────────────────────
  const repairPercent = Math.round((gameState.usedItems.length / ITEMS.length) * 100);

  // ── Render by game phase ───────────────────────────────────
  if (gameState.gamePhase === 'intro') {
    return <IntroSequence onComplete={handleIntroComplete} />;
  }
  if (gameState.gamePhase === 'victory') {
    return <VictoryScreen onRestart={handleRestart} />;
  }
  if (gameState.gamePhase === 'gameover') {
    return <GameOverScreen onRestart={handleRestart} />;
  }

  return (
    <div className="w-full h-screen overflow-hidden relative">
      {/* HUD - canlar, ilerleme, envanter, ses */}
      <HUD
        lives={gameState.lives}
        maxLives={gameState.maxLives}
        solvedCount={gameState.solvedQuestions.length}
        totalQuestions={20}
        onInventoryClick={() => setShowInventory(true)}
        lastLifeLostTime={gameState.lastLifeLostTime}
      />

      {/* Ana görünüm: Ada haritası veya gemi */}
      {showShip ? (
        <ShipView
          inventory={gameState.inventory}
          usedItems={gameState.usedItems}
          onUseItem={handleUseItem}
          onBack={() => setShowShip(false)}
          onVictory={handleVictory}
        />
      ) : (
        <IslandMap
          solvedQuestions={gameState.solvedQuestions}
          onLocationClick={handleLocationClick}
        />
      )}

      {/* İskele butonu - haritadayken görünür */}
      {!showShip && (
        <ShipButton
          onClick={() => setShowShip(true)}
          repairPercent={repairPercent}
        />
      )}

      {/* Soru modal'ı */}
      <AnimatePresence>
        {activeQuestion !== null && (
          <QuestionModal
            key={activeQuestion}
            questionId={activeQuestion}
            onCorrect={handleCorrectAnswer}
            onWrong={handleWrongAnswer}
            onClose={() => setActiveQuestion(null)}
          />
        )}
      </AnimatePresence>

      {/* Envanter paneli */}
      <AnimatePresence>
        {showInventory && (
          <InventoryPanel
            isOpen={showInventory}
            onClose={() => setShowInventory(false)}
            inventory={gameState.inventory}
            usedItems={gameState.usedItems}
            onUseItem={handleUseItem}
            isAtShip={showShip}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
