import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { CategoryTreeItem } from '../services/util';

const CategoryNode: React.FC<{ node: CategoryTreeItem; depth: number }> = ({ node, depth }) => {
    const [isOpen, setIsOpen] = useState(true);
    const hasChildren = node.children && node.children.length > 0;
    const { categoryTree } = useStore();

    console.log("현재 트리 데이터:", categoryTree);

    const toggleOpen = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    return (
        <div className="w-full">
            <div
                className="group flex items-center py-1.5 px-2 hover:bg-slate-100 cursor-pointer rounded transition-all duration-150 ease-in-out"
                style={{ paddingLeft: `${depth * 16 + 8}px` }}
                onClick={toggleOpen}
            >
                <div className="w-4 h-4 flex items-center justify-center mr-1">
                    {hasChildren && (
                        <span className={`text-[10px] text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}>
                            ▶
                        </span>
                    )}
                </div>

                <span className="mr-2 text-base leading-none">
                    {hasChildren ? '📂' : '📄'}
                </span>
                <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 truncate">
                    {node.name}
                </span>
            </div>

            {hasChildren && isOpen && (
                <div className="w-full">
                    {node.children.map((child) => (
                        <CategoryNode
                            key={`${child.parent}-${child.name}`}
                            node={child}
                            depth={depth + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const Explorer: React.FC = () => {
    const { categoryTree, isLoading } = useStore();

    if (isLoading) {
        return (
            <aside className="w-64 min-h-[700px] rounded-xl bg-white/80 border border-sky-300 shadow-sm p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-sky-100 rounded w-3/4"></div>
                    <div className="h-4 bg-sky-100 rounded w-1/2"></div>
                </div>
            </aside>
        );
    }

    return (
        <aside className="w-64 min-h-[700px] rounded-xl bg-white/80 border border-sky-300 shadow-sm flex flex-col overflow-hidden">
            <div className="px-6 pt-8 pb-2">
                <div className="text-lg font-bold text-sky-700 mb-6 border-b border-sky-100 pb-2">
                    Explorer
                </div>
            </div>

            <div className="flex-1 px-4 pb-8 overflow-y-auto custom-scrollbar">
                {categoryTree.length > 0 ? (
                    categoryTree.map((rootNode) => (
                        <CategoryNode
                            key={`${rootNode.parent}-${rootNode.name}`}
                            node={rootNode}
                            depth={0}
                        />
                    ))
                ) : (
                    <div className="px-2 text-sm text-slate-400 italic">
                        No categories found.
                    </div>
                )}
            </div>
        </aside>
    );
};

export default Explorer;