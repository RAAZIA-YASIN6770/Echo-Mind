import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import TreePage from './pages/TreePage';
import ChatPage from './pages/ChatPage';
import ParentDashboard from './pages/ParentDashboard';
import AchievementsPage from './pages/AchievementsPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="tree" element={<TreePage />} />
            <Route path="chat" element={<ChatPage />} />
            <Route path="parents" element={<ParentDashboard />} />
            <Route path="achievements" element={<AchievementsPage />} />
            <Route path="settings" element={<SettingsPage />} />

            <Route path="*" element={<HomePage />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
