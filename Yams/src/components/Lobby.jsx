import React, { useState } from 'react';
import { Plus, Trash2, Play, Trophy, Users, ShieldAlert, Award } from 'lucide-react';

export default function Lobby({ startGame, showHistory, historyCount }) {
  const [playerNames, setPlayerNames] = useState(['Joueur 1']);
  const [currentInput, setCurrentInput] = useState('');
  const [useMultipliers, setUseMultipliers] = useState(false);

  const handleAddPlayer = (e) => {
    e.preventDefault();
    const name = currentInput.trim();
    if (!name) return;
    
    if (playerNames.length >= 6) {
      alert('Limite maximum de 6 joueurs atteinte.');
      return;
    }
    
    setPlayerNames([...playerNames, name]);
    setCurrentInput('');
  };

  const handleRemovePlayer = (index) => {
    setPlayerNames(playerNames.filter((_, idx) => idx !== index));
  };

  const handleStart = () => {
    if (playerNames.length === 0) return;
    startGame(playerNames, useMultipliers);
  };

  return (
    <div className="glass-panel p-6 md:p-8 max-w-md w-full mx-auto my-8 animate-fade-in no-select">
      <div className="text-center mb-6">
        <div className="inline-flex p-3 rounded-full bg-indigo-500/10 text-indigo-400 mb-2">
          <Trophy size={40} className="pulse-primary-glow rounded-full" />
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-white mb-1">Triple Yams PWA</h2>
        <p className="text-sm text-slate-400">Scorecard interactive & lanceur de dés</p>
      </div>

      <form onSubmit={handleAddPlayer} className="mb-6">
        <label className="block text-sm font-semibold text-slate-300 mb-2">
          Ajouter des joueurs (1 à 6)
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Nom du joueur..."
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            maxLength={15}
            className="flex-1 px-4 py-2 rounded-xl bg-slate-900/60 border border-slate-700/50 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
          />
          <button
            type="submit"
            disabled={!currentInput.trim()}
            className="p-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800/40 disabled:text-indigo-400/40 text-white rounded-xl transition-all duration-200"
          >
            <Plus size={18} />
          </button>
        </div>
      </form>

      {/* Players List */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
          <Users size={16} /> Joueurs inscrits ({playerNames.length})
        </h3>
        {playerNames.length === 0 ? (
          <div className="p-4 text-center rounded-xl bg-slate-950/40 text-slate-500 border border-dashed border-slate-800 text-sm">
            Aucun joueur ajouté. Veuillez saisir un nom.
          </div>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {playerNames.map((name, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-xl bg-indigo-950/20 border border-indigo-900/20 text-slate-200"
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 flex items-center justify-center rounded-full bg-indigo-500/20 text-xs font-bold text-indigo-400">
                    {index + 1}
                  </span>
                  <span className="font-medium text-sm">{name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemovePlayer(index)}
                  className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rules Options */}
      <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80 mb-6">
        <h3 className="text-sm font-semibold text-slate-200 mb-2">Options de score</h3>
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={useMultipliers}
            onChange={(e) => setUseMultipliers(e.target.checked)}
            className="mt-1 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-950"
          />
          <div>
            <span className="text-sm font-semibold text-slate-200 block">
              Multiplicateurs de colonnes
            </span>
            <span className="text-xs text-slate-400">
              Col. Descendante (↓) x1 | Col. Libre (L) x2 | Col. Montante (↑) x3
            </span>
          </div>
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3">
        <button
          onClick={handleStart}
          disabled={playerNames.length === 0}
          className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 font-bold text-white flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all duration-200 hover:shadow-indigo-500/30"
        >
          <Play size={18} fill="currentColor" /> Commencer la partie
        </button>

        {historyCount > 0 && (
          <button
            onClick={showHistory}
            className="w-full py-2.5 rounded-xl bg-transparent hover:bg-slate-100 border border-slate-200 font-semibold text-slate-600 flex items-center justify-center gap-2 transition-all duration-200"
          >
            <Award size={18} /> Historique des parties ({historyCount})
          </button>
        )}
      </div>
    </div>
  );
}
