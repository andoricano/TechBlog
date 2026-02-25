async function loadPosts(containerId, limit = null) {
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
        // 1. list_manager.js가 만든 list.json 로드
        const listRes = await fetch('./post/data/list.json');
        if (!listRes.ok) throw new Error('list.json 로드 실패');

        const folderIds = await listRes.json();

        // 2. limit 설정 (개수 제한)
        const targetIds = limit ? folderIds.slice(0, limit) : folderIds;

        // 3. 각 폴더 안의 data.json들을 비동기로 병렬 로드
        const postPromises = targetIds.map(async (id) => {
            try {
                const res = await fetch(`./post/data/${id}/data.json`);
                return res.ok ? await res.json() : null;
            } catch (err) {
                return null;
            }
        });

        const posts = (await Promise.all(postPromises)).filter(p => p !== null);

        if (posts.length === 0) {
            container.innerHTML = '<p class="text-slate-400">등록된 포스트가 없습니다.</p>';
            return;
        }

        // 4. 렌더링
        container.innerHTML = posts.map(post => `
            <div class="border border-sky-200 rounded-2xl p-5 bg-white shadow-sm hover:shadow-md transition-all cursor-pointer">
                <img src="${post.thumbnailUrl}" class="w-full h-40 object-cover rounded-xl mb-4" onerror="this.src='https://placehold.co/400x300?text=No+Image'">
                <h3 class="text-lg font-bold text-slate-800">${post.title}</h3>
                <p class="text-sm text-slate-500 mt-2">${post.description}</p>
                <div class="mt-4 text-xs text-slate-400">${post.createdAt}</div>
            </div>
        `).join('');

    } catch (err) {
        console.error(`[Error] ${containerId} 로딩 실패:`, err);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadPosts('recent-project', 1);
    loadPosts('archive-list', 4);
});