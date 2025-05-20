import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Divider,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Snackbar
} from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SecurityIcon from '@mui/icons-material/Security';
import { API_URL } from '../config';

export default function AssassinsAdmin({ playerName }) {
  const [gameState, setGameState] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openResetDialog, setOpenResetDialog] = useState(false);
  const [playerToReset, setPlayerToReset] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    fetchGameState();
  }, [playerName]);

  const fetchGameState = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/api/admin/assassins-state?name=${encodeURIComponent(playerName)}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch game state');
      }
      
      const data = await response.json();
      setGameState(data);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching assassins game state:', err);
      setError('Failed to load game state. Please try again.');
      setIsLoading(false);
    }
  };

  // Sort players alphabetically by first name
  const sortedGameState = [...gameState].sort((a, b) => 
    a.name.localeCompare(b.name)
  );

  const handleResetClick = (player) => {
    setPlayerToReset(player);
    setOpenResetDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenResetDialog(false);
    setPlayerToReset(null);
  };

  const handleConfirmReset = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/reset-assassins-score`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adminName: playerName,
          playerName: playerToReset.name
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess(`Successfully reset score for ${playerToReset.name}`);
        setSnackbarOpen(true);
      } else {
        setError(data.error || 'Failed to reset score');
        setSnackbarOpen(true);
      }
    } catch (err) {
      console.error('Error resetting score:', err);
      setError('Failed to reset score. Please try again.');
      setSnackbarOpen(true);
    }
    
    setOpenResetDialog(false);
    setPlayerToReset(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box display="flex" flexDirection="column" gap={3} sx={{ m: 1, mb: 5 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          textAlign: 'center',
          background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
          borderRadius: 2
        }}
      >
        <Typography variant="h4" color="primary" gutterBottom fontWeight="bold">
          Assassins Game Admin
        </Typography>
        <Typography variant="body1">
          View the full state of the Assassins game, including each player's assigned word and categories.
        </Typography>
      </Paper>

      {isLoading ? (
        <Box display="flex" justifyContent="center" p={5}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Paper elevation={3} sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" mb={2}>
            <SecurityIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
            <Typography variant="h5" color="primary" fontWeight="bold">
              Player Assignments
            </Typography>
          </Box>
          <Divider sx={{ mb: 3 }} />
          
          <Box sx={{ overflowX: 'auto' }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>Player</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>Word</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', minWidth: '150px' }}>Categories</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', width: '60px' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedGameState.map((player) => (
                  <TableRow key={player.name}>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{player.name}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{player.assignedWord}</TableCell>
                    <TableCell>{player.themes.join(', ')}</TableCell>
                    <TableCell>
                      <IconButton 
                        color="error"
                        onClick={() => handleResetClick(player)}
                        title="Reset player's score"
                        size="small"
                      >
                        <RestartAltIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Paper>
      )}

      {/* Confirmation Dialog for Reset */}
      <Dialog
        open={openResetDialog}
        onClose={handleCloseDialog}
      >
        <DialogTitle>Confirm Reset</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to reset {playerToReset?.name}'s Assassins game score?
          </Typography>
          <Typography color="error" sx={{ mt: 2, fontWeight: 'bold' }}>
            This action cannot be undone!
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleConfirmReset} color="error" variant="contained">
            Reset Score
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success/Error Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={success ? "success" : "error"}
          sx={{ width: '100%' }}
        >
          {success || error}
        </Alert>
      </Snackbar>
    </Box>
  );
} 