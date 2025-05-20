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

// Admin users
const adminUsers = {
  "Anna Kelly": { password: "iamironman", isAdmin: true },
  "Pat Lally": { password: "iamironman", isAdmin: true }
};

// Generate names list from team assignments and add admin users
const names = [...Object.values(teamAssignments).flat(), ...Object.keys(adminUsers)];

// Get list of event names from data
const eventNames = [
  'Assassins',
  'Name Game',
  'Grapes',
  'Flip Cup',
  'Finish the Lyric',
  'Water Balloon Toss',
  'Amazing Race',
  'Relay Race'
];

const miniGames = [
  'Spike',
  'Disc Golf',
  'Liars Dice',
  'Pickleball',
  'Speed Puzzle'
];

// Scoring options for each event (using the data from FieldDayInfo)
const scoringOptions = {
  'Assassins': 'Variable', // Assassin scores are calculated automatically
  'Name Game': [100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0],
  'Grapes': [100, 80, 60, 50, 40, 30, 20, 10, 0],
  'Flip Cup': [100, 80, 60, 50, 40, 30, 20, 10, 0],
  'Finish the Lyric': [100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0],
  'Water Balloon Toss': [100, 80, 60, 50, 40, 30, 20, 10, 0],
  'Amazing Race': [100, 80, 60, 50, 40, 30, 20, 10, 0],
  'Relay Race': [400, 300, 200, 100, 0],
  'Spike': [50, 40, 30, 20, 10, 0],
  'Disc Golf': [50, 40, 30, 20, 10, 0],
  'Liars Dice': [50, 40, 30, 20, 10, 0],
  'Pickleball': [50, 40, 30, 20, 10, 0],
  'Speed Puzzle': [50, 40, 30, 20, 10, 0]
};

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

// Read/write event scores
async function readEventScoresFile() {
  try {
    const data = await fsPromises.readFile(path.join(__dirname, 'event_scores.json'), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // Initialize with default structure
      const defaultScores = {};
      Object.keys(teamAssignments).forEach(team => {
        defaultScores[team] = {
          events: {},
          miniGames: {}
        };
        
        // Initialize all events with 0
        eventNames.forEach(event => {
          defaultScores[team].events[event] = 0;
        });
        
        // Initialize all mini games with 0
        miniGames.forEach(game => {
          defaultScores[team].miniGames[game] = 0;
        });
      });
      
      return defaultScores;
    }
    throw error;
  }
}

async function writeEventScoresFile(scores) {
  const tempPath = path.join(__dirname, 'event_scores.json.tmp');
  const finalPath = path.join(__dirname, 'event_scores.json');
  
  await fsPromises.writeFile(tempPath, JSON.stringify(scores, null, 2));
  await fsPromises.rename(tempPath, finalPath);
}

// Initialize scores from file or create new if doesn't exist
let globalScores = {};
let eventScores = {};

