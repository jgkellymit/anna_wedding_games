import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Login from './components/Login';
import Tabs from './components/Tabs';
import FieldDayInfo from './components/FieldDayInfo';
import AssassinsGame from './components/AssassinsGame';
import TeamScores from './components/TeamScores';
import Leaderboard from './components/Leaderboard';
import Admin from './components/Admin';
import { API_URL } from './config';
import './index.css';

function App() {
  // State for dialogs
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [pendingLoginName, setPendingLoginName] = useState('');
  
  // Persistent login with name
  const [loggedIn, setLoggedIn] = useState(() => localStorage.getItem('weddingLoggedIn') === 'true');
  const [userName, setUserName] = useState(() => localStorage.getItem('userName') || '');
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('isAdmin') === 'true');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('assassins');

  const handleLogin = async (name, providedPassword = null) => {
    try {
      // If this is an admin user (Anna or Pat) and no password is provided, show password dialog
      if ((name === 'Anna Kelly' || name === 'Pat Lally') && !providedPassword) {
        setPendingLoginName(name);
        setPasswordDialogOpen(true);
        return;
      }
      
      const requestBody = { name };
      if (providedPassword) {
        requestBody.password = providedPassword;
      }
      
      const res = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody),
        credentials: 'include'
      });
      
      const data = await res.json();
      
      if (data.success) {
        setLoggedIn(true);
        setUserName(name);
        localStorage.setItem('weddingLoggedIn', 'true');
        localStorage.setItem('userName', name);
        
        if (data.isAdmin) {
          setIsAdmin(true);
          localStorage.setItem('isAdmin', 'true');
          setActiveTab('admin');
        } else {
          setIsAdmin(false);
          localStorage.removeItem('isAdmin');
          localStorage.setItem('assassinsName', name);
          localStorage.setItem('assassinsAssignedWord', data.word);
          localStorage.setItem('assassinsBoardLayout', JSON.stringify(data.boardLayout));
        }
        
        setLoginError('');
      } else if (data.requiresPassword) {
        // Server indicated this user requires a password
        setPendingLoginName(name);
        setPasswordDialogOpen(true);
      } else {
        setLoginError(data.message || 'Invalid name.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Failed to connect to server. Please try again.');
    }
  };

  const handlePasswordSubmit = () => {
    handleLogin(pendingLoginName, password);
    setPasswordDialogOpen(false);
    setPassword('');
    setPendingLoginName('');
  };

  // Logout function
  const handleLogout = () => {
    setLoggedIn(false);
    setUserName('');
    setIsAdmin(false);
    localStorage.removeItem('weddingLoggedIn');
    localStorage.removeItem('userName');
    localStorage.removeItem('isAdmin');
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

  const handlePasswordDialogClose = () => {
    setPasswordDialogOpen(false);
    setPassword('');
    setPendingLoginName('');
  };

  if (!loggedIn) {
    return (
      <>
        <Login onLogin={handleLogin} error={loginError} />
        
        {/* Password Dialog */}
        <Dialog open={passwordDialogOpen} onClose={handlePasswordDialogClose}>
          <DialogTitle>Admin Authentication</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Password"
              type="password"
              fullWidth
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handlePasswordSubmit();
                }
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handlePasswordDialogClose}>Cancel</Button>
            <Button onClick={handlePasswordSubmit} variant="contained" color="primary">
              Login
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col" style={{ background: 'linear-gradient(135deg, #fce4ec 0%, #bbdefb 100%)' }}>
      <div className="pt-4">
        <Tabs 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          onLogout={handleLogout} 
          onLogoutClick={handleLogoutClick} 
          userName={userName}
          isAdmin={isAdmin}
        />
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
            {activeTab === 'admin' && isAdmin && <Admin playerName={userName} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
