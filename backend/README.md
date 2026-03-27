# Tournament Manager - Backend

Node.js Express backend API for the Tournament Management System

## Features

- Game template management with scoring pattern grouping (sets-based, goals-based, points-based, turns-based, time-based)
- Player registration and management
- Tournament creation and management
- Match scheduling and tracking
- Real-time score management and updates
- Player statistics and leaderboards
- RESTful API with comprehensive endpoints

## Project Structure

```
backend/
├── models/          # MongoDB schemas
│   ├── GameTemplate.js
│   ├── Player.js
│   ├── Tournament.js
│   ├── Match.js
│   └── Score.js
├── controllers/     # API logic
│   ├── gameController.js
│   ├── playerController.js
│   ├── tournamentController.js
│   ├── matchController.js
│   └── scoreController.js
├── routes/         # API endpoints
│   ├── gameRoutes.js
│   ├── playerRoutes.js
│   ├── tournamentRoutes.js
│   ├── matchRoutes.js
│   └── scoreRoutes.js
├── server.js       # Express app setup
├── .env            # Environment variables
└── package.json
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/tournament_manager
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_change_in_production
CLIENT_URL=http://localhost:3000
```

3. Start MongoDB (ensure MongoDB is installed and running):
```bash
mongod
```

4. Start the server:
```bash
npm start
# or for development with auto-reload
npm run dev
```

The API will be available at `http://localhost:5000/api`

## API Endpoints

### Games
- `GET /api/games` - Get all game templates
- `GET /api/games/:id` - Get game by ID
- `GET /api/games/category/:category` - Get games by category
- `GET /api/games/default-templates` - Get default game templates
- `POST /api/games` - Create new game template
- `PUT /api/games/:id` - Update game template
- `DELETE /api/games/:id` - Delete game template

### Players
- `GET /api/players` - Get all players
- `GET /api/players/:id` - Get player by ID
- `GET /api/players/leaderboard` - Get player leaderboard
- `POST /api/players` - Register new player
- `PUT /api/players/:id` - Update player
- `PUT /api/players/:id/stats` - Update player stats
- `DELETE /api/players/:id` - Delete player

### Tournaments
- `GET /api/tournaments` - Get all tournaments
- `GET /api/tournaments/:id` - Get tournament by ID
- `GET /api/tournaments/:id/standings` - Get tournament standings
- `POST /api/tournaments` - Create tournament
- `PUT /api/tournaments/:id` - Update tournament
- `POST /api/tournaments/:id/register-player` - Register player
- `POST /api/tournaments/:id/remove-player` - Remove player
- `DELETE /api/tournaments/:id` - Delete tournament

### Matches
- `GET /api/matches` - Get all matches
- `GET /api/matches/:id` - Get match by ID
- `GET /api/matches/upcoming` - Get upcoming matches
- `GET /api/matches/today` - Get today's matches
- `POST /api/matches` - Create match
- `PUT /api/matches/:id/start` - Start match
- `PUT /api/matches/:id/end` - End match

### Scores
- `GET /api/scores/match/:matchId` - Get match scores
- `POST /api/scores` - Update score
- `POST /api/scores/initialize` - Initialize score sheet
- `POST /api/scores/match/:matchId/finalize` - Finalize match score

## Database Schema

### GameTemplate
- name, category, description
- scoringSystem (type, maxScore, winCondition, etc.)
- players (min, max)
- rules, customRules
- timestamps

### Player
- name, email, phone, avatar
- stats (totalMatches, wins, losses, winPercentage)
- gameStats, tournaments
- timestamps

### Tournament
- name, gameId, status, startDate
- registeredPlayers, format
- standings, rounds
- timestamps

### Match
- tournamentId, gameId, status, scheduledAt
- players, scores, match data
- timestamps

### Score
- matchId, playerId, gameId, tournamentId
- currentSet, setScores, currentScore, totalScore
- winners, timestamp

## Technologies Used

- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Node.js** - Runtime

## Future Enhancements

- WebSocket integration for real-time updates
- Match statistics and analytics
- Export match reports
- Team management
- Draw management
- Video integration
- Mobile app support

## Development

For development with auto-reload:
```bash
npm run dev
```

## License

MIT
