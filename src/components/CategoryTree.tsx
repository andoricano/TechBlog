import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { CategoryTreeItem } from '../services/util';



const CategoryNode: React.FC<{ node: CategoryTreeItem; depth: number }> = ({ node, depth }) => {
    const { setSelectedCategory, selectedCategory } = useStore();
    const [isOpen, setIsOpen] = useState(true);
    const hasChildren = node.children && node.children.length > 0;

    // 현재 노드가 선택된 상태인지 확인
    const isSelected = selectedCategory === node.name;

    const toggleOpen = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    const handleCategoryClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        // 필터링 상태 업데이트
        setSelectedCategory(isSelected ? null : node.name);
        // 이름 클릭 시에도 폴더 열림/닫힘 연동
        if (hasChildren) {
            setIsOpen(!isOpen);
        }
    };

    return (
        <div className="w-full">
            <div
                className={`group flex items-center py-1.5 px-2 cursor-pointer rounded transition-all duration-150 ease-in-out ${isSelected
                        ? 'bg-sky-100 text-sky-700 font-bold' // 선택되었을 때 스타일
                        : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
                    }`}
                style={{ paddingLeft: `${depth * 16 + 8}px` }}
                onClick={handleCategoryClick}
            >
                {/* 화살표 영역 */}
                <div className="w-4 h-4 flex items-center justify-center mr-1">
                    {hasChildren && (
                        <span
                            className={`text-[10px] transition-transform duration-200 ${isOpen ? 'rotate-90' : ''
                                } ${isSelected ? 'text-sky-600' : 'text-slate-400'}`}
                            onClick={(e) => {
                                e.stopPropagation(); // 이름 클릭과 별개로 화살표만 누를 때를 대비
                                toggleOpen(e);
                            }}
                        >
                            ▶
                        </span>
                    )}
                </div>

                <span className="mr-2 text-base leading-none">
                    📂
                </span>
                <span className="text-sm truncate">
                    {node.name}
                </span>
            </div>

            {/* 자식 렌더링 */}
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



const CategoryTree: React.FC = () => {
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
                <h3 className="text-2xl font-extrabold text-sky-700 mb-6 border-b-2 border-sky-100 pb-2 tracking-tight">
                    Explorer
                </h3>
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

export default CategoryTree;