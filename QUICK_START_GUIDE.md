# 🚀 EchoMind - Quick Start Guide

**Last Updated:** January 24, 2026  
**Time to Run:** 5 minutes  
**Difficulty:** Easy

---

## 📋 Prerequisites Checklist

Before starting, make sure you have:

- ✅ Python 3.8+ installed
- ✅ Node.js 16+ installed
- ✅ Virtual environment activated (`.venv`)
- ✅ All dependencies installed

---

## ⚡ Quick Start (2 Steps)

### Step 1: Start Backend (Django) 🐍

```bash
# Open Terminal 1
cd "c:\Users\Raazia Yasin\Documents\EchoMind"

# Activate virtual environment
.venv\Scripts\activate

# Start Django server
python manage.py runserver
```

**Expected Output:**
```
Starting development server at http://127.0.0.1:8000/
Quit the server with CTRL-BREAK.
```

✅ **Backend is running at:** http://localhost:8000

---

### Step 2: Start Frontend (React) ⚛️

```bash
# Open Terminal 2 (new terminal)
cd "c:\Users\Raazia Yasin\Documents\EchoMind\frontend"

# Start Vite dev server
npm run dev
```

**Expected Output:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

✅ **Frontend is running at:** http://localhost:5173

---

## 🌐 Open in Browser

1. Open your browser
2. Go to: **http://localhost:5173**
3. You should see the EchoMind homepage! 🎉

---

## 🧪 Quick Feature Test

### Test 1: Homepage ✅
1. Visit: http://localhost:5173
2. You should see:
   - Welcome message
   - Streak counter (showing 0 or current streak)
   - Feature cards (Chat, Tree, Parent Portal)
   - Stats section (concepts, mastered, badges, tree health)
   - Daily challenge card
   - Achievements section

### Test 2: Knowledge Tree ✅
1. Click on "Knowledge Tree" card
2. You should see:
   - Tree stats (state, health score, total concepts)
   - SVG tree visualization
   - Empty state message (if no concepts yet)
   - "Start Learning" button

### Test 3: Chat ✅
1. Click on "Chat with AI" card
2. Type a message: "What is photosynthesis?"
3. You should get:
   - Socratic response (questions, not direct answers)
   - Message history
   - Smooth animations

### Test 4: API Health Check ✅
1. Visit: http://localhost:8000/api/health/
2. You should see:
   ```json
   {
     "status": "healthy",
     "timestamp": "2026-01-24T..."
   }
   ```

---

## 🔧 Troubleshooting

### Problem: Backend won't start

**Error:** `Port 8000 is already in use`

**Solution:**
```bash
# Find and kill the process using port 8000
netstat -ano | findstr :8000
taskkill /PID <PID_NUMBER> /F

# Then restart
python manage.py runserver
```

---

### Problem: Frontend won't start

**Error:** `Port 5173 is already in use`

**Solution:**
```bash
# Kill the process
netstat -ano | findstr :5173
taskkill /PID <PID_NUMBER> /F

# Then restart
npm run dev
```

---

### Problem: CORS errors in browser console

**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:**
1. Check `.env` file in project root:
   ```env
   CORS_ALLOWED_ORIGINS=http://localhost:5173
   ```
2. Restart Django server

---

### Problem: API calls failing

**Error:** `Network Error` or `404 Not Found`

**Solution:**
1. Check frontend `.env`:
   ```env
   VITE_API_URL=http://localhost:8000/api
   ```
2. Verify backend is running at http://localhost:8000
3. Test API directly: http://localhost:8000/api/health/

---

### Problem: Database errors

**Error:** `no such table: gamification_knowledgetree`

**Solution:**
```bash
# Run migrations
python manage.py migrate

# Initialize gamification data
python manage.py init_gamification
```

---

### Problem: Missing dependencies

**Error:** `ModuleNotFoundError` or `Cannot find module`

**Solution:**

**Backend:**
```bash
pip install -r requirements.txt
```

**Frontend:**
```bash
cd frontend
npm install
```

---

## 📊 Verify Everything is Working

### Backend Health Check
```bash
# Test API endpoint
curl http://localhost:8000/api/health/
```

**Expected:** `{"status":"healthy",...}`

### Frontend Health Check
1. Open browser console (F12)
2. Go to http://localhost:5173
3. Check for errors (should be none)
4. Network tab should show successful API calls

---

## 🎯 First-Time Setup (Only Once)

If this is your first time running the project:

