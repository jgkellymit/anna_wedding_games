import { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Confetti from 'react-confetti';

import { API_URL } from '../config';

// All hooks must be at the top-level (React rules of hooks)
export default function AssassinsGame() {
  const [names, setNames] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('assassinsBoardLayout')) || [];
    } catch {
      return [];
    }
  });
  const [guesses, setGuesses] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('assassinsGuesses')) || {};
    } catch {
      return {};
    }
  });
  const [themeGuesses, setThemeGuesses] = useState(Array(5).fill(''));
  const [themeResults, setThemeResults] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('assassinsThemeResults')) || Array(5).fill(null);
    } catch {
      return Array(5).fill(null);
    }
  });
  const [themeCorrectGuesses, setThemeCorrectGuesses] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('assassinsThemeCorrectGuesses')) || Array(5).fill('');
    } catch {
      return Array(5).fill('');
    }
  });
  const [error, setError] = useState('');
  // Track wrong guesses for animation
  const [wrongGuesses, setWrongGuesses] = useState({});
  // Track current input values
  const [inputValues, setInputValues] = useState({});
  const [wrongThemeGuesses, setWrongThemeGuesses] = useState({});
  const [scores, setScores] = useState({
    correctGuesses: 0,
    correctCategories: 0,
    total: 0
  });
  const [playerTeam, setPlayerTeam] = useState('');
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiPosition, setConfettiPosition] = useState({ x: 0, y: 0 });
  const [recentlyGuessed, setRecentlyGuessed] = useState({});
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);

  // Get user info from localStorage
  const name = localStorage.getItem('userName');
  const assignedWord = localStorage.getItem('assassinsAssignedWord');

  // Build columns for the grid
  const columns = Array.from({ length: 5 }, (_, col) =>
    Array.from({ length: 4 }, (_, row) => names[col * 4 + row] || '')
  );

  // Countdown timer effect
  useEffect(() => {
    // Set the end time for the game - June 6th at 10pm EST
    const endTime = new Date('2025-06-06T22:00:00-04:00');
    
    const updateTimer = () => {
      const now = new Date();
      const diff = endTime - now;
      
      if (diff <= 0) {
        // Game has ended
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      
      // Calculate days, hours, minutes, and seconds
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      // Update state with the new time remaining
      setTimeRemaining({ days, hours, minutes, seconds });
    };
    
    // Update immediately
    updateTimer();
    
    // Update every second
    const timerId = setInterval(updateTimer, 1000);
    
    // Cleanup
    return () => clearInterval(timerId);
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/api/names?name=${encodeURIComponent(name)}`)
      .then(r => r.json())
      .then(data => {
        setNames(data);
        localStorage.setItem('assassinsBoardLayout', JSON.stringify(data));
      })
      .catch(error => {
        console.error('Error fetching names:', error);
        setError('Failed to load names. Please refresh the page.');
      });
      
    // Fetch player's team
    fetch(`${API_URL}/api/user/team?name=${encodeURIComponent(name)}`)
      .then(r => r.json())
      .then(data => {
        if (data.team) {
          setPlayerTeam(data.team);
        }
      })
      .catch(error => {
        console.error('Error fetching team:', error);
      });
  }, [name]);

  useEffect(() => {
    if (name) {
      fetch(`${API_URL}/api/user/scores?name=${encodeURIComponent(name)}`)
        .then(r => r.json())
        .then(setScores)
        .catch(error => {
          console.error('Error fetching scores:', error);
        });
    }
  }, [name]);

  const handleGuess = async (target, word) => {
    try {
      const res = await fetch(`${API_URL}/api/guess`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ guesser: name, target, word }),
        credentials: 'include'
      });
      const data = await res.json();
      
      setGuesses(g => {
        const newGuesses = { ...g };
        if (data.correct) {
          // Use the canonical code word returned by the backend
          newGuesses[target] = data.canonicalWord || word;
          // Update scores
          setScores(data.scores);
          // Clear input value on correct guess
          setInputValues(prev => {
            const next = { ...prev };
            delete next[target];
            return next;
          });
        } else {
          // Set wrong guess animation state
          setWrongGuesses(prev => ({ ...prev, [target]: Date.now() }));
          // Clear after animation
          setTimeout(() => {
            setWrongGuesses(prev => {
              const next = { ...prev };
              delete next[target];
              return next;
            });
          }, 500);
        }
        localStorage.setItem('assassinsGuesses', JSON.stringify(newGuesses));
        return newGuesses;
      });
    } catch (error) {
      console.error('Error making guess:', error);
      setError('Failed to submit guess. Please try again.');
    }
  };

  const handleThemeGuess = async (colIdx, theme) => {
    const gridWords = columns[colIdx].map(n => guesses[n] || '');
    // Check if all words in the column are guessed
    if (gridWords.some(word => !word)) {
      setErrorDialogOpen(true);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/theme`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          name,
          guessedTheme: theme, 
          gridWords 
        }),
        credentials: 'include'
      });
      const data = await res.json();
      const newResults = [...themeResults];
      newResults[colIdx] = data.correct;
      setThemeResults(newResults);
      localStorage.setItem('assassinsThemeResults', JSON.stringify(newResults));
      
      if (data.correct) {
        setScores(data.scores);
        // Store the correct guessed category for this column
        setThemeCorrectGuesses(prev => {
          const next = [...prev];
          next[colIdx] = theme;
          localStorage.setItem('assassinsThemeCorrectGuesses', JSON.stringify(next));
          return next;
        });
        
        // Trigger confetti animation only for new correct guesses
        setRecentlyGuessed(prev => ({ ...prev, [colIdx]: true }));
        const tableCell = document.querySelector(`#theme-cell-${colIdx}`);
        if (tableCell) {
          const rect = tableCell.getBoundingClientRect();
          setConfettiPosition({
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
          });
          setShowConfetti(true);
          setTimeout(() => {
            setShowConfetti(false);
            // Clear the recently guessed flag after animation
            setRecentlyGuessed(prev => {
              const next = { ...prev };
              delete next[colIdx];
              return next;
            });
          }, 3000);
        }
      } else {
        // Set wrong guess animation state for theme
        setWrongThemeGuesses(prev => ({ ...prev, [colIdx]: Date.now() }));
        // Clear after animation
        setTimeout(() => {
          setWrongThemeGuesses(prev => {
            const next = { ...prev };
            delete next[colIdx];
            return next;
          });
        }, 500);
      }
    } catch (error) {
      console.error('Error guessing theme:', error);
      setError('Failed to submit theme guess. Please try again.');
    }
  };

  // Custom animation keyframes for wrong guess
  const fadeRed = {
    '@keyframes fadeRed': {
      '0%': { borderColor: '#f44336' },
      '60%': { borderColor: '#f44336' },
      '100%': { borderColor: '#1976d2' }
    },
    animation: 'fadeRed 1s',
    borderColor: '#f44336',
  };
  
  // Custom animation for correct guess
  const correctGuessAnimation = {
    '@keyframes correctGuessAnimation': {
      '0%': { transform: 'scale(1)', backgroundColor: '#e8f5e9' },
      '50%': { transform: 'scale(1.05)', backgroundColor: '#a5d6a7' },
      '100%': { transform: 'scale(1)', backgroundColor: '#e8f5e9' }
    },
    animation: 'correctGuessAnimation 0.6s ease-in-out',
    backgroundColor: '#e8f5e9',
    borderRadius: '4px',
    padding: '8px',
    transition: 'all 0.3s'
  };

  if (!name || !assignedWord) {
    return (
      <Box p={4}>
        <Typography color="error">
          Error: No user information found. Please try logging out and back in.
        </Typography>
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" gap={3} sx={{ m: 1, mb: 5 }}>
      {/* Confetti effect */}
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
          confettiSource={{
            x: confettiPosition.x,
            y: confettiPosition.y,
            w: 10,
            h: 10
          }}
        />
      )}
      
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" color="primary" fontWeight="bold" align="center" sx={{ mb: 2 }}>
          Wedding Code Word Game
        </Typography>
        
        <Box sx={{ mb: 2, textAlign: 'center' }}>
          <Typography variant="h6" color="secondary" fontWeight="bold">
            Welcome, {name}!
          </Typography>
          {playerTeam && (
            <Typography variant="body1" color="text.secondary">
              You're playing for Team {playerTeam}
            </Typography>
          )}
        </Box>
        
        <Typography variant="h6" color="primary" gutterBottom fontWeight="bold">
          Description
        </Typography>
        <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
          Every guest has been given a code word. Find the guests displayed in your list and enter their word into the box with their name. Each successful entry will earn 1 point for your team. Once you have collected all four words in a column, earn your team an additional 4 points by correctly identifying the theme of that column. You can not guess guess the theme until you have guessed all four words in the column.
          Example: If you have the words "Corkscrew", "Tornado", "Dance", and "Ankle" in your column, you can guess the theme "things you twist" or just "twist" to earn 4 points for your team.
        </Typography>
      </Paper>
      
      
      <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="h5" fontWeight="bold" color="primary" mb={2}>
          Your Word:
          <Box component="span" ml={2} fontSize="2rem" fontWeight="bold" color="secondary.main">
            {assignedWord}
          </Box>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Don't tell anyone your word until they ask! 
        </Typography>
      </Paper>

      {error && (
        <Paper elevation={3} sx={{ p: 2, bgcolor: '#ffebee' }}>
          <Typography color="error" align="center">
            {error}
          </Typography>
        </Paper>
      )}

      {/* Error Dialog for incomplete column theme guessing */}
      <Dialog open={errorDialogOpen} onClose={() => setErrorDialogOpen(false)}>
        <DialogTitle>Cannot Guess Theme</DialogTitle>
        <DialogContent>
          <Typography>
            You must successfully guess all words in the column before guessing the theme.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setErrorDialogOpen(false)} color="primary" variant="contained">
            OK
          </Button>
        </DialogActions>
      </Dialog>

      <TableContainer component={Paper} sx={{
        overflowX: 'auto',
        width: '100%',
        '@media (max-width: 600px)': {
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }
      }}>
        <Table sx={{ minWidth: 600 }}>
          <TableBody>
            {/* Render 4 rows */}
            {Array.from({ length: 4 }, (_, rowIdx) => (
              <TableRow key={rowIdx}>
                {columns.map((col, colIdx) => {
                  const cellName = col[rowIdx];
                  const guessed = guesses[cellName];

                  // Determine if this cell should be revealed
                  let reveal = false;
                  if (rowIdx === 0) {
                    reveal = true;
                  } else {
                    const aboveCellName = col[rowIdx - 1];
                    if (guesses[aboveCellName]) {
                      reveal = true;
                    }
                  }
                  
                  // If this is the user's name, show their word
                  if (cellName === name && assignedWord) {
                    return (
                      <TableCell
                        key={colIdx}
                        align="center"
                        sx={{ border: '2px solid #e0e0e0', p: 2 }}
                      >
                        <Typography fontWeight="bold" color="success.main" fontSize="1.2rem">
                          {assignedWord}
                        </Typography>
                      </TableCell>
                    );
                  }

                  return (
                    <TableCell
                      key={colIdx}
                      align="center"
                      sx={{
                        borderTop: rowIdx === 0 ? 'none' : '2px solid #e0e0e0',
                        borderBottom: rowIdx === 3 ? 'none' : '2px solid #e0e0e0',
                        borderLeft: colIdx === 0 ? 'none' : '2px solid #e0e0e0',
                        borderRight: colIdx === 4 ? 'none' : '2px solid #e0e0e0',
                        p: 2,
                        minWidth: 120,
                        '@media (max-width: 600px)': {
                          minWidth: 120,
                          padding: '8px 4px'
                        }
                      }}
                    >
                      {cellName ? (
                        reveal ? (
                          guessed ? (
                            <Typography 
                              fontWeight="bold" 
                              color="success.main" 
                              fontSize="1.1rem"
                              sx={{
                                ...correctGuessAnimation,
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                              }}
                            >
                              {guessed}
                            </Typography>
                          ) : (
                            <TextField
                              size="small"
                              variant="outlined"
                              label={cellName}
                              disabled={cellName === name}
                              className={wrongGuesses[cellName] ? 'wrong-guess' : ''}
                              value={inputValues[cellName] || ''}
                              onChange={e => {
                                setInputValues(prev => ({
                                  ...prev,
                                  [cellName]: e.target.value
                                }));
                              }}
                              onKeyDown={e => {
                                if (e.key === 'Enter' && e.target.value) {
                                  handleGuess(cellName, e.target.value);
                                }
                              }}
                              sx={{
                                width: '100%',
                                minWidth: 100,
                                '@media (max-width: 600px)': {
                                  minWidth: 100,
                                  fontSize: '1.1rem',
                                  input: {
                                    fontSize: '1.1rem',
                                    padding: '10px 8px'
                                  }
                                }
                              }}
                            />
                          )
                        ) : (
                          <Typography color="text.secondary" fontWeight="bold" fontSize="1.1rem">???</Typography>
                        )
                      ) : null}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
            <TableRow>
              {columns.map((col, colIdx) => (
                <TableCell
                  key={colIdx}
                  id={`theme-cell-${colIdx}`}
                  align="center"
                  sx={{ 
                    borderTop: '4px solid #666',
                    borderLeft: '2px solid #e0e0e0',
                    borderRight: '2px solid #e0e0e0',
                    borderBottom: '2px solid #e0e0e0',
                    p: 2
                  }}
                >
                  <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                    {themeResults[colIdx] === true ? (
                      <Typography 
                        color="success.main" 
                        fontWeight="bold"
                        sx={{
                          ...correctGuessAnimation,
                          animation: recentlyGuessed[colIdx] ? 'correctGuessAnimation 0.6s ease-in-out' : 'none',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                          width: '100%',
                          textAlign: 'center'
                        }}
                      >
                        Category correct: {themeCorrectGuesses[colIdx]}
                      </Typography>
                    ) : (
                      <TextField
                        size="small"
                        variant="outlined"
                        label="Category"
                        className={wrongThemeGuesses[colIdx] ? 'wrong-guess' : ''}
                        value={themeGuesses[colIdx]}
                        onChange={e => {
                          const newGuesses = [...themeGuesses];
                          newGuesses[colIdx] = e.target.value;
                          setThemeGuesses(newGuesses);
                        }}
                        onKeyDown={e => {
                          if (e.key === 'Enter' && themeGuesses[colIdx]) {
                            handleThemeGuess(colIdx, themeGuesses[colIdx]);
                          }
                        }}
                        sx={{
                          width: '100%',
                          minWidth: 100,
                          '@media (max-width: 600px)': {
                            minWidth: 100,
                            fontSize: '1.1rem',
                            input: {
                              fontSize: '1.1rem',
                              padding: '10px 8px'
                            }
                          }
                        }}
                      />
                    )}
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="h6" color="primary" gutterBottom>
          Your Progress
        </Typography>
        <Box display="flex" justifyContent="space-around" alignItems="center">
          <Box>
            <Typography variant="subtitle1">Words Guessed</Typography>
            <Typography variant="h6" color="success.main">
              {scores.correctGuesses}/20
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle1">Categories Solved</Typography>
            <Typography variant="h6" color="success.main">
              {scores.correctCategories}/5
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle1">Total Score</Typography>
            <Typography variant="h6" color="primary.main">
              {scores.total}
            </Typography>
          </Box>
        </Box>
      </Paper>
      {/* Countdown Timer */}
      <Paper elevation={3} sx={{ p: 2, textAlign: 'center', bgcolor: '#f5f5f5' }}>
        <Box display="flex" alignItems="center" justifyContent="center" gap={2}>
          {/* <AccessTimeIcon color="primary" /> */}
          <Typography variant="h6" color="primary" fontWeight="bold">
            {timeRemaining.days > 0 ? (
              `Game Ends In: ${timeRemaining.days}d ${String(timeRemaining.hours).padStart(2, '0')}h ${String(timeRemaining.minutes).padStart(2, '0')}m ${String(timeRemaining.seconds).padStart(2, '0')}s`
            ) : (
              `Game Ends In: ${String(timeRemaining.hours).padStart(2, '0')}:${String(timeRemaining.minutes).padStart(2, '0')}:${String(timeRemaining.seconds).padStart(2, '0')}`
            )}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}

