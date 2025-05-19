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
  TableRow
} from '@mui/material';
import { API_URL } from '../config';

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(`${API_URL}/api/leaderboard`);
        const data = await response.json();
        setLeaderboard(data);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        setError('Failed to load leaderboard. Please try again later.');
      }
    };

    fetchLeaderboard();
    // Refresh leaderboard every 30 seconds
    const interval = setInterval(fetchLeaderboard, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box display="flex" flexDirection="column" gap={3} sx={{ m: 1, mb: 5 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" color="primary" gutterBottom fontWeight="bold">
          Assassins Game Leaderboard
        </Typography>
        
        {error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell width="10%">Rank</TableCell>
                  <TableCell width="30%">Name</TableCell>
                  <TableCell width="20%" align="right">Words Found</TableCell>
                  <TableCell width="20%" align="right">Categories Solved</TableCell>
                  <TableCell width="20%" align="right">Total Score</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leaderboard.map((player, index) => (
                  <TableRow 
                    key={player.name}
                    sx={index < 3 ? { backgroundColor: index === 0 ? '#fff9c4' : index === 1 ? '#f5f5f5' : '#fff3e0' } : {}}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{player.name}</TableCell>
                    <TableCell align="right">{player.correctGuesses}/20</TableCell>
                    <TableCell align="right">{player.correctCategories}/5</TableCell>
                    <TableCell align="right">
                      <Typography fontWeight="bold" color="primary">
                        {player.total}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
} 