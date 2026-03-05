import React from 'react';

interface HeaderProps {
    onLogoClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogoClick }) => {
    return (
        <header className="bg-sky-200/70 backdrop-blur-md text-sky-900">
            <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                <h1 className="text-xl font-bold">
                    <button
                        onClick={onLogoClick}
                        className="hover:text-sky-600 transition-colors duration-200 cursor-pointer"
                    >
                        AndoTechBlog
                    </button>
                </h1>
            </nav>
        </header>
    );
};

export default Header;