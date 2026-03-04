import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col md:flex-row gap-8">
            {/* 왼쪽: 메인 컨텐츠 */}
            <section className="flex-1">
                <h2 className="text-2xl font-bold mb-4">최신 포스트</h2>
                <div className="p-6 bg-white rounded-xl shadow-sm border border-sky-100 min-h-[200px]">
                    <p className="text-slate-600 mb-6">포스팅 내용이 여기에 들어갑니다.</p>

                    {/* 버튼 그룹 */}
                    <div className="flex gap-4">
                        <button
                            onClick={() => navigate('/archive')}
                            className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition shadow-md"
                        >
                            아카이브 보러가기
                        </button>
                        <button
                            onClick={() => navigate('/post')}
                            className="px-4 py-2 bg-white text-sky-500 border border-sky-500 rounded-lg hover:bg-sky-50 transition"
                        >
                            글 쓰기(Post)
                        </button>
                    </div>
                </div>
            </section>

            {/* 오른쪽: 사이드바 */}
            <aside className="w-full md:w-80">
                <div className="p-6 bg-sky-50 rounded-xl border border-sky-100 sticky top-24">
                    <h3 className="font-bold text-sky-900 mb-2">Home Sidebar</h3>
                    <p className="text-sm text-sky-700">여기는 홈 사이드바입니다.</p>
                </div>
            </aside>
        </div>
    );
};

export default Home;