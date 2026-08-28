import React from 'react';
import { Lock, ArrowDown, Shuffle, ArrowUp } from 'lucide-react';
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
            <ArrowDown className="text-indigo-300 font-extrabold" size={16} />
            <span className="text-[10px] uppercase font-extrabold text-slate-200 mt-0.5">Desc (↓)</span>
          </div>
        );
      case 'free':
        return (
          <div className="flex flex-col items-center justify-center">
            <Shuffle className="text-pink-300 font-extrabold" size={16} />
            <span className="text-[10px] uppercase font-extrabold text-slate-200 mt-0.5">Libre (L)</span>
          </div>
        );
      case 'up':
        return (
          <div className="flex flex-col items-center justify-center">
            <ArrowUp className="text-purple-300 font-extrabold" size={16} />
            <span className="text-[10px] uppercase font-extrabold text-slate-200 mt-0.5">Mont (↑)</span>
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
            <th className="p-3 font-bold text-slate-200 uppercase tracking-wider text-[10px] w-1/3">Combinaisons</th>
            {['down', 'up', 'free'].map(col => (
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
                {/* Middle Section Total */}
                {rowKey === 'suite' && (
                  <tr className="bg-slate-950/5 border-t border-b border-slate-800/40 font-bold text-[10px]">
                    <td className="p-2 px-3 text-slate-700 uppercase tracking-wider font-extrabold">Total Milieu</td>
                    {['down', 'up', 'free'].map(col => (
                      <td key={col} className="p-2 text-center border-l border-slate-800/40 text-slate-800 font-extrabold text-[11px]">
                        {stats[col].middleTotal}
                      </td>
                    ))}
                  </tr>
                )}

                <tr className="hover:bg-slate-900/10 transition-colors">
                  {/* Row Label */}
                  <td className="p-2.5 px-3">
                    <div className="font-bold text-slate-800 text-[12px]">{labelInfo.name}</div>
                    <div className="text-[9.5px] text-slate-500 font-medium hidden sm:block leading-none mt-0.5">{labelInfo.desc}</div>
                  </td>

                  {/* Columns */}
                  {['down', 'up', 'free'].map(col => {
                    const value = scorecard[col][rowKey];
                    const playable = isCellPlayable(col, rowKey, scorecard);

                    let cellContent = null;
                    let cellClass = "p-1 text-center border-l border-slate-800/40 w-2/9 h-[46px] relative vertical-middle ";
                    const onClickHandler = playable ? () => onCellClick(col, rowKey) : undefined;

                    if (value !== null) {
                      // Already scored
                      cellContent = (
                        <span className={`font-bold ${value === 0 ? 'text-rose-500 font-extrabold text-sm' : 'text-indigo-300 text-sm'}`}>
                          {value === 0 ? 'X' : value}
                        </span>
                      );
                      cellClass += "bg-indigo-950/5";
                    } else if (playable) {
                      // Playable cell (higher contrast indigo background & prominent dots)
                      cellClass += " cell-playable transition-all duration-150";
                      cellContent = (
                        <div className="w-full h-full flex items-center justify-center text-indigo-600/80 hover:text-indigo-600 font-extrabold text-[17px] tracking-widest leading-none select-none pb-0.5">
                          ...
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
                    <tr className="bg-slate-950/5 border-t border-slate-800/40 font-bold text-[10px]">
                      <td className="p-2 px-3 text-slate-700 uppercase tracking-wider font-extrabold">Total Supérieur</td>
                      {['down', 'up', 'free'].map(col => (
                        <td key={col} className="p-2 text-center border-l border-slate-800/40 text-slate-800 font-extrabold text-[11px]">
                          {stats[col].upperSubtotal}
                        </td>
                      ))}
                    </tr>
                    {/* Bonus Row */}
                    <tr className="bg-slate-950/5 font-bold text-[10px]">
                      <td className="p-2 px-3">
                        <span className="text-slate-700 uppercase tracking-wider font-extrabold">Bonus (≥63 pts)</span>
                        <span className="text-[10px] text-pink-600 ml-1.5 font-black">+20</span>
                      </td>
                      {['down', 'up', 'free'].map(col => {
                        const hasBonus = stats[col].upperBonus > 0;
                        return (
                          <td 
                            key={col} 
                            className={`p-2 text-center border-l border-slate-800/40 font-extrabold text-[11px] ${
                              hasBonus ? 'text-emerald-600' : 'text-slate-400'
                            }`}
                          >
                            {hasBonus ? '+20' : '0'}
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
          <tr className="bg-slate-950/5 border-t-2 border-slate-800/60 font-bold text-[10px]">
            <td className="p-2 px-3 text-slate-700 uppercase tracking-wider font-extrabold">Total Inférieur</td>
            {['down', 'up', 'free'].map(col => (
              <td key={col} className="p-2 text-center border-l border-slate-800/40 text-slate-800 font-extrabold text-[11px]">
                {stats[col].lowerTotal}
              </td>
            ))}
          </tr>

          {/* COLUMN TOTALS */}
          <tr className="bg-slate-900/60 border-t border-slate-700 font-bold text-xs">
            <td className="p-3 px-3 text-slate-100 uppercase tracking-wider font-black text-[11px]">Total Colonnes</td>
            {['down', 'up', 'free'].map(col => (
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
