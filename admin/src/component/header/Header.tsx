import { NavLink } from "react-router-dom";
import { CONFIG_PAGE } from "../../data/constants";

export default function Header() {
  const projectName = CONFIG_PAGE.NAME;

  const tabBaseStyle = "px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200";
  const activeStyle = "bg-white text-sky-600 shadow-sm";
  const inactiveStyle = "text-sky-800 hover:bg-sky-200";

  const tabs = [
    { name: "Monitoring", path: "/monitoring" },
    { name: "Posting", path: "/posting" },
    { name: "Test", path: "/test" },
  ];

  return (
    <header className="flex items-center justify-between w-full min-h-[60px] px-6 py-3 bg-sky-300 border-b border-[#ccc] box-border sticky top-0 z-[1000]">
      {/* 왼쪽 영역: 로고 및 탭 */}
      <div className="flex items-center gap-8">
        <h1 className="text-[20px] font-bold text-[#333] whitespace-nowrap">
          {projectName}
        </h1>

        <nav className="flex gap-2">
          {tabs.map((tab) => (
            <NavLink
              key={tab.path}
              to={tab.path}
              className={({ isActive }) =>
                `${tabBaseStyle} ${isActive ? activeStyle : inactiveStyle}`
              }
            >
              {tab.name}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* 오른쪽 영역: 필요시 로그아웃 버튼이나 사용자 정보 추가 가능 */}
      <div className="flex items-center gap-4">
        <span className="text-xs font-semibold text-sky-900 opacity-60">ADMIN MODE</span>
      </div>
    </header>
  );
}