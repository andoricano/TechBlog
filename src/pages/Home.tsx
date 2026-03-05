import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LinkBox from '../components/common/LinkBox';
import ThumbnailPostCard from '../components/common/ThumnailPostCard';
import ArchiveBox from '../components/common/ArchiveBox';
import ContactBox from '../components/common/ContactBox';
import { Post, useStore } from '../store/useStore';



const Home: React.FC = () => {
    const navigate = useNavigate();

    // 1. 스토어에서 데이터 및 로직 구독
    const posts = useStore((state) => state.posts);
    const isLoading = useStore((state) => state.isLoading);
    const fetchPosts = useStore((state) => state.fetchPosts);

    // 2. 컴포넌트 마운트 시 데이터 fetch
    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const handlePostClick = (id: string) => {
        navigate(`/post?id=${id}`);
    };

    return (
        <div className="flex flex-col gap-8 w-full">
            {/* 상단 섹션: 프로필 & 진행중인 프로젝트 */}
            <section className="flex flex-col md:flex-row gap-8 w-full items-stretch">
                <div className="flex-1 min-w-[300px]">
                    <ProfileCard />
                </div>

                <div className="flex-[4] w-full">
                    {/* 최신 데이터 3개만 잘라서 Progress에 전달 */}
                    <Progress posts={posts.slice(0, 3)} onPostClick={handlePostClick} />
                </div>
            </section>

            {/* 아카이브 섹션 */}
            <section className="w-full border border-sky-300 rounded-xl bg-white/80 p-8 shadow-sm flex flex-col">
                <div className="text-lg font-bold text-sky-700 mb-6 border-b border-sky-100 pb-2">
                    Archive
                </div>

                {/* 전체 posts 전달 (ArchiveBox 내부에서 col*row 만큼 알아서 자름) */}
                <ArchiveBox col={3} row={2} posts={posts} onPostClick={handlePostClick} />

                <div className="mt-8 flex justify-center">
                    <button
                        type="button"
                        onClick={() => navigate('/archive')}
                        className="group relative z-30 cursor-pointer pointer-events-auto px-8 py-2.5 text-sm font-semibold text-sky-600 border border-sky-200 rounded-full bg-white hover:bg-sky-50 hover:border-sky-300 hover:shadow-md transition-all duration-300 flex items-center gap-2"
                    >
                        <span className="relative z-10">전체 아카이브 보기</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300 relative z-10"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </button>
                </div>
            </section>

            <Career />
            <ContactBox />
        </div>
    );
};



const ProfileCard: React.FC = () => {
    return (
        <aside className="w-full md:w-[260px] lg:w-[280px] shrink-0 flex">
            <div className="flex-1 border border-sky-300 rounded-xl bg-white/80 p-4 shadow-sm flex flex-col">
                {/* 상단 프로필 정보 */}
                <div className="mb-auto">
                    <p className="text-lg font-bold text-sky-700 mb-6">Profile Info</p>
                    <div className="flex flex-col items-center text-center">
                        <img
                            src="/rsc/profile.jpg"
                            alt="profile image"
                            className="w-32 h-32 rounded-2xl object-cover border border-sky-200 mb-6 shadow-sm"
                        />

                        <div className="grid grid-cols-[80px_1px_1fr] gap-y-3 text-sm text-left w-full mb-8">
                            <div className="font-bold text-gray-500">Name</div>
                            <div className="bg-gray-200"></div>
                            <div className="pl-4 text-gray-800">Ando Choi</div>

                            <div className="font-bold text-gray-500">Job</div>
                            <div className="bg-gray-200"></div>
                            <div className="pl-4 text-gray-800 font-medium">Full stack engineer</div>

                            <div className="font-bold text-gray-500">Age</div>
                            <div className="bg-gray-200"></div>
                            <div className="pl-4 text-gray-800">30</div>

                            <div className="font-bold text-gray-500">Edu</div>
                            <div className="bg-gray-200"></div>
                            <div className="pl-4 text-gray-800">Recode</div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 pt-6 border-t border-sky-100">
                    <LinkBox
                        links={[
                            { imgSrc: '/rsc/github.png', url: 'https://github.com/andoricano' }
                        ]}
                    />
                </div>
            </div>
        </aside>
    );
};


interface ProgressProps {
    posts: Post[];
    onPostClick: (id: string) => void;
}

const Progress: React.FC<ProgressProps> = ({ posts, onPostClick }) => {
    return (
        <article className="flex-[4] w-full border border-sky-300 rounded-xl bg-white/80 p-8 shadow-sm h-full">
            <h3 className="text-lg font-bold text-sky-700 mb-6">진행중인 프로젝트</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {posts.map((post) => (
                    <ThumbnailPostCard
                        key={post.folderId}
                        post={post}
                        onClick={() => onPostClick(post.folderId)}
                    />
                ))}
            </div>
        </article>
    );
};

const Career: React.FC = () => {
    return (
        <section className="w-full h-full">
            <div className="w-full h-full border border-sky-300 rounded-xl bg-white/80 p-8 shadow-sm flex flex-col">
                <div className="text-lg font-bold text-sky-700 mb-6 border-b border-sky-100 pb-2">
                    Career
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[1fr_1px_2fr_1px_2fr_1px_1.5fr] gap-x-4 gap-y-6 items-center w-full my-auto">

                    {/* Company */}
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Company</span>
                        <span className="font-bold text-gray-800 text-lg">Huinsystec</span>
                    </div>

                    {/* Divider 1 */}
                    <div className="hidden md:block w-[1px] h-10 bg-sky-200"></div>

                    {/* Work Experience */}
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Work Experience</span>
                        <span className="font-medium text-gray-700">Android SI: SDK, NDK</span>
                    </div>

                    {/* Divider 2 */}
                    <div className="hidden md:block w-[1px] h-10 bg-sky-200"></div>

                    {/* Sub Experience */}
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Sub Experience</span>
                        <span className="font-medium text-gray-700">Microchip: Arduino Builder</span>
                    </div>

                    {/* Divider 3 */}
                    <div className="hidden md:block w-[1px] h-10 bg-sky-200"></div>

                    {/* Date */}
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Date</span>
                        <span className="font-bold text-sky-600 whitespace-nowrap bg-sky-50 px-3 py-1 rounded-full text-center">
                            2023.12 - 2025.12
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
};






export default Home;