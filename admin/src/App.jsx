import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./component/header/Header";
import MonitoringPage from "./pages/MonitoringPage";
import PostingPage from "./pages/PostingPage";
import TestPage from "./pages/TestPage";

export default function App() {
  return (
    <BrowserRouter>
      <Header />

      <main className="w-full h-[calc(100vh-60px)] overflow-auto bg-gray-50">
        <Routes>
          <Route path="/monitoring" element={<MonitoringPage />} />
          <Route path="/posting" element={<PostingPage />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="/" element={<Navigate to="/monitoring" />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}