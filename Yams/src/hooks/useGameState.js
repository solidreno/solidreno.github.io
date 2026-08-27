import { useState, useEffect, useCallback, useMemo } from 'react';
import confetti from 'canvas-confetti';

export const ROW_KEYS = [
  '1', '2', '3', '4', '5', '6',
  'brelan', 'carre', 'full', 'petite_suite', 'grande_suite', 'yams', 'chance'
];

export const ROW_LABELS = {
  '1': { name: 'As (1)', desc: 'Somme des 1' },
  '2': { name: 'Deux (2)', desc: 'Somme des 2' },
  '3': { name: 'Trois (3)', desc: 'Somme des 3' },
  '4': { name: 'Quatre (4)', desc: 'Somme des 4' },
  '5': { name: 'Cinq (5)', desc: 'Somme des 5' },
  '6': { name: 'Six (6)', desc: 'Somme des 6' },
  'brelan': { name: 'Brelan', desc: '3 identiques (Total dés)' },
  'carre': { name: 'Carré', desc: '4 identiques (Total dés)' },
  'full': { name: 'Full', desc: '3 + 2 identiques (25 pts)' },
  'petite_suite': { name: 'Petite Suite', desc: '4 consécutifs (30 pts)' },
  'grande_suite': { name: 'Grande Suite', desc: '5 consécutifs (40 pts)' },
  'yams': { name: 'Yams', desc: '5 identiques (50 pts)' },
  'chance': { name: 'Chance', desc: 'Total des 5 dés' }
};

// Initial empty scorecard
const createEmptyScorecard = () => {
  const scorecard = {};
  ['down', 'free', 'up'].forEach(col => {
    scorecard[col] = {};
    ROW_KEYS.forEach(key => {
      scorecard[col][key] = null;
    });
  });
  return scorecard;
};

// Calculate potential score for a category based on dice values
export const calculatePotentialScore = (rowKey, dice) => {
  if (!dice || dice.length !== 5) return 0;
  
  const sorted = [...dice].sort((a, b) => a - b);
  const sum = dice.reduce((a, b) => a + b, 0);
  
  // Count frequencies
  const counts = {};
  dice.forEach(d => { counts[d] = (counts[d] || 0) + 1; });
  const freq = Object.values(counts);
  const maxFreq = Math.max(...freq);

  // Upper section
  if (['1', '2', '3', '4', '5', '6'].includes(rowKey)) {
    const val = Number(rowKey);
    return dice.filter(d => d === val).length * val;
  }

  // Lower section
  switch (rowKey) {
    case 'brelan':
      return maxFreq >= 3 ? sum : 0;
      
    case 'carre':
      return maxFreq >= 4 ? sum : 0;
      
    case 'full': {
      // 3 of one, 2 of another OR 5 of same
      const hasThreeAndTwo = freq.includes(3) && freq.includes(2);
      const hasFive = maxFreq === 5;
      return (hasThreeAndTwo || hasFive) ? 25 : 0;
    }
    
    case 'petite_suite': {
      const uniqueStr = Array.from(new Set(sorted)).join('');
      if (
        uniqueStr.includes('1234') || 
        uniqueStr.includes('2345') || 
        uniqueStr.includes('3456')
      ) {
        return 30;
      }
      return 0;
    }
    
    case 'grande_suite': {
      const uniqueStr = Array.from(new Set(sorted)).join('');
      if (uniqueStr === '12345' || uniqueStr === '23456') {
        return 40;
      }
      return 0;
    }
    
    case 'yams':
      return maxFreq === 5 ? 50 : 0;
      
    case 'chance':
      return sum;
      
    default:
      return 0;
  }
};

// Column score calculations
export const calculateColumnStats = (columnScores, colName, useMultipliers = false) => {
  const multiplier = useMultipliers 
    ? (colName === 'down' ? 1 : colName === 'free' ? 2 : 3) 
    : 1;

  // Upper section sum (1-6)
  let upperSubtotal = 0;
  ['1', '2', '3', '4', '5', '6'].forEach(key => {
    if (columnScores[key] !== null) {
      upperSubtotal += columnScores[key];
    }
  });

  // Bonus: >= 63 in upper section gets +35
  const upperBonus = upperSubtotal >= 63 ? 35 : 0;
  const upperTotal = upperSubtotal + upperBonus;

  // Lower section sum
  let lowerTotal = 0;
  ['brelan', 'carre', 'full', 'petite_suite', 'grande_suite', 'yams', 'chance'].forEach(key => {
    if (columnScores[key] !== null) {
      lowerTotal += columnScores[key];
    }
  });

  const rawTotal = upperTotal + lowerTotal;
  const finalTotal = rawTotal * multiplier;

  return {
    upperSubtotal,
    upperBonus,
    upperTotal,
    lowerTotal,
    rawTotal,
    finalTotal,
    multiplier
  };
};

export const calculatePlayerTotal = (scorecard, useMultipliers = false) => {
  const downStats = calculateColumnStats(scorecard.down, 'down', useMultipliers);
  const freeStats = calculateColumnStats(scorecard.free, 'free', useMultipliers);
  const upStats = calculateColumnStats(scorecard.up, 'up', useMultipliers);

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
  const [useMultipliers, setUseMultipliers] = useState(() => {
    return localStorage.getItem('yams_use_multipliers') === 'true';
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
    localStorage.setItem('yams_use_multipliers', useMultipliers);
  }, [players, gameStarted, activePlayerIndex, useMultipliers]);

  // Start new game
  const startGame = useCallback((playerNames, multipliersEnabled) => {
    const newPlayers = playerNames.map((name, index) => ({
      id: index + 1,
      name: name || `Joueur ${index + 1}`,
      scorecard: createEmptyScorecard()
    }));
    setPlayers(newPlayers);
    setUseMultipliers(multipliersEnabled);
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
    return ['down', 'free', 'up'].every(col => {
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
        }
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
        const stats = calculatePlayerTotal(p.scorecard, useMultipliers);
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
      setGameStarted(false);

      // Save to history
      const newHistoryItem = {
        id: Date.now(),
        date: new Date().toLocaleDateString('fr-FR', {
          day: '2-digit', month: '2-digit', year: 'numeric',
          hour: '2-digit', minute: '2-digit'
        }),
        players: results.sort((a, b) => b.score - a.score),
        useMultipliers
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
  }, [gameStarted, players, activePlayerIndex, useMultipliers, isCellPlayable, isScorecardFilled, gameHistory]);

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
    useMultipliers,
    winner,
    gameHistory,
    startGame,
    isCellPlayable,
    recordScore,
    resetGame,
    clearHistory
  };
};
