import React, { useState, useEffect } from 'react';
import { LogOut, Trophy, Sparkles, User } from 'lucide-react';
import { useGameState } from './hooks/useGameState';
import Lobby from './components/Lobby';
import ScoreGrid from './components/ScoreGrid';
import ScoreInputModal from './components/ScoreInputModal';
import History from './components/History';

export default function App() {
  const {
    players,
    gameStarted,
    activePlayerIndex,
    winner,
    gameHistory,
    startGame,
    isCellPlayable,
    recordScore,
    resetGame,
    clearHistory
  } = useGameState();

  const [showHistoryScreen, setShowHistoryScreen] = useState(false);
  const [selectedCell, setSelectedCell] = useState(null); // { colName, rowKey }
  const [viewedPlayerIndex, setViewedPlayerIndex] = useState(0);
  const safeViewedPlayerIndex = viewedPlayerIndex < players.length ? viewedPlayerIndex : activePlayerIndex;

  // Sync viewed scorecard to the active player when their turn starts
  useEffect(() => {
    if (gameStarted && players.length > 0) {
      setViewedPlayerIndex(activePlayerIndex);
    }
  }, [activePlayerIndex, gameStarted, players.length]);

  const handleCellClick = (colName, rowKey) => {
    // Only the active player's scorecard can be clicked, and only if we are viewing it
    if (safeViewedPlayerIndex !== activePlayerIndex) return;
    
    setSelectedCell({
      colName,
      rowKey
    });
  };

  const handleModalSubmit = (scoreValue) => {
    if (!selectedCell) return;
    recordScore(selectedCell.colName, selectedCell.rowKey, scoreValue);
    setSelectedCell(null);
  };

  // Render History Screen
  if (showHistoryScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <History
          history={gameHistory}
          onClose={() => setShowHistoryScreen(false)}
          onClear={clearHistory}
        />
      </div>
    );
  }

  // Render Winner / Victory Screen
  if (winner) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 no-select">
        <div className="glass-panel p-8 max-w-sm w-full text-center border-emerald-500/20 animate-scale-up">
          <div className="inline-flex p-4 rounded-full bg-emerald-500/10 text-emerald-400 mb-4 animate-bounce">
            <Trophy size={48} />
          </div>
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-300 mb-1">
            Partie Terminée !
          </h2>
          <p className="text-slate-400 text-sm mb-5">Le score final a été calculé</p>

          <div className="p-5 rounded-2xl bg-indigo-950/20 border border-indigo-900/30 mb-6">
            <span className="text-xs text-indigo-400 uppercase font-bold tracking-wider block mb-1">
              Vainqueur 🎉
            </span>
            <span className="text-2xl font-black text-white block mb-1">{winner.name}</span>
            <span className="text-emerald-400 font-extrabold text-lg">
              Score total : {winner.scorecard ? winner.scorecard.grandTotal : ''} pts
            </span>
          </div>

          {/* Leaderboard list */}
          <div className="space-y-2 mb-6 text-left max-h-36 overflow-y-auto pr-1">
            <h4 className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Tableau des scores</h4>
            {players.map((p, index) => (
              <div key={p.id} className="flex justify-between items-center text-xs py-1.5 border-b border-slate-900/50">
                <span className="text-slate-300 font-medium">{index + 1}. {p.name}</span>
                <span className="text-slate-400 font-bold">
                  {p.scorecard ? p.scorecard.grandTotal : ''} pts
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={resetGame}
            className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all flex items-center justify-center gap-2"
          >
            <Sparkles size={16} /> Revenir au menu principal
          </button>
        </div>
      </div>
    );
  }

  // Render Lobby Screen
  if (!gameStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Lobby
          startGame={startGame}
          showHistory={() => setShowHistoryScreen(true)}
          historyCount={gameHistory.length}
        />
      </div>
    );
  }

  const currentPlayer = players[activePlayerIndex];
  const viewedPlayer = players[safeViewedPlayerIndex] || players[0];
  const isViewingSelf = safeViewedPlayerIndex === activePlayerIndex;

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto p-4 pb-24 md:pb-28">
      {/* Top Navbar */}
      <header className="flex items-center justify-between py-3 mb-3 border-b border-slate-800/40 select-none">
        <div className="flex items-center gap-2">
          <span className="text-sm font-black tracking-tight text-white flex items-center gap-1.5">
            <Trophy size={16} className="text-indigo-400" /> Triple Yams
          </span>
        </div>
        <button
          onClick={resetGame}
          className="p-2 rounded-lg bg-transparent hover:bg-rose-50 hover:text-rose-600 text-slate-500 border border-transparent hover:border-rose-100 transition-colors"
          title="Quitter la partie"
        >
          <LogOut size={14} />
        </button>
      </header>

      {/* Multiplayer Tabs switcher */}
      {players.length > 1 && (
        <div className="flex gap-1.5 overflow-x-auto pb-3 mb-2 scrollbar-none no-select">
          {players.map((p, idx) => {
            const isActive = idx === activePlayerIndex;
            const isViewed = idx === safeViewedPlayerIndex;
            return (
              <button
                key={p.id}
                onClick={() => setViewedPlayerIndex(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  isViewed
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-transparent text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <User size={11} className={isActive ? 'text-emerald-400' : ''} />
                <span>{p.name}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Active turn alert */}
      <div className="mb-3 p-2.5 rounded-xl bg-slate-100 border border-slate-200/60 flex items-center justify-between text-xs select-none">
        <span className="text-slate-500">
          Tour de : <strong className="text-slate-800 font-bold">{currentPlayer.name}</strong>
        </span>
        {!isViewingSelf && (
          <button
            onClick={() => setViewedPlayerIndex(activePlayerIndex)}
            className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold underline cursor-pointer"
          >
            Afficher ma grille
          </button>
        )}
      </div>

      {/* Score Grid scorecard */}
      <div className="flex-1 mb-4">
        <ScoreGrid
          scorecard={viewedPlayer.scorecard}
          isCellPlayable={(col, key, card) => isViewingSelf && isCellPlayable(col, key, card)}
          onCellClick={handleCellClick}
        />
      </div>

      {/* If viewing another player, show a clear message overlay at the bottom */}
      {!isViewingSelf && (
        <div className="fixed bottom-4 left-4 right-4 max-w-md mx-auto z-40 p-3 text-center text-xs text-slate-600 rounded-xl bg-white/95 border border-slate-200 shadow-lg backdrop-blur-md font-semibold">
          Vous consultez la grille de {viewedPlayer.name}
        </div>
      )}

      {/* Score Input Modal */}
      {selectedCell && (
        <ScoreInputModal
          colName={selectedCell.colName}
          rowKey={selectedCell.rowKey}
          onClose={() => setSelectedCell(null)}
          onSubmit={handleModalSubmit}
        />
      )}
    </div>
  );
}
