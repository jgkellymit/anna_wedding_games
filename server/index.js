const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const fsPromises = fs.promises;

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://192.168.0.156:5173',
  process.env.FRONTEND_URL
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

const PORT = process.env.PORT || 3001;

// Load game data from file
const gameData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data.json'), 'utf8'));
const { teamAssignments, wordCategories } = gameData;

// Generate names list from team assignments
const names = Object.values(teamAssignments).flat();

// User state storage
const userStates = new Map();
// Global store for precomputed player-specific data (assigned words and their themes)
let allPlayerInitialData = {};

// Add proper file locking
async function readScoresFile() {
  try {
    const data = await fsPromises.readFile(path.join(__dirname, 'scores.json'), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return {};
    }
    throw error;
  }
}

async function writeScoresFile(scores) {
  const tempPath = path.join(__dirname, 'scores.json.tmp');
  const finalPath = path.join(__dirname, 'scores.json');
  
  await fsPromises.writeFile(tempPath, JSON.stringify(scores, null, 2));
  await fsPromises.rename(tempPath, finalPath);
}

// Initialize scores from file or create new if doesn't exist
let globalScores = {};

// Precompute assigned words and selected themes for all players
function precomputeAllPlayerData() {
  names.forEach(playerName => {
    const nameSeed = playerName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const allThemesRaw = Object.entries(wordCategories);
    
    const selectedThemesArray = allThemesRaw
      .map((theme, index) => ({ theme, sortKey: (nameSeed * (index + 1)) % allThemesRaw.length }))
      .sort((a, b) => a.sortKey - b.sortKey)
      .map(item => item.theme)
      .slice(0, 5); // Array of [themeName, [words]]
      
    const wordsForUser = selectedThemesArray.reduce((acc, [_, themeWords]) => [...acc, ...themeWords], []);
    const assignedWord = wordsForUser[nameSeed % wordsForUser.length];
    
    allPlayerInitialData[playerName] = {
      assignedWord: assignedWord,
      selectedThemesArray: selectedThemesArray, // Retain order for board construction
      selectedThemesObject: Object.fromEntries(selectedThemesArray) // For quick lookup
    };
  });
  console.log("Precomputed initial data for all players.");
}

async function initializeServerState() {
  try {
    globalScores = await readScoresFile();
    precomputeAllPlayerData(); // This needs 'names' and 'wordCategories' to be loaded
  } catch (error) {
    console.error('Error initializing server state:', error);
    globalScores = {};
    // Handle potential errors in precomputeAllPlayerData if necessary
  }
}
initializeServerState();


// Function to initialize user state
function initializeUserState(guesserName) {
  if (userStates.has(guesserName)) {
    return userStates.get(guesserName);
  }

  const guesserData = allPlayerInitialData[guesserName];
  if (!guesserData) {
    console.error(`No precomputed data found for user: ${guesserName}`);
    return null; 
  }

  const guesserAssignedWord = guesserData.assignedWord;
  const guesserThemesArrayForBoard = guesserData.selectedThemesArray;

  // Create a pool of available players and shuffle it deterministically for this guesser
  const guesserNameSeed = guesserName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const availablePlayers = names
    .filter(n => n !== guesserName)
    .map((player, index) => ({ 
      player, 
      word: allPlayerInitialData[player].assignedWord,
      sortKey: (guesserNameSeed * index * 31) % names.length 
    }))
    .sort((a, b) => a.sortKey - b.sortKey);

  // Set to track players already used on the board
  let usedPlayersOnBoard = new Set([guesserName]);
  
  // Properly structured board with exactly 5 columns of 4 players each
  let boardColumns = [];
  
  // For each theme, create a column of 4 unique players
  for (const [themeName, wordsInTheme] of guesserThemesArrayForBoard) {
    // For this theme, find players whose words match AND who aren't already used
    let playersForTheme = [];
    let usedWordsInThisTheme = new Set(); // Track words used in this theme to avoid duplicates
    
    // First pass: try to get players with different words from this theme
    for (const { player, word } of availablePlayers) {
      if (usedPlayersOnBoard.has(player)) continue;
      if (usedWordsInThisTheme.has(word)) continue;
      
      if (wordsInTheme.includes(word)) {
        playersForTheme.push(player);
        usedPlayersOnBoard.add(player);
        usedWordsInThisTheme.add(word);
        
        // We've found 4 players with different words for this theme
        if (playersForTheme.length === 4) break;
      }
    }
    
    // If we couldn't find 4 unique players with different theme words, fill with other players
    if (playersForTheme.length < 4) {
      console.warn(`Theme ${themeName} only found ${playersForTheme.length} matching players. Filling remainder with non-matching players.`);
      
      // Fill with remaining players not yet used on the board
      for (const { player } of availablePlayers) {
        if (!usedPlayersOnBoard.has(player)) {
          playersForTheme.push(player);
          usedPlayersOnBoard.add(player);
          
          if (playersForTheme.length === 4) break;
        }
      }
    }
    
    // Ensure we have exactly 4 players in this column
    if (playersForTheme.length !== 4) {
      console.warn(`Could not find 4 unique players for theme ${themeName}. Got ${playersForTheme.length} players.`);
      
      // If we somehow still don't have 4 players (unlikely), pad with empty strings
      while (playersForTheme.length < 4) {
        playersForTheme.push("");
      }
    }
    
    boardColumns.push(playersForTheme);
  }

  // Ensure we have exactly 5 columns
  while (boardColumns.length < 5) {
    boardColumns.push(["", "", "", ""]);
    console.warn("Added a blank column to maintain 5 columns");
  }
  
  // Flatten the board
  const finalBoardLayout = boardColumns.flat();

  const userState = {
    themes: guesserData.selectedThemesObject,
    assignedWord: guesserAssignedWord,
    boardLayout: finalBoardLayout,
    guesses: {},
    themeGuesses: {},
    scores: {
      correctGuesses: 0,
      correctCategories: 0,
      total: 0
    }
  };
  
  userStates.set(guesserName, userState);
  return userState;
}

