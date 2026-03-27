# Tournament Manager - Practical Tutorial

Learn how to use the Tournament Manager by following a real-world example.

## Scenario: Create a Badminton Tournament

We'll create a complete tournament from scratch, register players, schedule matches, and track scores.

## Step 1: Start the Application

### Terminal 1 - Backend
```bash
cd backend
npm install
npm start
```

### Terminal 2 - Frontend
```bash
cd frontend
npm install
npm start
```

Open http://localhost:3000 in your browser.

## Step 2: Create Game Template (Optional)

The app comes with default game templates, but you can create custom ones.

### Via API:
```bash
curl -X POST http://localhost:5000/api/games \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Advanced Badminton",
    "category": "sets-based",
    "description": "Professional badminton with advanced rules",
    "scoringSystem": {
      "type": "dual-score",
      "maxScore": 21,
      "winCondition": "first-to-value",
      "setsPerMatch": 3,
      "pointsPerSet": 21,
      "deucesAllowed": true
    },
    "players": {
      "min": 2,
      "max": 4
    },
    "rules": ["Best of 3 sets", "First to 21 points wins a set", "Must win by 2 at deuce"]
  }'
```

### Via Frontend:
1. Click "Games" in sidebar
2. Click "Create Template"
3. Fill in the details
4. Click "Create Template"

## Step 3: Register Players

### Via API:
```bash
# Player 1
curl -X POST http://localhost:5000/api/players \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "phone": "1234567890"
  }'

# Player 2
curl -X POST http://localhost:5000/api/players \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bob Smith",
    "email": "bob@example.com",
    "phone": "0987654321"
  }'
```

### Via Frontend:
1. Click "Players" in sidebar
2. Click "Register Player"
3. Fill in name, email, phone
4. Click "Register"
5. Repeat for all players

## Step 4: Create Tournament

### Via API:
```bash
# First, get the Badminton game ID from:
# GET http://localhost:5000/api/games
# Use that ID in the following request

curl -X POST http://localhost:5000/api/tournaments \
  -H "Content-Type: application/json" \
  -d '{
    "name": "City Badminton Championship 2024",
    "gameId": "GAME_ID_HERE",
    "gameName": "Badminton",
    "startDate": "2024-04-15T10:00:00Z",
    "location": "City Sports Complex",
    "maxPlayers": 16,
    "format": "single-elimination",
    "description": "Annual city championship for badminton enthusiasts"
  }'
```

### Via Frontend:
1. Click "Tournaments" in sidebar
2. Click "Create Tournament"
3. Fill in details:
   - Name: "City Badminton Championship 2024"
   - Game: Select "Badminton"
   - Date: Pick a date
   - Location: "City Sports Complex"
   - Max Players: 16
   - Format: "Single Elimination"
4. Click "Create Tournament"

## Step 5: Register Players to Tournament

### Via API:
```bash
# Get tournament ID from GET http://localhost:5000/api/tournaments
# Get player IDs from GET http://localhost:5000/api/players

curl -X POST http://localhost:5000/api/tournaments/TOURNAMENT_ID/register-player \
  -H "Content-Type: application/json" \
  -d '{
    "playerId": "PLAYER_ID_1",
    "playerName": "Alice Johnson"
  }'

curl -X POST http://localhost:5000/api/tournaments/TOURNAMENT_ID/register-player \
  -H "Content-Type: application/json" \
  -d '{
    "playerId": "PLAYER_ID_2",
    "playerName": "Bob Smith"
  }'
```

### Via Frontend:
1. Go to "Tournaments"
2. Click "Register Players" on the tournament card
3. Click "Register" next to each player you want
4. Players appear in the tournament

## Step 6: Schedule Match

### Via API:
```bash
curl -X POST http://localhost:5000/api/matches \
  -H "Content-Type: application/json" \
  -d '{
    "tournamentId": "TOURNAMENT_ID",
    "gameId": "GAME_ID",
    "gameName": "Badminton",
    "players": [
      {
        "playerId": "PLAYER_ID_1",
        "playerName": "Alice Johnson"
      },
      {
        "playerId": "PLAYER_ID_2",
        "playerName": "Bob Smith"
      }
    ],
    "scheduledAt": "2024-04-15T10:00:00Z",
    "court": "Court 1"
  }'
```

### Via Frontend:
1. Go to "Matches"
2. Click "Schedule Match"
3. Fill in:
   - Tournament: Select the tournament
   - Time: Pick scheduled time
   - Court: "Court 1"
   - Players: Select 2 players
4. Click "Schedule Match"

## Step 7: Start the Match

### Via API:
```bash
# Get match ID from GET http://localhost:5000/api/matches
curl -X PUT http://localhost:5000/api/matches/MATCH_ID/start \
  -H "Content-Type: application/json"
```

### Via Frontend:
1. Go to "Matches"
2. Find the scheduled match
3. Click the play button (▶) to start

## Step 8: Live Scoring

