import React, { useMemo, useEffect } from 'react';
import { useLocation, useSearchParams, Navigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import MdViewer from '../components/mdviewer/MdViewer';
import { formatDate } from '../services/util';

const PostingPage: React.FC = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { posts, fetchPosts, isLoading } = useStore();

  const postId = searchParams.get('id');

  const postInfo = useMemo(() => {
    return (location.state?.post) || posts.find((p) => p.id === postId);
  }, [location.state, posts, postId]);

  useEffect(() => {
    if (posts.length === 0 && !isLoading) {
      fetchPosts();
    }
  }, [posts.length, isLoading, fetchPosts]);

  if (!postId) return <Navigate to="/archive" />;

  return (
    <div className="bg-slate-50 min-h-screen">
      <main className="max-w-7xl mx-auto px-6 py-12 bg-white shadow-sm min-h-screen">

        {postInfo && (
          <section className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-slate-800 mb-4">
              {postInfo.title}
            </h2>


            <div className="text-slate-400 font-medium">
              {postInfo ? formatDate(postInfo.createdAt) : ''}
            </div>

            <div className="mt-4 flex justify-center gap-2">
              {postInfo.tags?.map((tag: string) => (
                <span key={tag} className="px-3 py-1 bg-sky-50 text-sky-600 rounded-full text-xs font-semibold">
                  #{tag}
                </span>
              ))}
            </div>
          </section>
        )}

        <MdViewer postId={postId} />

      </main>
    </div>
  );
};

export default PostingPage;