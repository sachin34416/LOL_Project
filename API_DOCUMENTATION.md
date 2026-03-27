# Tournament Manager - API Documentation

Complete API reference for the Tournament Manager Backend

## Base URL
```
http://localhost:5000/api
```

## Table of Contents
1. [Games](#games)
2. [Players](#players)
3. [Tournaments](#tournaments)
4. [Matches](#matches)
5. [Scores](#scores)

---

## Games

### Get All Games
**Endpoint:** `GET /games`

**Description:** Retrieve all game templates

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Badminton",
      "category": "sets-based",
      "description": "Badminton match with sets and points",
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
      "rules": ["Best of 3 sets", "First to 21 points wins a set"]
    }
  ]
}
```

### Get Game by ID
**Endpoint:** `GET /games/:id`

**Parameters:**
- `id` (path parameter): Game template ID

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Badminton",
    "category": "sets-based",
    ...
  }
}
```

### Get Games by Category
**Endpoint:** `GET /games/category/:category`

**Parameters:**
- `category` (path parameter): One of `sets-based`, `goals-based`, `points-based`, `turns-based`, `time-based`

**Response:**
```json
{
  "success": true,
  "data": [
    { /* game object */ }
  ]
}
```

### Get Default Templates
**Endpoint:** `GET /games/default-templates`

**Description:** Get pre-configured game templates

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "name": "Badminton",
      "category": "sets-based",
      "description": "Badminton match with sets and points",
      ...
    }
  ]
}
```

### Create Game Template
**Endpoint:** `POST /games`

**Request Body:**
```json
{
  "name": "Cricket",
  "category": "runs-based",
  "description": "Cricket match",
  "scoringSystem": {
    "type": "single-score",
    "maxScore": null,
    "winCondition": "highest-score"
  },
  "players": {
    "min": 22,
    "max": 22
  },
  "rules": ["Team scoring", "1 point per run"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "new_id",
    "name": "Cricket",
    ...
  }
}
```

### Update Game Template
**Endpoint:** `PUT /games/:id`

**Parameters:**
- `id` (path parameter): Game template ID

**Request Body:** (partial update allowed)
```json
{
  "description": "Updated description",
  "rules": ["New rule 1", "New rule 2"]
}
```

**Response:**
```json
{
  "success": true,
  "data": { /* updated game */ }
}
```

### Delete Game Template
**Endpoint:** `DELETE /games/:id`

**Parameters:**
- `id` (path parameter): Game template ID

**Response:**
```json
{
  "success": true,
  "message": "Game deleted successfully"
}
```

---

## Players

### Get All Players
**Endpoint:** `GET /players`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "1234567890",
      "stats": {
        "totalMatches": 10,
        "wins": 7,
        "losses": 3,
        "draws": 0,
        "winPercentage": "70"
      },
      "gameStats": [],
      "tournaments": []
    }
  ]
}
```

### Get Player by ID
**Endpoint:** `GET /players/:id`

**Parameters:**
- `id` (path parameter): Player ID

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "John Doe",
    ...
  }
}
```

### Get Player Stats
**Endpoint:** `GET /players/:id/stats`

**Parameters:**
- `id` (path parameter): Player ID

**Response:**
```json
{
  "success": true,
  "data": {
    "totalMatches": 10,
    "wins": 7,
    "losses": 3,
    "draws": 0,
    "winPercentage": "70"
  }
}
```

### Get Leaderboard
**Endpoint:** `GET /players/leaderboard`

**Query Parameters:**
- `limit` (optional, default: 10): Number of players to return
- `gameId` (optional): Filter by specific game

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "John Doe",
      "stats": {
        "wins": 20,
        "winPercentage": "75"
      }
    }
  ]
}
```

