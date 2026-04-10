import React from 'react';
import { formatDaily, getCategoryNameById } from '../../services/util';
import { useStore } from '../../store/useStore';
import { IPost } from '../../types/post';

interface Props {
    post: IPost;
    onClick: (id: string) => void;
}
const ThumbnailPostCard: React.FC<Props> = ({ post, onClick }) => {
    // 1. 필요한 메타데이터 추출
    const { title, thumbnailUrl, category, createdAt, tags } = post.meta;

    // 2. content의 앞부분을 description 대용으로 사용 (데이터 구조에 따라 조절 가능)
    const description = post.content || "No description provided.";

    return (
        <div
            onClick={() => onClick(post.id)}
            className="border border-sky-100 rounded-2xl p-5 bg-white shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col h-full"
        >
            {/* 썸네일 영역 */}
            <div className="overflow-hidden rounded-xl mb-4 h-40 bg-slate-50">
                <img
                    src={thumbnailUrl}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://placehold.co/400x300?text=No+Image';
                    }}
                />
            </div>

            {/* 카테고리 (이제 category.slug를 직접 사용) */}
            <div className="mb-2">
                <span className="text-[10px] font-bold text-sky-500 uppercase tracking-widest px-2 py-0.5 bg-sky-50 rounded-md">
                    {category.slug}
                </span>
            </div>

            {/* 제목 및 설명 */}
            <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-800 line-clamp-1 group-hover:text-sky-600 transition-colors">
                    {title}
                </h3>
                <p className="text-sm text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    {description}
                </p>
            </div>

            {/* 하단 정보 섹션 */}
            <div className="mt-5 pt-4 border-t border-slate-50 flex flex-col gap-3">
                <div className="text-[11px] font-medium text-slate-400">
                    <span className="text-slate-300 mr-1.5">Date</span>
                    {/* formatDaily 함수가 있다면 그대로 사용, 없다면 localeString 사용 */}
                    {createdAt.split('T')[0]}
                </div>

                <div className="flex flex-wrap gap-2">
                    {tags.slice(0, 3).map(tag => (
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