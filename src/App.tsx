import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import JourneyPage from './pages/JourneyPage';
import ChapterPage from './pages/ChapterPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { SoundProvider } from './contexts/SoundContext';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <SoundProvider>
        <BrowserRouter>
          <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/learn" element={<JourneyPage />} />
                <Route path="/chapter/:chapterId" element={<ChapterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </SoundProvider>
    </AuthProvider>
  );
}

export default App;
