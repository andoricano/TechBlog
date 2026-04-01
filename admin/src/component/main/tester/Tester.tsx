import React from 'react';

export default function Tester() {
    return (
        <div className="flex flex-row w-full h-full overflow-hidden">
            {/* 나중에 aside가 추가된다면 아래 클래스를 사용하세요 */}
            {/* <aside className="w-[260px] h-full shrink-0 border-r border-[#eee] bg-white overflow-y-auto" /> */}

            <div className="flex-1 h-full overflow-y-auto bg-[#fafafa]">

            </div>
        </div>
    );
}