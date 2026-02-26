async function loadPosts(containerId, count = 6, basePath = './data', page = 1, usePaging = false, type = 'card') {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container #${containerId} 를 찾을 수 없습니다.`);
        return;
    }

    try {
        const res = await fetch(`${basePath}/list.json`);
        const folderIds = await res.json();

        const start = (page - 1) * count;
        const targetIds = folderIds.slice(start, start + count);

        const posts = await Promise.all(targetIds.map(async (id) => {
            const dRes = await fetch(`${basePath}/${id}/data.json`);
            if (!dRes.ok) return null;
            const data = await dRes.json();

            data.folderId = id;
            // 이미지 경로: basePath를 활용해 상대 경로로 설정
            if (data.thumbnailUrl && !data.thumbnailUrl.startsWith('http')) {
                data.thumbnailUrl = `${basePath}/${id}/${data.thumbnailUrl}`;
            }
            return data;
        }));

        const validPosts = posts.filter(p => p);

        // 핵심: 상세 페이지(post.html)로 가는 경로 계산
        // basePath에 'post'가 포함되어 있다면(index에서 호출 시), post/ 폴더 안으로 가야 함
        const isInRoot = basePath.includes('post');
        const postLinkBase = isInRoot ? './post/post.html' : './post.html';

        if (type === 'card') {
            container.innerHTML = validPosts.map(post => `
                <div onclick="location.href='${postLinkBase}?id=${post.folderId}'" 
                     class="border border-sky-200 rounded-2xl p-5 bg-white shadow-sm hover:shadow-md transition-all cursor-pointer">
                    <img src="${post.thumbnailUrl}" class="w-full h-40 object-cover rounded-xl mb-4" onerror="this.src='https://placehold.co/400x300?text=No+Image'">
                    <h3 class="text-lg font-bold text-slate-800">${post.title}</h3>
                    <p class="text-sm text-slate-500 mt-2 line-clamp-2">${post.description}</p>
                    <div class="mt-4 text-xs text-slate-400">${post.createdAt}</div>
                </div>
            `).join('');
        } else {
            container.innerHTML = validPosts.map(post => `
                <div onclick="location.href='${postLinkBase}?id=${post.folderId}'" 
                     class="flex justify-between items-center py-4 border-b border-slate-100 hover:bg-sky-50 px-4 rounded-xl cursor-pointer transition-all">
                    <span class="text-slate-700 font-medium">${post.title}</span>
                    <span class="text-xs text-slate-400 font-mono">${post.createdAt}</span>
                </div>
            `).join('');
        }

        // 페이지네이션 처리 (생략 없이 유지)
        if (usePaging && folderIds.length > count) {
            const navContainer = document.getElementById(`pagination-${containerId}`);
            if (navContainer) {
                const totalPages = Math.ceil(folderIds.length / count);
                let navHtml = '';
                for (let i = 1; i <= totalPages; i++) {
                    navHtml += `
                        <button onclick="loadPosts('${containerId}', ${count}, '${basePath}', ${i}, true, '${type}')" 
                            class="px-4 py-2 rounded-lg font-bold ${i === page ? 'bg-sky-600 text-white' : 'bg-white text-sky-600 border border-sky-100'}">
                            ${i}
                        </button>`;
                }
                navContainer.innerHTML = navHtml;
            }
        }
    } catch (err) {
        console.error("데이터 로드 실패:", err);
    }
}


async function initPostDetail(postId, basePath = './data') {
    try {
        const res = await fetch(`${basePath}/${postId}/data.json`);
        if (!res.ok) throw new Error();
        const data = await res.json();

        document.title = `${data.title} - AndoTechBlog`;
        document.getElementById('post-title').textContent = data.title;
        document.getElementById('post-date').textContent = data.createdAt;

        document.getElementById('post-tags').innerHTML = data.tags
            .map(t => `<span class="px-3 py-1 bg-sky-50 text-sky-600 rounded-full text-xs font-semibold">#${t}</span>`).join('');

        document.getElementById('post-content').innerHTML =
            `<div class="whitespace-pre-wrap text-slate-700 leading-relaxed">${data.content}</div>`;
    } catch (err) {
        document.getElementById('post-title').textContent = "오류 발생";
        document.getElementById('post-content').innerHTML = `<p class="text-red-400 text-center mt-20">데이터 로드 실패</p>`;
    }
}