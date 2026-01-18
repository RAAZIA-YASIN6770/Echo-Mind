# 🚀 EchoMind - Quick Start Guide

## Prerequisites
- Python 3.10+ installed
- Node.js 18+ installed
- Git installed

---

## 📦 Step 1: Backend Setup

### 1.1 Navigate to Project Directory
```bash
cd "c:\Users\Raazia Yasin\Documents\EchoMind"
```

### 1.2 Create Virtual Environment (if not exists)
```bash
python -m venv .venv
```

### 1.3 Activate Virtual Environment
```bash
# Windows
.venv\Scripts\activate

# You should see (.venv) in your terminal prompt
```

### 1.4 Install Dependencies
```bash
pip install django==6.0.1
pip install django-cors-headers
pip install requests
```

### 1.5 Run Migrations (if needed)
```bash
python manage.py migrate
```

### 1.6 Create Superuser (Optional - for Admin Panel)
```bash
python manage.py createsuperuser
# Follow prompts to create admin account
```

### 1.7 Start Backend Server
```bash
python manage.py runserver
```

✅ **Backend should now be running on:** http://localhost:8000

---

## 🎨 Step 2: Frontend Setup

### 2.1 Open New Terminal

### 2.2 Navigate to Frontend Directory
```bash
cd "c:\Users\Raazia Yasin\Documents\EchoMind\frontend"
```

### 2.3 Install Dependencies (if not done)
```bash
npm install
```

### 2.4 Start Frontend Development Server
```bash
npm run dev
```

✅ **Frontend should now be running on:** http://localhost:5173

---

## 🧪 Step 3: Test the Connection

### 3.1 Keep Both Servers Running

### 3.2 Open New Terminal for Testing
```bash
cd "c:\Users\Raazia Yasin\Documents\EchoMind"
.venv\Scripts\activate
python test_connection.py
```

This will test all backend endpoints and verify they're working.

### 3.3 Test in Browser
1. Open http://localhost:5173 in your browser
2. Navigate to "Chat" page
3. Send a message
4. You should receive a Socratic response!

---

## 🔍 Step 4: Verify Everything is Working

### Backend Checklist ✅
- [ ] Server running on http://localhost:8000
- [ ] Can access http://localhost:8000/api/health/
- [ ] Can access http://localhost:8000/admin/ (admin panel)
- [ ] No errors in terminal

### Frontend Checklist ✅
- [ ] Server running on http://localhost:5173
- [ ] Homepage loads correctly
- [ ] Can navigate between pages
- [ ] No errors in browser console (F12)

### Connection Checklist ✅
- [ ] Chat page can send messages
- [ ] Receives responses from backend
- [ ] No CORS errors in browser console

---

## 🎯 Quick Commands Reference

### Backend Commands
```bash
# Activate virtual environment
.venv\Scripts\activate

# Run server
python manage.py runserver

# Run migrations
python manage.py migrate

# Create migrations
python manage.py makemigrations

# Django shell
python manage.py shell

# Run tests
pytest

# Check for issues
python manage.py check
```

### Frontend Commands
```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

---

## 🐛 Troubleshooting

### Backend Issues

**Problem: "No module named django"**
```bash
# Make sure virtual environment is activated
.venv\Scripts\activate
pip install django==6.0.1
```

**Problem: "Port 8000 already in use"**
```bash
# Use different port
python manage.py runserver 8001
# Update frontend .env: VITE_API_URL=http://localhost:8001/api
```

**Problem: "Database is locked"**
```bash
# Close all terminals and restart
# Or delete db.sqlite3 and run migrations again
python manage.py migrate
```

### Frontend Issues

**Problem: "Cannot find module"**
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

**Problem: "Port 5173 already in use"**
```bash
# Vite will automatically suggest next available port
# Or kill the process using port 5173
```

**Problem: "CORS error in browser"**
- Make sure backend is running
- Check CORS settings in `EchoMind/settings.py`
- Verify frontend URL is in `CORS_ALLOWED_ORIGINS`

### Connection Issues

**Problem: "Network Error" in Chat**
1. Verify backend is running on http://localhost:8000
2. Check `.env` file in frontend has correct `VITE_API_URL`
3. Restart frontend server after changing .env
4. Check browser console for specific error

**Problem: "404 Not Found"**
- Verify URL paths match between frontend and backend
- Check `EchoMind/urls.py` for correct endpoint paths

---

## 📁 Project Structure

```
EchoMind/
├── EchoMind/              # Django project settings
│   ├── settings.py        # Main configuration
│   ├── urls.py           # URL routing
│   └── views.py          # Root views
├── gamification/          # Gamification app
│   ├── models.py         # Database models
│   ├── views.py          # API views
│   ├── urls.py           # App URLs
│   └── services.py       # Business logic
├── socratic_engine/       # Chat functionality
│   ├── views.py          # Chat views
│   └── urls.py           # Chat URLs
├── safety/               # Security features
├── frontend/             # React frontend
│   ├── src/
│   │   ├── App.jsx       # Main app
│   │   ├── pages/        # Page components
│   │   ├── components/   # Reusable components
│   │   └── services/     # API service
│   ├── package.json      # Dependencies
│   └── vite.config.js    # Vite config
├── db.sqlite3            # Database
├── manage.py             # Django management
├── .env                  # Backend environment
└── test_connection.py    # Connection test script
```

---

## 🎓 Next Steps

### For Development
1. ✅ Both servers running
2. ✅ Connection verified
3. 🔄 Start implementing features
4. 🔄 Connect Tree page to backend
5. 🔄 Add user authentication
6. 🔄 Integrate real AI service

### For Testing
```bash
# Run backend tests
pytest

# Run frontend tests (when added)
npm test
```

### For Production
1. Set `DEBUG=False` in settings.py
2. Use PostgreSQL instead of SQLite
3. Configure proper SECRET_KEY
4. Set up static file serving
5. Configure production CORS origins
6. Deploy to cloud platform

---

## 📞 Need Help?

### Check These Files
- `PROJECT_VERIFICATION_REPORT.md` - Detailed project status
- `docs/` - Additional documentation
- `Eco-Mind AI - Complete Project Plan.md` - Full project plan

### Common Tasks

**Add a new API endpoint:**
1. Add view function in `gamification/views.py` or `socratic_engine/views.py`
2. Add URL pattern in respective `urls.py`
3. Test with `test_connection.py`

**Add a new frontend page:**
1. Create component in `frontend/src/pages/`
2. Add route in `frontend/src/App.jsx`
3. Add navigation link in `frontend/src/components/Navbar.jsx`

**Connect frontend to new endpoint:**
1. Import `api` from `services/api.js`
2. Use `api.get()` or `api.post()` in component
3. Handle response with state management

---

## ✅ Success Indicators

You'll know everything is working when:
- ✅ Both servers start without errors
- ✅ Frontend loads in browser
- ✅ Chat page sends and receives messages
- ✅ No CORS errors in console
- ✅ `test_connection.py` passes all tests

---

**Happy Coding! 🚀**

Last Updated: January 18, 2026
