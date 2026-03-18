import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Post } from '../services/util';
import ArchiveBox from '../components/common/ArchiveBox';
import CategoryTree from '../components/CategoryTree';


const ArchivePage: React.FC = () => {
    const col = 3;
    const row = 2;

    const { posts, isLoading, selectedCategory } = useStore();

    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = col * row;
    const paginationRef = useRef<HTMLDivElement>(null);

    // 1. 카테고리에 따른 필터링 로직 추가
    const filteredPosts = selectedCategory
        ? posts.filter(post => post.category === selectedCategory.toString())
        : posts;

    // 2. 필터링된 결과로 페이지네이션 계산
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;

    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

    // 카테고리가 바뀌면 1페이지로 리셋하는 로직 (선택 사항)
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory]);

    useEffect(() => {
        const store = useStore.getState();
        store.fetchPosts();
    }, []);

    const handlePostClick = (post: Post) => {
        navigate(`/posting?id=${post.id}`, { state: { post } });
    };

    const handlePageChange = (pageNum: number) => {
        setCurrentPage(pageNum);
        setTimeout(() => {
            if (paginationRef.current) {
                paginationRef.current.scrollIntoView({
                    behavior: 'smooth',
                    block: 'end'
                });
            }
        }, 50);
    };

    if (isLoading) return <div className="text-center py-20 text-sky-600 font-bold">로딩 중...</div>;

    return (
        <div className="flex flex-col w-full min-h-screen bg-slate-50">
            <div className="max-w-7xl mx-auto w-full px-5 mt-10">
                <h1 className="text-4xl font-black text-sky-800 mb-8 border-b-4 border-sky-100 pb-4 tracking-tight">
                    Archive
                </h1>
            </div>

            <main className="max-w-7xl mx-auto p-5 w-full flex flex-row gap-6 items-start">

                <div className="w-64 shrink-0">
                    <CategoryTree />
                </div>

                <section className="flex-1 min-w-0 rounded-xl px-8 pt-8 pb-10 bg-white/80 border border-sky-300 shadow-sm min-h-[700px] flex flex-col">
                    <h3 className="text-2xl font-extrabold text-sky-700 mb-6 border-b-2 border-sky-100 pb-2 tracking-tight">
                        Post
                    </h3>

                    <div className="flex-grow w-full">
                        <ArchiveBox
                            col={col}
                            row={row}
                            posts={currentPosts}
                            onPostClick={handlePostClick}
                        />
                    </div>

                    {totalPages > 1 && (
                        <div
                            ref={paginationRef}
                            className="mt-12 flex justify-center items-center gap-x-2 border-t border-sky-50 pt-8"
                        >
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                                <button
                                    key={pageNum}
                                    onClick={() => handlePageChange(pageNum)}
                                    className={`px-4 py-2 rounded-lg font-bold transition-all ${currentPage === pageNum
                                        ? 'bg-sky-600 text-white shadow-md'
                                        : 'bg-white text-sky-600 border border-sky-100 hover:bg-sky-50'
                                        }`}
                                >
                                    {pageNum}
                                </button>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};

export default ArchivePage;