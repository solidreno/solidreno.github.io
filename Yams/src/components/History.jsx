import React from 'react';
import { ArrowLeft, Trash2, Calendar, Award, ShieldCheck } from 'lucide-react';

export default function History({ history, onClose, onClear }) {
  const handleClear = () => {
    if (window.confirm('Voulez-vous vraiment effacer tout l\'historique des scores ?')) {
      onClear();
    }
  };

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
            onClick={handleClear}
            className="p-2 rounded-xl bg-rose-950/20 hover:bg-rose-900/20 border border-rose-900/30 text-rose-400 hover:text-rose-300 transition-colors"
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
