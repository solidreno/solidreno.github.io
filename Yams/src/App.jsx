import React, { useState, useEffect } from 'react';
import { LogOut, Trophy, Sparkles, User, RotateCcw } from 'lucide-react';
import { useGameState } from './hooks/useGameState';
import Lobby from './components/Lobby';
import ScoreGrid from './components/ScoreGrid';
import ScoreInputModal from './components/ScoreInputModal';
import History from './components/History';

const GENERAL_MESSAGES = [
  "Ouch...",
  "Aïe !",
  "Pathétique.",
  "C'est tout ?",
  "Nul.",
  "Sérieux ?",
  "La honte !",
  "Zéro pointé.",
  "Next !",
  "Bof...",
  "Quel talent !",
  "Magnifique...",
  "Du grand art.",
  "Champion du monde.",
  "Impressionnant.",
  "Un coup de maître.",
  "Presque ! (Mais non)",
  "C'est fait exprès ?",
  "Stratégie audacieuse.",
  "On applaudit.",
  "Change de dés !",
  "Pas ton jour.",
  "La poisse...",
  "Les dés te détestent.",
  "Karma.",
  "Relance pour voir ? (Ah, tu peux plus)",
  "Souffle sur les dés !",
  "Maudit.",
  "Encore raté.",
  "Fâcheux.",
  "Mon chat ferait mieux.",
  "Arrête de jouer.",
  "Désinstalle le jeu.",
  "Tu le fais exprès ?",
  "Même l'IA a pitié.",
  "Au fond du trou.",
  "Catastrophique.",
  "C'est un gag ?",
  "Triste à pleurer.",
  "Joue au Loto plutôt."
];

const BULLE_MESSAGES = [
  "Dans le vide !",
  "Hop, poubelle.",
  "Barré !",
  "Une belle bulle.",
  "Tout ça pour ça.",
  "Adieu les points.",
  "Et c'est le zéro !",
  "Dommage...",
  "Plouf.",
  "Direct à la poubelle."
];

const CONGRATS_MESSAGES = [
  "Bingo !",
  "Boom !",
  "Parfait.",
  "Propre.",
  "Excellent.",
  "Magistral.",
  "Top !",
  "Superbe.",
  "Joli !",
  "Brillant.",
  "Bien joué !",
  "Quel talent !",
  "Du grand art.",
  "Un vrai pro.",
  "Impressionnant.",
  "Maître des dés.",
  "La grande classe.",
  "Inarrêtable !",
  "Coup de génie.",
  "Respect total.",
  "Insolent de chance !",
  "Les dés t'adorent.",
  "Main en or.",
  "Quelle chance !",
  "Les astres sont alignés.",
  "Le karma parfait.",
  "Va jouer au casino !",
  "Probabilités vaincues.",
  "Touché par la grâce.",
  "Incroyable mais vrai.",
  "Jackpot !",
  "Carton plein !",
  "Le coup parfait.",
  "Maximum de points !",
  "Historique !",
  "Pluie de points.",
  "Ça, c'est du lourd.",
  "Imbattable !",
  "Explosion de points !",
  "Le boss est là.",
  "Tu triches ?",
  "Calme-toi !",
  "Laisse-en aux autres !",
  "Même l'IA est jalouse.",
  "C'est illégal à ce stade.",
  "Tu as vendu ton âme ?",
  "Rentre chez toi, c'est gagné.",
  "Apprends-moi !",
  "On a un champion ici.",
  "Le roi du Yam's !"
];

