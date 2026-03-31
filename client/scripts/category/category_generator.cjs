const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'category.txt');
const outputPath = path.join(__dirname, '../../public/post/category_map.json');

try {
    const content = fs.readFileSync(inputPath, 'utf-8');
    const lines = content.split(/\r?\n/).filter(line => line.trim() && !line.startsWith('#'));

    const result = [];
    const stack = [];
    let globalCounter = 0;

    lines.forEach(line => {
        const indentMatch = line.match(/^(\s*)/);
        const indentSize = indentMatch ? indentMatch[0].length : 0;
        const depth = Math.floor(indentSize / 4);
        const name = line.trim();

        const currentId = ++globalCounter;

        while (stack.length > 0 && stack[stack.length - 1].depth >= depth) {
            stack.pop();
        }

        const parentId = stack.length > 0 ? stack[stack.length - 1].id : null;

        result.push({ id: currentId, name, parentId });

        stack.push({ id: currentId, depth });
    });

    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
    console.log(`✅ 성공: ${result.length}개의 카테고리가 저장되었습니다.`);
} catch (err) {
    console.error('❌ 실패:', err.message);
}