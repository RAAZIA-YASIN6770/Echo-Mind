# 🌳 EchoMind - AI-Powered Socratic Learning Platform

<div align="center">

![EchoMind Logo](https://img.shields.io/badge/EchoMind-AI%20Learning-purple?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Production%20Ready-success?style=for-the-badge)
![Backend](https://img.shields.io/badge/Backend-Django-green?style=for-the-badge&logo=django)
![Frontend](https://img.shields.io/badge/Frontend-React-blue?style=for-the-badge&logo=react)
![Tests](https://img.shields.io/badge/Tests-41%2F41%20Passing-brightgreen?style=for-the-badge)

**An AI-powered Socratic mentor for curious young minds (Grades 3-7)**

[Quick Start](#-quick-start) • [Features](#-features) • [Documentation](#-documentation) • [Testing](#-testing)

</div>

---

## 📖 About

**EchoMind** is an innovative educational platform that uses AI to guide children through the Socratic method of learning. Instead of providing direct answers, EchoMind asks thoughtful questions that encourage critical thinking and deep understanding.

### 🎯 Key Highlights

- 🤖 **AI-Powered Socratic Dialogue** - Guides learning through questions, not answers
- 🌳 **Visual Knowledge Tree** - Watch understanding grow with every concept mastered
- 🏆 **Gamification System** - Streaks, badges, and challenges keep learning fun
- 🔒 **Child Safety First** - PII redaction, content filtering, and parental controls
- 📊 **Progress Analytics** - Track learning journey with detailed insights

---

## ✨ Features

### 🧠 Socratic Chat Engine
- AI-powered conversational learning
- Guided discovery through questions
- Concept completion detection
- Tree growth notifications

### 🌲 Knowledge Tree Visualization
- Interactive SVG tree representation
- Fibonacci spiral node positioning
- Health score tracking (0-100%)
- Tree states: Seedling → Sapling → Young Tree → Mature Tree
- Wilt detection for inactive learning

### 🎮 Gamification System
- **Daily Streaks** - Login tracking with Golden Leaves rewards (5+ days)
- **Achievement Badges** - 10 unique badges to unlock
  - 🎉 Welcome Explorer
  - 🌱 Knowledge Seeker
  - 🌿 Growing Mind
  - 🌳 Knowledge Builder
  - 🏆 Wisdom Tree
  - 🔥 Week Warrior
  - 💡 Misconception Buster
  - 🗺️ Knowledge Explorer
  - ❓ Question Master
  - 🍂 Golden Leaves
- **Offline Challenges** - 20+ creative real-world activities
- **Analytics Dashboard** - Comprehensive learning insights

### 🛡️ Safety Features
- PII redaction (emails, phone numbers, addresses)
- Content filtering (blocked topics)
- Prompt injection defense
- Rate limiting (5 req/sec per IP)
- Security headers (HSTS, X-Frame-Options)
- Parental monitoring dashboard

---

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/echomind.git
cd echomind

# Backend setup
python -m venv .venv
.venv\Scripts\activate  # Windows
# source .venv/bin/activate  # Mac/Linux

pip install -r requirements.txt
python manage.py migrate
python manage.py init_gamification

# Frontend setup
cd frontend
npm install
```

### Running the Application

**Terminal 1 - Backend:**
```bash
cd echomind
.venv\Scripts\activate
python manage.py runserver
```
Backend runs at: http://localhost:8000

**Terminal 2 - Frontend:**
```bash
cd echomind/frontend
npm run dev
```
Frontend runs at: http://localhost:5173

### First Visit
Open your browser and go to: **http://localhost:5173**

---

## 🏗️ Tech Stack

### Backend
- **Framework:** Django 4.x
- **API:** Django REST Framework
- **Database:** SQLite (dev), PostgreSQL (prod-ready)
- **Authentication:** JWT
- **Testing:** pytest (41/41 tests passing)

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite
- **Routing:** React Router v6
- **Animations:** Framer Motion
- **HTTP Client:** Axios
- **Styling:** Custom CSS with design system

### AI Integration
- **LLM:** OpenAI GPT / Anthropic Claude (configurable)
- **Safety:** Multi-layer content filtering
- **Prompt Engineering:** Socratic method optimization

---

## 📁 Project Structure

```
echomind/
├── � docs/                         # Project documentation sub-folders
│   ├── management/                  # Project plans and charters
│   ├── reports/                     # Status and story reports
│   ├── technical/                   # Architecture and design specs
│   └── verification/                # Test logs and compliance
│
├── 🐍 Backend (Django)
│   ├── EchoMind/                    # Main Django settings
│   ├── socratic_engine/             # AI chat logic
│   ├── gamification/                # Streaks and badges
│   ├── safety/                      # Content filtering
│   ├── personalization-service/     # Adaptive learning
│   ├── tests/                       # Unit and integration tests
│   └── manage.py
│
├── ⚛️ Frontend (React/Vite)
│   └── frontend/
│       ├── src/                     # Source code (pages, components)
│       └── package.json
│
└── 🏛️ Infrastructure
    └── infra/                       # Docker & K8s configs
```

---

## 🧪 Testing

### Run Backend Tests
```bash
# All tests
pytest

# Specific test file
pytest tests/test_phase4.py

# With coverage
pytest --cov
```

**Test Results:** ✅ 41/41 passing (100%)
- Gamification: 35 tests
- Safety: 6 tests

### Test Coverage
- TreeStateManager: 6 tests ✅
- NodeManager: 7 tests ✅
- StreakManager: 6 tests ✅
- AchievementManager: 4 tests ✅
- ChallengeManager: 6 tests ✅
- AnalyticsManager: 6 tests ✅
- Safety Features: 6 tests ✅

---

## 📊 API Endpoints

### Chat
- `POST /api/chat/` - Send message, get Socratic response

### Gamification
- `GET /api/gamification/tree/state/` - Get tree visualization data
- `POST /api/gamification/tree/node/` - Add new tree node
- `GET /api/gamification/streak/` - Get user streak
- `POST /api/gamification/streak/update/` - Update streak
- `GET /api/gamification/achievements/badges/` - Get earned badges
- `GET /api/gamification/challenges/daily/` - Get daily challenge
- `GET /api/gamification/analytics/` - Get user analytics

### Health
- `GET /api/health/` - API health check

---

## 🎨 Screenshots

### Homepage
Beautiful dashboard with real-time stats, streak counter, and daily challenges.

### Knowledge Tree
Interactive SVG visualization showing learning progress with Fibonacci spiral layout.

### Chat Interface
AI-powered Socratic dialogue that guides learning through thoughtful questions.

### Achievement Badges
Unlock 10 unique badges as you progress through your learning journey.

---

## 📚 Documentation

The project documentation is organized in the `docs/` directory:

- **[Management](docs/management/)** - Project plans, charters, and high-level summaries.
- **[Reports](docs/reports/)** - Sprint summaries, story reports, and status updates.
- **[Technical](docs/technical/)** - Architecture, design systems, and technical specs.
- **[Verification](docs/verification/)** - Test results, checklists, and compliance reports.
- **[Archive](docs/archive/)** - Outdated logs or reference files.

---

## 🔒 Security

EchoMind implements multiple layers of security:

- **PII Redaction** - Automatically removes personal information
- **Content Filtering** - Blocks inappropriate topics
- **Prompt Injection Defense** - Prevents system manipulation
- **Rate Limiting** - Prevents abuse (5 req/sec per IP)
- **Security Headers** - HSTS, X-Frame-Options, X-XSS-Protection
- **CORS Protection** - Configured for trusted origins only

---

## 🎯 Roadmap

### ✅ Completed (Phase 1-5)
- [x] Backend API (Django)
- [x] Frontend UI (React)
- [x] Socratic chat engine
- [x] Knowledge tree visualization
- [x] Gamification system
- [x] Safety features
- [x] Testing suite

### 🚧 In Progress (Phase 6)
- [ ] Beta testing with users
- [ ] Performance optimization
- [ ] Mobile app (React Native)

### 📅 Future Enhancements
- [ ] Multiplayer learning sessions
- [ ] Parent mobile app
- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] Voice interaction
- [ ] AR/VR tree visualization

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow PEP 8 for Python code
- Use ESLint for JavaScript code
- Write tests for new features
- Update documentation

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

- **Project Lead:** [Your Name]
- **Backend Developer:** [Your Name]
- **Frontend Developer:** [Your Name]
- **UI/UX Designer:** [Your Name]

---

## 🙏 Acknowledgments

- OpenAI / Anthropic for LLM APIs
- Django community for excellent framework
- React community for amazing tools
- All contributors and testers

---

## 📞 Support

For questions, issues, or suggestions:

- 📧 Email: support@echomind.ai
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/echomind/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/echomind/discussions)

---

## 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/yourusername/echomind?style=social)
![GitHub forks](https://img.shields.io/github/forks/yourusername/echomind?style=social)
![GitHub issues](https://img.shields.io/github/issues/yourusername/echomind)
![GitHub pull requests](https://img.shields.io/github/issues-pr/yourusername/echomind)

---

<div align="center">

**Made with ❤️ for curious young minds**

[⬆ Back to Top](#-echomind---ai-powered-socratic-learning-platform)

</div>
