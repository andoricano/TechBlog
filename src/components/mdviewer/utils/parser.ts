/**
 * 모든 커스텀 문법을 한 번에 처리하는 동기 파서
 */
export const parseMarkdown = (content: string): string => {
  if (!content) return "";

  try {
    let processedMd = content;

    // 1. 이미지 경로 치환
    processedMd = processedMd.replace(
      /(!\[.*?\])\((?:images\/|@\[image\]\(")(.*?)(\)"|\))/g,
      `$1($2)`
    );

    // 2. 직접 입력 코드 블록 변환 (@code)
    processedMd = parseCustomCodeBlock(processedMd);

    // 3. Gist 링크 변환 (@gist) -> 커스텀 렌더러가 [GIST_LINK]를 처리함
    processedMd = parseCustomGist(processedMd);

    return processedMd;
  } catch (error) {
    console.error("parseMarkdown 에러:", error);
    return content;
  }
}


/**
 * @gist[name](link) 문법을 탐색하여
 * 표준 마크다운 링크와 GIST_LINK 형식으로 변환합니다.
 */
const parseCustomGist = (content: string): string => {
  const gistRegex = /@gist\[([^\]]+)\]\((.*?)\)/g;

  return content.replace(gistRegex, (_, rawTitle, pathOrUrl) => {
    const title = rawTitle.trim();
    const url = pathOrUrl.trim();

    let publicUrl = url;
    if (url.includes('gist.githubusercontent.com')) {
      publicUrl = url
        .replace('gist.githubusercontent.com', 'gist.github.com')
        .split('/raw')[0];
    }

    return `\n\n**${title}**\n[GIST_LINK](${publicUrl})\n\n`;
  });
};


/**
 * @code[name](code) 문법 변환
 */
const parseCustomCodeBlock = (content: string): string => {
  // 정규식
  return content.replace(/@code\[(.*?)\s+(.*?)\]\(([\s\S]*?)\n\)/g, (match, type, title, code) => {

    return `### ${title}\n\n\`\`\`${type}\n${code}\n\`\`\``;
  });
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













/**
 * 전달받은 raw 마크다운(content) 내부의 이미지 경로를 수정하고,
 * @[code] 커스텀 문법을 탐색하여 실제 코드를 fetch하여 합쳐줍니다.
 */
// export const parseMarkdown = async (content: string): Promise<string> => {
//   try {
//     // 0. 초기 텍스트 설정 (이미 가져온 content를 기반으로 시작)
//     let processedMd = content;

//     // 1. 이미지 경로 치환
//     processedMd = processedMd.replace(
//       /(!\[.*?\])\((?:images\/|@\[image\]\(")(.*?)(\)"|\))/g,
//       `$1($2)`
//     );

//     // 2. @[code] 커스텀 문법 탐색 (@[code]("path"))
//     const codeFileRegex = /@\[code\]\("(.*?)"\)/g;
//     const codeMatches = Array.from(processedMd.matchAll(codeFileRegex));

//     if (codeMatches.length > 0) {
//       const fetchPromises = codeMatches.map(async ([fullPattern, pathOrUrl]) => {
//         try {
//           const fetchUrl = pathOrUrl.startsWith('http')
//             ? pathOrUrl
//             : `/post/data/${postId}/${pathOrUrl}`;

//           const res = await fetch(fetchUrl);

//           if (!res.ok) return {
//             fullPattern,
//             pathOrUrl,
//             content: `// 로드 실패: ${pathOrUrl}`
//           };

//           const code = await res.text();
//           const ext = pathOrUrl.split('.').pop()?.split('?')[0] || 'plaintext';

//           return {
//             fullPattern,
//             pathOrUrl,
//             content: `\`\`\`${ext}\n${code}\n\`\`\``
//           };
//         } catch (e) {
//           return {
//             fullPattern,
//             pathOrUrl,
//             content: `// 에러 발생: ${pathOrUrl}`
//           };
//         }
//       });

//       const results = await Promise.all(fetchPromises);

//       // 3. 치환 작업 및 Gist 링크 처리
//       results.forEach(({ fullPattern, content, pathOrUrl }) => {
//         let finalContent = content;

//         // Gist URL인 경우 원본 링크 추가
//         if (pathOrUrl.includes('gist.githubusercontent.com')) {
//           const publicUrl = pathOrUrl
//             .replace('gist.githubusercontent.com', 'gist.github.com')
//             .split('/raw')[0];
//           finalContent += `\n\n[GIST_LINK](${publicUrl})`;
//         }

//         // 전체 텍스트에서 해당 문법 부분을 실제 코드 블록으로 교체
//         processedMd = processedMd.split(fullPattern).join(finalContent);
//       });
//     }

//     return processedMd;
//   } catch (error) {
//     console.error("parseMarkdown 에러:", error);
//     return content || "콘텐츠 가공 중 에러가 발생했습니다.";
//   }
// };
