function loadPosts(containerId, limit = null) {
    fetch('./post/posts.json')
        .then(res => res.json())
        .then(dataList => {
            const container = document.getElementById(containerId);
            if (!container) return;

            const displayList = limit ? dataList.slice(0, limit) : dataList;

            container.innerHTML = displayList.map(post => `
                <div class="border border-sky-200 rounded-2xl p-5 bg-white shadow-sm hover:shadow-md transition-all cursor-pointer">
                    <img src="${post.thumbnailUrl}" class="w-full h-40 object-cover rounded-xl mb-4">
                    <h3 class="text-lg font-bold text-slate-800">${post.title}</h3>
                    <p class="text-sm text-slate-500 mt-2">${post.description}</p>
                    <div class="mt-4 text-xs text-slate-400">${post.createdAt}</div>
                </div>
            `).join('');
        })
        .catch(err => console.error("데이터 로드 실패:", err));
}
document.addEventListener('DOMContentLoaded', () => {
    loadPosts('recent-project', 1);
    loadPosts('archive-list');
});