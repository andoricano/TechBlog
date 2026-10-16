import React from 'react';
import { isStaticThumbnail, resolveThumbnailSrc, THUMBNAIL_FALLBACK } from '../../services/thumbnail';
import { IPost } from '../../types/post';

interface Props {
    post: IPost;
    onClick: (id: string) => void;
}
const ThumbnailPostCard: React.FC<Props> = ({ post, onClick }) => {
    const { title, thumbnailUrl, category, createdAt, tags } = post.meta;
    const FALLBACK_IMAGE = THUMBNAIL_FALLBACK;
    const description = post.meta.description;
    const thumbSrc = resolveThumbnailSrc(thumbnailUrl);
    // 로고형(정적 /thumbnail, 기본 이미지)은 여백을 주고, 외부(Cloudinary) 이미지는 영역을 꽉 채워 contain
    const isStatic = isStaticThumbnail(thumbSrc);

    return (
        <div
            onClick={() => onClick(post.id)}
            className="border border-sky-100 rounded-2xl p-5 bg-white shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col h-full"
        >
            {/* 썸네일 영역 */}
            {/* 모든 카드 썸네일은 16:9 고정 영역, 이미지는 잘리지 않도록 contain */}
            <div className="overflow-hidden rounded-xl mb-4 aspect-video bg-slate-50">
                <img
                    src={thumbSrc}
                    alt={title}
                    className={`w-full h-full object-contain ${isStatic ? 'p-4' : ''}`}
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (target.src !== window.location.origin + FALLBACK_IMAGE) {
                            target.src = FALLBACK_IMAGE;
                        }
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
                {description && (
                    <p className="text-sm text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                        {description}
                    </p>
                )}
            </div>

            {/* 하단 정보 섹션 */}
            <div className="mt-5 pt-4 border-t border-slate-50 flex flex-col gap-3">
                <div className="text-[11px] font-medium text-slate-400">
                    <span className="text-slate-300 mr-1.5">Date</span>
                    {createdAt?.split('T')[0]}
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