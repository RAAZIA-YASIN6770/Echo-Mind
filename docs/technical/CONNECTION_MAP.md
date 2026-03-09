# 🔗 EchoMind - Frontend-Backend Connection Map

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER'S BROWSER                              │
│                     http://localhost:5173                           │
└─────────────────────────────────────────────────────────────────────┘
                                 │
                                 │ HTTP Requests
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      REACT FRONTEND (Vite)                          │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │  App.jsx (Router)                                             │ │
│  │  ├── HomePage.jsx          ⚠️ Static (needs API integration)  │ │
│  │  ├── ChatPage.jsx          ✅ Connected to /api/chat/         │ │
│  │  └── TreePage.jsx          ⚠️ Static (needs API integration)  │ │
│  └───────────────────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │  services/api.js                                              │ │
│  │  • Base URL: http://localhost:8000/api                        │ │
│  │  • Axios instance with interceptors                           │ │
│  │  • Token management                                           │ │
│  │  • Error handling                                             │ │
│  └───────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                                 │
                                 │ axios.post('/chat/', {...})
                                 │ axios.get('/gamification/...')
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    CORS MIDDLEWARE                                  │
│  • Checks origin: localhost:5173 ✅                                │
│  • Adds CORS headers                                               │
│  • Allows credentials                                              │
└─────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  DJANGO BACKEND (Python)                            │
│                  http://localhost:8000                              │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │  EchoMind/urls.py (Main Router)                               │ │
│  │  ├── /                      → home view                       │ │
│  │  ├── /api/health/           → health check                    │ │
│  │  ├── /api/gamification/     → gamification.urls               │ │
│  │  └── /api/chat/             → socratic_engine.urls            │ │
│  └───────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                    │                              │
                    │                              │
        ┌───────────┴──────────┐      ┌───────────┴──────────┐
        ▼                      ▼      ▼                      ▼
┌──────────────────┐  ┌──────────────────────────────────────────┐
│ Socratic Engine  │  │  Gamification App                        │
│                  │  │                                          │
│ socratic_engine/ │  │  gamification/                           │
│ └── urls.py      │  │  └── urls.py (17 endpoints)              │
│     └── /        │  │      ├── /tree/state/        ✅         │
│         POST     │  │      ├── /tree/node/         ✅         │
│                  │  │      ├── /tree/health/       ✅         │
│ └── views.py     │  │      ├── /streak/            ✅         │
│     └── chat_view│  │      ├── /achievements/...   ✅         │
│         ✅       │  │      ├── /challenges/...     ✅         │
│                  │  │      └── /analytics/...      ✅         │
│                  │  │                                          │
│                  │  │  └── views.py (21 functions)             │
│                  │  │      • get_tree_state()                  │
│                  │  │      • add_tree_node()                   │
│                  │  │      • mark_concept_mastered()           │
│                  │  │      • get_streak()                      │
│                  │  │      • update_streak()                   │
│                  │  │      • get_user_badges()                 │
│                  │  │      • get_daily_challenge()             │
│                  │  │      • get_user_analytics()              │
│                  │  │      • ... and more                      │
│                  │  │                                          │
│                  │  │  └── services/                           │
│                  │  │      ├── tree_services.py                │
│                  │  │      └── gamification_services.py        │
└──────────────────┘  └──────────────────────────────────────────┘
        │                              │
        │                              │
        └──────────────┬───────────────┘
                       ▼
        ┌──────────────────────────────┐
        │      Database Layer          │
        │                              │
        │  SQLite (Development)        │
        │  db.sqlite3                  │
        │                              │
        │  Models:                     │
        │  • KnowledgeTree             │
        │  • TreeNode                  │
        │  • Streak                    │
        │  • BadgeDefinition           │
        │  • UserBadge                 │
        │  • OfflineChallenge          │
        │  • User (Django Auth)        │
        └──────────────────────────────┘
