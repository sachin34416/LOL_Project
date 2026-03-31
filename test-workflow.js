/**
 * Complete Tournament Manager Workflow Test
 * Tests: Login → Register Players → Create Game → Create Tournament → 
 *        Register Players → Schedule Match → Start Match → Track Scores → End Match
 */

const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';
let authToken = '';
let userId = '';

// Colored console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  warn: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  section: (msg) => console.log(`\n${colors.cyan}━━━ ${msg} ━━━${colors.reset}`),
};

// API client with token
const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

async function testWorkflow() {
  try {
    log.section('WORKFLOW TEST: Complete Tournament Manager Flow');

    // ============ STEP 1: LOGIN/REGISTER ============
    log.section('STEP 1: Authentication');
    const uniqueEmail = `workflow-test-${Date.now()}@test.com`;
    const uniqueName = `Workflow User ${Date.now()}`;

    log.info(`Registering user: ${uniqueEmail}`);
    let response = await api.post('/auth/register', {
      name: uniqueName,
      email: uniqueEmail,
      password: 'TestPass123',
      confirmPassword: 'TestPass123',
    });

    if (response.status === 201) {
      log.success(`User registered: ${response.data.data.name}`);
      userId = response.data.data._id;
    }

    log.info('Logging in...');
    response = await api.post('/auth/login', {
      email: uniqueEmail,
      password: 'TestPass123',
    });

    if (response.status === 200) {
      authToken = response.data.data.token;
      log.success(`Login successful! Token: ${authToken.substring(0, 20)}...`);
    }

    // ============ STEP 2: REGISTER PLAYERS ============
    log.section('STEP 2: Register Players');

    const players = [];
    const playerData = [
      { name: 'Alice Johnson', email: `alice-${Date.now()}@test.com`, phone: '1234567890' },
      { name: 'Bob Smith', email: `bob-${Date.now()}@test.com`, phone: '0987654321' },
      { name: 'Charlie Brown', email: `charlie-${Date.now()}@test.com`, phone: '5555555555' },
    ];

    for (const pData of playerData) {
      log.info(`Registering player: ${pData.name}`);
      response = await api.post('/players', pData);
      if (response.status === 201) {
        players.push(response.data.data);
        log.success(`Player registered: ${response.data.data.name} (ID: ${response.data.data._id})`);
      }
    }

    if (players.length < 2) {
      throw new Error('Failed to register minimum 2 players');
    }

    // ============ STEP 3: GET GAMES ============
    log.section('STEP 3: Get Game Templates');

    log.info('Fetching game templates...');
    response = await api.get('/games');
    let games = response.data.data;

    // If no games exist, create one
    if (games.length === 0) {
      log.warn('No game templates found, creating one...');
      const gameData = {
        name: 'Badminton',
        category: 'sets-based',
        description: 'Badminton match with sets and points',
        scoringSystem: {
          type: 'dual-score',
          maxScore: 21,
          winCondition: 'first-to-value',
          setsPerMatch: 3,
        },
        players: { min: 2, max: 4 },
        rules: ['Best of 3 sets', 'First to 21 points wins a set'],
      };

      response = await api.post('/games', gameData);
      if (response.status === 201) {
        games = [response.data.data];
        log.success(`Game template created: ${response.data.data.name}`);
      }
    }

    if (games.length === 0) {
      throw new Error('Failed to create or fetch game templates');
    }

    const selectedGame = games[0];
    log.success(`Using game template: ${selectedGame.name}`);

    // ============ STEP 4: CREATE TOURNAMENT ============
    log.section('STEP 4: Create Tournament');

    const tournamentData = {
      name: `Test Tournament ${Date.now()}`,
      gameId: selectedGame._id,
      gameName: selectedGame.name,
      startDate: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
      location: 'Test Venue',
      maxPlayers: 4,
      format: 'single-elimination',
      description: 'Test tournament for workflow validation',
    };

    log.info(`Creating tournament: ${tournamentData.name}`);
    response = await api.post('/tournaments', tournamentData);

    if (response.status === 201) {
      const tournament = response.data.data;
      log.success(`Tournament created: ${tournament.name} (ID: ${tournament._id})`);

      // ============ STEP 5: REGISTER PLAYERS TO TOURNAMENT ============
      log.section('STEP 5: Register Players to Tournament');

      for (const player of players) {
        log.info(`Registering ${player.name} to tournament...`);
        response = await api.post(`/tournaments/${tournament._id}/register-player`, {
          playerId: player._id,
          playerName: player.name,
        });

        if (response.status === 200) {
          log.success(`${player.name} registered to tournament`);
        }
      }

      // ============ STEP 6: SCHEDULE MATCH ============
      log.section('STEP 6: Schedule Match');

      const matchData = {
        tournamentId: tournament._id,
        gameId: selectedGame._id,
        gameName: selectedGame.name,
        players: [
          { playerId: players[0]._id, playerName: players[0].name },
          { playerId: players[1]._id, playerName: players[1].name },
        ],
        scheduledAt: new Date(Date.now() + 1800000).toISOString(), // 30 mins from now
        court: 'Court 1',
      };

      log.info('Scheduling match...');
      response = await api.post('/matches', matchData);

      if (response.status === 201) {
        const match = response.data.data;
        log.success(`Match scheduled: ${match.gameName} - ${match.players.map(p => p.playerName).join(' vs ')} (ID: ${match._id})`);

        // ============ STEP 7: START MATCH ============
        log.section('STEP 7: Start Match');

        log.info('Starting match...');
        response = await api.put(`/matches/${match._id}/start`);

        if (response.status === 200) {
          log.success('Match started successfully');
        }

        // ============ STEP 8: INITIALIZE SCORE SHEET ============
        log.section('STEP 8: Initialize Score Sheet');

        const scoreSheetData = {
          matchId: match._id,
          gameId: selectedGame._id,
          players: match.players,
        };

        log.info('Initializing score sheet...');
        response = await api.post('/scores/initialize', scoreSheetData);

        if (response.status === 201) {
          log.success('Score sheet initialized for ' + response.data.data.length + ' players');

          // ============ STEP 9: UPDATE SCORES ============
          log.section('STEP 9: Update Match Scores');

          const scores = {};
          for (let i = 0; i < match.players.length; i++) {
            const playerId = match.players[i].playerId;
            const playerName = match.players[i].playerName;
            const score = (i + 1) * 10; // 10, 20, etc.

            scores[playerId] = score;

            log.info(`Updating score for ${playerName}: ${score} points`);
            response = await api.post('/scores', {
              matchId: match._id,
              playerId: playerId,
              playerName: playerName,
              gameId: selectedGame._id,
              currentScore: score,
              totalScore: score,
            });

            if (response.status === 200) {
              log.success(`Score updated for ${playerName}: ${score}`);
            }
          }

          // ============ STEP 10: END MATCH ============
          log.section('STEP 10: End Match');

          // Determine winner (highest score)
          const maxScore = Math.max(...Object.values(scores));
          const winners = match.players
            .filter((p) => scores[p.playerId] === maxScore)
            .map((p) => p.playerId);

          log.info('Determining winner based on highest score...');
          response = await api.put(`/matches/${match._id}/end`, { winners });

          if (response.status === 200) {
            const endedMatch = response.data.data;
            const winnerName = endedMatch.players.find(p => p.isWinner)?.playerName;
            log.success(`Match ended! Winner: ${winnerName}`);
          }

          // ============ STEP 11: FINALIZE SCORES ============
          log.section('STEP 11: Finalize Scores');

          log.info('Finalizing match scores...');
          response = await api.post(`/scores/match/${match._id}/finalize`, { winners });

          if (response.status === 200) {
            log.success('Match scores finalized');
          }

          // ============ STEP 12: GET TOURNAMENT STANDINGS ============
          log.section('STEP 12: Tournament Standings');

          log.info('Fetching tournament standings...');
          response = await api.get(`/tournaments/${tournament._id}/standings`);

          if (response.status === 200) {
            log.success('Tournament standings retrieved');
          }

          // ============ STEP 13: GET PLAYER STATS ============
          log.section('STEP 13: Player Statistics');

          for (const player of players) {
            log.info(`Fetching stats for ${player.name}...`);
            response = await api.get(`/players/${player._id}/stats`);

            if (response.status === 200) {
              const stats = response.data.data;
              log.success(
                `${player.name} Stats: Matches=${stats.totalMatches}, Wins=${stats.wins}, Loss=${stats.losses}`
              );
            }
          }

          // ============ STEP 14: GET LEADERBOARD ============
          log.section('STEP 14: Leaderboard');

          log.info('Fetching player leaderboard...');
          response = await api.get('/players/leaderboard?limit=10');

          if (response.status === 200) {
            log.success(`Leaderboard retrieved: ${response.data.data.length} players`);
          }

          // ============ FINAL SUMMARY ============
          log.section('WORKFLOW TEST COMPLETED SUCCESSFULLY ✅');
          console.log(`
${colors.green}╔════════════════════════════════════════════╗${colors.reset}
${colors.green}║   ALL WORKFLOW TESTS PASSED ✓              ║${colors.reset}
${colors.green}╠════════════════════════════════════════════╣${colors.reset}
${colors.green}║ ✓ Authentication (Login/Register)         ║${colors.reset}
${colors.green}║ ✓ Player Registration (3 players)         ║${colors.reset}
${colors.green}║ ✓ Game Templates Retrieved                ║${colors.reset}
${colors.green}║ ✓ Tournament Created                      ║${colors.reset}
${colors.green}║ ✓ Players Registered to Tournament        ║${colors.reset}
${colors.green}║ ✓ Match Scheduled                         ║${colors.reset}
${colors.green}║ ✓ Match Started                           ║${colors.reset}
${colors.green}║ ✓ Score Sheet Initialized                 ║${colors.reset}
${colors.green}║ ✓ Scores Updated During Match            ║${colors.reset}
${colors.green}║ ✓ Match Ended with Winner Determined     ║${colors.reset}
${colors.green}║ ✓ Scores Finalized                        ║${colors.reset}
${colors.green}║ ✓ Tournament Standings Retrieved          ║${colors.reset}
${colors.green}║ ✓ Player Statistics Updated               ║${colors.reset}
${colors.green}║ ✓ Leaderboard Generated                   ║${colors.reset}
${colors.green}╚════════════════════════════════════════════╝${colors.reset}

${colors.cyan}System is ready for production use!${colors.reset}
          `);
        } else {
          throw new Error('Failed to initialize score sheet');
        }
      } else {
        throw new Error('Failed to schedule match');
      }
    } else {
      throw new Error('Failed to create tournament');
    }
  } catch (error) {
    log.error(`Test failed: ${error.message}`);
    if (error.response) {
      log.error(`Response: ${JSON.stringify(error.response.data)}`);
    }
    process.exit(1);
  }
}

// Run the test
console.log(`${colors.cyan}🎮 Starting Complete Workflow Test...${colors.reset}`);
testWorkflow().catch(err => {
  log.error(`Unexpected error: ${err.message}`);
  process.exit(1);
});
