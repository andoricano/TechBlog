export const parseMarkdown = async (postId: string) => {
  try {
    const response = await fetch(`/post/data/${postId}/content.md`);
    if (!response.ok) throw new Error("Markdown 로드 실패");

    let processedMd = await response.text();

    // 1. 이미지 경로 치환
    processedMd = processedMd.replace(
      /(!\[.*?\])\((?:images\/|@\[image\]\(")(.*?)(\)"|\))/g,
      `$1(/post/data/${postId}/images/$2)`
    );

    // 2. @[code] 커스텀 문법 탐색
    const codeFileRegex = /@\[code\]\("(.*?)"\)/g;
    const codeMatches = Array.from(processedMd.matchAll(codeFileRegex));

    if (codeMatches.length > 0) {
      const fetchPromises = codeMatches.map(async ([fullPattern, pathOrUrl]) => {
        try {
          const fetchUrl = pathOrUrl.startsWith('http')
            ? pathOrUrl
            : `/post/data/${postId}/${pathOrUrl}`;

          const res = await fetch(fetchUrl);

          // 타입 에러 방지를 위해 return 객체에 pathOrUrl을 포함시킴
          if (!res.ok) return {
            fullPattern,
            pathOrUrl,
            content: `// 로드 실패: ${pathOrUrl}`
          };

          const code = await res.text();
          const ext = pathOrUrl.split('.').pop()?.split('?')[0] || 'plaintext';

          return {
            fullPattern,
            pathOrUrl,
            content: `\`\`\`${ext}\n${code}\n\`\`\``
          };
        } catch (e) {
          return {
            fullPattern,
            pathOrUrl,
            content: `// 에러 발생: ${pathOrUrl}`
          };
        }
      });

      const results = await Promise.all(fetchPromises);

      // 3. 치환 작업 및 Gist 링크 바 추가
      results.forEach(({ fullPattern, content, pathOrUrl }) => {
        let finalContent = content;

        if (pathOrUrl.includes('gist.githubusercontent.com')) {
          const publicUrl = pathOrUrl
            .replace('gist.githubusercontent.com', 'gist.github.com')
            .split('/raw')[0];
          finalContent += `\n\n[GIST_LINK](${publicUrl})`;
        }

        processedMd = processedMd.split(fullPattern).join(finalContent);
      });
    }

    return processedMd;
  } catch (error) {
    console.error(error);
    return "콘텐츠를 불러올 수 없습니다.";
  }
};

export interface TocItem {
  level: number;
  text: string;
  anchorId: string;
}

export const generateToc = (markdown: string): TocItem[] => {
  const currentToc: TocItem[] = [];
  const lines = markdown.split('\n');

  lines.forEach((line) => {
    // # (H1)과 ## (H2)만 매칭
    const match = line.match(/^(#{1,2})\s+(.*)/);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim();

      // 특수문자 제거 및 공백을 하이픈으로 변경하여 ID 생성
      const anchorId = text
        .toLowerCase()
        .replace(/[^\wㄱ-ㅎㅏ-ㅣ가-힣\s]+/g, '')
        .trim()
        .replace(/\s+/g, '-');

      currentToc.push({ level, text, anchorId });
    }
  });

  return currentToc;
};