// Auth and word assignment
app.post('/api/login', (req, res) => {
  const { name } = req.body;
  if (names.includes(name)) {
    const userState = initializeUserState(name);
    if (userState) {
      res.json({ 
        success: true,
        word: userState.assignedWord,
        boardLayout: userState.boardLayout
      });
    } else {
      res.status(500).json({ success: false, message: 'Error initializing user state.' });
    }
  } else {
    res.status(401).json({ success: false, message: 'Invalid name' });
  }
});

// Get available names
app.get('/api/names', (req, res) => {
  const userName = req.query.name;
  if (userName && userStates.has(userName)) { // Should be initialized by login
    const userState = userStates.get(userName);
    res.json(userState.boardLayout);
  } else if (userName && !userStates.has(userName)) {
     // This case might occur if login failed or state not ready
     // Initialize state if user is valid but not yet in userStates (e.g. direct access after server restart but before login)
    if (names.includes(userName)) {
        const userState = initializeUserState(userName);
        if (userState) {
            res.json(userState.boardLayout);
            return;
        }
    }
    res.status(404).json({ message: 'User state not found or not initialized. Please login.'});
  }
  else {
    res.json(names); // For login screen name list
  }
});

// Handle guesses
app.post('/api/guess', async (req, res) => {
  const { guesser, target, word } = req.body;
  
  // Ensure states are initialized
  const guesserState = userStates.get(guesser) || initializeUserState(guesser);
  const targetInitialData = allPlayerInitialData[target]; // Target's word is from precomputed data

  if (!guesserState || !targetInitialData || !word) {
    return res.status(400).json({ correct: false, message: "Missing data for guess." });
  }
  
  const correct = targetInitialData.assignedWord.toLowerCase() === word.toLowerCase();
  if (correct) {
    guesserState.guesses[target] = word;
    guesserState.scores.correctGuesses += 1;
    guesserState.scores.total = guesserState.scores.correctGuesses + (guesserState.scores.correctCategories * 4);
    
    globalScores[guesser] = guesserState.scores; // Update global scores with the guesser's name
    try {
      await writeScoresFile(globalScores);
    } catch (error) {
      console.error('Error writing scores:', error);
    }
  }
  
  res.json({ 
    correct,
    canonicalWord: correct ? targetInitialData.assignedWord : undefined,
    scores: guesserState.scores // Return guesser's updated scores
  });
});

// Handle theme guesses
app.post('/api/theme', async (req, res) => {
  const { name, guessedTheme, gridWords } = req.body;
  const userState = userStates.get(name) || initializeUserState(name); // Ensure user state is loaded
  
  if (!userState) {
    return res.status(400).json({ correct: false, message: "User state not found." });
  }

  const actualThemeKey = Object.keys(userState.themes).find(themeKey => 
    guessedTheme.toLowerCase().includes(themeKey.toLowerCase()) || 
    themeKey.toLowerCase().includes(guessedTheme.toLowerCase())
  );
  
   console.log(actualThemeKey); // User's debug log
   console.log(userState);   // User's debug log
   console.log(guessedTheme); // User's debug log
    
  if (!actualThemeKey) {
    return res.status(400).json({ correct: false, message: "Theme not recognized for this user." });
  }
  
  const themeWords = userState.themes[actualThemeKey]; // These are the correct words for the identified theme
  const allMatch = gridWords.every(word => 
    word && themeWords.map(w => w.toLowerCase()).includes(word.toLowerCase())
  );
  
  if (allMatch && !userState.themeGuesses[actualThemeKey]) {
    userState.themeGuesses[actualThemeKey] = true;
    userState.scores.correctCategories += 1;
    userState.scores.total = userState.scores.correctGuesses + (userState.scores.correctCategories * 4);
    
    globalScores[name] = userState.scores;
    try {
      await writeScoresFile(globalScores);
    } catch (error) {
      console.error('Error writing scores:', error);
    }
  }
  
  res.json({ 
    correct: allMatch,
    scores: userState.scores
  });
});

