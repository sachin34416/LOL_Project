# Tournament Manager Application

A comprehensive web application for managing tournaments, players, matches, and live scoring across multiple games and sports with custom game templates.

## Overview

Tournament Manager is a full-stack application designed for tournament organizers, sports clubs, and event managers to manage all aspects of tournament operations in one place. The application supports a wide variety of sports and games by grouping them into scoring pattern categories.

## Key Features

### 1. **Game Templates with Custom Scoring Patterns**
   - Grouping games by similar scoring patterns:
     - **Sets-based**: Badminton, Volleyball, Tennis
     - **Goals-based**: Football, Hockey, Rugby
     - **Points-based**: Carrom, Chess
     - **Turns-based**: Pool, Foosball, Warhammer
     - **Time-based**: Racing, Time-attack events
   - Create custom game templates with specific rules and parameters
   - Define scoring systems, number of players, and win conditions

### 2. **Player Management**
   - Register and manage tournament players
   - Track player statistics and historical performance
   - Maintain player profiles with contact information
   - View individual player leaderboards per game

### 3. **Tournament Management**
   - Create tournaments with different formats (Single Elimination, Double Elimination, Round-robin, Group Stage)
   - Register players to tournaments
   - Track tournament status (upcoming, ongoing, completed)
   - Manage tournament standings and rankings

### 4. **Match Scheduling**
   - Schedule matches with specific dates, times, and venues
   - Assign players to matches
   - Track match status (scheduled, ongoing, completed)
   - View upcoming and today's matches

### 5. **Live Scoring**
   - Real-time score updates during matches
   - Support for complex scoring systems based on game templates
   - Automatic winner determination
   - Score board display for each player

### 6. **Player Statistics & History**
   - Comprehensive player statistics dashboard
   - Match history and score tracking
   - Game-wise performance metrics
   - Tournament participation records
   - Win-loss records and win percentages
   - Leaderboards and rankings

## Architecture

### Frontend (React)
- **Framework**: React 18
- **Routing**: React Router v6
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **Icons**: React Icons
- **Charts**: Recharts

### Backend (Node.js)
- **Framework**: Express.js
- **Database**: MongoDB
- **ODM**: Mongoose
- **API**: RESTful
- **Authentication Ready**: JWT structure in place

## Project Structure

```
LOL_Project/
├── frontend/                 # React frontend application
│   ├── public/
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API integration
│   │   ├── store/           # State management
│   │   ├── styles/          # CSS files
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   ├── .env
│   └── README.md
│
└── backend/                  # Node.js backend API
    ├── models/              # MongoDB schemas
    ├── controllers/         # Business logic
    ├── routes/              # API endpoints
    ├── server.js
    ├── package.json
    ├── .env
    └── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/tournament_manager
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:3000
```

4. Start the server:
```bash
npm start
```

Server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with:
```
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm start
```

Application will open at `http://localhost:3000`

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Main Endpoints

#### Games
- `GET /games` - Get all game templates
- `POST /games` - Create new game template
- `GET /games/:id` - Get specific game
- `PUT /games/:id` - Update game
- `DELETE /games/:id` - Delete game

#### Players
- `GET /players` - Get all players
- `POST /players` - Register new player
- `GET /players/:id` - Get player details
- `PUT /players/:id` - Update player
- `DELETE /players/:id` - Delete player
- `GET /players/leaderboard` - Get leaderboard

#### Tournaments
- `GET /tournaments` - Get all tournaments
- `POST /tournaments` - Create tournament
- `GET /tournaments/:id` - Get tournament details
- `POST /tournaments/:id/register-player` - Register player
- `DELETE /tournaments/:id` - Delete tournament

#### Matches
- `GET /matches` - Get all matches
- `POST /matches` - Schedule match
- `PUT /matches/:id/start` - Start match
- `PUT /matches/:id/end` - End match
- `GET /matches/upcoming` - Get upcoming matches