```bash
# 1. Navigate to project
cd "c:\Users\Raazia Yasin\Documents\EchoMind"

# 2. Activate virtual environment
.venv\Scripts\activate

# 3. Install backend dependencies
pip install -r requirements.txt

# 4. Run migrations
python manage.py migrate

# 5. Initialize gamification data
python manage.py init_gamification

# 6. Create superuser (optional, for admin panel)
python manage.py createsuperuser

# 7. Install frontend dependencies
cd frontend
npm install

# 8. Done! Now follow Quick Start steps above
```

---

## 🧪 Run Tests

### Backend Tests
```bash
# Run all tests
pytest

# Run specific test file
pytest tests/test_phase4.py
pytest tests/test_safety.py

# Run with verbose output
pytest -v

# Run with coverage
pytest --cov
```

**Expected:** `41 passed in ~77s`

### Frontend Tests (if configured)
```bash
cd frontend
npm test
```

---

## 🎨 Development Tips

### Hot Reload
Both servers support hot reload:
- **Backend:** Django auto-reloads on file changes
- **Frontend:** Vite auto-reloads on file changes

Just save your files and see changes instantly!

### Browser DevTools
- **F12** - Open DevTools
- **Network Tab** - See API calls
- **Console Tab** - See logs and errors
- **React DevTools** - Inspect components (install extension)

### API Testing
Use these tools to test API endpoints:
- **Browser:** http://localhost:8000/api/health/
- **Postman:** Import endpoints
- **curl:** Command-line testing

---

## 📁 Important Files

### Backend
- `manage.py` - Django management
- `.env` - Environment variables
- `db.sqlite3` - Database
- `EchoMind/settings.py` - Django settings

### Frontend
- `package.json` - Dependencies
- `.env` - Environment variables
- `vite.config.js` - Vite configuration
- `src/services/api.js` - API client

---

## 🔗 Important URLs

### Development
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8000/api
- **Django Admin:** http://localhost:8000/admin
- **API Health:** http://localhost:8000/api/health/

### API Endpoints
- **Chat:** POST http://localhost:8000/api/chat/
- **Tree State:** GET http://localhost:8000/api/gamification/tree/state/
- **Streak:** GET http://localhost:8000/api/gamification/streak/
- **Badges:** GET http://localhost:8000/api/gamification/achievements/badges/
- **Analytics:** GET http://localhost:8000/api/gamification/analytics/
- **Daily Challenge:** GET http://localhost:8000/api/gamification/challenges/daily/

---

## 🎯 Next Steps After Running

1. ✅ **Test all features** - Click through the app
2. ✅ **Create test data** - Chat with AI to create concepts
3. ✅ **Check tree growth** - See nodes appear in tree
4. ✅ **Earn badges** - Unlock achievements
5. ✅ **Build streak** - Login daily to increase streak
6. ✅ **Review analytics** - Check your progress

---

## 💡 Pro Tips

### Tip 1: Keep Both Terminals Open
Run backend and frontend in separate terminals so you can see logs from both.

### Tip 2: Check Logs
- **Backend logs:** Terminal 1 (Django)
- **Frontend logs:** Browser console (F12)
- **API calls:** Browser Network tab

### Tip 3: Use Browser DevTools
- Inspect API responses
- Debug React components
- Check for errors

### Tip 4: Test API Directly
Before testing in frontend, verify API works:
```bash
curl http://localhost:8000/api/health/
```

### Tip 5: Clear Cache
If you see old data:
- **Browser:** Ctrl + Shift + R (hard refresh)
- **Backend:** Restart Django server
- **Frontend:** Restart Vite server

---

## 🆘 Getting Help

### Check Documentation
1. `PROJECT_OVERVIEW.md` - Project structure
2. `COMPLETE_STATUS_REPORT.md` - Feature status
3. `CONNECTION_MAP.md` - API connections
4. `Eco-Mind AI - Complete Project Plan.md` - Full plan

### Common Issues
- **CORS errors:** Check CORS settings in Django
- **404 errors:** Verify API endpoints
- **Database errors:** Run migrations
- **Module errors:** Install dependencies

---

## ✅ Success Checklist

After following this guide, you should have:

- ✅ Backend running on port 8000
- ✅ Frontend running on port 5173
- ✅ Homepage loading successfully
- ✅ API calls working (check Network tab)
- ✅ No errors in browser console
- ✅ All features accessible

---

## 🎉 You're Ready!

Your EchoMind project is now running!

**Enjoy exploring your AI-powered Socratic learning platform!** 🚀

---

**Need Help?** Check the documentation files or review the error messages carefully.

**Last Updated:** January 24, 2026
