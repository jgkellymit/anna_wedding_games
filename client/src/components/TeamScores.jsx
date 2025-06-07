import { useState, useEffect } from 'react';
import { Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Zoom } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import RefreshIcon from '@mui/icons-material/Refresh';
import { API_URL } from '../config';

const EVENTS = [
  'Assassins',
  'Name Game',
  'Grapes',
  'Flip Cup',
  'Finish the Lyric',
  'Water Balloon Toss',
  'Amazing Race',
  'Relay Race'
];

// Mini games as additional columns
const MINI_GAMES = [
  '(M) Spike',
  '(M) Disc Golf',
  '(M) Liars Dice',
  '(M) Speed Puzzle'
];

// Original mini game names without prefix (for data lookup)
const MINI_GAMES_ORIGINAL = [
  'Spike',
  'Disc Golf',
  'Liars Dice',
  'Speed Puzzle'
];

// Medal colors for top 3 teams
const MEDAL_COLORS = {
  0: '#FFD700', // Gold
  1: '#C0C0C0', // Silver
  2: '#CD7F32'  // Bronze
};

export default function TeamScores() {
  const [scores, setScores] = useState({});
  const [teams, setTeams] = useState({});
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      // Fetch both teams and scores
      const [teamsResponse, scoresResponse] = await Promise.all([
        fetch(`${API_URL}/api/teams`),
        fetch(`${API_URL}/api/scores`)
      ]);
      
      const teamsData = await teamsResponse.json();
      const scoresData = await scoresResponse.json();
      
      setTeams(teamsData);
      setScores(scoresData);
      setLastUpdated(new Date());
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load team data. Please try again later.');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const calculateTeamTotal = (teamScores) => {
    if (!teamScores?.events) return 0;
    
    // Calculate total from main events
    const eventsTotal = Object.values(teamScores.events).reduce((sum, score) => sum + score, 0);
    
    // Calculate total from mini games
    const miniGamesTotal = MINI_GAMES_ORIGINAL.reduce((sum, game) => {
      return sum + (teamScores?.miniGames?.[game] || 0);
    }, 0);
    
    return eventsTotal + miniGamesTotal;
  };

  // Sort teams by total score
  const sortedTeams = Object.entries(scores)
    .map(([team, teamScores]) => ({
      team,
      total: calculateTeamTotal(teamScores),
      scores: teamScores
    }))
    .sort((a, b) => b.total - a.total);

  if (error) {
    return (
      <Box p={4}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" gap={3} sx={{  m: 1, mb: 5  }}>
      <Paper elevation={3} sx={{ 
        p: 3, 
        textAlign: 'center',
        // background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
        borderRadius: 2
      }}>
        <Typography variant="h4" color="primary" fontWeight="bold" gutterBottom>
          Wedding Field Day Scores
        </Typography>
        {lastUpdated && (
          <Box 
            component="span" 
            onClick={fetchData}
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
      
      {/* Team Assignments */}
      <Paper elevation={3} sx={{ p: 3, transition: 'all 0.3s ease' }}>
        <Typography variant="h5" color="primary" gutterBottom fontWeight="bold">
          Team Assignments
        </Typography>
        <TableContainer sx={{ maxHeight: '400px', overflowY: 'auto' }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ backgroundColor: '#f5f5f5' }}><strong>Team</strong></TableCell>
                <TableCell sx={{ backgroundColor: '#f5f5f5' }}><strong>Members</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(teams).map(([teamName, members]) => (
                <TableRow 
                  key={teamName}
                  sx={{ 
                    '&:hover': { 
                      backgroundColor: '#f5f5f5',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  <TableCell sx={{ fontWeight: 'bold' }}>{teamName}</TableCell>
                  <TableCell>{members.join(', ')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Combined Scores Table */}
      <Paper elevation={3} sx={{ p: 3, transition: 'all 0.3s ease' }}>
        <Typography variant="h5" color="primary" gutterBottom fontWeight="bold">
          Event Scores
        </Typography>
        <TableContainer sx={{ maxHeight: '500px', overflowX: 'auto' }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell 
                  sx={{ 
                    backgroundColor: '#f5f5f5', 
                    minWidth: '100px',
                    padding: '8px',
                    position: 'sticky',
                    left: 0,
                    zIndex: 3
                  }}
                >
                  <strong>Team</strong>
                </TableCell>
                
                {/* Main Events Headers before Mini Games */}
                {EVENTS.slice(0, 4).map(event => (
                  <TableCell 
                    key={event} 
                    align="center" 
                    sx={{ 
                      backgroundColor: '#f5f5f5', 
                      minWidth: '70px',
                      padding: '8px',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <strong>{event}</strong>
                  </TableCell>
                ))}
                
                {/* Mini Games Headers */}
                {MINI_GAMES.map(game => (
                  <TableCell 
                    key={game} 
                    align="center" 
                    sx={{ 
                      backgroundColor: '#f5f5f5', 
                      minWidth: '70px',
                      padding: '8px',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <strong>{game}</strong>
                  </TableCell>
                ))}
                
                {/* Main Events Headers after Mini Games */}
                {EVENTS.slice(4).map(event => (
                  <TableCell 
                    key={event} 
                    align="center" 
                    sx={{ 
                      backgroundColor: '#f5f5f5', 
                      minWidth: '70px',
                      padding: '8px',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <strong>{event}</strong>
                  </TableCell>
                ))}
                
                <TableCell 
                  align="center" 
                  sx={{ 
                    backgroundColor: '#f5f5f5', 
                    minWidth: '70px',
                    padding: '8px'
                  }}
                >
                  <strong>Total</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedTeams.map(({ team, total, scores: teamScores }, index) => (
                <TableRow 
                  key={team}
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
                  <TableCell 
                    sx={{ 
                      padding: '8px',
                      position: 'sticky',
                      left: 0,
                      backgroundColor: index < 3 ? 
                        `${index === 0 ? '#fff9c4' : index === 1 ? '#f5f5f5' : '#fff3e0'}` : 'white',
                      zIndex: 2
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={1}>
                      {index < 3 && (
                        <Tooltip 
                          title={index === 0 ? "1st Place" : index === 1 ? "2nd Place" : "3rd Place"} 
                          TransitionComponent={Zoom}
                        >
                          <EmojiEventsIcon sx={{ color: MEDAL_COLORS[index] }} />
                        </Tooltip>
                      )}
                      <Typography fontSize={'.9rem'} fontWeight={index < 3 ? 'bold' : 'normal'}>
                        {team}
                      </Typography>
                    </Box>
                  </TableCell>
                  
                  {/* Main Events Scores */}
                  {EVENTS.slice(0, 4).map(event => (
                    <TableCell 
                      key={event} 
                      align="center"
                      sx={{
                        padding: '8px',
                        fontWeight: (teamScores?.events?.[event] || 0) > 0 ? 'bold' : 'normal',
                        backgroundColor: (teamScores?.events?.[event] || 0) > 0 ? 'rgba(0, 0, 0, 0.04)' : 'transparent'
                      }}
                    >
                      {teamScores?.events?.[event] || 0}
                    </TableCell>
                  ))}
                  
                  {/* Mini Games Scores */}
                  {MINI_GAMES.map((game, idx) => (
                    <TableCell 
                      key={game} 
                      align="center"
                      sx={{
                        padding: '8px',
                        fontWeight: (teamScores?.miniGames?.[MINI_GAMES_ORIGINAL[idx]] || 0) > 0 ? 'bold' : 'normal',
                        backgroundColor: (teamScores?.miniGames?.[MINI_GAMES_ORIGINAL[idx]] || 0) > 0 ? 'rgba(0, 0, 0, 0.04)' : 'transparent'
                      }}
                    >
                      {teamScores?.miniGames?.[MINI_GAMES_ORIGINAL[idx]] || 0}
                    </TableCell>
                  ))}
                  
                  {/* Main Events Scores */}
                  {EVENTS.slice(4).map(event => (
                    <TableCell 
                      key={event} 
                      align="center"
                      sx={{
                        padding: '8px',
                        fontWeight: (teamScores?.events?.[event] || 0) > 0 ? 'bold' : 'normal',
                        backgroundColor: (teamScores?.events?.[event] || 0) > 0 ? 'rgba(0, 0, 0, 0.04)' : 'transparent'
                      }}
                    >
                      {teamScores?.events?.[event] || 0}
                    </TableCell>
                  ))}
                  
                  <TableCell 
                    align="center"
                    sx={{
                      padding: '8px'
                    }}
                  >
                    <Typography 
                      fontWeight="bold" 
                      // color={index === 0 ? 'error' : index === 1 ? 'primary' : index === 2 ? 'secondary' : 'inherit'}
                      fontSize={index < 3 ? '1.1rem' : '1rem'}
                    >
                      {total}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
