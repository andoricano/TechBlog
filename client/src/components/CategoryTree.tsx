import React from 'react';
import { useStore } from '../store/useStore';
import { CategoryTreeItem } from '../services/util';

const CategoryNode: React.FC<{ node: CategoryTreeItem; depth: number }> = ({ node, depth }) => {
    const { setSelectedCategory, selectedCategory } = useStore();

    const isSelected = selectedCategory === node.id;

    const handleCategoryClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedCategory(isSelected ? null : node.id);
    };

    return (
        <div className="w-full">
            {/* 노드 항목 */}
            <div
                className={`group flex items-center py-1.5 px-2 cursor-pointer rounded transition-all duration-150 ease-in-out select-none ${isSelected
                    ? 'bg-sky-100 text-sky-700 font-bold'
                    : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
                    }`}
                style={{ paddingLeft: `${depth * 16 + 8}px` }}
                onClick={handleCategoryClick}
            >
                <span className="mr-2 text-base leading-none">📂</span>
                <span className="text-sm truncate">{node.name}</span>
            </div>

            {/* 자식 노드 렌더링 (항상 보여줌) */}
            {node.children && node.children.length > 0 && (
                <div className="w-full">
                    {node.children.map((child) => (
                        <CategoryNode
                            key={child.id}
                            node={child}
                            depth={depth + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const CategoryTree: React.FC = () => {
    const { categoryTree, isLoading, selectedCategory, setSelectedCategory } = useStore();
    const isAllSelected = selectedCategory === null;

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
                <h3 className="text-2xl font-extrabold text-sky-700 mb-6 border-b-2 border-sky-100 pb-2 tracking-tight">
                    Explorer
                </h3>
            </div>

            <div className="flex-1 px-4 pb-8 overflow-y-auto custom-scrollbar">

                <div
                    className={`cursor-pointer px-2 py-2 mb-2 rounded transition-all select-none ${isAllSelected ? 'bg-sky-500 text-white font-bold' : 'hover:bg-slate-100 text-slate-600'
                        }`}
                    onClick={() => setSelectedCategory(null)}
                >
                    🏠 전체 게시글
                </div>

                {categoryTree.length > 0 ? (
                    categoryTree.map((rootNode) => (
                        <React.Fragment key={rootNode.id}>
                            {/* 필요하다면 최상위 노드 이름(rootNode.name)을 여기서 출력 가능 */}
                            {rootNode.children.map((child) => (
                                <CategoryNode
                                    key={child.id}
                                    node={child}
                                    depth={0}
                                />
                            ))}
                        </React.Fragment>
                    ))
                ) : (
                    <div className="px-2 text-sm text-slate-400 italic">No categories found.</div>
                )}
            </div>
        </aside>
    );
};

export default CategoryTree;