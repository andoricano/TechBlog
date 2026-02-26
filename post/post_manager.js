async function loadPosts(containerId, count = 6, basePath = './post/data', page = 1, usePaging = false) {
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
        const res = await fetch(`${basePath}/list.json`);
        const folderIds = await res.json(); // 최신순 정렬된 ID 배열

        // 1. 슬라이스 로직 (최신순에서 필요한 만큼 자르기)
        const start = (page - 1) * count;
        const targetIds = folderIds.slice(start, start + count);

        const posts = await Promise.all(targetIds.map(async (id) => {
            const dRes = await fetch(`${basePath}/${id}/data.json`);
            if (!dRes.ok) return null;
            const data = await dRes.json();
            // 이미지 경로 처리
            if (data.thumbnailUrl && !data.thumbnailUrl.startsWith('http')) {
                data.thumbnailUrl = `${basePath}/${id}/${data.thumbnailUrl}`;
            }
            return data;
        }));

        // 2. 렌더링
        container.innerHTML = posts.filter(p => p).map(post => `
            <div class="border border-sky-200 rounded-2xl p-5 bg-white shadow-sm hover:shadow-md transition-all cursor-pointer">
                <img src="${post.thumbnailUrl}" class="w-full h-40 object-cover rounded-xl mb-4" onerror="this.src='https://placehold.co/400x300?text=No+Image'">
                <h3 class="text-lg font-bold text-slate-800">${post.title}</h3>
                <p class="text-sm text-slate-500 mt-2 line-clamp-2">${post.description}</p>
                <div class="mt-4 text-xs text-slate-400">${post.createdAt}</div>
            </div>
        `).join('');

        // 3. 페이지네이션 (usePaging이 true일 때만 실행)
        const navId = `nav-${containerId}`;
        const oldNav = document.getElementById(navId);
        if (oldNav) oldNav.remove();

        if (usePaging && folderIds.length > count) {
            const totalPages = Math.ceil(folderIds.length / count);
            const nav = document.createElement('div');
            nav.id = navId;
            nav.className = 'mt-12 flex justify-center gap-2 w-full';

            for (let i = 1; i <= totalPages; i++) {
                nav.innerHTML += `
                    <button onclick="loadPosts('${containerId}', ${count}, '${basePath}', ${i}, true)" 
                        class="px-4 py-2 rounded-lg font-bold ${i === page ? 'bg-sky-600 text-white' : 'bg-white text-sky-600 border border-sky-200'}">
                        ${i}
                    </button>`;
            }
            container.after(nav);
        }
    } catch (err) {
        console.error("데이터 로드 에러:", err);
    }
}