### Register New Player
**Endpoint:** `POST /players`

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "0987654321",
  "avatar": "https://example.com/avatar.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "new_player_id",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "stats": {
      "totalMatches": 0,
      "wins": 0,
      "losses": 0,
      "draws": 0,
      "winPercentage": 0
    }
  }
}
```

### Update Player
**Endpoint:** `PUT /players/:id`

**Parameters:**
- `id` (path parameter): Player ID

**Request Body:**
```json
{
  "phone": "1111111111",
  "avatar": "https://example.com/new-avatar.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "data": { /* updated player */ }
}
```

### Update Player Stats
**Endpoint:** `PUT /players/:id/stats`

**Parameters:**
- `id` (path parameter): Player ID

**Request Body:**
```json
{
  "won": true,
  "gameId": "507f1f77bcf86cd799439011",
  "gameName": "Badminton"
}
```

**Response:**
```json
{
  "success": true,
  "data": { /* updated player with new stats */ }
}
```

### Delete Player
**Endpoint:** `DELETE /players/:id`

**Parameters:**
- `id` (path parameter): Player ID

**Response:**
```json
{
  "success": true,
  "message": "Player deleted successfully"
}
```

---

## Tournaments

### Get All Tournaments
**Endpoint:** `GET /tournaments`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "name": "City Badminton Championship",
      "gameId": "507f1f77bcf86cd799439011",
      "gameName": "Badminton",
      "status": "upcoming",
      "startDate": "2024-04-01T10:00:00.000Z",
      "location": "City Sports Complex",
      "maxPlayers": 32,
      "registeredPlayers": [],
      "format": "single-elimination",
      "standings": []
    }
  ]
}
```

### Get Tournament by ID
**Endpoint:** `GET /tournaments/:id`

**Parameters:**
- `id` (path parameter): Tournament ID

**Response:**
```json
{
  "success": true,
  "data": { /* tournament object */ }
}
```

### Get Tournament Standings
**Endpoint:** `GET /tournaments/:id/standings`

