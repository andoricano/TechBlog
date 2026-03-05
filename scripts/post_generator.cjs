const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../public/post/data');

/**
 * @function syncListJson
 * @description DATA_DIR 내의 포스트 폴더 목록을 읽어 최신순으로 정렬한 뒤 list.json 파일을 업데이트합니다.
 * 숫자로 시작하는 폴더만 유효한 포스트 폴더로 간주합니다.
 */
function syncListJson() {
    const listPath = path.join(DATA_DIR, 'list.json');

    if (!fs.existsSync(DATA_DIR)) {
        console.error(`[오류] 데이터 디렉토리를 찾을 수 없습니다: ${DATA_DIR}`);
        return;
    }

    const folders = fs.readdirSync(DATA_DIR).filter(name => {
        const fullPath = path.join(DATA_DIR, name);
        return fs.statSync(fullPath).isDirectory() && /^\d/.test(name);
    });

    folders.sort((a, b) => b.localeCompare(a));

    fs.writeFileSync(listPath, JSON.stringify(folders, null, 4), 'utf8');
    console.log(`[동기화 완료] 총 ${folders.length}개의 포스트가 list.json에 반영되었습니다.`);
}

/**
 * @function generatePost
 * @description 새로운 포스트를 위한 폴더와 기본 파일(data.json, content.md)을 생성합니다.
 * 폴더명과 ID는 'YYYYMMDDHHmmssSeq' 형식의 숫자로 통일됩니다.
 */
function generatePost() {
    const now = new Date();
    const YYYY = now.getFullYear();
    const MM = String(now.getMonth() + 1).padStart(2, '0');
    const DD = String(now.getDate()).padStart(2, '0');
    const dateStr = `${YYYY}${MM}${DD}`;
    const HH = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');

    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

    const dailyFolders = fs.readdirSync(DATA_DIR).filter(f => f.startsWith(dateStr));
    const nextSeq = String(dailyFolders.length + 1).padStart(4, '0');

    const timestampId = `${dateStr}${HH}${mm}${ss}${nextSeq}`;
    const dirPath = path.join(DATA_DIR, timestampId);

    fs.mkdirSync(dirPath, { recursive: true });
    const imagesDir = path.join(dirPath, 'images');
    fs.mkdirSync(imagesDir, { recursive: true });

    const postData = {
        "id": timestampId,
        "title": `${nextSeq}번째 블로그 글`,
        "category": ["Tech"],
        "tags": ["JSON", "Web"],
        "createdAt": `${dateStr}${HH}${mm}`,
        "thumbnailUrl": "images/thumb1.jpg",
        "description": `${nextSeq}번째 포스트 요약입니다.`
    };

    fs.writeFileSync(path.join(dirPath, 'data.json'), JSON.stringify(postData, null, 4), 'utf8');
    fs.writeFileSync(path.join(dirPath, 'content.md'), `# ${postData.title}\n\n내용을 입력하세요.`, 'utf8');

    syncListJson();

    console.log(`[생성 완료] ID/경로: ${timestampId}`);
}

generatePost();