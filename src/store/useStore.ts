import { create } from 'zustand';
import { IPost } from '../types/post';
import { ICategory } from '../types/category';

interface AppState {
  postsDict: Record<string, IPost>;
  categoryTree: ICategory[];

  setPostsDict: (dict: Record<string, IPost>) => void;
  setCategoryTree: (tree: ICategory[]) => void;
}

export const useStore = create<AppState>((set) => ({
  postsDict: {},
  categoryTree: [],

  setPostsDict: (dict) => set({ postsDict: dict }),
  setCategoryTree: (tree) => set({ categoryTree: tree }),
}));