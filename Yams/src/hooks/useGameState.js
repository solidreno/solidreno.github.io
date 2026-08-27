import { useState, useEffect, useCallback, useMemo } from 'react';
import confetti from 'canvas-confetti';

export const ROW_KEYS = [
  '1', '2', '3', '4', '5', '6',
  'plus', 'moins',
  'suite', 'full', 'carre', 'yams'
];

export const ROW_LABELS = {
  '1': { name: 'As (1)', desc: 'Somme des 1' },
  '2': { name: 'Deux (2)', desc: 'Somme des 2' },
  '3': { name: 'Trois (3)', desc: 'Somme des 3' },
  '4': { name: 'Quatre (4)', desc: 'Somme des 4' },
  '5': { name: 'Cinq (5)', desc: 'Somme des 5' },
  '6': { name: 'Six (6)', desc: 'Somme des 6' },
  'plus': { name: 'Plus', desc: 'Somme des 5 dés' },
  'moins': { name: 'Moins', desc: 'Somme des 5 dés' },
  'suite': { name: 'Suite', desc: '5 dés consécutifs (20 pts)' },
  'full': { name: 'Full', desc: '3 + 2 dés identiques (30 pts)' },
  'carre': { name: 'Carré', desc: '4 dés identiques (40 pts)' },
  'yams': { name: 'Yams', desc: '5 dés identiques (50 pts)' }
};

// Initial empty scorecard
const createEmptyScorecard = () => {
  const scorecard = {};
  ['down', 'up', 'free'].forEach(col => {
    scorecard[col] = {};
    ROW_KEYS.forEach(key => {
      scorecard[col][key] = null;
    });
  });
  return scorecard;
};

// Column score calculations
export const calculateColumnStats = (columnScores, colName) => {
  const multiplier = 1;

  // Upper section sum (1-6)
  let upperSubtotal = 0;
  ['1', '2', '3', '4', '5', '6'].forEach(key => {
    if (columnScores[key] !== null) {
      upperSubtotal += columnScores[key];
    }
  });

  // Bonus: >= 63 in upper section gets +20
  const upperBonus = upperSubtotal >= 63 ? 20 : 0;
  const upperTotal = upperSubtotal + upperBonus;

  // Middle section calculations
  const plusVal = columnScores['plus'] !== null ? columnScores['plus'] : null;
  const moinsVal = columnScores['moins'] !== null ? columnScores['moins'] : null;
  const acesVal = columnScores['1'] !== null ? columnScores['1'] : 0;

  let middleTotal = 0;
  if (plusVal !== null && moinsVal !== null) {
    middleTotal = (plusVal - moinsVal) * acesVal;
  }

  // Lower section sum
  let lowerTotal = 0;
  ['suite', 'full', 'carre', 'yams'].forEach(key => {
    if (columnScores[key] !== null) {
      lowerTotal += columnScores[key];
    }
  });

  const rawTotal = upperTotal + middleTotal + lowerTotal;
  const finalTotal = rawTotal * multiplier;

  return {
    upperSubtotal,
    upperBonus,
    upperTotal,
    plusVal,
    moinsVal,
    middleTotal,
    lowerTotal,
    rawTotal,
    finalTotal,
    multiplier
  };
};

export const calculatePlayerTotal = (scorecard) => {
  const downStats = calculateColumnStats(scorecard.down, 'down');
  const freeStats = calculateColumnStats(scorecard.free, 'free');
  const upStats = calculateColumnStats(scorecard.up, 'up');

  return {
    down: downStats,
    free: freeStats,
    up: upStats,
    grandTotal: downStats.finalTotal + freeStats.finalTotal + upStats.finalTotal
  };
};

