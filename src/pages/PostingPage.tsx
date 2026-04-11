import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useSearchParams, Navigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import MdViewer from '../components/mdviewer/MdViewer';
import { fetchPostDetail } from '../api/postApi';


const PostingPage: React.FC = () => {

  const [searchParams] = useSearchParams();
  const postId = searchParams.get('id');
  const postsDict = useStore((state) => state.postsDict);

  const [content, setContent] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const fetchLock = useRef<string | null>(null);
  const currentPostMeta = postId ? postsDict[postId] : null;



  console.log("📍 postId 값:", postId);

  useEffect(() => {
    // ID가 있고, 메타데이터도 있는데, 아직 본문(content)만 없을 때 실행
    if (postId && currentPostMeta && !content && !isFetching) {
      if (fetchLock.current === postId) return;

      const getDetail = async () => {
        fetchLock.current = postId;
        setIsFetching(true);
        try {
          const response = await fetchPostDetail(postId);
          if (response && response.content) {
            setContent(response.content);
          }
        } catch (err) {
          fetchLock.current = null;
        } finally {
          setIsFetching(false);
        }
      };
      getDetail();
    }
  }, [postId, currentPostMeta, content, isFetching]);


  // ID가 없으면 리스트로 튕겨냄
  if (!postId) return <Navigate to="/archive" />;

  return (
    <div className="bg-slate-50 min-h-screen">


      <main className="max-w-7xl mx-auto px-6 py-12 bg-white shadow-sm min-h-screen">
        {currentPostMeta ? (
          <section className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-slate-800 mb-4">
              {currentPostMeta.meta.title}
            </h2>
            <div className="text-slate-400 font-medium">
              {currentPostMeta.meta.createdAt}
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
          </div>
        ) : (
          <div className="text-center py-10 text-sky-600 animate-pulse font-medium">
            글 내용을 불러오고 있습니다...
          </div>
        )}

      </main>

    </div>
  );
};

export default PostingPage;

