import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="bg-sky-200/70 backdrop-blur-md text-sky-900">
            <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                <h1 className="text-xl font-bold">
                    AndoTechBlog
                </h1>
            </nav>
        </header>
    );
};

export default Header;