// Precompute assigned words and selected themes for all players
function precomputeAllPlayerData() {
  // Get all words from all categories
  const allWords = [];
  const wordToCategory = {}; // Map to track which category each word belongs to
  
  Object.entries(wordCategories).forEach(([category, words]) => {
    words.forEach(word => {
      allWords.push(word);
      wordToCategory[word] = category;
    });
  });
  
  // Get the list of players (excluding admin users)
  const allPlayers = Object.values(teamAssignments).flat(); // Make a copy to avoid modifying the original
  
  // Check if we have the right number of words and players
  const extraWords = allWords.length - allPlayers.length;
  const extraPlayers = allPlayers.length - allWords.length;
  
  // Handle cases with extra words or players
  if (extraWords > 0) {
    // We have more words than players, add special players
    if (extraWords > 2) {
      throw new Error(`Too many extra words (${extraWords}). Maximum allowed is 2.`);
    }
    
    const specialPlayers = ["Anna Kelly", "Pat Lally"];
    for (let i = 0; i < extraWords; i++) {
      allPlayers.push(specialPlayers[i]);
    }
    console.log(`Added ${extraWords} special players to match word count`);
  } else if (extraPlayers > 0) {
    // We have more players than words, remove some players
    if (extraPlayers > 4) {
      throw new Error(`Too many extra players (${extraPlayers}). Maximum allowed is 4.`);
    }
    
    const playersToRemove = ["Jack Larch", "Michelle Larch", "Anna Kelly", "Pat Lally"];
    for (let i = 0; i < extraPlayers; i++) {
      const playerToRemove = playersToRemove[i];
      const index = allPlayers.indexOf(playerToRemove);
      if (index !== -1) {
        allPlayers.splice(index, 1);
      } else {
        console.warn(`Player ${playerToRemove} not found in the list, skipping removal`);
      }
    }
    console.log(`Removed ${extraPlayers} players to match word count`);
  }
  
  // Now we should have equal number of players and words
  if (allPlayers.length !== allWords.length) {
    console.error(`Player count (${allPlayers.length}) does not match word count (${allWords.length}) after adjustments`);
  } else {
    console.log(`Player count (${allPlayers.length}) matches word count (${allWords.length})`);
  }
  
  // Shuffle the words deterministically based on a fixed seed
  const shuffledWords = [...allWords].sort(() => 0.5 - Math.random());
  
  // Assign one word to each player
  const playerWordMap = {};
  allPlayers.forEach((player, index) => {
    playerWordMap[player] = shuffledWords[index];
  });
  
  // For each player, select 5 themes, making sure to exclude the theme containing their word
  allPlayers.forEach(playerName => {
    // Skip admin users who are not assigned words
    if (adminUsers[playerName]) {
      return;
    }
    
    const playerWord = playerWordMap[playerName];
    const playerWordCategory = wordToCategory[playerWord];
    
    // Get all themes except the one containing the player's word
    const availableThemes = Object.entries(wordCategories).filter(([category, _]) => category !== playerWordCategory);
    
    // If we have fewer than 5 available themes, we'll need to include the player's theme
    let selectedThemes;
    if (availableThemes.length < 5) {
      console.warn(`Not enough themes to exclude player's theme for ${playerName}. Including their theme.`);
      selectedThemes = Object.entries(wordCategories)
        .map(theme => ({ theme, sortKey: Math.random() }))
        .sort((a, b) => a.sortKey - b.sortKey)
        .map(item => item.theme)
        .slice(0, 5);
    } else {
      // Randomly select 5 themes from available themes
      selectedThemes = availableThemes
        .map(theme => ({ theme, sortKey: Math.random() }))
        .sort((a, b) => a.sortKey - b.sortKey)
        .map(item => item.theme)
        .slice(0, 5);
    }
    
    allPlayerInitialData[playerName] = {
      assignedWord: playerWord,
      selectedThemesArray: selectedThemes,
      selectedThemesObject: Object.fromEntries(selectedThemes)
    };
  });
  
  // Set up admin users with special data
  Object.keys(adminUsers).forEach(adminName => {
    allPlayerInitialData[adminName] = {
      isAdmin: true,
      assignedWord: "Admin", // Special value indicating admin status
      selectedThemesArray: [],
      selectedThemesObject: {}
    };
  });
  
  console.log("Precomputed initial data for all players.");
  return allPlayerInitialData;
}

async function initializeServerState() {
  try {
    globalScores = await readScoresFile();
    eventScores = await readEventScoresFile();
    precomputeAllPlayerData(); // This needs 'names' and 'wordCategories' to be loaded
  } catch (error) {
    console.error('Error initializing server state:', error);
    globalScores = {};
    eventScores = {};
    // Handle potential errors in precomputeAllPlayerData if necessary
  }
}
initializeServerState();


