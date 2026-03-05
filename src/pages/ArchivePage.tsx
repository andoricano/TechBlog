import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import ArchiveBox from '../components/common/ArchiveBox';


const ArchivePage: React.FC = () => {
    const col = 3;
    const row = 2;
    const { posts, isLoading } = useStore();
    const navigate = useNavigate();

    // 현재 페이지 상태 관리
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = col * row;
    const paginationRef = useRef<HTMLDivElement>(null);

    // 페이지네이션 계산
    const totalPages = Math.ceil(posts.length / postsPerPage);
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;

    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

    const handlePostClick = (id: string) => {
        navigate(`/post?id=${id}`);
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

    if (isLoading) return <div className="text-center py-20 text-sky-600">로딩 중...</div>;

    return (
        <main className="max-w-7xl mx-auto p-5">
            <section className="w-full rounded-xl px-8 pt-8 pb-10 bg-white/80 border border-sky-300 shadow-sm min-h-[700px] flex flex-col">
                {/* 타이틀 영역 */}
                <div className="text-lg font-bold text-sky-700 mb-6 border-b border-sky-100 pb-2">
                    Archive
                </div>

                <div className="flex-grow">
                    <ArchiveBox
                        col={col}
                        row={row}
                        posts={currentPosts}
                        onPostClick={handlePostClick}
                    />
                </div>

                {/* 넘버링 UI */}
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
    );
};

export default ArchivePage;