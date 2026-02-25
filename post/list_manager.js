// node list_manager.js

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const OUTPUT_FILE = path.join(DATA_DIR, 'list.json');

try {
    if (!fs.existsSync(DATA_DIR)) {
        process.exit(1);
    }

    const folders = fs.readdirSync(DATA_DIR)
        .filter(file => {
            const fullPath = path.join(DATA_DIR, file);
            return fs.statSync(fullPath).isDirectory() && file.startsWith('id');
        })
        .sort((a, b) => b.localeCompare(a));

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(folders, null, 2), 'utf8');

    console.log(`[Success] ${folders.length} posts found in ./data/`);
} catch (err) {
    console.error('[Error]', err.message);
}