### Via API:
```bash
# Initialize score sheet
curl -X POST http://localhost:5000/api/scores/initialize \
  -H "Content-Type: application/json" \
  -d '{
    "matchId": "MATCH_ID",
    "gameId": "GAME_ID",
    "players": [
      {
        "playerId": "PLAYER_ID_1",
        "playerName": "Alice Johnson"
      },
      {
        "playerId": "PLAYER_ID_2",
        "playerName": "Bob Smith"
      }
    ]
  }'

# Update score during match
curl -X POST http://localhost:5000/api/scores \
  -H "Content-Type: application/json" \
  -d '{
    "matchId": "MATCH_ID",
    "playerId": "PLAYER_ID_1",
    "playerName": "Alice Johnson",
    "gameId": "GAME_ID",
    "currentSet": 1,
    "currentScore": 15,
    "totalScore": 15
  }'
```

### Via Frontend:
1. Go to "Live Scoring"
2. Select the ongoing match from the left panel
3. Click "Start Match" (if not started)
4. For each player:
   - Click "Increase" to add points
   - Click "Decrease" to subtract points
5. Scores update in real-time

## Step 9: End the Match

### Via API:
```bash
# Determine winner and end match
curl -X PUT http://localhost:5000/api/matches/MATCH_ID/end \
  -H "Content-Type: application/json" \
  -d '{
    "winners": ["PLAYER_ID_1"]
  }'

# Finalize scores
curl -X POST http://localhost:5000/api/scores/match/MATCH_ID/finalize \
  -H "Content-Type: application/json" \
  -d '{
    "winners": ["PLAYER_ID_1"]
  }'
```

### Via Frontend:
1. In "Live Scoring", with the ongoing match selected
2. Click "End Match"
3. System determines winner based on highest score
4. Match marked as completed

## Step 10: View Statistics

### Get Player Stats via API:
```bash
# Overall stats
curl http://localhost:5000/api/players/PLAYER_ID

# Player's game statistics
curl http://localhost:5000/api/players/PLAYER_ID/stats

# Leaderboard
curl http://localhost:5000/api/players/leaderboard?limit=10
```

### View in Frontend:
1. Go to "Players"
2. Click on a player
3. See detailed statistics:
   - Total matches
   - Win percentage
   - Game-wise performance
   - Tournament history

## Step 11: Track Tournament Progress

### Get Tournament Info via API:
```bash
# Tournament details
curl http://localhost:5000/api/tournaments/TOURNAMENT_ID

# Tournament standings
curl http://localhost:5000/api/tournaments/TOURNAMENT_ID/standings

# All tournament matches
curl http://localhost:5000/api/matches/tournament/TOURNAMENT_ID
```

### View in Frontend:
1. Go to "Tournaments"
2. Click on tournament card to see details
3. Click "Register Players" to see current registrations
4. Go to "Matches" and filter by this tournament

## Common Workflows

### Workflow 1: Single Match Recording
1. Register players
2. Schedule match
3. Start match
4. Update scores in live scoring
5. End match
6. View updated player stats

### Workflow 2: Tournament with Multiple Rounds
1. Create tournament
2. Register all players
3. Schedule Round 1 matches
4. Play and record all Round 1 matches
5. Calculate standings
6. Schedule Round 2 matches
7. Repeat until completion

### Workflow 3: Quick Stats Check
1. Go to Players
2. Click on player
3. View game-wise stats
4. View tournament history
5. View recent scores

## API Testing with Curl

### Get All Games
```bash
curl http://localhost:5000/api/games
```

### Get All Players
```bash
curl http://localhost:5000/api/players
```

### Get Today's Matches
```bash
curl http://localhost:5000/api/matches/today
```

### Get Upcoming Matches
```bash
curl http://localhost:5000/api/matches/upcoming
```

## Postman Import

Create a new Postman Collection with these requests:
1. GET /games
2. GET /players
3. POST /players (register)
4. GET /tournaments
5. POST /tournaments (create)
6. POST /matches (schedule)
7. PUT /matches/{id}/start
8. POST /scores/initialize
9. POST /scores (update)
10. PUT /matches/{id}/end

## Tips for Using the Application

1. **Use Default Templates** - No need to create custom games initially
2. **Create Test Data** - Register 4-5 test players for quick testing
3. **Schedule Multiple Matches** - Test system with multiple concurrent matches
4. **View Live Scoreboard** - Open Live Scoring in one window while matches are ongoing
5. **Check Stats Regularly** - Stats update automatically after each match

## Data Relationships

```
1 Tournament
├── 1 Game (Template)
├── N Players (registered)
└── N Matches (scheduled for this tournament)
    ├── 2-4 Players (participating)
    └── N Scores (one per player per match)

1 Player
├── Multiple Matches
├── Tournament Participations
└── Game-specific Statistics
```

## Key Metrics to Track

1. **Player Performance**
   - Total matches played
   - Win-loss record
   - Win percentage
   - Performance per game

2. **Tournament Progress**
   - Total registered players
   - Completed matches
   - Standings/rankings
   - Tournament status

3. **Match Information**
   - Player pairings
   - Score progression
   - Set-wise performance
   - Winner determination

---

**Now you're ready to use the Tournament Manager!** 🎉

For more detailed API information, see API_DOCUMENTATION.md
For setup help, see SETUP_GUIDE.md
For quick reference, see QUICK_START.md
