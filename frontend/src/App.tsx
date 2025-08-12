import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import UserProfile from './pages/UserProfile';
import CourseDetail from './pages/CourseDetail';
import AssessmentQuiz from './pages/AssessmentQuiz';

function App() {
 return (
 <Router>
 <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
 <Navbar />
 <main>
 <Routes>
 <Route path="/" element={<Home />} />
 <Route path="/quiz/assessment" element={<AssessmentQuiz />} />
 <Route path="/profile" element={<UserProfile />} />
 <Route path="/dashboard" element={<Dashboard />} />
 <Route path="/course/:courseId" element={<CourseDetail />} />
 </Routes>
 </main>
 </div>
 </Router>
 );
}

export default App;
