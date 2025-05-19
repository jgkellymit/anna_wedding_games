import { useState } from 'react';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';
import { API_URL } from '../config';

export default function Login({ onLogin, error }) {
  const [name, setName] = useState('');
  const [names, setNames] = useState([]);

  // Fetch available names when component mounts
  useState(() => {
    fetch(`${API_URL}/api/names`)
      .then(res => res.json())
      .then(setNames)
      .catch(err => console.error('Error fetching names:', err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(name);
  };

  return (
    <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" sx={{ background: 'linear-gradient(135deg, #fce4ec 0%, #bbdefb 100%)' }}>
      <Paper elevation={6} sx={{ p: 4, width: '100%', maxWidth: 340 }}>
        <Typography variant="h5" fontWeight="bold" align="center" mb={3}>
          Anna and Pat
          <br/>
          Wedding Games Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <Autocomplete
            fullWidth
            options={names}
            value={name}
            onChange={(_, newValue) => setName(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select your name"
                sx={{ mb: 2 }}
                required
              />
            )}
          />
          {error && <Typography color="error" align="center" mb={2}>{error}</Typography>}
          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            disabled={!name}
          >
            Enter
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
