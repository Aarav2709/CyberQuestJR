import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Quiz from './pages/Quiz';
import Modules from './pages/Modules';
import ModuleDetail from './pages/ModuleDetail';
import Leaderboard from './pages/Leaderboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
        <Navbar />
        <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/quiz/:type?" element={<Quiz />} />
              <Route path="/modules" element={<Modules />} />
              <Route path="/modules/:moduleName" element={<ModuleDetail />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
            </Routes>
          </main>
        </div>
      </Router>
  );
}

export default App;
