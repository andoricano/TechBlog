import React from 'react';
import { useNavigate } from 'react-router-dom';
import ThumbnailPostCard from './ThumnailPostCard';
import { Post } from '../../store/useStore';


interface ArchiveProps {
    col: number;
    row: number;
    posts: Post[];
    onPostClick: (id: string) => void;
}




const ArchiveBox: React.FC<ArchiveProps> = ({ col, row, posts, onPostClick }) => {
    // col 값에 따른 Tailwind class 매핑
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
        <div className={`grid ${gridColsClass} gap-6 w-full`}>
            {displayPosts.length > 0 ? (
                displayPosts.map((post) => (
                    <ThumbnailPostCard
                        key={post.id}
                        post={post}
                        onClick={() => onPostClick(post.id)}
                    />
                ))
            ) : (
                <div className="col-span-full py-20 text-center text-slate-400">
                    아카이브된 포스트가 없습니다.
                </div>
            )}
        </div>
    );
};



export default ArchiveBox;