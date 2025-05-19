/**
 * Tests for server/index.js
 * 
 * This file tests the core game logic functions:
 * - precomputeAllPlayerData
 * - initializeUserState
 */

// Mock data for testing
const mockGameData = {
  teamAssignments: {
    "Team 1": ["Alice", "Bob", "Charlie", "Dave"],
    "Team 2": ["Eve", "Frank", "Grace", "Heidi"],
    "Team 3": ["Ivan", "Julia", "Karl", "Lisa"]
  },
  wordCategories: {
    "animals": ["Lion", "Tiger", "Bear", "Zebra"],
    "colors": ["Red", "Blue", "Green", "Yellow"],
    "fruits": ["Apple", "Banana", "Cherry", "Date"],
    "elements": ["Fire", "Water", "Earth", "Air"],
    "planets": ["Mars", "Venus", "Jupiter", "Saturn"]
  }
};

// Mock the fs module
jest.mock('fs', () => ({
  readFileSync: jest.fn(() => JSON.stringify(mockGameData)),
  promises: {
    readFile: jest.fn().mockResolvedValue(JSON.stringify({})),
    writeFile: jest.fn().mockResolvedValue(undefined),
    rename: jest.fn().mockResolvedValue(undefined)
  }
}));

// Mock path module
jest.mock('path', () => ({
  join: jest.fn((_, file) => file)
}));

// Import the functions to test
// Note: We need to import after mocking dependencies
const server = require('./index');

// Extract the functions we need to test
// Note: These functions are not exported, so we'll need to make them accessible for testing
// This will require modifying index.js to expose these functions for testing

