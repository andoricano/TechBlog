import { create } from 'zustand';
import { loadPostsByIds } from '../services/loadPost';
import { makeTagList } from '../services/util';


export interface Post {
  id: string;
  folderId: string;
  title: string;
  category: string[];
  tags: string[];
  createdAt: string;
  thumbnailUrl: string;
  description: string;
}

interface AppState {
  posts: Post[];
  tagMap: string[];
  categoryMap: string[];
  isLoading: boolean;
  fetchPosts: (basePath?: string) => Promise<void>;
  setCategoryMap: (list: string[]) => void;
}

export const useStore = create<AppState>((set) => ({
  posts: [],
  tagMap: [],
  categoryMap: [],
  isLoading: false,

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

  setCategoryMap: (list) => set({ categoryMap: list }),
}));