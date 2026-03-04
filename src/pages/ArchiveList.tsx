import React from 'react';

const ArchiveList: React.FC = () => {
    return (
        <div className="flex flex-col md:flex-row gap-8">
            <section className="flex-1">
                <h2 className="text-2xl font-bold mb-4">최신 포스트</h2>
                <div className="p-6 bg-white rounded-xl shadow-sm border border-sky-100">
                    Archive List
                </div>
            </section>

            <aside className="w-full md:w-80">
                <div className="p-6 bg-sky-50 rounded-xl border border-sky-100">
                    프로필 카드가 들어갈 자리입니다.
                </div>
            </aside>
        </div>
    );
};

export default ArchiveList;