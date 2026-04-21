import React, { useEffect, useState } from 'react';
import { marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import MdIdxTable from '../mdviewer/MdIdxTable';
import { generateToc, TocItem } from '../mdviewer/utils/parser';
import { MD_BLOCK_TAGS } from './utils/parser';

marked.use(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const lowerLang = lang ? lang.toLowerCase() : 'plaintext';
      const language = hljs.getLanguage(lowerLang) ? lowerLang : 'plaintext';
      return hljs.highlight(code, { language }).value;
    },
  })
);

interface PublicMdViewerProps {
  content: string;
}

const PublicMdViewer: React.FC<PublicMdViewerProps> = ({ content }) => {
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [toc, setToc] = useState<TocItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  console.log("content post : ", content)
  useEffect(() => {
    const parseAndRender = async () => {
      if (!content) return;
      setIsLoading(true);

      try {
        let processedMd = content;

        // 1. 로컬 코드 블록 처리 (@code)
        const localCodeRegex = new RegExp(
          `@code\\[(.*?)\\]\\(\\n${MD_BLOCK_TAGS.CODE_START}\\n([\\s\\S]*?)\\n${MD_BLOCK_TAGS.CODE_END}\\n\\)`,
          'g'
        );
        processedMd = processedMd.replace(localCodeRegex, (_, lang, code) => `\`\`\`${lang}\n${code}\n\`\`\``);

        // 2. Gist 블록 처리 (@gist) - 하단 바 버전
        const gistBlockRegex = new RegExp(
          `@gist\\[(.*?)\\]\\(\\n${MD_BLOCK_TAGS.GIST_START}\\n([\\s\\S]*?)\\n${MD_BLOCK_TAGS.GIST_END}\\n\\)`,
          'g'
        );

        processedMd = processedMd.replace(gistBlockRegex, (_, lang, content) => {
          const firstNewLineIndex = content.indexOf('\n');
          const gistUrl = content.substring(0, firstNewLineIndex).trim();
          const code = content.substring(firstNewLineIndex + 1);
          const webUrl = gistUrl.split('/raw')[0];

          // 코드 블록을 먼저 배치하고, 2칸 개행 후 하단 바를 배치
          return `\`\`\`${lang}
${code.trim()}
\`\`\`

<div style="padding: 4px 12px; background: #f1f5f9; border-left: 4px solid #64748b; font-family: sans-serif; display: flex; justify-content: space-between; align-items: center; margin-top: -16px;">
<span style="font-size: 11px; color: #475569; font-weight: bold;">GIST</span>
<a href="${webUrl}" target="_blank" rel="noopener noreferrer" style="font-size: 11px; color: #0284c7; text-decoration: none;">View on GitHub ↗</a>
</div>`;
        });

        // 목차 생성
        setToc(generateToc(processedMd));

        // 3. Renderer 설정
        const renderer = new marked.Renderer();

        renderer.heading = ({ text, depth }) => {
          const anchorId = text.toLowerCase().trim().replace(/[^\wㄱ-ㅎㅏ-ㅣ가-힣]+/g, '-');
          const fontSize = depth === 1 ? '1.875rem' : '1.5rem';
          return `<h${depth} id="${anchorId}" class="scroll-mt-24 font-bold" style="margin-top: 2rem; margin-bottom: 1rem; font-size: ${fontSize};">${text}</h${depth}>`;
        };

        renderer.link = ({ href, tokens }) => {
          const linkText = tokens.map((t) => t.raw).join('').trim();
          return `<a href="${href}" target="_blank" rel="noopener noreferrer" style="color: #0284c7; text-decoration: underline;">${linkText}</a>`;
        };

        // 4. 파싱 실행 (이미 외부에서 marked.use로 highlight가 등록됨)
        const parsed = await marked.parse(processedMd, {
          renderer,
          breaks: true,
          gfm: true,
        });

        setHtmlContent(typeof parsed === 'string' ? parsed : '');
      } catch (err) {
        console.error("MdViewer Error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    parseAndRender();
  }, [content]);

  if (isLoading) return <div className="text-center py-20 text-slate-400 animate-pulse">데이터를 불러오는 중...</div>;






  return (
    <div className="w-full min-h-full px-4 lg:px-0">
      <style>{`
        .hljs-comment,
        .hljs-quote {
          color: #ffffff !important;
          font-style: italic;
        }
        #post-content pre {
          overflow-x: auto !important;
        }
      `}</style>

      {/* 중앙 정렬 컨테이너: 간격(gap)을 줄여 본문을 더 넓게 확보 */}
      <div className="flex flex-col lg:flex-row justify-center gap-6 xl:gap-8">

        {/* [2] 왼쪽: TOC (너비를 w-72에서 w-60으로 축소) */}
        <aside
          className="hidden lg:block flex-shrink-0 w-60"
          style={{ position: 'sticky', top: '5rem', height: 'fit-content' }}
        >
          <MdIdxTable toc={toc} />
        </aside>

        {/* [5] 중앙: 본문 (max-w를 5xl에서 1000px급으로 상향) */}
        <article
          id="post-content"
          className="prose prose-sky max-w-[1000px] flex-1 min-w-0 pb-20"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        {/* [2] 오른쪽: 균형용 더미 (왼쪽과 동일하게 w-60) */}
        <aside className="hidden lg:block flex-shrink-0 w-60" />
      </div>
    </div>
  );


};

export default PublicMdViewer;