// Get team assignments
app.get('/api/teams', (req, res) => {
  res.json(teamAssignments);
});

// Function to calculate team scores from individual scores
function calculateTeamScores() {
  const teamScores = {};
  
  Object.keys(teamAssignments).forEach(team => {
    teamScores[team] = {
      events: {
        Assassins: 0,
        'Name Game': 0,
        Grapes: 0,
        'Flip Cup': 0,
        'Finish the Lyric': 0,
        'Mini Games': 0,
        'Water Balloon Toss': 0,
        'Amazing Race': 0,
        'Relay Race': 0
      }
    };
  });

  Object.entries(globalScores).forEach(([playerName, scores]) => {
    const team = Object.entries(teamAssignments).find(([_, members]) => 
      members.includes(playerName)
    )?.[0];

    if (team && teamScores[team] && scores && typeof scores.total === 'number') {
      teamScores[team].events.Assassins += scores.total;
    }
  });

  return teamScores;
}

// Get team scores
app.get('/api/scores', (req, res) => {
  const scores = calculateTeamScores();
  res.json(scores);
});

// Update scores for a specific event (outside Assassins game)
app.post('/api/scores/update', (req, res) => {
  const { team, event, score } = req.body;
  
  // This endpoint seems to be for manually updating non-Assassins scores.
  // It reads current team scores, updates one, but doesn't persist it to a file.
  // This might need its own persistence mechanism if these scores are meant to be saved.
  // For now, it recalculates Assassins scores and then overwrites one event.
  const currentTeamScores = calculateTeamScores(); // Includes Assassins scores from globalScores
  
  if (!currentTeamScores[team] || !currentTeamScores[team].events.hasOwnProperty(event)) {
    return res.status(400).json({ error: 'Invalid team or event' });
  }

  currentTeamScores[team].events[event] = parseInt(score, 10) || 0;
  // Note: This modification is in-memory for this request's response.
  // If these event scores need to persist across server restarts, they need to be saved.
  // For now, this only affects the response of this specific call.
  // It does not update `globalScores` (which are individual assassins scores).
  res.json({ success: true, scores: currentTeamScores });
});


// Add an endpoint to get team-specific scores
app.get('/api/teams/:team/scores', (req, res) => {
  const { team } = req.params;
  const scores = calculateTeamScores();
  
  if (!scores[team]) {
    return res.status(404).json({ error: 'Team not found' });
  }
  
  res.json(scores[team]);
});

// Add an endpoint to get user scores (for Assassins game)
app.get('/api/user/scores', (req, res) => {
  const { name } = req.query;
  const userState = userStates.get(name) || initializeUserState(name);
  
  if (!userState) {
    return res.status(404).json({ error: 'User not found or not initialized.' });
  }
  
  res.json(userState.scores);
});

// Add an endpoint to get all scores (for leaderboard)
app.get('/api/leaderboard', async (req, res) => {
  try {
    // Read the latest scores from file to ensure fresh data for leaderboard
    const latestGlobalScores = await readScoresFile();
    
    const leaderboard = Object.entries(latestGlobalScores)
      .map(([name, scoresData]) => ({
        name,
        // Ensure scoresData is an object and has total, otherwise default
        correctGuesses: scoresData && typeof scoresData.correctGuesses === 'number' ? scoresData.correctGuesses : 0,
        correctCategories: scoresData && typeof scoresData.correctCategories === 'number' ? scoresData.correctCategories : 0,
        total: scoresData && typeof scoresData.total === 'number' ? scoresData.total : 0,
      }))
      .sort((a, b) => b.total - a.total);
    
    res.json(leaderboard);
  } catch (error) {
    console.error('Error reading leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// Only start the server if not in test mode
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export functions for testing
if (process.env.NODE_ENV === 'test') {
  module.exports = {
    precomputeAllPlayerData,
    initializeUserState,
    allPlayerInitialData
  };
}