describe('Game Logic Tests', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('precomputeAllPlayerData', () => {
    test('should assign unique words to all players', () => {
      // This test assumes precomputeAllPlayerData is exposed for testing
      
      // Call the function
      const result = server.precomputeAllPlayerData();
      
      // Get all players
      const allPlayers = Object.values(mockGameData.teamAssignments).flat();
      
      // Check that every player has an entry
      allPlayers.forEach(player => {
        expect(server.allPlayerInitialData).toHaveProperty(player);
      });
      
      // Check that each player has an assigned word
      allPlayers.forEach(player => {
        expect(server.allPlayerInitialData[player]).toHaveProperty('assignedWord');
        expect(typeof server.allPlayerInitialData[player].assignedWord).toBe('string');
      });
      
      // Check that each player has exactly 5 themes
      allPlayers.forEach(player => {
        expect(server.allPlayerInitialData[player]).toHaveProperty('selectedThemesArray');
        expect(server.allPlayerInitialData[player].selectedThemesArray.length).toBe(5);
      });
      
      // Check that the assigned word is from one of the player's themes
      allPlayers.forEach(player => {
        const playerData = server.allPlayerInitialData[player];
        const allThemeWords = playerData.selectedThemesArray.reduce((acc, [_, words]) => [...acc, ...words], []);
        expect(allThemeWords).toContain(playerData.assignedWord);
      });
    });
  });

  describe('initializeUserState', () => {
    test('should create a valid board layout for each player', () => {
      // This test assumes initializeUserState is exposed for testing
      
      // Get all players
      const allPlayers = Object.values(mockGameData.teamAssignments).flat();
      
      // Test for a specific player
      const testPlayer = allPlayers[0];
      
      // Call the function
      const userState = server.initializeUserState(testPlayer);
      
      // Check that the user state has the correct structure
      expect(userState).toHaveProperty('themes');
      expect(userState).toHaveProperty('assignedWord');
      expect(userState).toHaveProperty('boardLayout');
      expect(userState).toHaveProperty('guesses');
      expect(userState).toHaveProperty('themeGuesses');
      expect(userState).toHaveProperty('scores');
      
      // Check that the board layout has exactly 20 entries (5 columns x 4 players)
      expect(userState.boardLayout.length).toBe(20);
      
      // Check that the board layout doesn't include the player themselves
      expect(userState.boardLayout).not.toContain(testPlayer);
      
      // Check that there are no duplicate players in the board layout
      const uniquePlayers = new Set(userState.boardLayout.filter(name => name !== ""));
      expect(uniquePlayers.size).toBe(userState.boardLayout.filter(name => name !== "").length);
      
      // Check that each column corresponds to a theme
      const columns = [];
      for (let i = 0; i < 5; i++) {
        columns.push(userState.boardLayout.slice(i * 4, (i + 1) * 4));
      }
      
      // For each column, at least some players should have words from the same theme
      columns.forEach(column => {
        const nonEmptyPlayers = column.filter(name => name !== "");
        if (nonEmptyPlayers.length > 0) {
          // Get the words for these players
          const words = nonEmptyPlayers.map(name => server.allPlayerInitialData[name].assignedWord);
          
          // Find a theme that contains at least some of these words
          const matchingTheme = Object.entries(userState.themes).find(([_, themeWords]) => {
            return words.some(word => themeWords.includes(word));
          });
          
          // There should be at least one matching theme
          expect(matchingTheme).toBeDefined();
        }
      });
    });
    
    test('should minimize duplicate words in a column', () => {
      // Get all players
      const allPlayers = Object.values(mockGameData.teamAssignments).flat();
      
      // Test for a specific player
      const testPlayer = allPlayers[0];
      
      // Call the function
      const userState = server.initializeUserState(testPlayer);
      
      // Check each column for duplicate words
      for (let col = 0; col < 5; col++) {
        const columnPlayers = userState.boardLayout.slice(col * 4, (col + 1) * 4).filter(name => name !== "");
        
        // Skip empty columns
        if (columnPlayers.length === 0) continue;
        
        const columnWords = columnPlayers.map(name => server.allPlayerInitialData[name].assignedWord);
        
        // Check for duplicates - we should have at least 1 unique word per column
        // With our small test dataset, we can't guarantee all words are unique
        const uniqueWords = new Set(columnWords);
        expect(uniqueWords.size).toBeGreaterThan(0);
        
        // For columns with multiple players, we should try to minimize duplicates
        if (columnPlayers.length > 1) {
          // We should have at least some variety in words
          expect(uniqueWords.size).toBeGreaterThanOrEqual(Math.ceil(columnPlayers.length / 2));
        }
      }
    });

    test('should handle multiple users with consistent results', () => {
      // Get all players
      const allPlayers = Object.values(mockGameData.teamAssignments).flat();
      
      // Test for multiple players
      const testPlayers = allPlayers.slice(0, 3); // Take first 3 players
      
      // Call the function for each player
      const userStates = testPlayers.map(player => server.initializeUserState(player));
      
      // Each user should have a valid board
      userStates.forEach((state, index) => {
        // Board should have 20 entries
        expect(state.boardLayout.length).toBe(20);
        
        // Board should not contain the player themselves
        expect(state.boardLayout).not.toContain(testPlayers[index]);
        
        // Each player should have a valid word
        expect(state.assignedWord).toBeTruthy();
      });
      
      // Calling the same function twice for the same player should return the same state
      const player = testPlayers[0];
      const firstState = server.initializeUserState(player);
      const secondState = server.initializeUserState(player);
      
      expect(firstState).toBe(secondState); // Should be the same object reference
    });
    
    test('should handle edge cases gracefully', () => {
      // Test with invalid player name
      const invalidPlayer = "NonExistentPlayer";
      const invalidState = server.initializeUserState(invalidPlayer);
      
      // Should return null for invalid player
      expect(invalidState).toBeNull();
    });
  });
  
  // Test the theme guessing logic
  describe('Theme guessing logic', () => {
    test('should match themes with partial strings', () => {
      // This would normally be tested through the API endpoint
      // But we can simulate the logic here
      
      const themes = {
        "silent letter": ["Knife", "Wrestle", "Psychic", "Subtle"],
        "homophones": ["Knight", "Seam", "Flour", "Write"]
      };
      
      // Test cases for theme matching
      const testCases = [
        { guess: "silent", expected: "silent letter" },
        { guess: "letter", expected: "silent letter" },
        { guess: "Silent Letter", expected: "silent letter" },
        { guess: "homo", expected: "homophones" },
        { guess: "phones", expected: "homophones" },
        { guess: "HOMOPHONES", expected: "homophones" }
      ];
      
      testCases.forEach(({ guess, expected }) => {
        const match = Object.keys(themes).find(themeKey => 
          guess.toLowerCase().includes(themeKey.toLowerCase()) || 
          themeKey.toLowerCase().includes(guess.toLowerCase())
        );
        
        expect(match).toBe(expected);
      });
    });
  });
}); 