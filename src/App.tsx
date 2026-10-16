import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import ArchivePage from './pages/ArchivePage';
import PostingPage from './pages/PostingPage';
import { useStore } from './store/useStore';
import { useEffect } from 'react';
import { fetchPostMetaDict } from './api/postApi';
import { transformToCategoryTree } from './services/postService';
import { IPost } from './types/post';




const AppContent = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Zustand 스토어에서 액션들 가져오기
  const setPostsDict = useStore((state) => state.setPostsDict);
  const setCategoryTree = useStore((state) => state.setCategoryTree);

  useEffect(() => {
    const loadData = async () => {
      try {
        // 1. 데이터 호출
        const data = await fetchPostMetaDict();

        // 2. 카테고리 트리 생성
        const metaList = Object.values(data).map(post => post.meta);
        const tree = transformToCategoryTree(metaList);

        // 3. 스토어 상태 업데이트
        setPostsDict(data);
        setCategoryTree(tree);

      } catch (error) {
        console.error("데이터 로딩 중 에러:", error);
      }
    };

    loadData();
  }, [setPostsDict, setCategoryTree]);

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