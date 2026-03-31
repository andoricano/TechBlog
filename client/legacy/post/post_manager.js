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
        const [resData, resContent] = await Promise.all([
            fetch(`${basePath}/${postId}/data.json`),
            fetch(`${basePath}/${postId}/content.md`)
        ]);

        if (!resData.ok || !resContent.ok) throw new Error();

        const data = await resData.json();
        const markdown = await resContent.text();

        const toc = [];
        // 커스텀 렌더러 설정
        const renderer = new marked.Renderer();

        // 헤더 렌더링 방식 정의 (id 부여 및 toc 수집)
        renderer.heading = ({ text, depth }) => {
            const anchorId = text.toLowerCase().replace(/[^\wㄱ-ㅎㅏ-ㅣ가-힣]+/g, '-');

            if (depth <= 2) {
                toc.push({ level: depth, text, anchorId });
            }

            return `<h${depth} id="${anchorId}" class="scroll-mt-20 font-bold text-slate-800 mt-8 mb-4">${text}</h${depth}>`;
        };

        // marked 옵션 적용
        marked.setOptions({ renderer });

        // 마크다운 변환
        const htmlContent = marked.parse(markdown);

        // 1. 메타데이터 반영
        document.title = `${data.title} - AndoTechBlog`;
        document.getElementById('post-title').textContent = data.title;
        document.getElementById('post-date').textContent = data.createdAt;

        if (data.tags) {
            document.getElementById('post-tags').innerHTML = data.tags
                .map(t => `<span class="px-3 py-1 bg-sky-50 text-sky-600 rounded-full text-xs font-semibold">#${t}</span>`)
                .join('');
        }

        // 2. 본문 삽입 (로딩 메시지 제거됨)
        document.getElementById('post-content').innerHTML = `
            <div class="markdown-body text-slate-700 leading-relaxed">
                ${htmlContent}
            </div>`;

        // 3. 목차(TOC) 생성
        const tocContainer = document.getElementById('post-toc');
        if (tocContainer && toc.length > 0) {
            const tocHtml = toc.map(item => `
                <li class="${item.level === 2 ? 'ml-4' : ''} mb-2">
                    <a href="#${item.anchorId}" class="hover:text-sky-500 transition-colors block">
                        ${item.text}
                    </a>
                </li>
            `).join('');
            tocContainer.innerHTML = `<ul class="text-sm text-slate-500 border-l-2 border-slate-100 pl-4">${tocHtml}</ul>`;
        }

    } catch (err) {
        console.error("로딩 실패:", err);
        document.getElementById('post-title').textContent = "오류 발생";
        document.getElementById('post-content').innerHTML = `<p class="text-red-400 text-center mt-20">데이터 로드 실패</p>`;
    }
}