#### Scores
- `POST /scores` - Update score
- `GET /scores/match/:matchId` - Get match scores
- `POST /scores/match/:matchId/finalize` - Finalize match

See individual README files in `frontend/` and `backend/` for detailed documentation.

## Game Template Categories

### 1. Sets-based Games
**Examples**: Badminton, Volleyball, Tennis
- Multiple sets per match
- Points per set system
- Best of 3/5 format

**Configuration**:
- `setsPerMatch`: 3 or 5
- `pointsPerSet`: 21, 25, etc.
- `deucesAllowed`: true/false

### 2. Goals-based Games
**Examples**: Football, Hockey, Rugby
- Direct goal counting
- No sets or rounds
- Highest score wins

**Configuration**:
- `maxScore`: Unlimited
- `winCondition`: highest-score

### 3. Points-based Games
**Examples**: Carrom, Darts
- Accumulated points
- Fixed maximum points to win
- All players score

**Configuration**:
- `maxScore`: 29 (Carrom), 501 (Darts)
- `winCondition`: first-to-value

### 4. Turns-based Games
**Examples**: Pool, Foosball, Chess
- Turn-based play
- Objective-based wins
- May include rounds

**Configuration**:
- Custom turn tracking
- Specific win conditions

### 5. Time-based Games
**Examples**: Racing, Chess (with time), Boxing
- Time-based competition
- Timer management
- Score after time limit

**Configuration**:
- Duration/time limit
- Scoring during time

## Usage Examples

### Creating a Tournament
1. Go to "Tournaments" section
2. Click "Create Tournament"
3. Select game template (e.g., Badminton)
4. Set tournament details
5. Register players
6. Schedule matches

### Live Scoring
1. Go to "Live Scoring"
2. Select a match
3. Start the match
4. Update scores in real-time
5. End match when complete

### Viewing Statistics
1. Go to "Players"
2. Click on a player
3. View game-wise stats
4. See tournament history
5. Check score trends

## Technologies at a Glance

| Layer | Technology |
|-------|-----------|
| Frontend | React, Tailwind CSS, Axios |
| Backend | Express.js, Node.js |
| Database | MongoDB, Mongoose |
| State | Zustand |
| HTTP | REST API |

## Future Enhancements

- [ ] Real-time updates with WebSocket
- [ ] Team management and team tournaments
- [ ] Advanced analytics and statistics
- [ ] Export to CSV/PDF
- [ ] Mobile app (React Native)
- [ ] Integration with live streaming
- [ ] Video highlight integration
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Multi-language support
- [ ] Dark mode
- [ ] AI-based match prediction
- [ ] Bracket visualization
- [ ] Draw management for draws
- [ ] Seeding system

## Testing

### Test the Backend Health
```bash
curl http://localhost:5000/api/health
```

### Load Default Game Templates
```bash
curl http://localhost:5000/api/games/default-templates
```

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`
- Verify MongoDB is on port 27017

### CORS Error
- Backend URL in frontend `.env` should match backend server
- Check CORS configuration in `server.js`

### Port Already in Use
```bash
# Kill process on port 5000 (backend)
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9
```

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## License

MIT License - see LICENSE file for details

## Support

For issues or questions:
1. Check documentation in `frontend/README.md` and `backend/README.md`
2. Review API endpoints documentation
3. Check browser console for errors
4. Verify backend is running and accessible

## Roadmap

**Phase 1** (Current): Core tournament management
- ✅ Game templates
- ✅ Player management
- ✅ Tournament creation
- ✅ Match scheduling
- ✅ Live scoring

**Phase 2**: Advanced features
- [ ] WebSocket real-time updates
- [ ] Analytics dashboard
- [ ] Report generation
- [ ] Mobile app

**Phase 3**: Enterprise features
- [ ] Sponsorship management
- [ ] Streaming integration
- [ ] Multi-org support
- [ ] Advanced permissions

---

**Happy Tournament Managing!** 🎮⚽🏐
#   L O L _ P r o j e c t  
 