/**
 * 포스트 목록을 불러와서 지정된 컨테이너에 렌더링
 * @param {string} containerId - 데이터를 넣을 요소의 ID
 * @param {number|null} limit - 표시할 포스트 개수 (null이면 전체 표시)
 */
function loadPosts(containerId, limit = null) {
    fetch('./post/posts.json')
        .then(res => {
            if (!res.ok) throw new Error('네트워크 응답에 문제가 있습니다.');
            return res.json();
        })
        .then(dataList => {
            const container = document.getElementById(containerId);
            if (!container) return;

            const displayList = limit ? dataList.slice(0, limit) : dataList;

            if (displayList.length === 0) {
                container.innerHTML = `<p class="text-slate-400 text-center col-span-full py-10">등록된 글이 없습니다.</p>`;
                return;
            }

            container.innerHTML = displayList.map(post => {
                // 썸네일이 없을 경우를 대비한 기본 이미지 설정
                const thumb = post.thumbnailUrl || 'https://via.placeholder.com/400x250?text=No+Image';

                return `
                    <div onclick="location.href='./post/post_detail.html?id=${post.id}'" 
                         class="group border border-sky-100 rounded-2xl p-5 bg-white shadow-sm hover:shadow-lg hover:border-sky-300 transition-all duration-300 cursor-pointer">
                        <div class="overflow-hidden rounded-xl mb-4">
                            <img src="${thumb}" 
                                 alt="${post.title}" 
                                 class="w-full h-44 object-cover transform group-hover:scale-105 transition-transform duration-500">
                        </div>
                        <h3 class="text-lg font-bold text-slate-800 group-hover:text-sky-600 transition-colors">${post.title}</h3>
                        <p class="text-sm text-slate-500 mt-2 line-clamp-2">${post.description}</p>
                        <div class="flex items-center justify-between mt-5">
                            <span class="text-xs font-medium px-2 py-1 bg-sky-50 text-sky-600 rounded-md">
                                ${post.tags ? post.tags[0] : 'General'}
                            </span>
                            <span class="text-xs text-slate-400">${post.createdAt}</span>
                        </div>
                    </div>
                `;
            }).join('');
        })
        .catch(err => {
            console.error("데이터 로드 실패:", err);
            const container = document.getElementById(containerId);
            if (container) container.innerHTML = `<p class="text-red-400">데이터를 불러오는 중 오류가 발생했습니다.</p>`;
        });
}

document.addEventListener('DOMContentLoaded', () => {
    loadPosts('recent-project', 1);
    loadPosts('archive-list', 4);
});