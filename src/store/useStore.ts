import { create } from 'zustand';
import { loadPostsByIds } from '../services/loadPost';
import { CategoryItem, CategoryTreeItem, makeCategoryTree, makeTagList } from '../services/util';
import { Post } from '../services/util';



interface AppState {
  posts: Post[];
  tagMap: string[];
  categoryMap: CategoryItem[];
  categoryTree: CategoryTreeItem[];
  isLoading: boolean;
  fetchPosts: (basePath?: string) => Promise<void>;
  fetchCategoryMap: () => Promise<void>;

  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
}
export const useStore = create<AppState>((set) => ({
  posts: [],
  tagMap: [],
  categoryMap: [],
  categoryTree: [],
  isLoading: false,selectedCategory: null,
  setSelectedCategory: (category) => set({ selectedCategory: category }),

  

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
    
    const tree = makeCategoryTree(list); 

    set({ 
      categoryMap: list,
      categoryTree: tree 
    });
  } catch (err) {
    console.error(err);
  }
},


}));