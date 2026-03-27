# Tournament Manager - Quick Start Guide

Get the Tournament Manager up and running in 5 minutes!

## 1. Prerequisites Check
Ensure you have Node.js installed:
```bash
node --version  # Should be v14 or higher
npm --version
```

Have MongoDB running (local or Atlas connection string ready)

## 2. Backend Setup (Terminal 1)
```bash
cd backend
npm install
npm start
```

Expected output:
```
MongoDB connected
Server running on port 5000
```

## 3. Frontend Setup (Terminal 2)
```bash
cd frontend
npm install
npm start
```

Expected output:
```
Compiled successfully!
Local: http://localhost:3000
```

## 4. You're Ready!
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

## First Steps in the App

1. **Register Players**
   - Click "Players" in sidebar
   - Click "Register Player"
   - Fill in player details

2. **Create Game Templates**
   - Click "Games" in sidebar
   - Use default templates or create custom
   - Examples: Badminton, Football, Pool, etc.

3. **Create Tournament**
   - Click "Tournaments"
   - Click "Create Tournament"
   - Select game and date
   - Register players

4. **Schedule Matches**
   - Click "Matches"
   - Click "Schedule Match"
   - Select tournament and players

5. **Track Scores**
   - Click "Live Scoring"
   - Select match
   - Start match and update scores

## Common Commands

### Stop Services
```bash
# Press Ctrl+C in each terminal
```

### Fresh Install
```bash
# Remove dependencies
rm -rf node_modules package-lock.json

# Reinstall
npm install

# Run again
npm start
```

### Reset Database (⚠️ Careful!)
```bash
# Delete and recreate database
# Through MongoDB Compass or CLI:
# db.dropDatabase()
```

## Troubleshooting

**Port already in use?**
```bash
# Change PORT in backend .env
# Or kill the process using the port
```

**MongoDB connection error?**
```bash
# Verify .env MONGODB_URI
# Ensure MongoDB is running
# For local: mongod
```

**CORS error?**
```bash
# Verify REACT_APP_API_URL in frontend .env
# Should be: http://localhost:5000/api
```

## Next Steps
- Read [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed setup
- Check [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for API details
- Review [README.md](./README.md) for full documentation
- Check backend/README.md and frontend/README.md for detailed info

## Tips
- Open browser DevTools (F12) to see API calls
- Check terminal logs for backend errors
- Use Dark Mode in browser for comfortable viewing
- Test on multiple browsers for responsiveness

---

**That's it! Happy tournament managing!** 🎮
