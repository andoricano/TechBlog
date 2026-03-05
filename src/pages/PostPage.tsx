import React, { useEffect, useState } from 'react';
import { useLocation, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { marked } from 'marked';
import { Post, useStore } from '../store/useStore';

interface TocItem {
    level: number;
    text: string;
    anchorId: string;
}

const PostPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { posts } = useStore();

    const postId = searchParams.get('id');
    // Navigation state에서 post 객체 우선 수신, 없으면 store에서 검색
    const postInfo = (location.state?.post as Post) || posts.find((p) => p.id === postId);

    const [htmlContent, setHtmlContent] = useState<string>('');
    const [toc, setToc] = useState<TocItem[]>([]);

    useEffect(() => {
        if (!postId) {
            navigate('/archive');
            return;
        }

        const fetchContent = async () => {
            try {
                const res = await fetch(`/post/data/${postId}/content.md`);
                const markdown = await res.text();

                const currentToc: TocItem[] = [];
                const renderer = new marked.Renderer();

                // 제목 태그 파싱 및 TOC 추출
                renderer.heading = ({ text, depth }) => {
                    const anchorId = text.toLowerCase().replace(/[^\wㄱ-ㅎㅏ-ㅣ가-힣]+/g, '-');
                    if (depth <= 3) {
                        currentToc.push({ level: depth, text, anchorId });
                    }
                    return `<h${depth} id="${anchorId}" class="scroll-mt-20">${text}</h${depth}>`;
                };

                const parsed = await marked.parse(markdown, { renderer });
                setHtmlContent(typeof parsed === 'string' ? parsed : '');
                setToc(currentToc);
            } catch (err) {
                setHtmlContent('<p class="text-center py-20 text-slate-400">본문을 불러올 수 없습니다.</p>');
            }
        };

        fetchContent();
        window.scrollTo(0, 0);
    }, [postId, navigate]);

    if (!postInfo) return null;

    return (
        <div className="bg-slate-50 min-h-screen">
            {/* Header 영역은 상위 레이아웃에 있다고 가정하고 생략하거나 추가 가능 */}

            <main className="max-w-7xl mx-auto px-6 py-12 bg-white shadow-sm min-h-screen">
                {/* 포스트 헤더 섹션 */}
                <section className="text-center mb-16">
                    <h2 className="text-4xl font-extrabold text-slate-800 mb-4">
                        {postInfo.title}
                    </h2>
                    <div className="text-slate-400 font-medium">{postInfo.createdAt}</div>
                    <div className="mt-4 flex justify-center gap-2">
                        {postInfo.tags.map((tag) => (
                            <span key={tag} className="px-3 py-1 bg-sky-50 text-sky-600 rounded-full text-xs font-semibold">
                                #{tag}
                            </span>
                        ))}
                    </div>
                </section>

                <section className="grid grid-cols-1 lg:grid-cols-10 gap-8">
                    {/* 왼쪽 사이드바: TOC */}
                    <aside className="hidden lg:block lg:col-span-2">
                        <nav className="sticky top-12 p-5 border border-slate-200 rounded-xl bg-slate-50/50">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 border-b border-slate-200 pb-2">
                                Table of Contents
                            </h3>
                            <div className="text-sm space-y-2">
                                {toc.map((item, idx) => (
                                    <a
                                        key={idx}
                                        href={`#${item.anchorId}`}
                                        className={`block text-slate-500 hover:text-sky-600 transition-colors ${item.level === 3 ? 'pl-4 text-xs' : 'font-medium'
                                            }`}
                                    >
                                        {item.text}
                                    </a>
                                ))}
                            </div>
                        </nav>
                    </aside>

                    {/* 본문 기사 영역 */}
                    <article
                        id="post-content"
                        className="prose prose-sky max-w-none min-h-[400px] border-b border-slate-100 pb-16 lg:col-span-6"
                        dangerouslySetInnerHTML={{ __html: htmlContent || '<p class="text-slate-300 text-center mt-20">본문을 불러오는 중입니다...</p>' }}
                    />

                    <aside className="hidden lg:block lg:col-span-2" />
                </section>
            </main>

            {/* 푸터 영역: 다른 글 읽기 */}
            <footer className="max-w-7xl mx-auto px-6 my-10 p-12 border-t border-slate-100 bg-white">
                <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
                    <div className="hidden lg:block lg:col-span-2" />
                    <section className="lg:col-span-6">
                        <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                            <h3 className="text-lg font-bold text-slate-700">다른 글 읽기</h3>
                            <Link to="/archive" className="flex items-center gap-1 text-sm font-semibold text-sky-600 hover:text-sky-800 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                                전체 목록
                            </Link>
                        </div>

                        {/* 하단 리스트: 현재 포스트를 제외한 최신글 5개 */}
                        <div className="space-y-2">
                            {posts.filter(p => p.id !== postId).slice(0, 5).map(post => (
                                <div
                                    key={post.id}
                                    onClick={() => navigate(`/post?id=${post.id}`, { state: { post } })}
                                    className="cursor-pointer p-3 hover:bg-sky-50 rounded-lg transition-colors flex justify-between items-center group"
                                >
                                    <span className="text-slate-600 group-hover:text-sky-700 transition-colors">{post.title}</span>
                                    <span className="text-xs text-slate-400">{post.createdAt}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                    <div className="hidden lg:block lg:col-span-2" />
                </div>
            </footer>
        </div>
    );
};

export default PostPage;