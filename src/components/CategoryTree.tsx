import React from 'react';
import { useStore } from '../store/useStore';
import { ICategory } from '../types/category';


interface CategoryNodeProps {
    node: ICategory;
    depth: number;
    selectedCategory: ICategory | null;
    onCategoryClick: (category: ICategory | null) => void;
}


const CategoryNode: React.FC<CategoryNodeProps> = ({
    node,
    depth,
    selectedCategory,
    onCategoryClick
}) => {
    const isSelected = selectedCategory?.path === node.path;

    const handleCategoryClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onCategoryClick(isSelected ? null : node);
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
                <span className="mr-2 text-base leading-none">
                    {node.children && node.children.length > 0 ? '📂' : '📄'}
                </span>
                <span className="text-sm truncate">{node.slug}</span>
            </div>

            {node.children && node.children.length > 0 && (
                <div className="w-full">
                    {node.children.map((child) => (
                        <CategoryNode
                            key={child.path}
                            node={child}
                            depth={depth + 1}
                            selectedCategory={selectedCategory}
                            onCategoryClick={onCategoryClick}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

interface CategoryTreeProps {
    selectedCategory: ICategory | null;
    onCategoryClick: (category: ICategory | null) => void;
}
const CategoryTree: React.FC<CategoryTreeProps> = ({ selectedCategory, onCategoryClick }) => {
    const categoryTree = useStore((state) => state.categoryTree);

    const isAllSelected = selectedCategory === null;

    return (
        <aside className="w-64 min-h-[700px] rounded-xl bg-white/80 border border-sky-300 shadow-sm flex flex-col overflow-hidden">
            <div className="px-6 pt-8 pb-2">
                <h3 className="text-2xl font-extrabold text-sky-700 mb-6 border-b-2 border-sky-100 pb-2 tracking-tight">
                    Explorer
                </h3>
            </div>

            <div className="flex-1 px-4 pb-8 overflow-y-auto custom-scrollbar">
                {/* 전체 게시글 버튼 */}
                <div
                    className={`cursor-pointer px-2 py-2 mb-2 rounded transition-all select-none ${isAllSelected
                        ? 'bg-sky-500 text-white font-bold shadow-md shadow-sky-100'
                        : 'hover:bg-slate-100 text-slate-600'
                        }`}
                    onClick={() => onCategoryClick(null)}
                >
                    🏠 전체 게시글
                </div>

                {categoryTree.length > 0 ? (
                    categoryTree.map((rootNode) => (
                        <React.Fragment key={rootNode.path}>
                            {rootNode.children.map((child) => (
                                <CategoryNode
                                    key={child.path}
                                    node={child}
                                    depth={0}
                                    selectedCategory={selectedCategory}
                                    onCategoryClick={onCategoryClick}
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