```

---

## 📊 API Endpoint Mapping

### Chat Functionality ✅ CONNECTED

```
Frontend                          Backend
────────────────────────────────────────────────────────────
ChatPage.jsx
  │
  ├─ api.post('/chat/', {        → POST /api/chat/
  │    message: "Hello"              │
  │  })                               ├─ socratic_engine/urls.py
  │                                   │   └─ path('', views.chat_view)
  │                                   │
  │                                   ├─ socratic_engine/views.py
  │                                   │   └─ chat_view(request)
  │                                   │       • Parse message
  │                                   │       • Process with Socratic logic
  │                                   │       • Return response + tree_update
  │                                   │
  └─ Response: {                  ← JSON Response
       "response": "...",
       "tree_update": {...}
     }
```

### Knowledge Tree ⚠️ NOT YET CONNECTED

```
Frontend                          Backend
────────────────────────────────────────────────────────────
TreePage.jsx (TODO)
  │
  ├─ api.get('/gamification/     → GET /api/gamification/tree/state/
  │    tree/state/')                 │
  │                                  ├─ gamification/urls.py
  │                                  │   └─ path('tree/state/', views.get_tree_state)
  │                                  │
  │                                  ├─ gamification/views.py
  │                                  │   └─ get_tree_state(request)
  │                                  │       • Get user's tree
  │                                  │       • Get all nodes
  │                                  │       • Calculate health
  │                                  │       • Return visualization data
  │                                  │
  └─ Response: {                 ← JSON Response
       "tree_id": 1,
       "health_score": 75,
       "nodes": [...],
       "visualization": {...}
     }
```

### Gamification Features ⚠️ NOT YET CONNECTED

```
Frontend                          Backend
────────────────────────────────────────────────────────────
HomePage.jsx (TODO)
  │
  ├─ api.get('/gamification/     → GET /api/gamification/streak/
  │    streak/')                     │
  │                                  └─ Returns current streak
  │
  ├─ api.get('/gamification/     → GET /api/gamification/achievements/badges/
  │    achievements/badges/')        │
  │                                  └─ Returns earned badges
  │
  └─ api.get('/gamification/     → GET /api/gamification/analytics/
       analytics/')                  │
                                     └─ Returns user stats
```

---

## 🔄 Request/Response Flow Example

### Example: Sending a Chat Message

```
1. USER TYPES MESSAGE
   ┌─────────────────────┐
   │ ChatPage.jsx        │
   │ Input: "Hello"      │
   └─────────────────────┘
            │
            ▼
2. FRONTEND SENDS REQUEST
   ┌─────────────────────────────────────┐
   │ api.post('/chat/', {                │
   │   message: "Hello"                  │
   │ })                                  │
   │                                     │
   │ Full URL:                           │
   │ http://localhost:8000/api/chat/     │
   │                                     │
   │ Headers:                            │
   │ - Content-Type: application/json    │
   │ - Authorization: Bearer <token>     │
   └─────────────────────────────────────┘
            │
            ▼
3. CORS CHECK
   ┌─────────────────────────────────────┐
   │ CORS Middleware                     │
   │ ✅ Origin: localhost:5173 allowed   │
   │ ✅ Method: POST allowed             │
   │ ✅ Headers allowed                  │
   └─────────────────────────────────────┘
            │
            ▼
4. DJANGO ROUTING
   ┌─────────────────────────────────────┐
   │ EchoMind/urls.py                    │
   │ path('api/chat/', include(...))     │
   │         │                           │
   │         ▼                           │
   │ socratic_engine/urls.py             │
   │ path('', views.chat_view)           │
   └─────────────────────────────────────┘
            │
            ▼
5. VIEW PROCESSING
   ┌─────────────────────────────────────┐
   │ socratic_engine/views.py            │
   │                                     │
   │ def chat_view(request):             │
   │   1. Parse JSON body                │
   │   2. Extract message                │
   │   3. Process with Socratic logic    │
   │   4. Generate response              │
   │   5. Create tree_update object      │
   │   6. Return JSON response           │
   └─────────────────────────────────────┘
            │
            ▼
6. RESPONSE SENT
   ┌─────────────────────────────────────┐
   │ JSON Response:                      │
   │ {                                   │
   │   "response": "That's fascinating!  │
   │                What led you to that │
   │                conclusion?",        │
   │   "tree_update": {                  │
   │     "growth": true,                 │
   │     "message": "Your tree grew! 🌱" │
   │   }                                 │
   │ }                                   │
   │                                     │
   │ Status: 200 OK                      │
   │ Headers:                            │
   │ - Access-Control-Allow-Origin: ...  │
   │ - Content-Type: application/json    │
   └─────────────────────────────────────┘
            │
            ▼
7. FRONTEND RECEIVES
   ┌─────────────────────────────────────┐
   │ ChatPage.jsx                        │
   │                                     │
   │ const response = await api.post()   │
   │ const botResponse = response.data   │
   │                                     │
   │ setMessages([...messages, {         │
   │   text: botResponse.response,       │
   │   sender: 'bot'                     │
   │ }])                                 │
   │                                     │
   │ if (treeUpdate.growth) {            │
   │   // Show notification              │
   │ }                                   │
   └─────────────────────────────────────┘
            │
            ▼
8. UI UPDATES
   ┌─────────────────────┐
   │ User sees:          │
   │ • Their message     │
   │ • Bot response      │
   │ • Tree notification │
   └─────────────────────┘
```

---

## 🎯 Connection Status Summary

### ✅ Working Connections
1. **Chat Functionality**
   - Frontend: `ChatPage.jsx`
   - Backend: `POST /api/chat/`
   - Status: ✅ Fully functional

### ⚠️ Pending Connections
2. **Knowledge Tree**
   - Frontend: `TreePage.jsx` (static UI only)
   - Backend: `GET /api/gamification/tree/state/` (ready)
   - Status: ⚠️ Backend ready, frontend needs integration

3. **User Stats**
   - Frontend: `HomePage.jsx` (static UI only)
   - Backend: Multiple endpoints ready
   - Status: ⚠️ Backend ready, frontend needs integration

4. **Streak System**
   - Frontend: Not implemented
   - Backend: `GET/POST /api/gamification/streak/` (ready)
   - Status: ⚠️ Backend ready, frontend needs component

5. **Achievements**
   - Frontend: Not implemented
   - Backend: `GET /api/gamification/achievements/...` (ready)
   - Status: ⚠️ Backend ready, frontend needs component

---

## 🔧 How to Add New Connections

### Step 1: Backend (if not exists)
```python
# gamification/views.py
@require_GET
def my_new_endpoint(request):
    # Your logic here
    return JsonResponse({'data': 'value'})

# gamification/urls.py
path('my-endpoint/', views.my_new_endpoint, name='my_endpoint'),
```

### Step 2: Frontend
```javascript
// In your component
import api from '../services/api';

const fetchData = async () => {
  try {
    const response = await api.get('/gamification/my-endpoint/');
    setData(response.data);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### Step 3: Test
```bash
# Backend test
curl http://localhost:8000/api/gamification/my-endpoint/

# Frontend test
# Open browser console and check Network tab
```

---

## 📝 Environment Variables Flow

```
Frontend (.env)                    Backend (.env)
─────────────────────────────────────────────────────
VITE_API_URL=                      DJANGO_SECRET_KEY=
  http://localhost:8000/api          your-secret-key
        │                                  │
        │                                  │
        ▼                                  ▼
  api.js uses this                  settings.py uses this
  as baseURL                        for security
        │                                  │
        │                                  │
        ▼                                  ▼
  All API calls                     Server configuration
  go to this URL                    and security
```

---

## 🎓 Key Takeaways

1. **CORS is configured** ✅
   - Frontend can communicate with backend
   - No CORS errors expected

2. **API structure is solid** ✅
   - RESTful design
   - Clear endpoint naming
   - Proper HTTP methods

3. **One connection working** ✅
   - Chat functionality proves the connection works
   - Same pattern can be used for other features

4. **Backend is complete** ✅
   - All endpoints implemented
   - Ready to be consumed by frontend

5. **Frontend needs integration** ⚠️
   - Tree page needs API calls
   - Home page needs API calls
   - Additional components needed for full features

---

**Last Updated:** January 18, 2026
