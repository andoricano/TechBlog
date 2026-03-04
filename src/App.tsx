import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import ArchiveList from './pages/ArchiveList';
import Post from './pages/Post';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />

        <main className="max-w-7xl mx-auto px-6 py-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/archive" element={<ArchiveList />} />
            <Route path="/post" element={<Post />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;