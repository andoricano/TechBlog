import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useSearchParams, Navigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import MdViewer from '../components/mdviewer/MdViewer';
import { fetchPostDetail } from '../api/postApi';


const PostingPage: React.FC = () => {

  const [searchParams] = useSearchParams();
  const postId = searchParams.get('id');
  const postsDict = useStore((state) => state.postsDict);


  console.log("📍 postId 값:", postId);
  console.log("📍 현재 postsDict 상태:", Object.keys(postsDict).length > 0 ? "데이터 있음" : "데이터 없음(대기 중)");



  const [content, setContent] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const fetchLock = useRef<string | null>(null);



  useEffect(() => {
    // 1. 관찰 조건: ID가 있고, 스토어에 데이터가 로드되었으며, 아직 본문을 가져오지 않았을 때
    if (postId && postsDict[postId] && !content && !isFetching) {

      // 2. 중복 호출 방지 (이미 해당 ID로 작업 중이면 차단)
      if (fetchLock.current === postId) return;

      const getDetail = async () => {
        console.log("✅ [관찰 성공] 데이터를 찾았으므로 본문 fetch를 시작합니다.");
        fetchLock.current = postId;
        setIsFetching(true);

        try {
          const response = await fetchPostDetail(postId);
          console.log("📊 [결과] fetchPostDetail 응답:", response);

          if (response && response.content) {
            setContent(response.content);
            console.log("✨ [성공] 본문 저장 완료");
          } else {
            console.error("❌ [실패] 응답에 content가 없습니다.");
          }
        } catch (err) {
          console.error("❌ [에러] fetch 중 발생:", err);
          fetchLock.current = null;
        } finally {
          setIsFetching(false);
        }
      };

      getDetail();
    }
  }, [postId, postsDict, content, isFetching]);



  // ID가 없으면 리스트로 튕겨냄
  if (!postId) return <Navigate to="/archive" />;

  return (
    <div className="bg-slate-50 min-h-screen">


      <main className="max-w-7xl mx-auto px-6 py-12 bg-white shadow-sm min-h-screen">
        {/* 
        {currentPostMeta ? (
          <section className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-slate-800 mb-4">
              {currentPostMeta.title}
            </h2>
            <div className="text-slate-400 font-medium">
              {currentPostMeta.createdAt}
            </div>
          </section>
        ) : (
          <div className="text-center py-20 text-slate-400">
            포스트 정보를 확인하는 중...
          </div>
        )}

        {content ? (
          <div className="prose max-w-none">
            <MdViewer content={content} />
            <div className="whitespace-pre-wrap text-slate-700">{content}</div>
          </div>
        ) : (
          <div className="text-center py-10 text-sky-600 animate-pulse font-medium">
            글 내용을 불러오고 있습니다...
          </div>
        )} */}

      </main>

    </div>
  );
};

export default PostingPage;

