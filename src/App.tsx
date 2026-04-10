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

        // 2. 로그 출력
        const keys = Object.keys(data);
        console.log("📊 받아온 포스트 개수:", keys.length);
        keys.forEach((key) => {
          console.log(`✅ 확인된 포스트: ${data[key].meta.title} (${data[key].id})`);
        });

        // 3. 트리 가공 로직 (이 부분이 useEffect 안에 정의되어야 tree를 쓸 수 있습니다)
        const metaList = Object.values(data).map(post => post.meta);
        const tree = transformToCategoryTree(metaList);

        console.log("🌳 생성된 카테고리 트리:", tree);

        // 4. 스토어 상태 업데이트
        setPostsDict(data);
        setCategoryTree(tree);

      } catch (error) {
        console.error("❌ 데이터 로딩 중 에러:", error);
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






const TestComponent = ({ name, color }: { name: string; color: string }) => (
  <div className={`p-10 bg-white shadow rounded-lg border-l-8 ${color}`}>
    <h2 className="text-2xl font-bold text-gray-800">{name} 테스트 중</h2>
    <p className="mt-2 text-gray-600">현재 {name} 경로에 접속해 있습니다.</p>
  </div>
);

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}



export default App;