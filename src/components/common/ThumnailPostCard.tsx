import React from 'react';

import { getCategoryNameById } from '../../services/util';
import { useStore } from '../../store/useStore';


export interface PostData {
    id: string;
    title: string;
    category: string;
    tags: string[];
    createdAt: string;
    thumbnailUrl: string;
    description: string;
}

interface Props {
    post: PostData;
    onClick: (id: string) => void;
}

const ThumbnailPostCard: React.FC<Props> = ({ post, onClick }) => {
    const categoryMap = useStore((state) => state.categoryMap);
    const categoryName = getCategoryNameById(categoryMap, post.category);
    return (
        <div
            onClick={() => onClick(post.id)}
            className="border border-sky-200 rounded-2xl p-5 bg-white shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
            <div className="overflow-hidden rounded-xl mb-4 h-40">
                <img
                    src={post.thumbnailUrl}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://placehold.co/400x300?text=No+Image';
                    }}
                />
            </div>

            <div className="flex gap-2 mb-2">
                <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider">
                    {categoryName}
                </span>
            </div>

            <h3 className="text-lg font-bold text-slate-800 line-clamp-1 group-hover:text-sky-600 transition-colors">
                {post.title}
            </h3>
            <p className="text-sm text-slate-500 mt-2 line-clamp-2 min-h-[40px]">
                {post.description}
            </p>

            <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center text-xs text-slate-400">
                <span className="font-mono">{post.createdAt}</span>
                <div className="flex gap-1">
                    {post.tags.slice(0, 2).map(tag => (
                        <span key={tag}>#{tag}</span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ThumbnailPostCard;