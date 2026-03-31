import React from 'react';
import { formatDaily, getCategoryNameById } from '../../services/util';
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
            className="border border-sky-100 rounded-2xl p-5 bg-white shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col h-full"
        >
            {/* 썸네일 영역 */}
            <div className="overflow-hidden rounded-xl mb-4 h-40 bg-slate-50">
                <img
                    src={post.thumbnailUrl}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://placehold.co/400x300?text=No+Image';
                    }}
                />
            </div>

            {/* 카테고리 */}
            <div className="mb-2">
                <span className="text-[10px] font-bold text-sky-500 uppercase tracking-widest px-2 py-0.5 bg-sky-50 rounded-md">
                    {categoryName}
                </span>
            </div>

            {/* 제목 및 설명 */}
            <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-800 line-clamp-1 group-hover:text-sky-600 transition-colors">
                    {post.title}
                </h3>
                <p className="text-sm text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    {post.description}
                </p>
            </div>


            <div className="mt-5 pt-4 border-t border-slate-50 flex flex-col gap-3">
                <div className="text-[11px] font-medium text-slate-400">
                    <span className="text-slate-300 mr-1.5">Date</span>
                    {formatDaily(post.createdAt)}
                </div>

                <div className="flex flex-wrap gap-2">
                    {post.tags.slice(0, 3).map(tag => (
                        <span
                            key={tag}
                            className="text-[10px] text-slate-500 hover:text-sky-600 transition-colors"
                        >
                            #{tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ThumbnailPostCard;