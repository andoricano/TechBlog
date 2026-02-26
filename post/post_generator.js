const fs = require('fs');
const path = require('path');

function generatePost() {
    const now = new Date();
    const YYYY = now.getFullYear();
    const MM = String(now.getMonth() + 1).padStart(2, '0');
    const DD = String(now.getDate()).padStart(2, '0');
    const dateStr = `${YYYY}${MM}${DD}`; // 오늘 날짜 8자리

    const HH = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');

    const dataDir = path.join(__dirname, 'data');
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

    // 1. 오늘 날짜로 시작하는 폴더 개수 파악
    const folders = fs.readdirSync(dataDir);
    const todayPosts = folders.filter(name => name.startsWith(`id${dateStr}`));
    const nextSeq = String(todayPosts.length + 1).padStart(4, '0'); // 다음 번호 (0001, 0002...)

    const timestamp = `${dateStr}${HH}${mm}${ss}`;
    const folderId = `id${timestamp}${nextSeq}`;
    const dataId = `${timestamp}_${nextSeq}`;

    const dirPath = path.join(dataDir, folderId);

    // 2. 폴더 생성
    fs.mkdirSync(dirPath, { recursive: true });

    // 3. data.json 내용
    const postData = {
        "id": dataId,
        "title": `${nextSeq}번째 블로그 글`, // 오늘 날짜 기준 순번
        "content": "md",
        "tags": ["JSON", "Web"],
        "createdAt": `${dateStr}${HH}${mm}`,
        "thumbnailUrl": "/images/thumb1.jpg",
        "description": `${nextSeq}`
    };

    // 4. 파일 저장
    fs.writeFileSync(path.join(dirPath, 'data.json'), JSON.stringify(postData, null, 4), 'utf8');

    // 5. list.json 업데이트
    updateListJson(folderId);

    console.log(`[생성 완료] 순번: ${nextSeq} | 경로: ${dirPath}`);
}

function updateListJson(newId) {
    const listPath = path.join(__dirname, 'data', 'list.json');
    let list = [];
    if (fs.existsSync(listPath)) {
        list = JSON.parse(fs.readFileSync(listPath, 'utf8'));
    }
    if (!list.includes(newId)) {
        list.unshift(newId);
        fs.writeFileSync(listPath, JSON.stringify(list, null, 4), 'utf8');
    }
}

generatePost();