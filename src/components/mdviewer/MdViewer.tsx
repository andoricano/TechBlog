import React, { useEffect, useState } from 'react';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import { TocItem, parseMarkdown, generateToc } from './utils/parser';
import MdIdxTable from './MdIdxTable';

interface MdViewerProps {
  postId: string;
}

const MdViewer: React.FC<MdViewerProps> = ({ postId }) => {
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [toc, setToc] = useState<TocItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAndParse = async () => {
      setIsLoading(true);
      try {
        // 1. 커스텀 규칙 처리된 마크다운 가져오기 (@[code], @[image] 등)
        const processedMd = await parseMarkdown(postId);
        console.log(processedMd);
        // 2. TOC 추출 (#, ## 기반)
        const generatedToc = generateToc(processedMd);
        setToc(generatedToc);

        // 3. Marked 커스텀 렌더러 설정 (기존 로직 흡수)
        const renderer = new marked.Renderer();

        // 이미지 렌더링 최적화
        renderer.image = ({ href, title, text }) => {
          return `<img src="${href}" alt="${text}" title="${title || ''}" class="md-img" />`;
        };

        // 헤더 렌더링 (ID 부여하여 TOC와 연결)
        renderer.heading = ({ text, depth }) => {
          const anchorId = text.toLowerCase().replace(/[^\wㄱ-ㅎㅏ-ㅣ가-힣]+/g, '-');
          return `<h${depth} id="${anchorId}" class="scroll-mt-20">${text}</h${depth}>`;
        };

        // 코드 하이라이팅
        renderer.code = ({ text, lang }) => {
          const language = lang && hljs.getLanguage(lang) ? lang : 'plaintext';
          const highlighted = hljs.highlight(text, { language }).value;
          return `<pre><code class="hljs language-${language}">${highlighted}</code></pre>`;
        };



        renderer.link = ({ href, title, tokens }) => {
          const text = tokens.map(t => t.raw).join('').trim();

          const isGist = text === 'GIST_LINK';
          console.log("isGist?? : "+isGist)

          if (isGist) {
            return `
      <div class="gist-link-bar">
        <a href="${href}" target="_blank" rel="noopener noreferrer">
          📄 Gist 보기
        </a>
      </div>
    `;
          }

          return `<a href="${href}" title="${title || ''}">${text}</a>`;
        };

        const parsed = await marked.parse(processedMd, { renderer });
        setHtmlContent(typeof parsed === 'string' ? parsed : '');
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
        window.scrollTo(0, 0);
      }
    };

    loadAndParse();
  }, [postId]);

  if (isLoading) return <div className="text-center py-20 text-slate-400 animate-pulse">데이터를 불러오는 중...</div>;

  return (
    <section className="grid grid-cols-1 lg:grid-cols-10 gap-8">
      {/* 왼쪽 사이드바: TOC */}
      <aside className="hidden lg:block lg:col-span-2">
        <div className="sticky top-12">
          <MdIdxTable toc={toc} />
        </div>
      </aside>

      {/* 본문 영역 */}
      <article
        id="post-content"
        className="prose prose-sky max-w-none min-h-[400px] pb-16 lg:col-span-6 
                   prose-pre:bg-transparent prose-pre:p-0"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />

      {/* 오른쪽 여백 (기존 레이아웃 유지) */}
      <aside className="hidden lg:block lg:col-span-2" />
    </section>
  );
};

export default MdViewer;