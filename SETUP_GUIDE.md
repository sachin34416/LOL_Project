# Tournament Manager - Complete Setup Guide

This guide will walk you through setting up the Tournament Manager application from scratch.

## Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js** (v14 or higher)
   - Download: https://nodejs.org/
   - Verify: `node --version` and `npm --version`

2. **MongoDB** (Local or MongoDB Atlas)
   - **Option 1: Local MongoDB**
     - Download: https://www.mongodb.com/try/download/community
     - Install and run: `mongod`
   - **Option 2: MongoDB Atlas (Cloud)**
     - Create account at https://www.mongodb.com/cloud/atlas
     - Create a cluster and get connection string

3. **Git** (Optional, for version control)
   - Download: https://git-scm.com/

4. **Text Editor/IDE**
   - VS Code (recommended): https://code.visualstudio.com/
   - Or any preferred code editor

## Step 1: Initial Setup

### 1.1 Navigate to Project Directory
```bash
cd c:\Users\91739\LOL_Project
```

### 1.2 Verify Folder Structure
Ensure you have:
```
LOL_Project/
├── backend/
└── frontend/
```

## Step 2: Backend Setup

### 2.1 Install Backend Dependencies
```bash
cd backend
npm install
```

This installs all required packages:
- Express.js (web framework)
- MongoDB (database driver)
- Mongoose (ODM)
- CORS (cross-origin requests)
- dotenv (environment variables)
- UUID and others

### 2.2 Configure Environment Variables
Create/Update `.env` file in backend directory:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/tournament_manager
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
CLIENT_URL=http://localhost:3000
```

#### MongoDB URI Options:
**Local MongoDB:**
```
MONGODB_URI=mongodb://localhost:27017/tournament_manager
```

**MongoDB Atlas (Cloud):**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tournament_manager
```

### 2.3 Start MongoDB (if using local)
Open a new terminal and run:
```bash
mongod
```

This starts the MongoDB server on port 27017.

### 2.4 Start Backend Server
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

Expected output:
```
MongoDB connected
Server running on port 5000
```

### 2.5 Test Backend Health
Open browser and visit:
```
http://localhost:5000/api/health
```

Should return:
```json
{ "status": "Backend is running" }
```

## Step 3: Frontend Setup

### 3.1 Navigate to Frontend Directory
```bash
cd ../frontend
```

### 3.2 Install Frontend Dependencies
```bash
npm install
```

This installs:
- React and React DOM
- React Router (navigation)
- Axios (HTTP client)
- Zustand (state management)
- Tailwind CSS (styling)
- React Icons
- React Hot Toast
- And more...

### 3.3 Configure Environment Variables
Create/Update `.env` file in frontend directory:
```
REACT_APP_API_URL=http://localhost:5000/api
```

### 3.4 Start Frontend Development Server
```bash
npm start
```

This automatically opens http://localhost:3000 in your browser.

Expected output:
```
Compiled successfully!

You can now view tournament-manager-frontend in the browser.
  Local:            http://localhost:3000
```

## Step 4: Load Sample Data (Optional)

### 4.1 Load Default Game Templates

You can load default game templates by making a request to:
```bash
curl http://localhost:5000/api/games/default-templates
```

Or through the frontend:
1. Go to "Games" section
2. Click "Create Template"
3. The app suggests default templates

### 4.2 Create Sample Data

Using the frontend UI:
1. Register some test players (Players page)
2. Create a tournament (Tournaments page)
3. Create game templates (Games page)
4. Schedule matches (Matches page)

## Step 5: Verification

### 5.1 Check Backend
- [ ] MongoDB is running
- [ ] Backend server is running on port 5000
- [ ] Health endpoint responds
- [ ] Can access http://localhost:5000/api

### 5.2 Check Frontend
- [ ] Frontend is running on port 3000
- [ ] Dashboard loads without errors
- [ ] Can navigate between pages
- [ ] Network tab shows API calls

## Step 6: Common Issues & Solutions