export const useGameState = () => {
  // Game Setup
  const [players, setPlayers] = useState(() => {
    const saved = localStorage.getItem('yams_players');
    return saved ? JSON.parse(saved) : [];
  });
  const [gameStarted, setGameStarted] = useState(() => {
    return localStorage.getItem('yams_game_started') === 'true';
  });
  const [activePlayerIndex, setActivePlayerIndex] = useState(() => {
    return Number(localStorage.getItem('yams_active_player_index') || 0);
  });

  // Game End & History
  const [winner, setWinner] = useState(null);
  const [gameHistory, setGameHistory] = useState(() => {
    const saved = localStorage.getItem('yams_history');
    return saved ? JSON.parse(saved) : [];
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('yams_players', JSON.stringify(players));
    localStorage.setItem('yams_game_started', gameStarted);
    localStorage.setItem('yams_active_player_index', activePlayerIndex);
  }, [players, gameStarted, activePlayerIndex]);

  // Start new game
  const startGame = useCallback((playerNames) => {
    localStorage.setItem('yams_last_players', JSON.stringify(playerNames));
    const newPlayers = playerNames.map((name, index) => ({
      id: index + 1,
      name: name || `Joueur ${index + 1}`,
      scorecard: createEmptyScorecard(),
      lastAction: null
    }));
    setPlayers(newPlayers);
    setGameStarted(true);
    setActivePlayerIndex(0);
    setWinner(null);
  }, []);

  // Verify cell playable status based on 3-column rules
  const isCellPlayable = useCallback((colName, rowKey, scorecard) => {
    const rowIndex = ROW_KEYS.indexOf(rowKey);
    if (rowIndex === -1) return false;

    // Check if already filled
    if (scorecard[colName][rowKey] !== null) return false;

    if (colName === 'free') {
      return true;
    }

    if (colName === 'down') {
      // Must fill in order 0, 1, 2...
      // Check if all rows before this index are filled
      return ROW_KEYS.slice(0, rowIndex).every(key => scorecard.down[key] !== null);
    }

    if (colName === 'up') {
      // Must fill in reverse order ...12, 11, 10
      // Check if all rows after this index are filled
      return ROW_KEYS.slice(rowIndex + 1).every(key => scorecard.up[key] !== null);
    }

    return false;
  }, []);

  // Check if scorecard is completely filled
  const isScorecardFilled = useCallback((scorecard) => {
    return ['down', 'up', 'free'].every(col => {
      return ROW_KEYS.every(key => scorecard[col][key] !== null);
    });
  }, []);

  // Record a score in a cell
  const recordScore = useCallback((colName, rowKey, scoreValue) => {
    if (!gameStarted || players.length === 0) return;
    
    const currentPlayer = players[activePlayerIndex];
    if (!isCellPlayable(colName, rowKey, currentPlayer.scorecard)) return;

    // Update player scorecard
    const updatedPlayers = players.map((p, idx) => {
      if (idx !== activePlayerIndex) return p;
      return {
        ...p,
        scorecard: {
          ...p.scorecard,
          [colName]: {
            ...p.scorecard[colName],
            [rowKey]: scoreValue
          }
        },
        lastAction: { colName, rowKey }
      };
    });

    setPlayers(updatedPlayers);

    // Check if game is completely finished
    const allFinished = updatedPlayers.every(p => isScorecardFilled(p.scorecard));

    if (allFinished) {
      // End game: Calculate winner
      let highestScore = -1;
      let winningPlayer = null;
      
      const results = updatedPlayers.map(p => {
        const stats = calculatePlayerTotal(p.scorecard);
        if (stats.grandTotal > highestScore) {
          highestScore = stats.grandTotal;
          winningPlayer = p;
        }
        return {
          name: p.name,
          score: stats.grandTotal
        };
      });

      setWinner(winningPlayer);

      // Save to history
      const newHistoryItem = {
        id: Date.now(),
        date: new Date().toLocaleDateString('fr-FR', {
          day: '2-digit', month: '2-digit', year: 'numeric',
          hour: '2-digit', minute: '2-digit'
        }),
        players: results.sort((a, b) => b.score - a.score)
      };

      const updatedHistory = [newHistoryItem, ...gameHistory];
      setGameHistory(updatedHistory);
      localStorage.setItem('yams_history', JSON.stringify(updatedHistory));

      // Trigger Confetti
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
    } else {
      // Move to next player
      setActivePlayerIndex(prev => (prev + 1) % players.length);
    }
  }, [gameStarted, players, activePlayerIndex, isCellPlayable, isScorecardFilled, gameHistory]);

  // Undo last recorded score for a specific player
  const undoLastScore = useCallback((playerIdx) => {
    const player = players[playerIdx];
    if (!player || !player.lastAction) return;

    const { colName, rowKey } = player.lastAction;

    const updatedPlayers = players.map((p, idx) => {
      if (idx !== playerIdx) return p;
      return {
        ...p,
        scorecard: {
          ...p.scorecard,
          [colName]: {
            ...p.scorecard[colName],
            [rowKey]: null
          }
        },
        lastAction: null
      };
    });

    setPlayers(updatedPlayers);
    setActivePlayerIndex(playerIdx);
    setWinner(null);
  }, [players]);

  // Force reset game
  const resetGame = useCallback(() => {
    setPlayers([]);
    setGameStarted(false);
    setActivePlayerIndex(0);
    setWinner(null);
    localStorage.removeItem('yams_players');
    localStorage.removeItem('yams_game_started');
    localStorage.removeItem('yams_active_player_index');
  }, []);

  // Clear History
  const clearHistory = useCallback(() => {
    setGameHistory([]);
    localStorage.removeItem('yams_history');
  }, []);

  return {
    players,
    gameStarted,
    activePlayerIndex,
    winner,
    gameHistory,
    startGame,
    isCellPlayable,
    recordScore,
    undoLastScore,
    resetGame,
    clearHistory
  };
};
