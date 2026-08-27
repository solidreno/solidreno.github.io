import React, { useState } from 'react';
import { ArrowLeft, Trash2, Calendar, Award, ShieldCheck } from 'lucide-react';

export default function History({ history, onClose, onClear }) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClear = () => {
    onClear();
    setShowConfirm(false);
  };

  if (showConfirm) {
    return (
      <div className="glass-panel p-6 max-w-md w-full mx-auto my-8 animate-scale-up no-select text-center border-rose-500/20">
        <div className="inline-flex p-3 rounded-full bg-rose-500/10 text-rose-400 mb-4 animate-pulse">
          <Trash2 size={32} />
        </div>
        <h3 className="text-base font-extrabold text-white mb-2">
          Effacer l'historique ?
        </h3>
        <p className="text-slate-400 text-xs mb-6 leading-relaxed">
          Cette action est irréversible. Toutes les parties enregistrées seront supprimées définitivement.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setShowConfirm(false)}
            className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-semibold text-xs transition-colors cursor-pointer"
          >
            Annuler
          </button>
          <button
            onClick={handleClear}
            className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors shadow-lg shadow-rose-600/10 cursor-pointer"
          >
            Confirmer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel p-6 max-w-md w-full mx-auto my-8 animate-fade-in no-select">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onClose}
          className="p-2 rounded-xl bg-transparent hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-800 transition-colors flex items-center gap-1.5 text-xs font-semibold"
        >
          <ArrowLeft size={14} /> Retour
        </button>
        <h2 className="text-xl font-extrabold text-white">Historique</h2>
        {history.length > 0 && (
          <button
            onClick={() => setShowConfirm(true)}
            className="p-2 rounded-xl bg-rose-950/20 hover:bg-rose-900/20 border border-rose-900/30 text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
            title="Effacer tout"
          >
            <Trash2 size={15} />
          </button>
        )}
      </div>

      {/* History List */}
      {history.length === 0 ? (
        <div className="py-12 text-center rounded-2xl bg-slate-950/40 border border-dashed border-slate-800/80 text-slate-500 text-sm">
          Aucune partie enregistrée pour le moment.
        </div>
      ) : (
        <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
          {history.map((game) => (
            <div
              key={game.id}
              className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80 flex flex-col gap-3"
            >
              <div className="flex items-center justify-between text-[10px] text-slate-400 border-b border-slate-900 pb-2">
                <span className="flex items-center gap-1">
                  <Calendar size={11} /> {game.date}
                </span>
              </div>

              {/* Leaderboard */}
              <div className="space-y-2">
                {game.players.map((p, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      {idx === 0 ? (
                        <Award size={14} className="text-yellow-500" />
                      ) : (
                        <span className="w-3.5 text-center text-slate-500 font-bold">{idx + 1}</span>
                      )}
                      <span className={`font-semibold ${idx === 0 ? 'text-slate-100' : 'text-slate-300'}`}>
                        {p.name}
                      </span>
                    </div>
                    <span className={`font-bold ${idx === 0 ? 'text-emerald-400' : 'text-slate-400'}`}>
                      {p.score} pts
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
