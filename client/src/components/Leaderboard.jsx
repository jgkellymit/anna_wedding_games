import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Zoom,
  Divider,
  Chip,
  CircularProgress
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PersonIcon from '@mui/icons-material/Person';
import ScoreboardIcon from '@mui/icons-material/Scoreboard';
import CategoryIcon from '@mui/icons-material/Category';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import { API_URL } from '../config';

// Medal colors for top 3 players
const MEDAL_COLORS = {
  0: '#FFD700', // Gold
  1: '#C0C0C0', // Silver
  2: '#CD7F32'  // Bronze
};

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchLeaderboard = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/api/leaderboard`);
      const data = await response.json();
      setLeaderboard(data);
      setLastUpdated(new Date());
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setError('Failed to load leaderboard. Please try again later.');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return (
    <Box display="flex" flexDirection="column" gap={3} sx={{ m: 1, mb: 5 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          textAlign: 'center',
          // background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
          borderRadius: 2
        }}
      >
        <Typography variant="h4" color="primary" gutterBottom fontWeight="bold">
          Wedding Code Word Game Leaderboard
        </Typography>
        {lastUpdated && (
          <Box 
            component="span" 
            onClick={fetchLeaderboard}
            sx={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              cursor: 'pointer',
              '&:hover': {
                color: 'primary.main',
                '& .refresh-icon': {
                  transform: 'rotate(360deg)',
                }
              },
              transition: 'color 0.3s ease',
            }}
          >
            <RefreshIcon 
              className="refresh-icon"
              fontSize="small" 
              sx={{ 
                verticalAlign: 'middle', 
                mr: 0.5,
                transition: 'transform 0.5s ease',
              }} 
            />
            Last updated: {lastUpdated.toLocaleTimeString()}
          </Box>
        )}
      </Paper>
        
      {error ? (
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="error">{error}</Typography>
        </Paper>
      ) : (
        <Paper 
          elevation={3} 
          sx={{ 
            p: 3,
            transition: 'all 0.3s ease',
            position: 'relative'
          }}
        >
          <Box display="flex" alignItems="center" mb={2}>
            <ScoreboardIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
            <Typography variant="h5" color="primary" fontWeight="bold">
              Individual Rankings
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer sx={{ maxHeight: '500px', overflowY: 'auto' }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell 
                      width="10%" 
                      sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}
                    >
                      Rank
                    </TableCell>
                    <TableCell 
                      width="30%" 
                      sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PersonIcon fontSize="small" sx={{ mr: 1 }} />
                        Name
                      </Box>
                    </TableCell>
                    <TableCell 
                      width="20%" 
                      align="right" 
                      sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <SearchIcon fontSize="small" sx={{ mr: 1 }} />
                        Words Found
                      </Box>
                    </TableCell>
                    <TableCell 
                      width="20%" 
                      align="right" 
                      sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <CategoryIcon fontSize="small" sx={{ mr: 1 }} />
                        Categories
                      </Box>
                    </TableCell>
                    <TableCell 
                      width="20%" 
                      align="right" 
                      sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <ScoreboardIcon fontSize="small" sx={{ mr: 1 }} />
                        Total Score
                      </Box>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {leaderboard.map((player, index) => (
                    <TableRow 
                      key={player.name}
                      sx={{
                        backgroundColor: index < 3 ? 
                          `${index === 0 ? '#fff9c4' : index === 1 ? '#f5f5f5' : '#fff3e0'}80` : 'transparent',
                        '&:hover': { 
                          backgroundColor: index < 3 ? 
                            `${index === 0 ? '#fff9c4' : index === 1 ? '#f5f5f5' : '#fff3e0'}` : '#f5f5f5',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        },
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          {index < 3 && (
                            <Tooltip 
                              title={index === 0 ? "1st Place" : index === 1 ? "2nd Place" : "3rd Place"} 
                              TransitionComponent={Zoom}
                            >
                              <EmojiEventsIcon sx={{ color: MEDAL_COLORS[index], mr: 1 }} />
                            </Tooltip>
                          )}
                          <Typography fontWeight={index < 3 ? 'bold' : 'normal'}>
                            {index + 1}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight={index < 3 ? 'bold' : 'normal'}>
                          {player.name}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Chip 
                          label={`${player.correctGuesses}/20`}
                          color={player.correctGuesses > 0 ? "primary" : "default"}
                          size="small"
                          variant={player.correctGuesses > 0 ? "filled" : "outlined"}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Chip 
                          label={`${player.correctCategories}/5`}
                          color={player.correctCategories > 0 ? "secondary" : "default"}
                          size="small"
                          variant={player.correctCategories > 0 ? "filled" : "outlined"}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Typography 
                          fontWeight="bold" 
                          // color={index === 0 ? 'error' : index === 1 ? 'primary' : index === 2 ? 'secondary' : 'inherit'}
                          fontSize={index < 3 ? '1.1rem' : '1rem'}
                          sx={{
                            display: 'inline-block',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            backgroundColor: player.total > 0 ? 'rgba(0, 0, 0, 0.04)' : 'transparent'
                          }}
                        >
                          {player.total}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                  {leaderboard.length === 0 && !isLoading && (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                        <Typography color="text.secondary">
                          No scores recorded yet. Be the first to score points!
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      )}
      
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          background: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
          borderRadius: 2
        }}
      >
        <Typography variant="h6" color="primary" gutterBottom fontWeight="bold">
          Scoring System
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.7)', borderRadius: 2 }}>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>• Words Found:</strong> 1 point per correct word guess
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>• Categories:</strong> 4 points per correctly identified theme
          </Typography>
          <Typography variant="body1">
            <strong>• Total Score:</strong> Words + (Categories × 4)
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
} 