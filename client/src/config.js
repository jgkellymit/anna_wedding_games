// Use the Vite environment variable if set, otherwise determine based on hostname
const API_URL = import.meta.env.VITE_API_URL || 
  (window.location.hostname === 'localhost' 
    ? 'http://localhost:10000'
    : 'https://anna-and-pat-wedding.onrender.com');

export { API_URL }; 