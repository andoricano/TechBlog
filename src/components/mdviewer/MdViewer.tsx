import React, { useEffect, useState } from 'react';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import { TocItem, generateToc, parseMarkdown } from './utils/parser';
import MdIdxTable from './MdIdxTable';

interface MdViewerProps {
  content: string; // 이미 모든 가공(이미지 주소, 코드 치환 등)이 완료된 마크다운 문자열
}

const MdViewer: React.FC<MdViewerProps> = ({ content }) => {
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [toc, setToc] = useState<TocItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);



  useEffect(() => {
    const renderMarkdown = async () => {
      if (!content) return;
      setIsLoading(true);

      try {
        // 1. props로 받은 content를 가공하여 mdString에 할당
        let mdString = content;
        mdString = parseMarkdown(mdString);

        // 2. 가공된 mdString으로 TOC 추출
        const generatedToc = generateToc(mdString);
        setToc(generatedToc);

        // 3. Marked 커스텀 렌더러 설정
        const renderer = new marked.Renderer();

        renderer.image = ({ href, title, text }) => {
          return `<img src="${href}" alt="${text}" title="${title || ''}" class="md-img" />`;
        };

        renderer.heading = ({ text, depth }) => {
          const anchorId = text.toLowerCase().replace(/[^\wㄱ-ㅎㅏ-ㅣ가-힣]+/g, '-');
          return `<h${depth} id="${anchorId}" class="scroll-mt-20">${text}</h${depth}>`;
        };

        renderer.code = ({ text, lang }) => {

          console.log("lang:", lang)

          const language = lang && hljs.getLanguage(lang) ? lang : 'plaintext';
          const highlighted = hljs.highlight(text, { language }).value;
          return `<pre><code class="hljs language-${language}">${highlighted}</code></pre>`;
        };

        renderer.link = ({ href, title, tokens }) => {
          const linkText = tokens.map(t => t.raw).join('').trim();
          if (linkText === 'GIST_LINK') {
            return `
              <div class="gist-link-bar">
                <a href="${href}" target="_blank" rel="noopener noreferrer">
                  📄 Gist 보기
                </a>
              </div>
            `;
          }
          return `<a href="${href}" title="${title || ''}">${linkText}</a>`;
        };

        // 4. 최종 파싱 (가공 완료된 mdString 사용)
        const parsed = await marked.parse(mdString, { renderer });
        setHtmlContent(typeof parsed === 'string' ? parsed : '');
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
        window.scrollTo(0, 0);
      }
    };

    renderMarkdown();
  }, [content]);




  if (isLoading) return <div className="text-center py-20 text-slate-400 animate-pulse">본문을 구성 중입니다...</div>;

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

      {/* 오른쪽 여백 */}
      <aside className="hidden lg:block lg:col-span-2" />
    </section>
  );
};


export default MdViewer;