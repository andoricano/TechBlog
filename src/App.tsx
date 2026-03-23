import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import ArchivePage from './pages/ArchivePage';
import PostingPage from './pages/PostingPage';
import { useStore } from './store/useStore';
import { useEffect } from 'react';

const AppContent = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const fetchPosts = useStore((state) => state.fetchPosts);
  const fetchCategoryMap = useStore((state) => state.fetchCategoryMap);

  useEffect(() => {
    fetchPosts();
    fetchCategoryMap();
  }, [fetchPosts, fetchCategoryMap]);

  const handleLogoClick = () => {
    if (location.pathname !== '/') {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onLogoClick={handleLogoClick} />
      <main className="max-w-7xl mx-auto px-6 py-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/archive" element={<ArchivePage />} />
          <Route path="/posting" element={<PostingPage />} />
        </Routes>
      </main>
    </div>
  );
};
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}



export default App;