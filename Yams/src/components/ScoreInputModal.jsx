import React from 'react';
import { X, Sparkles } from 'lucide-react';
import { ROW_LABELS } from '../hooks/useGameState';

export default function ScoreInputModal({ colName, rowKey, onClose, onSubmit }) {
  const labelInfo = ROW_LABELS[rowKey];
  const isUpperSection = ['1', '2', '3', '4', '5', '6'].includes(rowKey);

  // Column friendly name
  const getColNameFr = () => {
    if (colName === 'down') return 'Colonne Descendante (↓)';
    if (colName === 'free') return 'Colonne Libre (L)';
    if (colName === 'up') return 'Colonne Montante (↑)';
    return '';
  };

  // 1. Render Upper Section Options (1s to 6s)
  const renderUpperOptions = () => {
    const val = Number(rowKey);
    const options = [
      { label: 'Rayer la case', score: 0, desc: 'Aucun dé' },
      { label: `1 dé (${val} pt)`, score: val * 1, desc: 'Un seul dé' },
      { label: `2 dés (${val * 2} pts)`, score: val * 2, desc: 'Une paire' },
      { label: `3 dés (${val * 3} pts)`, score: val * 3, desc: 'Un brelan' },
      { label: `4 dés (${val * 4} pts)`, score: val * 4, desc: 'Un carré' },
      { label: `5 dés (${val * 5} pts)`, score: val * 5, desc: 'Yams !' },
    ];

    return (
      <div className="space-y-2.5">
        <p className="text-xs text-slate-400 mb-4 text-center">
          Sélectionnez le nombre de dés de valeur <strong>{rowKey}</strong> obtenus :
        </p>
        <div className="grid grid-cols-2 gap-2.5">
          {options.map((opt) => (
            <button
              key={opt.score}
              onClick={() => onSubmit(opt.score)}
              className={`p-3.5 rounded-xl border font-bold transition-all text-sm flex flex-col items-center justify-center ${
                opt.score === 0
                  ? 'border-slate-800 bg-slate-900/50 hover:bg-slate-900 text-rose-400'
                  : 'border-indigo-900/40 bg-indigo-950/20 hover:bg-indigo-600/20 text-indigo-200'
              }`}
            >
              <span>{opt.label}</span>
              <span className="text-[10px] font-normal text-slate-400 mt-0.5">{opt.desc}</span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  // 2. Render Binary Fixed Scores (Full, Petite Suite, Grande Suite, Yams)
  const renderBinaryOptions = () => {
    let fixedPoints = 0;
    if (rowKey === 'carre') fixedPoints = 40;
    if (rowKey === 'full') fixedPoints = 30;
    if (rowKey === 'suite') fixedPoints = 20;
    if (rowKey === 'yams') fixedPoints = 50;

    return (
      <div className="space-y-4">
        <p className="text-xs text-slate-400 text-center">
          Avez-vous réussi cette combinaison ?
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => onSubmit(fixedPoints)}
            className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/10 text-sm"
          >
            <Sparkles size={16} /> Oui, marquer {fixedPoints} points
          </button>
          <button
            onClick={() => onSubmit(0)}
            className="w-full py-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:bg-slate-900 text-rose-400 font-bold text-sm"
          >
            Non, rayer la case (0 point)
          </button>
        </div>
      </div>
    );
  };

  // 3. Render Custom Dice Sum Input (Plus, Moins)
  const renderSumOptions = () => {
    // Generate scores from 5 to 30
    const scoreRange = [];
    for (let s = 5; s <= 30; s++) {
      scoreRange.push(s);
    }

    return (
      <div className="space-y-3">
        <p className="text-xs text-slate-400 text-center">
          Sélectionnez la somme totale des 5 dés :
        </p>
        


        <div className="grid grid-cols-6 gap-1.5 max-h-56 overflow-y-auto p-1.5 bg-slate-950/50 rounded-xl border border-slate-900">
          {scoreRange.map((score) => (
            <button
              key={score}
              onClick={() => onSubmit(score)}
              className="aspect-square flex items-center justify-center rounded-lg bg-indigo-950/20 border border-indigo-900/30 hover:bg-indigo-600/30 hover:border-indigo-500 text-indigo-300 font-bold text-xs transition-all"
            >
              {score}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in no-select">
      <div className="glass-panel w-full max-w-sm overflow-hidden shadow-2xl border border-indigo-500/20 animate-scale-up">
        {/* Modal Header */}
        <div className="p-4 px-5 bg-gradient-to-r from-indigo-950/30 to-purple-950/30 border-b border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
              {getColNameFr()}
            </span>
            <h3 className="text-base font-extrabold text-white">
              {labelInfo.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5">
          {/* Render manual selectors */}
          {isUpperSection && renderUpperOptions()}
          {!isUpperSection && ['carre', 'full', 'suite', 'yams'].includes(rowKey) && renderBinaryOptions()}
          {!isUpperSection && ['plus', 'moins'].includes(rowKey) && renderSumOptions()}
        </div>

        {/* Cancel Button Footer */}
        <div className="p-3 bg-slate-950/60 border-t border-slate-900 text-center">
          <button
            onClick={onClose}
            className="text-xs font-semibold text-slate-500 hover:text-slate-300 transition-colors"
          >
            Annuler la saisie
          </button>
        </div>
      </div>
    </div>
  );
}
