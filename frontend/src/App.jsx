import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import TreePage from './pages/TreePage';
import ChatPage from './pages/ChatPage';
import ParentDashboard from './pages/ParentDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="tree" element={<TreePage />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="parents" element={<ParentDashboard />} />

          <Route path="*" element={<HomePage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
