import React from 'react';

const Post: React.FC = () => {
    return (
        <div className="flex flex-col md:flex-row gap-8">
            {/* 왼쪽: 메인 컨텐츠 (글 목록 등) */}
            <section className="flex-1">
                <h2 className="text-2xl font-bold mb-4">최신 포스트</h2>
                <div className="p-6 bg-white rounded-xl shadow-sm border border-sky-100">
                    포스팅 내용이 여기에 들어갑니다.
                </div>
            </section>

            {/* 오른쪽: 사이드바 (프로필 등) */}
            <aside className="w-full md:w-80">
                <div className="p-6 bg-sky-50 rounded-xl border border-sky-100">
                    Post
                </div>
            </aside>
        </div>
    );
};

export default Post;