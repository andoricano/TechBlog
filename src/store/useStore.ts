import { create } from 'zustand';
import { loadPostsByIds } from '../services/loadPost';
import { CategoryItem, CategoryTreeItem, makeCategoryTree, makeTagList, Post } from '../services/util';

interface AppState {
  posts: Post[];
  tagMap: string[];
  categoryMap: CategoryItem[];
  categoryTree: CategoryTreeItem[];
  isLoading: boolean;
  fetchPosts: (basePath?: string) => Promise<void>;
  fetchCategoryMap: () => Promise<void>;

  selectedCategory: number | null;
  setSelectedCategory: (id: number | null) => void;
}

export const useStore = create<AppState>((set) => ({
  posts: [],
  tagMap: [],
  categoryMap: [],
  categoryTree: [],
  isLoading: false,
  selectedCategory: null,
  setSelectedCategory: (id) => set({ selectedCategory: id }),

  fetchPosts: async (basePath = '/post/data') => {
    set({ isLoading: true });
    try {
      const res = await fetch(`${basePath}/list.json`);
      if (!res.ok) throw new Error('list.json 로드 실패');
      const folderIds: string[] = await res.json();

      const validPosts = await loadPostsByIds(basePath, folderIds);
      const uniqueTags = makeTagList(validPosts);

      set({
        posts: validPosts,
        tagMap: uniqueTags,
        isLoading: false,
      });
    } catch (err) {
      console.error("Store Fetch Error:", err);
      set({ isLoading: false });
    }
  },

  fetchCategoryMap: async () => {
    try {
      const res = await fetch('/post/category_map.json');
      const list: CategoryItem[] = await res.json();
      
      const tree = makeCategoryTree(list, null); 

      set({ 
        categoryMap: list,
        categoryTree: tree 
      });
    } catch (err) {
      console.error("Category Fetch Error:", err);
    }
  },
}));