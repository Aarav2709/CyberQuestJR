import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import JourneyPage from './pages/JourneyPage';
import ChapterPage from './pages/ChapterPage';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-night text-slate-50">
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
  );
}

export default App;