const getUndoLabel = (lastAction) => {
  if (!lastAction) return "";
  const { colName, rowKey } = lastAction;
  
  // Column name
  let colFr = "";
  if (colName === "down") colFr = "la colonne descente";
  if (colName === "up") colFr = "la colonne montée";
  if (colName === "free") colFr = "la colonne libre";
  
  // Row name
  let rowFr = "";
  if (rowKey === "1") rowFr = "les as";
  else if (rowKey === "2") rowFr = "les deux";
  else if (rowKey === "3") rowFr = "les trois";
  else if (rowKey === "4") rowFr = "les quatre";
  else if (rowKey === "5") rowFr = "les cinq";
  else if (rowKey === "6") rowFr = "les six";
  else if (rowKey === "plus") rowFr = "le plus";
  else if (rowKey === "moins") rowFr = "le moins";
  else if (rowKey === "suite") rowFr = "la suite";
  else if (rowKey === "full") rowFr = "le full";
  else if (rowKey === "carre") rowFr = "le carré";
  else if (rowKey === "yams") rowFr = "le yams";
  
  return `Annuler ${rowFr} sur ${colFr}`;
};

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
    undoLastScore,
    replayGame,
    resetGame,
    clearHistory
  } = useGameState();

  const [showHistoryScreen, setShowHistoryScreen] = useState(false);
  const [selectedCell, setSelectedCell] = useState(null); // { colName, rowKey }
  const [viewedPlayerIndex, setViewedPlayerIndex] = useState(0);
  const safeViewedPlayerIndex = viewedPlayerIndex < players.length ? viewedPlayerIndex : activePlayerIndex;
  
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Sync viewed scorecard to the active player when their turn starts
  useEffect(() => {
    if (gameStarted && players.length > 0) {
      setViewedPlayerIndex(activePlayerIndex);
    }
  }, [activePlayerIndex, gameStarted, players.length]);

  const handleCellClick = (colName, rowKey) => {
    // Prevent scoring clicks if the game is finished
    if (winner) return;
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
    
    // Easter Egg toast message if scoring 0 or 1 die in the upper section
    const isUpperSection = ['1', '2', '3', '4', '5', '6'].includes(selectedCell.rowKey);
    if (isUpperSection && (scoreValue === 0 || scoreValue === Number(selectedCell.rowKey))) {
      let pool = [...GENERAL_MESSAGES];
      if (scoreValue === 0) {
        pool = [...pool, ...BULLE_MESSAGES];
      }
      const randomMsg = pool[Math.floor(Math.random() * pool.length)];
      setToast(randomMsg);
    }

    // Easter Egg congratulations toast message
    let showCongrats = false;
    if (isUpperSection) {
      if (scoreValue === Number(selectedCell.rowKey) * 5) {
        showCongrats = true;
      }
      if (selectedCell.rowKey === '1' && (scoreValue === 4 || scoreValue === 5)) {
        showCongrats = true;
      }
    } else {
      if (selectedCell.rowKey === 'yams' && scoreValue === 50) {
        showCongrats = true;
      }
      if (selectedCell.rowKey === 'plus' && scoreValue > 28) {
        showCongrats = true;
      }
      if (selectedCell.rowKey === 'moins' && scoreValue < 7) {
        showCongrats = true;
      }
    }

    if (showCongrats) {
      const randomMsg = CONGRATS_MESSAGES[Math.floor(Math.random() * CONGRATS_MESSAGES.length)];
      setToast(randomMsg);
    }
    
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
    <div className="min-h-screen flex flex-col max-w-md mx-auto p-4 pb-24 md:pb-28 relative">
      {/* Toast Notification */}
      {toast && (
        <div className="toast-notification animate-toast">
          <span>{toast}</span>
        </div>
      )}

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

      {/* Active turn alert or Game over banner */}
      {winner ? (
        <div className="mb-3 p-3 rounded-xl bg-emerald-600 border border-emerald-500 text-white flex flex-col gap-2.5 text-xs select-none shadow-md animate-fade-in">
          {/* First row: Turn indicator & Rejouer */}
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <Trophy size={14} fill="currentColor" className="text-amber-300" />
              <span>
                Partie terminée ! <strong>{winner.name}</strong> a gagné !
              </span>
            </div>
            <button
              onClick={replayGame}
              className="px-2.5 py-1 rounded bg-white hover:bg-slate-100 text-emerald-700 font-bold text-[10px] uppercase tracking-wide cursor-pointer transition-colors shadow-sm"
            >
              Rejouer
            </button>
          </div>
          
          {/* Second row: Descriptive Undo button (on separate line) */}
          {viewedPlayer.lastAction && (
            <div className="border-t border-emerald-500/60 pt-2 flex justify-start">
              <button
                onClick={() => undoLastScore(safeViewedPlayerIndex)}
                className="flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-[10px] cursor-pointer transition-all shadow-sm border border-emerald-600/40"
              >
                <RotateCcw size={10} /> {getUndoLabel(viewedPlayer.lastAction)}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="mb-3 p-2.5 rounded-xl bg-slate-100 border border-slate-200/60 flex flex-col gap-2 text-xs select-none shadow-sm">
          {/* First row: Turn indicator & Afficher ma grille */}
          <div className="flex items-center justify-between w-full">
            <span className="text-slate-500">
              Tour de : <strong className="text-slate-800 font-bold">{currentPlayer.name}</strong>
            </span>
            {!isViewingSelf && (
              <button
                onClick={() => setViewedPlayerIndex(activePlayerIndex)}
                className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold underline cursor-pointer"
              >
                Afficher sa grille
              </button>
            )}
          </div>
          
          {/* Second row: Descriptive Undo button (on separate line) */}
          {viewedPlayer.lastAction && (
            <div className="border-t border-slate-200/50 pt-2 flex justify-start">
              <button
                onClick={() => undoLastScore(safeViewedPlayerIndex)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 font-semibold text-[10px] cursor-pointer transition-all shadow-sm"
              >
                <RotateCcw size={10} /> {getUndoLabel(viewedPlayer.lastAction)}
              </button>
            </div>
          )}
        </div>
      )}

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
