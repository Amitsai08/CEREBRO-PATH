import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';

// Layout
import MainLayout from './components/layout/MainLayout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Questionnaire from './pages/Questionnaire';
import CollegeExplorer from './pages/CollegeExplorer';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import DataManagement from './pages/DataManagement';
import EntranceExamTracker from './pages/EntranceExamTracker';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col font-sans">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="login" element={<Login />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="questionnaire/:grade" element={<Questionnaire />} />
                <Route path="explore" element={<CollegeExplorer />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="profile" element={<Profile />} />
                <Route path="exams" element={<EntranceExamTracker />} />
                <Route path="admin/data" element={<DataManagement />} />
              </Route>
            </Routes>
          </AnimatePresence>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
