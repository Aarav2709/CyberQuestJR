import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import JourneyPage from './pages/JourneyPage';
import ChapterPage from './pages/ChapterPage';
import { SoundProvider } from './contexts/SoundContext';

function App() {
  return (
    <SoundProvider>
      <BrowserRouter>
        <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
          <Navbar />
          <main className="pt-6">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/learn" element={<JourneyPage />} />
              <Route path="/chapter/:chapterId" element={<ChapterPage />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </SoundProvider>
  );
}

export default App;
