import React from 'react';
import { Lock, ArrowDown, Shuffle, ArrowUp, Plus } from 'lucide-react';
import { ROW_KEYS, ROW_LABELS, calculateColumnStats, calculatePlayerTotal } from '../hooks/useGameState';

export default function ScoreGrid({ scorecard, isCellPlayable, onCellClick }) {
  // Compute column stats and totals
  const stats = calculatePlayerTotal(scorecard);

  // Column header symbols/icons
  const getColHeader = (col) => {
    switch (col) {
      case 'down':
        return (
          <div className="flex flex-col items-center justify-center">
            <ArrowDown className="text-indigo-400" size={16} />
            <span className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">Desc (↓)</span>
          </div>
        );
      case 'free':
        return (
          <div className="flex flex-col items-center justify-center">
            <Shuffle className="text-pink-400" size={16} />
            <span className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">Libre (L)</span>
          </div>
        );
      case 'up':
        return (
          <div className="flex flex-col items-center justify-center">
            <ArrowUp className="text-purple-400" size={16} />
            <span className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">Mont (↑)</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full glass-panel overflow-hidden border border-slate-800/80 select-none">
      <table className="w-full border-collapse text-left text-xs no-select">
        <thead>
          <tr className="bg-slate-950/80 border-b border-slate-800">
            <th className="p-3 font-semibold text-slate-300 w-1/3">Combinaisons</th>
            {['down', 'free', 'up'].map(col => (
              <th key={col} className="p-2 text-center w-2/9 border-l border-slate-800/50">
                {getColHeader(col)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/40">
          {ROW_KEYS.map((rowKey, rowIndex) => {
            const isUpperSection = rowIndex < 6;
            const labelInfo = ROW_LABELS[rowKey];

            return (
              <React.Fragment key={rowKey}>
                {/* Section Separator before Lower Section */}
                {rowKey === 'brelan' && (
                  <tr className="bg-indigo-950/10 font-bold border-t border-b border-slate-800/60">
                    <td colSpan={4} className="p-1 px-3 text-[10px] uppercase tracking-wider text-indigo-400/80">
                      Section Basse
                    </td>
                  </tr>
                )}

                <tr className="hover:bg-slate-900/10 transition-colors">
                  {/* Row Label */}
                  <td className="p-2.5 px-3">
                    <div className="font-semibold text-slate-100">{labelInfo.name}</div>
                    <div className="text-[10px] text-slate-400 hidden sm:block">{labelInfo.desc}</div>
                  </td>

                  {/* Columns */}
                  {['down', 'free', 'up'].map(col => {
                    const value = scorecard[col][rowKey];
                    const playable = isCellPlayable(col, rowKey, scorecard);

                    let cellContent = null;
                    let cellClass = "p-1 text-center border-l border-slate-800/40 w-2/9 h-[46px] relative vertical-middle ";
                    const onClickHandler = playable ? () => onCellClick(col, rowKey) : undefined;

                    if (value !== null) {
                      // Already scored
                      cellContent = (
                        <span className="font-bold text-sm text-indigo-300">
                          {value}
                        </span>
                      );
                      cellClass += "bg-indigo-950/5";
                    } else if (playable) {
                      // Playable cell
                      cellClass += " cursor-pointer bg-indigo-50/20 hover:bg-indigo-500/10 transition-all duration-150";
                      cellContent = (
                        <div className="w-full h-full flex items-center justify-center text-indigo-400/80 hover:text-indigo-600">
                          <Plus size={16} />
                        </div>
                      );
                    } else {
                      // Locked cell
                      cellClass += " bg-slate-950/50 text-slate-700 cursor-not-allowed";
                      cellContent = <Lock size={12} className="mx-auto opacity-20 text-slate-600" />;
                    }

                    return (
                      <td key={col} className={cellClass} onClick={onClickHandler}>
                        {cellContent}
                      </td>
                    );
                  })}
                </tr>

                {/* Subtotals & Bonus rows inside the Upper section */}
                {rowKey === '6' && (
                  <>
                    {/* Upper Section Subtotal */}
                    <tr className="bg-slate-950/40 border-t border-slate-800 font-medium text-[11px]">
                      <td className="p-2 px-3 text-slate-400">Total Supérieur</td>
                      {['down', 'free', 'up'].map(col => (
                        <td key={col} className="p-2 text-center border-l border-slate-800/40 text-slate-300 font-semibold">
                          {stats[col].upperSubtotal}
                        </td>
                      ))}
                    </tr>
                    {/* Bonus Row */}
                    <tr className="bg-slate-950/40 font-medium text-[11px]">
                      <td className="p-2 px-3">
                        <span className="text-slate-400">Bonus (≥63 pts)</span>
                        <span className="text-[10px] text-pink-400/80 ml-1.5 font-bold">+35</span>
                      </td>
                      {['down', 'free', 'up'].map(col => {
                        const hasBonus = stats[col].upperBonus > 0;
                        return (
                          <td 
                            key={col} 
                            className={`p-2 text-center border-l border-slate-800/40 font-bold ${
                              hasBonus ? 'text-emerald-400' : 'text-slate-500 opacity-40'
                            }`}
                          >
                            {hasBonus ? '+35' : '0'}
                          </td>
                        );
                      })}
                    </tr>
                  </>
                )}
              </React.Fragment>
            );
          })}

          {/* LOWER SECTION TOTAL */}
          <tr className="bg-slate-950/40 border-t-2 border-slate-800 font-medium text-[11px]">
            <td className="p-2 px-3 text-slate-400">Total Inférieur</td>
            {['down', 'free', 'up'].map(col => (
              <td key={col} className="p-2 text-center border-l border-slate-800/40 text-slate-300 font-semibold">
                {stats[col].lowerTotal}
              </td>
            ))}
          </tr>

          {/* COLUMN TOTALS */}
          <tr className="bg-slate-900/60 border-t border-slate-700 font-bold text-xs">
            <td className="p-3 px-3 text-slate-200 uppercase tracking-wide">Total Colonnes</td>
            {['down', 'free', 'up'].map(col => (
              <td key={col} className="p-3 text-center border-l border-slate-800/40 text-white font-extrabold text-sm">
                {stats[col].finalTotal}
              </td>
            ))}
          </tr>
        </tbody>
      </table>

      {/* GRAND TOTAL BAR */}
      <div className="bg-gradient-to-r from-indigo-900/30 to-pink-900/20 p-4 border-t border-slate-800 flex items-center justify-between text-white font-bold no-select">
        <span className="text-xs uppercase tracking-wider text-indigo-300">Score Général</span>
        <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-300 font-heading">
          {stats.grandTotal} points
        </span>
      </div>
    </div>
  );
}
