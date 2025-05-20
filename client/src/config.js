const API_URL = import.meta.env.VITE_API_URL || window.location.hostname === 'localhost' 
  ? 'http://localhost:10000'
  : 'http://192.168.0.156:10000';

export { API_URL }; 