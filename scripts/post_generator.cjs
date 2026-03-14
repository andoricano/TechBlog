const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../public/post/data');

/**
 * 인자 파싱 함수
 * -f [format], -l [lang1] [lang2]... 형태를 처리합니다.
 */
function parseArgs() {
    const args = process.argv.slice(2);
    const options = { format: 'text', langs: [] };

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (arg === '-f') {
            options.format = args[i + 1] || 'text';
            i++;
        } else if (arg.startsWith('-l')) {
            // -l 뒤에 붙어있는 경우 (예: -lcpp)
            let firstLang = arg.substring(2);
            if (firstLang) {
                options.langs.push(firstLang);
            } else {
                // -l 뒤에 공백이 있는 경우, 다음 인자들을 확인하여 -로 시작하기 전까지 모두 언어로 취급
                while (args[i + 1] && !args[i + 1].startsWith('-')) {
                    options.langs.push(args[i + 1]);
                    i++;
                }
            }
        }
    }

    // 언어가 지정되지 않았을 경우 기본값 설정
    if (options.langs.length === 0) {
        options.langs = ['plaintext'];
    }
    
    return options;
}

function syncListJson() {
    const listPath = path.join(DATA_DIR, 'list.json');
    if (!fs.existsSync(DATA_DIR)) return;

    const folders = fs.readdirSync(DATA_DIR).filter(name => {
        const fullPath = path.join(DATA_DIR, name);
        return fs.statSync(fullPath).isDirectory() && /^\d/.test(name);
    });

    folders.sort((a, b) => b.localeCompare(a));
    fs.writeFileSync(listPath, JSON.stringify(folders, null, 4), 'utf8');
}

function generatePost() {
    const opts = parseArgs();
    const now = new Date();
    const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
    const timeStr = `${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;

    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

    const dailyFolders = fs.readdirSync(DATA_DIR).filter(f => f.startsWith(dateStr));
    const nextSeq = String(dailyFolders.length + 1).padStart(4, '0');
    const timestampId = `${dateStr}${timeStr}${nextSeq}`;
    const dirPath = path.join(DATA_DIR, timestampId);

    fs.mkdirSync(dirPath, { recursive: true });
    fs.mkdirSync(path.join(dirPath, 'images'), { recursive: true });

    // 태그 생성: 입력받은 모든 언어를 대문자로 변환하여 포함
    const tags = [...opts.langs.map(l => l.toUpperCase()), "Web"];

    const postData = {
        "id": timestampId,
        "title": `${nextSeq}번째 블로그 글`,
        "category": "20",
        "tags": tags,
        "createdAt": `${dateStr}${timeStr.substring(0, 4)}`,
        "thumbnailUrl": "images/thumb1.jpg",
        "description": `${nextSeq}번째 포스트 요약입니다.`
    };

    // 콘텐츠 생성 로직
    let content = `# ${postData.title}\n\n내용을 입력하세요.`;
    
    if (opts.format === 'code') {
        opts.langs.forEach(lang => {
            content += `\n\n\`\`\`${lang}\na\n\`\`\``;
        });
    }

    fs.writeFileSync(path.join(dirPath, 'data.json'), JSON.stringify(postData, null, 4), 'utf8');
    fs.writeFileSync(path.join(dirPath, 'content.md'), content, 'utf8');

    syncListJson();
    console.log(`[생성 완료] ID: ${timestampId} | 포맷: ${opts.format} | 언어들: ${opts.langs.join(', ')}`);
}

generatePost();