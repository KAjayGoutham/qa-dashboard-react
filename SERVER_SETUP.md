# QA Dashboard - Server Setup Guide

## 🎯 Overview

The QA Dashboard now uses a **Node.js backend server** with **JSON file persistence** instead of browser localStorage. This ensures your flow data persists even when browser cache is cleared.

## 📁 Architecture

```
qa-dashboard-react/
├── server/                    # Backend server
│   ├── server.js             # Express server with API endpoints
│   ├── package.json          # Server dependencies
│   ├── data/                 # Auto-created directory
│   │   └── flows.json       # Persistent data storage (auto-created)
│   └── .gitignore
├── src/                      # React frontend
│   ├── services/
│   │   └── api.js           # API client for backend communication
│   └── hooks/
│       └── useServerStorage.js  # Custom hook for server storage
```

## 🚀 Setup Instructions

### 1. Install Server Dependencies

Open a terminal in the `server` directory:

```bash
cd server
npm install
```

This will install:
- `express` - Web server framework
- `cors` - Enable cross-origin requests from React app

### 2. Start the Backend Server

In the `server` directory:

```bash
npm start
```

You should see:
```
🚀 QA Dashboard Server running on http://localhost:3001
📁 Data file: C:\Dashboard\Main\qa-dashboard-react\server\data\flows.json
✅ Server ready to accept requests
```

**Note:** Keep this terminal running while using the dashboard.

### 3. Start the React App

In a **new terminal**, from the root directory:

```bash
npm run dev
```

The React app will run on `http://localhost:5173`

## 📊 How It Works

### Data Flow

1. **On App Load:**
   - React app calls `GET /api/data`
   - Server reads `flows.json` and returns data
   - If file doesn't exist, creates it with initial structure

2. **When Data Changes:**
   - User adds/updates/deletes a flow
   - React app calls `POST /api/data` or `POST /api/modules`
   - Server writes to `flows.json`
   - Data persists on disk

3. **Fallback:**
   - If server is unavailable, app falls back to localStorage
   - Shows error notification but continues working

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Check server status |
| `/api/data` | GET | Get all data (modules, environments, settings) |
| `/api/data` | POST | Save all data |
| `/api/modules` | GET | Get modules only |
| `/api/modules` | POST | Save modules only |

### Data Structure (flows.json)

```json
{
  "modules": [
    {
      "id": "1234567890",
      "name": "Login Flow",
      "status": "Passed",
      "environment": "QA",
      "channels": {
        "voice": "Passed",
        "sms": "Passed",
        "chat": "Passed",
        "email": "Passed"
      },
      "results": {
        "voice": "https://logs.example.com/voice",
        "sms": "",
        "chat": "",
        "email": ""
      },
      "reason": "",
      "failures": 0,
      "lastUpdated": "2026-03-12T18:08:00.000Z",
      "commentHistory": []
    }
  ],
  "environments": {
    "QA": "QA",
    "SAT": "SAT",
    "Prod": "Prod"
  },
  "releaseNames": {
    "QA": "Release 1.0",
    "SAT": "Release 1.0",
    "Prod": "Release 1.0"
  },
  "currentEnvironment": "QA",
  "lastUpdated": "2026-03-12T18:08:00.000Z"
}
```

## 🔧 Development

### Running Both Servers Simultaneously

**Option 1: Two Terminals**
```bash
# Terminal 1 - Backend
cd server
npm start

# Terminal 2 - Frontend
npm run dev
```

**Option 2: Use concurrently (recommended)**

Install in root directory:
```bash
npm install --save-dev concurrently
```

Add to root `package.json`:
```json
{
  "scripts": {
    "dev": "vite",
    "server": "cd server && npm start",
    "start:all": "concurrently \"npm run server\" \"npm run dev\""
  }
}
```

Then run:
```bash
npm run start:all
```

### Auto-Restart Server on Changes

Use `nodemon` for development:

```bash
cd server
npm install --save-dev nodemon
```

Update `server/package.json`:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

Run with:
```bash
npm run dev
```

## 🧪 Testing

### 1. Test Server Health

```bash
curl http://localhost:3001/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-03-12T18:08:00.000Z"
}
```

### 2. Test Data Persistence

1. Start both servers
2. Add a new flow in the dashboard
3. Check `server/data/flows.json` - your flow should be there
4. Clear browser cache (Ctrl+Shift+Delete)
5. Refresh the page
6. ✅ Your flow should still be there!

### 3. Test Fallback

1. Stop the backend server
2. Try to add a flow
3. ✅ App should show error but continue working with localStorage

## 🐛 Troubleshooting

### "Failed to fetch data" Error

**Cause:** Backend server not running

**Solution:**
```bash
cd server
npm start
```

### CORS Error

**Cause:** Frontend and backend on different ports

**Solution:** Already configured in `server.js`:
```javascript
app.use(cors());
```

### Port 3001 Already in Use

**Solution:** Change port in `server/server.js`:
```javascript
const PORT = 3002; // or any available port
```

And update `src/services/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:3002/api';
```

### Data File Not Created

**Cause:** Permission issues or directory doesn't exist

**Solution:** Server auto-creates directory. Check console for errors.

## 📦 Deployment

### Production Setup

1. **Environment Variables:**
   Create `.env` file in server directory:
   ```
   PORT=3001
   NODE_ENV=production
   DATA_DIR=./data
   ```

2. **Update server.js:**
   ```javascript
   const PORT = process.env.PORT || 3001;
   const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');
   ```

3. **Update React API URL:**
   Create `.env` in root:
   ```
   VITE_API_URL=http://your-server-domain.com/api
   ```

   Update `src/services/api.js`:
   ```javascript
   const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
   ```

### Backup Strategy

The `flows.json` file contains all your data. Back it up regularly:

```bash
# Manual backup
cp server/data/flows.json server/data/flows.backup.json

# Automated backup (add to server.js)
setInterval(() => {
  const backup = path.join(__dirname, 'data', `flows.backup.${Date.now()}.json`);
  fs.copyFile(DATA_FILE, backup);
}, 24 * 60 * 60 * 1000); // Daily backup
```

## ✅ Benefits

- ✅ **True Persistence:** Data survives browser cache clears
- ✅ **File-Based:** Easy to backup, version control, and migrate
- ✅ **Auto-Save:** Every change automatically saved to file
- ✅ **Fallback:** Works with localStorage if server unavailable
- ✅ **Extensible:** Easy to add more API endpoints
- ✅ **Portable:** JSON file can be moved between systems

## 🎉 Success Checklist

- [ ] Server dependencies installed (`cd server && npm install`)
- [ ] Backend server running (`npm start` in server directory)
- [ ] React app running (`npm run dev` in root directory)
- [ ] Can add/edit flows in dashboard
- [ ] `server/data/flows.json` file created and updating
- [ ] Data persists after browser cache clear
- [ ] Health check endpoint responds (`/api/health`)

---

**Need Help?** Check the console logs in both terminals for detailed error messages.
