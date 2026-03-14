import React, { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import { useStore } from '../store/useStore'; // 실제 스토어 경로로 수정해주세요.
import { Post } from '../services/util';     // 실제 타입 경로로 수정해주세요.

interface TocItem {
    level: number;
    text: string;
    anchorId: string;
}

const PostPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Zustand 스토어에서 상태와 fetch 함수를 가져옵니다.
    const { posts, fetchPosts, isLoading } = useStore();

    const postId = searchParams.get('id');

    // 포스트 정보를 결정합니다. (Navigation state -> Store 검색)
    const postInfo = useMemo(() => {
        return (location.state?.post as Post) || posts.find((p) => p.id === postId);
    }, [location.state, posts, postId]);

    const [htmlContent, setHtmlContent] = useState<string>('');
    const [toc, setToc] = useState<TocItem[]>([]);

    // 1. 데이터 부재 시(직접 링크 접속 등) 스토어 데이터 로드
    useEffect(() => {
        if (!postId) {
            navigate('/archive');
            return;
        }

        if (posts.length === 0 && !isLoading) {
            fetchPosts();
        }
    }, [postId, posts.length, isLoading, fetchPosts, navigate]);


    useEffect(() => {
        if (!postId) return;

        const fetchContent = async () => {
            try {
                // 1. 기본 마크다운 파일 로드
                const res = await fetch(`/post/data/${postId}/content.md`);
                if (!res.ok) throw new Error('파일을 찾을 수 없습니다.');

                let markdown = await res.text();

                // --- [수정된 부분: 외부 코드 파일 전처리 로직 시작] ---
                const codeFileRegex = /@\[code\]\((.*?)\)/g;
                const matches = Array.from(markdown.matchAll(codeFileRegex));

                // 찾은 모든 패턴에 대해 루프를 돌며 실제 코드를 가져와 치환합니다.
                for (const match of matches) {
                    const fullPattern = match[0]; // @[code](main.cpp)
                    const fileName = match[1];    // main.cpp
                    const extension = fileName.split('.').pop() || 'plaintext';

                    try {
                        const codeRes = await fetch(`/post/data/${postId}/${fileName}`);
                        if (codeRes.ok) {
                            const codeText = await codeRes.text();
                            // 마크다운 코드 블록 문법으로 변경합니다.
                            const replacement = `\`\`\`${extension}\n${codeText}\n\`\`\``;
                            markdown = markdown.replace(fullPattern, replacement);
                        }
                    } catch (e) {
                        console.error(`${fileName} 파일을 로드하는 중 오류가 발생했습니다:`, e);
                    }
                }
                // --- [전처리 로직 끝] ---

                const currentToc: TocItem[] = [];
                const renderer = new marked.Renderer();

                renderer.image = ({ href, title, text }) => {
                    const isFullUrl = href.startsWith('http') || href.startsWith('/');

                    const finalHref = isFullUrl
                        ? href
                        : `/post/data/${postId}/${href}`;

                    return `<img src="${finalHref}" alt="${text}" title="${title || ''}" style="max-width: 100%; height: auto; display: block; margin: 2rem auto; border-radius: 8px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);" />`;
                };
                // 제목 파싱 및 TOC 추출
                renderer.heading = ({ text, depth }) => {
                    const anchorId = text.toLowerCase().replace(/[^\wㄱ-ㅎㅏ-ㅣ가-힣]+/g, '-');
                    if (depth <= 3) {
                        currentToc.push({ level: depth, text, anchorId });
                    }
                    return `<h${depth} id="${anchorId}" class="scroll-mt-20">${text}</h${depth}>`;
                };

                // 코드 블록 하이라이팅 (highlight.js)
                renderer.code = ({ text, lang }) => {
                    const language = lang && hljs.getLanguage(lang) ? lang : 'plaintext';
                    const highlighted = hljs.highlight(text, { language }).value;
                    return `<pre><code class="hljs language-${language}">${highlighted}</code></pre>`;
                };

                const parsed = await marked.parse(markdown, { renderer });
                setHtmlContent(typeof parsed === 'string' ? parsed : '');
                setToc(currentToc);
            } catch (err) {
                console.error('콘텐츠 로드 에러:', err);
                setHtmlContent('<p class="text-center py-20 text-slate-400">본문을 불러올 수 없습니다.</p>');
            }
        };

        fetchContent();
        window.scrollTo(0, 0);
    }, [postId]);

    // 데이터가 로드될 때까지 대기 처리
    if (isLoading && !postInfo) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white">
                <p className="text-slate-400 animate-pulse">데이터를 불러오는 중입니다...</p>
            </div>
        );
    }

    if (!postInfo) return null;

    return (
        <div className="bg-slate-50 min-h-screen">
            <main className="max-w-7xl mx-auto px-6 py-12 bg-white shadow-sm min-h-screen">
                {/* 포스트 헤더 섹션 */}
                <section className="text-center mb-16">
                    <h2 className="text-4xl font-extrabold text-slate-800 mb-4">
                        {postInfo.title}
                    </h2>
                    <div className="text-slate-400 font-medium">{postInfo.createdAt}</div>
                    <div className="mt-4 flex justify-center gap-2">
                        {postInfo.tags?.map((tag) => (
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
                                {toc.length > 0 ? (
                                    toc.map((item, idx) => (
                                        <a
                                            key={idx}
                                            href={`#${item.anchorId}`}
                                            className={`block text-slate-500 hover:text-sky-600 transition-colors ${item.level === 3 ? 'pl-4 text-xs' : 'font-medium'
                                                }`}
                                        >
                                            {item.text}
                                        </a>
                                    ))
                                ) : (
                                    <p className="text-xs text-slate-400">목차가 없습니다.</p>
                                )}
                            </div>
                        </nav>
                    </aside>

                    {/* 본문 기사 영역 */}
                    <article
                        id="post-content"
                        className="prose prose-sky max-w-none min-h-[400px] border-b border-slate-100 pb-16 lg:col-span-6 
                                   prose-pre:bg-transparent prose-pre:p-0"
                        dangerouslySetInnerHTML={{
                            __html: htmlContent || '<p class="text-slate-300 text-center mt-20">내용을 로드하는 중입니다...</p>'
                        }}
                    />

                    <aside className="hidden lg:block lg:col-span-2" />
                </section>
            </main>
        </div>
    );
};

export default PostPage;