// Function to initialize user state
function initializeUserState(guesserName) {
  // For admin users, return admin user state
  if (adminUsers[guesserName]) {
    const userState = {
      isAdmin: true,
      assignedWord: "Admin",
      boardLayout: [],
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
    
  // Create a pool of available players, excluding the guesser
  const availablePlayers = Object.keys(allPlayerInitialData)
    .filter(name => name !== guesserName && !adminUsers[name]);

  // Set to track players already used on the board
  let usedPlayersOnBoard = new Set([guesserName]);
  
  // Properly structured board with exactly 5 columns of 4 players each
  let boardColumns = [];
    
  // For each theme, create a column of 4 unique players whose words match the theme
  for (const [themeName, wordsInTheme] of guesserThemesArrayForBoard) {
    // Find all players who have words from this theme
    let playersWithThemeWords = availablePlayers.filter(player => 
      wordsInTheme.includes(allPlayerInitialData[player].assignedWord) && 
      !usedPlayersOnBoard.has(player)
    );
    
    // Shuffle these players using a more random approach
    const seed = Math.random() * 1000; // Use a random seed instead of deterministic
    playersWithThemeWords = playersWithThemeWords
      .map(player => ({ 
        player, 
        sortKey: Math.random() * seed // Use Math.random() for true randomness
      }))
      .sort((a, b) => a.sortKey - b.sortKey)
      .map(item => item.player);
    
    // Take up to 4 players for this column
    const playersForTheme = playersWithThemeWords.slice(0, 4);

    // If we don't have 4 players, fill with empty strings
    while (playersForTheme.length < 4) {
      playersForTheme.push("");
    }
    
    // Mark these players as used
    playersForTheme.forEach(player => {
      if (player) usedPlayersOnBoard.add(player);
    });
    
    boardColumns.push(playersForTheme);
  }

  // Shuffle the columns randomly to ensure random theme distribution
  boardColumns = boardColumns
    .map((column, index) => ({ column, sortKey: Math.random() }))
    .sort((a, b) => a.sortKey - b.sortKey)
    .map(item => item.column);

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
  const { name, password } = req.body;
  
  // Check if user is an admin and requires password
  if (adminUsers[name]) {
    if (password !== adminUsers[name].password) {
      return res.status(401).json({ 
        success: false, 
        requiresPassword: true,
        message: 'Password required for admin user' 
      });
    }
    
    // Password is correct for admin
    const userState = initializeUserState(name);
    return res.json({ 
      success: true,
      isAdmin: true,
      word: userState.assignedWord
    });
  }
  
  // Regular user authentication
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
    
    // For admin users, return admin status instead of board layout
    if (userState.isAdmin) {
      return res.json({ isAdmin: true });
    }
    
    res.json(userState.boardLayout);
  } else if (userName && !userStates.has(userName)) {
     // This case might occur if login failed or state not ready
     // Initialize state if user is valid but not yet in userStates (e.g. direct access after server restart but before login)
    if (names.includes(userName)) {
        const userState = initializeUserState(userName);
        if (userState) {
            // For admin users, return admin status instead of board layout
            if (userState.isAdmin) {
              return res.json({ isAdmin: true });
            }
            
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
async function calculateTeamScores() {
  try {
    // Get the most up-to-date event scores
    const currentEventScores = await readEventScoresFile();
    
    const teamScores = { ...currentEventScores };
    
    // Add Assassins scores from individual scores
    Object.entries(globalScores).forEach(([playerName, scores]) => {
      const team = Object.entries(teamAssignments).find(([_, members]) => 
        members.includes(playerName)
      )?.[0];

      if (team && teamScores[team] && scores && typeof scores.total === 'number') {
        teamScores[team].events.Assassins = (teamScores[team].events.Assassins || 0) + scores.total;
      }
    });

    return teamScores;
  } catch (error) {
    console.error('Error calculating team scores:', error);
    return {};
  }
}

// Get team scores
app.get('/api/scores', async (req, res) => {
  const scores = await calculateTeamScores();
  res.json(scores);
});

// Update scores for a specific event
app.post('/api/scores/update', async (req, res) => {
  const { name, team, event, score, isMinigame } = req.body;
  
  // Check if user is admin
  const userState = userStates.get(name);
  if (!userState || !userState.isAdmin) {
    return res.status(403).json({ error: 'Unauthorized: Admin access required' });
  }
  
  try {
    // Load current scores
    const currentScores = await readEventScoresFile();
    
    if (!currentScores[team]) {
      return res.status(400).json({ error: 'Invalid team' });
    }
    
    // Update score in the correct category
    if (isMinigame) {
      if (!miniGames.includes(event)) {
        return res.status(400).json({ error: 'Invalid mini game' });
      }
      currentScores[team].miniGames[event] = parseInt(score, 10) || 0;
    } else {
      if (!eventNames.includes(event)) {
        return res.status(400).json({ error: 'Invalid event' });
      }
      currentScores[team].events[event] = parseInt(score, 10) || 0;
    }
    
    // Save updated scores
    await writeEventScoresFile(currentScores);
    
    // Return updated scores
    res.json({ success: true, scores: currentScores });
  } catch (error) {
    console.error('Error updating scores:', error);
    res.status(500).json({ error: 'Failed to update scores' });
  }
});

// Get event and minigame configuration
app.get('/api/config/events', (req, res) => {
  res.json({
    events: eventNames,
    miniGames: miniGames,
    scoringOptions: scoringOptions,
    teams: Object.keys(teamAssignments)
  });
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

// Get user's team
app.get('/api/user/team', (req, res) => {
  const { name } = req.query;
  
  if (!name) {
    return res.status(400).json({ error: 'Name parameter is required' });
  }
  
  // Check if user is admin
  if (adminUsers[name]) {
    return res.json({ isAdmin: true });
  }
  
  // Find which team the player belongs to
  let playerTeam = null;
  Object.entries(teamAssignments).forEach(([team, players]) => {
    if (players.includes(name)) {
      playerTeam = team;
    }
  });
  
  if (playerTeam) {
    res.json({ team: playerTeam });
  } else {
    res.status(404).json({ error: 'Player not found in any team' });
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
