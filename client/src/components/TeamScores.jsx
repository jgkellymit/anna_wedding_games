import { useState, useEffect } from 'react';
import { Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { API_URL } from '../config';

const EVENTS = [
  'Assassins',
  'Name Game',
  'Grapes',
  'Flip Cup',
  'Finish the Lyric',
  'Mini Games',
  'Water Balloon Toss',
  'Amazing Race',
  'Relay Race'
];

export default function TeamScores() {
  const [scores, setScores] = useState({});
  const [teams, setTeams] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch both teams and scores
        const [teamsResponse, scoresResponse] = await Promise.all([
          fetch(`${API_URL}/api/teams`),
          fetch(`${API_URL}/api/scores`)
        ]);
        
        const teamsData = await teamsResponse.json();
        const scoresData = await scoresResponse.json();
        
        setTeams(teamsData);
        setScores(scoresData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load team data. Please try again later.');
      }
    };

    fetchData();
    // Refresh data every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const calculateTeamTotal = (teamScores) => {
    if (!teamScores?.events) return 0;
    return Object.values(teamScores.events).reduce((sum, score) => sum + score, 0);
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
      {/* Team Assignments */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" color="primary" gutterBottom fontWeight="bold">
          Team Assignments
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Team</strong></TableCell>
                <TableCell><strong>Members</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(teams).map(([teamName, members]) => (
                <TableRow key={teamName}>
                  <TableCell>{teamName}</TableCell>
                  <TableCell>{members.join(', ')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Event Scores */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" color="primary" gutterBottom fontWeight="bold">
          Event Scores
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Team</strong></TableCell>
                {EVENTS.map(event => (
                  <TableCell key={event} align="right"><strong>{event}</strong></TableCell>
                ))}
                <TableCell align="right"><strong>Total</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedTeams.map(({ team, total, scores: teamScores }, index) => (
                <TableRow 
                  key={team}
                  sx={index < 3 ? { backgroundColor: index === 0 ? '#fff9c4' : index === 1 ? '#f5f5f5' : '#fff3e0' } : {}}
                >
                  <TableCell>{team}</TableCell>
                  {EVENTS.map(event => (
                    <TableCell key={event} align="right">
                      {teamScores?.events?.[event] || 0}
                    </TableCell>
                  ))}
                  <TableCell align="right">
                    <Typography fontWeight="bold" color="primary">
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