**Parameters:**
- `id` (path parameter): Tournament ID

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "position": 1,
      "playerId": "507f1f77bcf86cd799439012",
      "playerName": "John Doe",
      "wins": 4,
      "losses": 0,
      "pointsFor": 80,
      "pointsAgainst": 20
    }
  ]
}
```

### Create Tournament
**Endpoint:** `POST /tournaments`

**Request Body:**
```json
{
  "name": "City Badminton Championship",
  "gameId": "507f1f77bcf86cd799439011",
  "gameName": "Badminton",
  "startDate": "2024-04-01T10:00:00.000Z",
  "location": "City Sports Complex",
  "maxPlayers": 32,
  "format": "single-elimination",
  "description": "Annual city championship"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "new_tournament_id",
    ...
  }
}
```

### Register Player to Tournament
**Endpoint:** `POST /tournaments/:id/register-player`

**Parameters:**
- `id` (path parameter): Tournament ID

**Request Body:**
```json
{
  "playerId": "507f1f77bcf86cd799439012",
  "playerName": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "data": { /* updated tournament with new player */ }
}
```

### Remove Player from Tournament
**Endpoint:** `POST /tournaments/:id/remove-player`

**Parameters:**
- `id` (path parameter): Tournament ID

**Request Body:**
```json
{
  "playerId": "507f1f77bcf86cd799439012"
}
```

**Response:**
```json
{
  "success": true,
  "data": { /* updated tournament without player */ }
}
```

### Update Tournament
**Endpoint:** `PUT /tournaments/:id`

**Parameters:**
- `id` (path parameter): Tournament ID

**Request Body:**
```json
{
  "status": "ongoing",
  "location": "New Venue"
}
```

**Response:**
```json
{
  "success": true,
  "data": { /* updated tournament */ }
}
```

### Update Standings
**Endpoint:** `PUT /tournaments/:id/standings`

**Parameters:**
- `id` (path parameter): Tournament ID

**Request Body:**
```json
{
  "standings": [
    {
      "position": 1,
      "playerId": "507f1f77bcf86cd799439012",
      "playerName": "John Doe",
      "wins": 4,
      "losses": 0,
      "pointsFor": 80,
      "pointsAgainst": 20
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": { /* updated tournament */ }
}
```

### Delete Tournament
**Endpoint:** `DELETE /tournaments/:id`

**Parameters:**
- `id` (path parameter): Tournament ID

**Response:**
```json
{
  "success": true,
  "message": "Tournament deleted successfully"
}
```

---

## Matches

### Get All Matches
**Endpoint:** `GET /matches`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "tournamentId": "507f1f77bcf86cd799439013",
      "gameId": "507f1f77bcf86cd799439011",
      "gameName": "Badminton",
      "matchNumber": 1,
      "round": 1,
      "status": "scheduled",
      "scheduledAt": "2024-04-01T10:00:00.000Z",
      "court": "Court 1",
      "players": [
        {
          "playerId": "507f1f77bcf86cd799439012",
          "playerName": "John Doe",
          "finalScore": 0,
          "isWinner": false,
          "setScores": []
        }
      ]
    }
  ]
}
```

### Get Match by ID
**Endpoint:** `GET /matches/:id`

**Parameters:**
- `id` (path parameter): Match ID

**Response:**
```json
{
  "success": true,
  "data": { /* match object */ }
}
```

### Get Matches by Tournament
**Endpoint:** `GET /matches/tournament/:tournamentId`

**Parameters:**
- `tournamentId` (path parameter): Tournament ID

**Response:**
```json
{
  "success": true,
  "data": [
    { /* match objects */ }
  ]
}
```

### Get Upcoming Matches
**Endpoint:** `GET /matches/upcoming`

**Response:**
```json
{
  "success": true,
  "data": [
    { /* upcoming match objects */ }
  ]
}
```

### Get Today's Matches
**Endpoint:** `GET /matches/today`

**Response:**
```json
{
  "success": true,
  "data": [
    { /* today's match objects */ }
  ]
}
```

### Create Match
**Endpoint:** `POST /matches`

**Request Body:**
```json
{
  "tournamentId": "507f1f77bcf86cd799439013",
  "gameId": "507f1f77bcf86cd799439011",
  "gameName": "Badminton",
  "players": [
    {
      "playerId": "507f1f77bcf86cd799439012",
      "playerName": "John Doe"
    },
    {
      "playerId": "507f1f77bcf86cd799439015",
      "playerName": "Jane Smith"
    }
  ],
  "scheduledAt": "2024-04-01T10:00:00.000Z",
  "court": "Court 1"
}
```

**Response:**
```json
{
  "success": true,
  "data": { /* created match */ }
}
```

### Start Match
**Endpoint:** `PUT /matches/:id/start`

**Parameters:**
- `id` (path parameter): Match ID

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439014",
    "status": "ongoing",
    "startedAt": "2024-04-01T10:05:00.000Z"
  }
}
```

### End Match
**Endpoint:** `PUT /matches/:id/end`

**Parameters:**
- `id` (path parameter): Match ID

**Request Body:**
```json
{
  "winners": ["507f1f77bcf86cd799439012"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439014",
    "status": "completed",
    "endedAt": "2024-04-01T10:30:00.000Z"
  }
}
```

### Update Match
**Endpoint:** `PUT /matches/:id`

**Parameters:**
- `id` (path parameter): Match ID

**Request Body:**
```json
{
  "court": "Court 2",
  "umpire": "John Smith"
}
```

**Response:**
```json
{
  "success": true,
  "data": { /* updated match */ }
}
```

### Schedule Matches for Tournament
**Endpoint:** `POST /matches/tournament/:tournamentId/schedule`

**Parameters:**
- `tournamentId` (path parameter): Tournament ID

**Request Body:**
```json
{
  "pairingSchedule": [
    {
      "round": 1,
      "matchNumber": 1,
      "players": [
        { "playerId": "id1", "playerName": "Player 1" },
        { "playerId": "id2", "playerName": "Player 2" }
      ],
      "scheduledAt": "2024-04-01T10:00:00.000Z"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": [
    { /* created match objects */ }
  ]
}
```

---

## Scores

### Get Match Scores
**Endpoint:** `GET /scores/match/:matchId`

**Parameters:**
- `matchId` (path parameter): Match ID

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439016",
      "matchId": "507f1f77bcf86cd799439014",
      "playerId": "507f1f77bcf86cd799439012",
      "playerName": "John Doe",
      "currentSet": 2,
      "currentScore": 15,
      "totalScore": 21,
      "setScores": [
        {
          "setNumber": 1,
          "score": 21,
          "won": true
        }
      ]
    }
  ]
}
```

### Get Player Match Score
**Endpoint:** `GET /scores/match/:matchId/player/:playerId`

**Parameters:**
- `matchId` (path parameter): Match ID
- `playerId` (path parameter): Player ID

**Response:**
```json
{
  "success": true,
  "data": { /* score object */ }
}
```

### Get Player Game Stats
**Endpoint:** `GET /scores/player/:playerId/game/:gameId`

**Parameters:**
- `playerId` (path parameter): Player ID
- `gameId` (path parameter): Game ID

**Response:**
```json
{
  "success": true,
  "data": {
    "gameId": "507f1f77bcf86cd799439011",
    "gameName": "Badminton",
    "matches": 10,
    "wins": 7,
    "losses": 3,
    "avgScore": 19.5
  }
}
```

### Get Tournament Leaderboard
**Endpoint:** `GET /scores/tournament/:tournamentId/leaderboard`

**Parameters:**
- `tournamentId` (path parameter): Tournament ID

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "playerName": "John Doe",
      "totalScore": 150,
      "matches": 5,
      "wins": 5
    }
  ]
}
```

### Get Score History
**Endpoint:** `GET /scores/history/:playerId`

**Parameters:**
- `playerId` (path parameter): Player ID

**Query Parameters:**
- `gameId` (optional): Filter by game
- `limit` (optional, default: 10): Number of records

**Response:**
```json
{
  "success": true,
  "data": [
    { /* score objects */ }
  ]
}
```

### Update Score
**Endpoint:** `POST /scores`

**Request Body:**
```json
{
  "matchId": "507f1f77bcf86cd799439014",
  "playerId": "507f1f77bcf86cd799439012",
  "playerName": "John Doe",
  "gameId": "507f1f77bcf86cd799439011",
  "currentSet": 1,
  "currentScore": 15,
  "totalScore": 15
}
```

**Response:**
```json
{
  "success": true,
  "data": { /* updated score */ }
}
```

### Initialize Score Sheet
**Endpoint:** `POST /scores/initialize`

**Request Body:**
```json
{
  "matchId": "507f1f77bcf86cd799439014",
  "gameId": "507f1f77bcf86cd799439011",
  "players": [
    {
      "playerId": "507f1f77bcf86cd799439012",
      "playerName": "John Doe"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": [
    { /* initialized score objects */ }
  ]
}
```

### Add Set Score
**Endpoint:** `POST /scores/match/:matchId/player/:playerId/set`

**Parameters:**
- `matchId` (path parameter): Match ID
- `playerId` (path parameter): Player ID

**Request Body:**
```json
{
  "setNumber": 1,
  "score": 21,
  "won": true
}
```

**Response:**
```json
{
  "success": true,
  "data": { /* updated score */ }
}
```

### Finalize Match Score
**Endpoint:** `POST /scores/match/:matchId/finalize`

**Parameters:**
- `matchId` (path parameter): Match ID

**Request Body:**
```json
{
  "winners": ["507f1f77bcf86cd799439012"]
}
```

**Response:**
```json
{
  "success": true,
  "data": [
    { /* finalized score objects */ }
  ]
}
```

---

## Error Responses

All endpoints return error responses in the following format:

```json
{
  "success": false,
  "message": "Error description"
}
```

Common HTTP Status Codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `404`: Not Found
- `500`: Server Error

---

## Rate Limiting
Currently, no rate limiting is implemented. In production, consider adding rate limiting middleware.

## Authentication
JWT authentication structure is in place. Future versions will require authentication tokens.

---

**Last Updated:** March 27, 2024
