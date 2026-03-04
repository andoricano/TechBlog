import React from 'react';
import { useNavigate } from 'react-router-dom';
import ThumbnailPostCard from './ThumnailPostCard';

interface PostData {
    id: string;
    title: string;
    category: string[];
    tags: string[];
    createdAt: string;
    thumbnailUrl: string;
    description: string;
}

interface ArchiveProps {
    col: number; // 한 줄에 몇 개를 보여줄지
    row: number; // 몇 줄을 보여줄지 (총 개수 = col * row)
    posts: PostData[]; // 표시할 포스트 데이터 리스트
}

const ArchiveBox: React.FC<ArchiveProps> = ({ col, row, posts }) => {
    const navigate = useNavigate();

    // col 값에 따른 Tailwind class 매핑 (동적 클래스 생성을 위해)
    const gridColsClass = {
        1: 'grid-cols-1',
        2: 'grid-cols-1 md:grid-cols-2',
        3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    }[col] || 'grid-cols-1 md:grid-cols-3';

    // 보여줄 포스트 개수 계산
    const displayLimit = col * row;
    const displayPosts = posts.slice(0, displayLimit);

    return (
        <section className="w-full">
            <div className="w-full border border-sky-300 rounded-xl bg-white/80 p-8 shadow-sm">
                <div className="text-lg font-bold text-sky-700 mb-6 border-b border-sky-100 pb-2">
                    Archive
                </div>

                <div className={`grid ${gridColsClass} gap-6`}>
                    {displayPosts.map((post) => (
                        <ThumbnailPostCard
                            key={post.id}
                            post={post}
                            onClick={(id) => navigate(`/post?id=${id}`)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ArchiveBox;