### Issue: "MongoDB connection error"
**Solution:**
1. Ensure MongoDB is running: `mongod`
2. Check MONGODB_URI in .env
3. If using local: `mongodb://localhost:27017/tournament_manager`
4. If using Atlas: Update connection string with credentials

### Issue: "Port 5000 already in use"
**Solution (Windows):**
```bash
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Solution (Mac/Linux):**
```bash
lsof -i :5000
kill -9 <PID>
```

### Issue: "CORS error in frontend"
**Solution:**
1. Check backend is running on port 5000
2. Verify REACT_APP_API_URL in frontend .env
3. Restart both servers

### Issue: "npm install fails"
**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue: "Module not found" errors
**Solution:**
1. Ensure all dependencies installed: `npm install`
2. Restart the development server
3. Clear browser cache (Ctrl+Shift+Delete)

## Step 7: Development Tips

### Frontend Development
1. **Enable React Developer Tools**
   - Chrome: Install React Developer Tools extension
   - Helps debug component state and props

2. **Use Browser DevTools**
   - Network tab: See API calls
   - Console: Check for errors
   - Elements: Inspect components

3. **Hot Reload**
   - Changes save automatically
   - Browser refreshes automatically

### Backend Development
1. **API Testing**
   - Use Postman or Thunder Client
   - Test endpoints before frontend integration

2. **Database Inspection**
   - Use MongoDB Compass
   - View/edit data directly
   - Useful for debugging

3. **Server Logs**
   - Check terminal for API requests
   - Useful for debugging issues

## Step 8: Create Your First Tournament

1. **Register Players**
   - Go to Players page
   - Click "Register Player"
   - Add player details

2. **Create Game Template** (Optional)
   - Go to Games page
   - Use default templates or create custom
   - Define scoring rules

3. **Create Tournament**
   - Go to Tournaments page
   - Click "Create Tournament"
   - Select game and configure

4. **Register Players to Tournament**
   - Click "Register Players"
   - Add registered players

5. **Schedule Matches**
   - Go to Matches page
   - Click "Schedule Match"
   - Select tournament and players

6. **Start Live Scoring**
   - Go to Live Scoring
   - Select match
   - Update scores in real-time

## Step 9: Production Deployment

### Frontend Deployment (Vercel Example)
1. Build for production: `npm run build`
2. Deploy to Vercel: `vercel` or use dashboard
3. Update REACT_APP_API_URL to production backend

### Backend Deployment (Heroku Example)
1. Create Heroku account
2. Deploy: `heroku create` and `git push heroku main`
3. Set environment variables in Heroku dashboard
4. Use MongoDB Atlas for production database

## Step 10: Useful Commands

### Backend
```bash
# Start development server
npm run dev

# Start production server
npm start

# Install new package
npm install package-name
```

### Frontend
```bash
# Start development
npm start

# Build for production
npm run build

# Run tests
npm test

# Install new package
npm install package-name
```

## Troubleshooting Checklist

Before reporting issues:
- [ ] Node.js and npm are installed and updated
- [ ] MongoDB is running (if using local)
- [ ] Environment variables are set correctly
- [ ] Backend and frontend services are running
- [ ] Ports 5000 and 3000 are not in use
- [ ] Browser cache is cleared
- [ ] npm dependencies are installed fresh
- [ ] Check browser console for errors
- [ ] Check terminal for backend errors

## Next Steps

1. Explore the application features
2. Read individual README.md files in backend/ and frontend/
3. Customize game templates for your needs
4. Set up database backups
5. Plan deployment strategy

## Getting Help

1. Check README files in project
2. Review API documentation
3. Check browser console for errors
4. Check backend terminal logs
5. Verify environment variables

## Additional Resources

- **React Documentation**: https://react.dev/
- **Express.js Guide**: https://expressjs.com/
- **MongoDB Documentation**: https://docs.mongodb.com/
- **Tailwind CSS**: https://tailwindcss.com/
- **Zustand**: https://github.com/pmndrs/zustand

---

**Congratulations!** Your Tournament Manager is now set up and ready to use! 🎉
