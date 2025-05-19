const API_URL = import.meta.env.VITE_API_URL || window.location.hostname === 'localhost' 
  ? 'http://localhost:3001'
  : 'http://192.168.0.156:3001';

export { API_URL }; 