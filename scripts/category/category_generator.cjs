const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'category.txt');
const outputPath = path.join(__dirname, '../../public/post/category_map.json');

try {
    const content = fs.readFileSync(inputPath, 'utf-8');
    // 줄바꿈 기준 분리 및 불필요한 공백/주석 제거
    const lines = content.split(/\r?\n/).filter(line => line.trim() && !line.startsWith('#'));

    const result = [];
    const stack = [];

    lines.forEach(line => {
        // 앞부분 공백 개수 계산
        const indentMatch = line.match(/^(\s*)/);
        const indentSize = indentMatch ? indentMatch[0].length : 0;

        // 4칸 공백을 1단계 depth로 계산 (Tab 사용 시 \t의 length에 따라 조절 필요)
        const depth = Math.floor(indentSize / 4);
        const name = line.trim();

        const parent = depth === 0 ? "master" : stack[depth - 1];

        result.push({ name, parent });

        // 현재 뎁스에 이름 저장하여 자식들이 참조하게 함
        stack[depth] = name;
    });

    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
    console.log(`✅ 성공: ${result.length}개의 카테고리가 public/post/category_map.json에 저장되었습니다.`);
} catch (err) {
    console.error('❌ 실패:', err.message);
}