import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  TextField,
  Alert,
  Snackbar,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress
} from '@mui/material';
import ScoreboardIcon from '@mui/icons-material/Scoreboard';
import EditIcon from '@mui/icons-material/Edit';
import UpgradeIcon from '@mui/icons-material/Upgrade';
import { API_URL } from '../config';

export default function Admin({ playerName }) {
  const [events, setEvents] = useState([]);
  const [miniGames, setMiniGames] = useState([]);
  const [teams, setTeams] = useState([]);
  const [scoringOptions, setScoringOptions] = useState({});
  
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedEvent, setSelectedEvent] = useState('');
  const [selectedScore, setSelectedScore] = useState('');
  const [isMinigame, setIsMinigame] = useState(false);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  
  const [teamScores, setTeamScores] = useState({});

  // Fetch configuration and current scores
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setIsLoading(true);
        const [configResponse, scoresResponse] = await Promise.all([
          fetch(`${API_URL}/api/config/events`),
          fetch(`${API_URL}/api/scores`)
        ]);
        
        if (!configResponse.ok || !scoresResponse.ok) {
          throw new Error('Failed to fetch data');
        }
        
        const configData = await configResponse.json();
        const scoresData = await scoresResponse.json();
        
        setEvents(configData.events);
        setMiniGames(configData.miniGames);
        setScoringOptions(configData.scoringOptions);
        setTeams(configData.teams);
        setTeamScores(scoresData);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load configuration. Please try again.');
        setIsLoading(false);
      }
    };
    
    fetchConfig();
  }, []);

  const handleSubmit = async () => {
    if (!selectedTeam || !selectedEvent || selectedScore === '') {
      setError('Please fill out all fields');
      setOpenSnackbar(true);
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/api/scores/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: playerName,
          team: selectedTeam,
          event: selectedEvent,
          score: parseInt(selectedScore, 10),
          isMinigame: isMinigame
        }),
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to update score');
      }
      
      const data = await response.json();
      setTeamScores(data.scores);
      setSuccess(`Successfully updated ${selectedEvent} score for ${selectedTeam}`);
      setOpenSnackbar(true);
      
      // Reset selection
      setSelectedScore('');
    } catch (err) {
      console.error('Error updating score:', err);
      setError('Failed to update score. Please try again.');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleEventTypeChange = (isMinigameOption) => {
    setIsMinigame(isMinigameOption);
    setSelectedEvent('');
    setSelectedScore('');
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
          Admin Dashboard
        </Typography>
        <Typography variant="body1">
          Welcome, {playerName}! You can update event scores here.
        </Typography>
      </Paper>

      {isLoading ? (
        <Box display="flex" justifyContent="center" p={5}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Score Update Form */}
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <EditIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
              <Typography variant="h5" color="primary" fontWeight="bold">
                Update Scores
              </Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth sx={{ minWidth: '200px' }}>
                  <InputLabel>Team</InputLabel>
                  <Select
                    value={selectedTeam}
                    label="Team"
                    onChange={(e) => setSelectedTeam(e.target.value)}
                  >
                    {teams.map(team => (
                      <MenuItem key={team} value={team}>{team}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth sx={{ minWidth: '200px' }}>
                  <InputLabel>Event Type</InputLabel>
                  <Select
                    value={isMinigame ? 'minigame' : 'event'}
                    label="Event Type"
                    onChange={(e) => handleEventTypeChange(e.target.value === 'minigame')}
                  >
                    <MenuItem value="event">Main Event</MenuItem>
                    <MenuItem value="minigame">Mini Game</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth sx={{ minWidth: '200px' }}>
                  <InputLabel>Event</InputLabel>
                  <Select
                    value={selectedEvent}
                    label="Event"
                    onChange={(e) => setSelectedEvent(e.target.value)}
                  >
                    {isMinigame ? (
                      miniGames.map(game => (
                        <MenuItem key={game} value={game}>{game}</MenuItem>
                      ))
                    ) : (
                      events.filter(event => event !== 'Assassins').map(event => (
                        <MenuItem key={event} value={event}>{event}</MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth sx={{ minWidth: '200px' }}>
                  <InputLabel>Score</InputLabel>
                  <Select
                    value={selectedScore}
                    label="Score"
                    onChange={(e) => setSelectedScore(e.target.value)}
                    disabled={!selectedEvent}
                  >
                    {selectedEvent && scoringOptions[selectedEvent] && 
                     Array.isArray(scoringOptions[selectedEvent]) ? (
                      scoringOptions[selectedEvent].map(scoreOption => (
                        <MenuItem key={scoreOption} value={scoreOption}>{scoreOption}</MenuItem>
                      ))
                    ) : (
                      <MenuItem value={0}>0</MenuItem>
                    )}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  fullWidth
                  onClick={handleSubmit}
                  startIcon={<UpgradeIcon />}
                  disabled={!selectedTeam || !selectedEvent || selectedScore === ''}
                >
                  Update Score
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {/* Current Scores Table */}
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <ScoreboardIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
              <Typography variant="h5" color="primary" fontWeight="bold">
                Current Scores
              </Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            
            <Typography variant="h6" gutterBottom>Main Events</Typography>
            <Box sx={{ overflowX: 'auto' }}>
              <Table size="small" sx={{ mb: 4 }}>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Team</strong></TableCell>
                    {events.map(event => (
                      <TableCell key={event} align="center"><strong>{event}</strong></TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(teamScores).map(([team, data]) => (
                    <TableRow key={team} hover>
                      <TableCell>{team}</TableCell>
                      {events.map(event => (
                        <TableCell key={`${team}-${event}`} align="center">
                          {data.events[event] || 0}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
            
            <Typography variant="h6" gutterBottom>Mini Games</Typography>
            <Box sx={{ overflowX: 'auto' }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Team</strong></TableCell>
                    {miniGames.map(game => (
                      <TableCell key={game} align="center"><strong>{game}</strong></TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(teamScores).map(([team, data]) => (
                    <TableRow key={team} hover>
                      <TableCell>{team}</TableCell>
                      {miniGames.map(game => (
                        <TableCell key={`${team}-${game}`} align="center">
                          {data.miniGames[game] || 0}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Paper>
        </>
      )}
      
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={error ? "error" : "success"} 
          sx={{ width: '100%' }}
        >
          {error || success}
        </Alert>
      </Snackbar>
    </Box>
  );
} 