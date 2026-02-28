const fs = require('fs');
const path = require('path');

/**
 * data 폴더 내의 실제 폴더 목록을 읽어 list.json을 최신화합니다.
 */
function syncListJson() {
    const dataDir = path.join(__dirname, 'data');
    const listPath = path.join(dataDir, 'list.json');

    if (!fs.existsSync(dataDir)) return;

    // 1. id로 시작하는 폴더 목록만 필터링
    const folders = fs.readdirSync(dataDir).filter(name => {
        const fullPath = path.join(dataDir, name);
        return fs.statSync(fullPath).isDirectory() && name.startsWith('id');
    });

    // 2. 내림차순 정렬 (최신글이 위로)
    folders.sort((a, b) => b.localeCompare(a));

    // 3. 파일 쓰기
    fs.writeFileSync(listPath, JSON.stringify(folders, null, 4), 'utf8');
    console.log(`[동기화 완료] 총 ${folders.length}개의 포스트가 list.json에 반영되었습니다.`);
}


function generatePost() {
    const now = new Date();
    const YYYY = now.getFullYear();
    const MM = String(now.getMonth() + 1).padStart(2, '0');
    const DD = String(now.getDate()).padStart(2, '0');
    const dateStr = `${YYYY}${MM}${DD}`;
    const HH = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');

    const dataDir = path.join(__dirname, 'data');
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

    const folders = fs.readdirSync(dataDir).filter(f => f.startsWith(`id${dateStr}`));
    const nextSeq = String(folders.length + 1).padStart(4, '0');
    const timestamp = `${dateStr}${HH}${mm}${ss}`;
    const folderId = `id${timestamp}${nextSeq}`;
    const dirPath = path.join(dataDir, folderId);

    // 1. 포스트 메인 폴더 생성
    fs.mkdirSync(dirPath, { recursive: true });

    // 2. 포스트 내부 images 폴더 생성
    const imagesDir = path.join(dirPath, 'images');
    fs.mkdirSync(imagesDir, { recursive: true });

    const postData = {
        "id": `${timestamp}_${nextSeq}`,
        "title": `${nextSeq}번째 블로그 글`,
        "category": ["Tech"], // 기본 카테고리 설정
        "tags": ["JSON", "Web"],
        "createdAt": `${dateStr}${HH}${mm}`,
        // 3. 썸네일 경로를 내부 images 폴더 기준으로 변경
        "thumbnailUrl": "images/thumb1.jpg",
        "description": `${nextSeq}`
    };

    fs.writeFileSync(path.join(dirPath, 'data.json'), JSON.stringify(postData, null, 4), 'utf8');
    fs.writeFileSync(path.join(dirPath, 'content.md'), `# ${postData.title}\n\n내용을 입력하세요.`, 'utf8');

    syncListJson();

    console.log(`[생성 완료] 경로: ${dirPath}`);
    console.log(`[폴더 생성] 이미지 경로: ${imagesDir}`);
}



// 스크립트 실행 시 새 글 생성 (필요에 따라 syncListJson()만 단독 호출 가능)
generatePost();