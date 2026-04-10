import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import ArchiveBox from '../components/common/ArchiveBox';
import CategoryTree from '../components/CategoryTree';
import { IPost } from '../types/post';
import { ICategory } from '../types/category';


const ArchivePage: React.FC = () => {

    const col = 3;
    const row = 2;
    const postsPerPage = col * row;

    const navigate = useNavigate();
    const paginationRef = useRef<HTMLDivElement>(null);

    const postsDict = useStore((state) => state.postsDict);

    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null);


    const postList = useMemo(() => {
        const list = Object.values(postsDict).sort(
            (a, b) => new Date(b.meta.createdAt).getTime() - new Date(a.meta.createdAt).getTime()
        );

        if (list.length > 0) {
            const stats = list.reduce((acc: Record<string, number>, post) => {
                const path = post.meta.category.path;
                acc[path] = (acc[path] || 0) + 1;
                return acc;
            }, {});

            console.group("📂 Archive 데이터 로드 완료");
            console.log("📌 고유 카테고리 개수:", Object.keys(stats).length);
            console.groupEnd();
        }

        return list;
    }, [postsDict]);



    const filteredPostList = useMemo(() => {
        const result = !selectedCategory
            ? postList
            : postList.filter((post) => post.meta.category.path.startsWith(selectedCategory.path));

        if (selectedCategory) {
            console.log(`🔍 필터링 적용: [${selectedCategory.path}] -> ${result.length}개 발견`);
        }

        return result;
    }, [postList, selectedCategory]);

    const totalPages = Math.ceil(filteredPostList.length / postsPerPage);
    const currentPosts = useMemo(() => {
        const indexOfLastPost = currentPage * postsPerPage;
        const indexOfFirstPost = indexOfLastPost - postsPerPage;
        return filteredPostList.slice(indexOfFirstPost, indexOfLastPost);
    }, [filteredPostList, currentPage, postsPerPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory]);

    const handlePostClick = (post: IPost) => {
        navigate(`/posting?id=${post.id}`);
    };

    const handlePageChange = (pageNum: number) => {
        setCurrentPage(pageNum);
    };

    if (Object.keys(postsDict).length === 0) {
        return <div className="text-center py-20 text-slate-400">포스트를 불러오는 중입니다...</div>;
    }

    return (
        <div className="flex flex-col w-full min-h-screen bg-slate-50">
            <div className="max-w-7xl mx-auto w-full px-5 mt-10">
                <h1 className="text-4xl font-black text-sky-800 mb-8 border-b-4 border-sky-100 pb-4 tracking-tight">
                    Archive
                </h1>
            </div>

            <main className="max-w-7xl mx-auto p-5 w-full flex flex-row gap-6 items-start">

                <div className="w-64 shrink-0">
                    <CategoryTree
                        selectedCategory={selectedCategory}
                        onCategoryClick={setSelectedCategory}
                    />
                </div>

                <section className="flex-1 min-w-0 rounded-xl px-8 pt-8 pb-10 bg-white/80 border border-sky-300 shadow-sm min-h-[700px] flex flex-col">
                    <h3 className="text-2xl font-extrabold text-sky-700 mb-6 border-b-2 border-sky-100 pb-2 tracking-tight">
                        Post
                    </h3>

                    <div className="flex-grow w-full">
                        <ArchiveBox
                            col={col}
                            row={row}
                            postList={currentPosts}
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