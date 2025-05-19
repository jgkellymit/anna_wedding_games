import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Login from './components/Login';
import Tabs from './components/Tabs';
import FieldDayInfo from './components/FieldDayInfo';
import AssassinsGame from './components/AssassinsGame';
import TeamScores from './components/TeamScores';
import Leaderboard from './components/Leaderboard';
import { API_URL } from './config';
import './index.css';

function App() {
  // State for logout confirmation dialog
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  // Persistent login with name
  const [loggedIn, setLoggedIn] = useState(() => localStorage.getItem('weddingLoggedIn') === 'true');
  const [userName, setUserName] = useState(() => localStorage.getItem('userName') || '');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('assassins');

  const handleLogin = async (name) => {
    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ name }),
        credentials: 'include'
      });
      
      const data = await res.json();
      
      if (data.success) {
        setLoggedIn(true);
        setUserName(name);
        localStorage.setItem('weddingLoggedIn', 'true');
        localStorage.setItem('userName', name);
        localStorage.setItem('assassinsName', name); // Store name for Assassins game
        localStorage.setItem('assassinsAssignedWord', data.word); // Store assigned word
        localStorage.setItem('assassinsBoardLayout', JSON.stringify(data.boardLayout)); // Store board layout
        setLoginError('');
      } else {
        setLoginError(data.message || 'Invalid name.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Failed to connect to server. Please try again.');
    }
  };

  // Logout function
  const handleLogout = () => {
    setLoggedIn(false);
    setUserName('');
    localStorage.removeItem('weddingLoggedIn');
    localStorage.removeItem('userName');
    localStorage.removeItem('assassinsName');
    localStorage.removeItem('assassinsAssignedWord');
    localStorage.removeItem('assassinsBoardLayout');
  };

  // Open dialog instead of logging out immediately
  const handleLogoutClick = () => {
    setLogoutDialogOpen(true);
  };

  const handleLogoutConfirm = () => {
    setLogoutDialogOpen(false);
    handleLogout();
  };

  const handleLogoutCancel = () => {
    setLogoutDialogOpen(false);
  };

  if (!loggedIn) {
    return <Login onLogin={handleLogin} error={loginError} />;
  }

  return (
    <div className="min-h-screen w-full flex flex-col" style={{ background: 'linear-gradient(135deg, #fce4ec 0%, #bbdefb 100%)' }}>
      <div className="pt-4">
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} onLogoutClick={handleLogoutClick} userName={userName} />
      </div>
      <Dialog open={logoutDialogOpen} onClose={handleLogoutCancel}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          Please confirm you are not logging out so that you can cheat and view someone else's word because that would be very uncool!!!
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLogoutCancel} color="primary">Cancel</Button>
          <Button onClick={handleLogoutConfirm} color="error" variant="contained">Log Out</Button>
        </DialogActions>
      </Dialog>
      <div className="flex-1 flex justify-center px-4">
        <div className="w-full max-w-[850px]">
          <div className="mt-4">
            {activeTab === 'info' && <FieldDayInfo />}
            {activeTab === 'assassins' && <AssassinsGame />}
            {activeTab === 'scores' && <TeamScores />}
            {activeTab === 'leaderboard' && <Leaderboard />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
