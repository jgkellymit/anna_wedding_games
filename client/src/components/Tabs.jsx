import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

export default function Tabs({ activeTab, setActiveTab, onLogout, onLogoutClick, userName, isAdmin }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleTabSelect = (tab) => {
    setActiveTab(tab);
    handleMenuClose();
  };

  return (
    <div className="w-full bg-white shadow-md sticky top-0 z-10">
      <div className="max-w-[850px] w-full mx-auto">
        <div className="flex items-center justify-between w-full px-6 py-2">
          <div className="flex items-center">
            <span className="whitespace-nowrap" style={{ color: 'black', marginLeft: '8px', fontWeight: 700, fontStyle: 'italic' }}>
              {userName}
            </span>
            {isAdmin && (
              <AdminPanelSettingsIcon 
                color="primary" 
                sx={{ ml: 1 }} 
                fontSize="small"
              />
            )}
          </div>
          <div className="flex items-center">
            <IconButton
              aria-label="menu"
              size="large"
              edge={false}
              sx={{ color: 'black', marginRight: '8px' }}
              onClick={handleMenuClick}
            >
              <MenuIcon /> 
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              {!isAdmin && <MenuItem onClick={() => handleTabSelect('assassins')}>Assassins Game</MenuItem>}
              <MenuItem onClick={() => handleTabSelect('leaderboard')}>Assassins Leaderboard</MenuItem>
              <MenuItem onClick={() => handleTabSelect('info')}>Field Day</MenuItem>
              <MenuItem onClick={() => handleTabSelect('scores')}>Team Scores</MenuItem>
              {isAdmin && <MenuItem onClick={() => handleTabSelect('admin')}>Admin Dashboard</MenuItem>}
              {isAdmin && <MenuItem onClick={() => handleTabSelect('assassinsAdmin')}>Assassins Admin</MenuItem>}
              <MenuItem divider />
              <MenuItem onClick={onLogoutClick || onLogout} sx={{ color: 'red' }}>Log Out</MenuItem>
            </Menu>
          </div>
        </div>
      </div>
    </div>
  );
}
