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
    // 1. 전체 포스트 데이터 가져오기 (1:1 매칭)
    const loadAllPosts = async () => {
      try {
        const res = await fetch('/.netlify/functions/posts');
        const data = await res.json();
        console.log("📂 [전체 포스트 로드]:", data);
      } catch (err) {
        console.error("❌ 전체 포스트 로드 실패:", err);
      }
    };

    // 2. Dict 형태 데이터 가져오기 (사용자님이 원하신 핵심 데이터)
    const loadCategoryDict = async () => {
      try {
        const res = await fetch('/.netlify/functions/posts?type=dict');
        const data = await res.json();
        console.log("📋 [Category Dict 로드]:", data);
      } catch (err) {
        console.error("❌ Dict 데이터 로드 실패:", err);
      }
    };

    // 컴포넌트 마운트 시 실행
    loadAllPosts();
    loadCategoryDict();
  }, []);


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