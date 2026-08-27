import React from 'react';
import { RotateCw, Lock } from 'lucide-react';

// Sub-component to render a beautiful CSS die with dots
const Die = ({ value, isLocked, isRolling, onClick }) => {
  // Dot visibility based on a 3x3 grid: index 0 to 8
  const getDotMap = (val) => {
    switch (val) {
      case 1: return [4];
      case 2: return [0, 8];
      case 3: return [0, 4, 8];
      case 4: return [0, 2, 6, 8];
      case 5: return [0, 2, 4, 6, 8];
      case 6: return [0, 2, 3, 5, 6, 8];
      default: return [];
    }
  };

  const dots = getDotMap(value);

  return (
    <div
      onClick={onClick}
      className={`relative w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center cursor-pointer select-none transition-all duration-300 no-select ${
        isRolling ? 'animate-roll' : ''
      } ${
        isLocked
          ? 'bg-gradient-to-br from-indigo-600 to-indigo-800 border-2 border-indigo-400 shadow-[0_0_12px_rgba(99,102,241,0.6)] scale-95 translate-y-1'
          : 'bg-white border border-slate-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95'
      }`}
    >
      {/* 3x3 Dot Grid */}
      <div className="w-10 h-10 md:w-11 md:h-11 grid grid-cols-3 gap-1 p-0.5">
        {[...Array(9)].map((_, idx) => (
          <div key={idx} className="flex items-center justify-center">
            {dots.includes(idx) && (
              <div
                className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-colors duration-300 ${
                  isLocked ? 'bg-white shadow-[0_1px_2px_rgba(0,0,0,0.4)]' : 'bg-slate-900'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Mini Lock Icon */}
      {isLocked && (
        <div className="absolute -top-1.5 -right-1.5 p-0.5 rounded-full bg-indigo-500 text-white shadow-md">
          <Lock size={10} />
        </div>
      )}
    </div>
  );
};

export default function DiceRoller({ dice, keep, rollsRemaining, isRolling, hasRolled, toggleKeep, rollDice }) {
  return (
    <div className="glass-panel p-4 md:p-5 flex flex-col items-center gap-4 select-none border border-slate-800/80">
      {/* Dice Container */}
      <div className="flex gap-3 md:gap-4 justify-center items-center py-2 min-h-[75px]">
        {dice.map((val, idx) => (
          <Die
            key={idx}
            value={val}
            isLocked={keep[idx]}
            isRolling={isRolling}
            onClick={() => toggleKeep(idx)}
          />
        ))}
      </div>

      {/* Controls Container */}
      <div className="w-full flex items-center justify-between gap-4 mt-1 border-t border-slate-800/40 pt-3">
        {/* Helper info */}
        <div className="text-left">
          <div className="text-xs font-semibold text-slate-300">
            {rollsRemaining === 3 
              ? 'Lancer les dés pour démarrer' 
              : rollsRemaining === 0 
                ? 'Plus de lancers ! Marquez vos points' 
                : 'Cliquez sur les dés pour les garder'}
          </div>
          <div className="text-[10px] text-slate-500 font-medium">
            Lancers restants : <span className="font-bold text-indigo-400">{rollsRemaining} / 3</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={rollDice}
          disabled={rollsRemaining <= 0 || isRolling}
          className={`py-2.5 px-5 rounded-xl font-bold text-xs md:text-sm flex items-center gap-2 shadow-md transition-all duration-200 ${
            rollsRemaining <= 0 
              ? 'bg-slate-800/50 border border-slate-800 text-slate-600 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/10 hover:shadow-indigo-500/25 active:scale-95'
          }`}
        >
          <RotateCw size={14} className={isRolling ? 'animate-spin' : ''} />
          {rollsRemaining === 3 ? 'Premier lancer' : 'Relancer'}
        </button>
      </div>
    </div>
  );
}
