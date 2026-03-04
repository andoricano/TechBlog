import React from 'react';
import { useNavigate } from 'react-router-dom';
import LinkBox from '../components/common/LinkBox';

const Home: React.FC = () => {
    const navigate = useNavigate();

    const myLinks = [
        { imgSrc: '/rsc/github.png', url: 'https://github.com/andoricano' },
    ];

    return (
        <div className="flex flex-col md:flex-row gap-8">

            <ProfileCard />

            <section className="flex-1 w-full flex flex-col space-y-6">

                <article className="flex-[4] border border-sky-300 rounded-xl bg-white/80 p-8 shadow-sm">
                    <h3 className="text-lg font-bold text-sky-700 mb-6">진행중인 프로젝트</h3>
                    <div id="recent-project"></div>
                </article>

            </section>
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

export default Home;