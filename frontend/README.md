# Tournament Manager - Frontend

React frontend for the Tournament Management System

## Features

- Responsive dashboard with tournament overview
- Player registration and management
- Game template creation with custom scoring patterns
- Tournament creation and player registration
- Match scheduling interface
- Real-time live scoring
- Player statistics and leaderboards
- Comprehensive player history

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/        # Reusable components
│   │   ├── Navbar.js
│   │   └── Sidebar.js
│   ├── pages/            # Page components
│   │   ├── Dashboard.js
│   │   ├── PlayerManagement.js
│   │   ├── GameTemplates.js
│   │   ├── TournamentManagement.js
│   │   ├── MatchScheduling.js
│   │   ├── LiveScoring.js
│   │   └── PlayerStats.js
│   ├── services/         # API calls
│   │   └── api.js
│   ├── store/           # State management (Zustand)
│   │   ├── playerStore.js
│   │   ├── gameStore.js
│   │   ├── tournamentStore.js
│   │   └── matchStore.js
│   ├── styles/          # CSS files
│   │   └── App.css
│   ├── App.js
│   ├── index.js
│   └── index.css
├── .env
├── .gitignore
└── package.json
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```
REACT_APP_API_URL=http://localhost:5000/api
```

3. Start the development server:
```bash
npm start
```

The application will open at `http://localhost:3000`

## Available Scripts

### `npm start`
Runs the app in development mode.

### `npm run build`
Builds the app for production to the `build` folder.

### `npm test`
Runs the test suite.

## Pages Overview

### Dashboard
- Overview of tournaments, players, and matches
- Top players leaderboard
- Today's match schedule

### Player Management
- Register new players
- Edit player information
- View player statistics
- Delete players
- Search and filter

### Game Templates
- View all game templates
- Create custom game templates
- Categorize games by scoring patterns:
  - Sets-based (Badminton, Volleyball)
  - Goals-based (Football, Hockey)
  - Points-based (Carrom)
  - Turns-based (Pool, Foosball)
  - Time-based (Chess, Racing)
- Edit and delete templates

### Tournament Management
- Create tournaments
- Register players to tournaments
- View tournament standings
- Track tournament status
- Support multiple formats (single-elimination, double-elimination, round-robin, group-stage)

### Match Scheduling
- Schedule matches for tournaments
- Assign players to matches
- Set match venue/court
- Track match status
- Start matches

### Live Scoring
- Real-time score updates
- Player-wise scoring interface
- Start/end match controls
- Automatic winner determination
- Score board display

### Player Statistics
- View detailed player stats
- Game-wise statistics
- Tournament history
- Score history
- Win percentage and trends

## State Management

Uses **Zustand** for lightweight state management:
- `playerStore` - Player data and management
- `gameStore` - Game templates
- `tournamentStore` - Tournament data
- `matchStore` - Match information

## API Integration

Axios-based API service with pre-configured endpoints for:
- Games management
- Players management
- Tournaments management
- Matches management
- Scores management

## Styling

- **Tailwind CSS** for utility-first styling
- Responsive design for mobile and desktop
- Consistent color scheme (Indigo primary)
- Custom animations and transitions

## Technologies Used

- **React 18** - UI library
- **React Router** - Navigation
- **Axios** - HTTP client
- **Zustand** - State management
- **Tailwind CSS** - Styling
- **React Icons** - Icon library
- **React Hot Toast** - Notifications
- **Recharts** - Charts and graphs
- **Date-fns** - Date utilities

## Key Features

1. **Responsive Design** - Works on desktop, tablet, and mobile
2. **Real-time Updates** - Live score tracking
3. **Data Persistence** - All data synced with backend
4. **Error Handling** - Toast notifications for user feedback
5. **Search & Filter** - Quick player and tournament lookup
6. **Analytics** - Player statistics and leaderboards

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Environment Variables

```
REACT_APP_API_URL=http://localhost:5000/api
```

## Future Enhancements

- Dark mode
- Export to CSV/PDF
- Chat/messaging
- Admin panel
- Email notifications
- WebSocket real-time updates
- Mobile app (React Native)
- Multi-language support
- Advanced analytics and visualizations

## Development Tips

- Use React DevTools for component debugging
- Use Redux DevTools for Zustand store debugging
- Enable Tailwind CSS IntelliSense in VS Code

## License

MIT
