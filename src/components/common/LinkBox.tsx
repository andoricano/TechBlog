import React from 'react';

interface LinkItem {
    imgSrc: string;
    url: string;
}

interface LinkBoxProps {
    links: LinkItem[];
}

const LinkBox: React.FC<LinkBoxProps> = ({ links }) => (
    <article className="flex-[1] border border-sky-300 rounded-xl bg-white/80 p-4 shadow-sm">
        <h3 className="flex items-center gap-6 text-lg font-bold text-sky-700">
            My Links
            <div className="flex gap-4">
                {links.map((link, index) => (
                    <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img
                            src={link.imgSrc}
                            className="w-10 h-10 hover:scale-110 transition-transform"
                            alt={`link-${index}`}
                        />
                    </a>
                ))}
            </div>
        </h3>
    </article>
);

export default LinkBox;