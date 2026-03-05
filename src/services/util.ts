import { Post } from '../store/useStore';

/**
 * 모든 포스트에서 태그를 추출하여 중복 없는 리스트를 반환합니다.
 */
export const makeTagList = (posts: Post[]): string[] => {
  if (!posts || posts.length === 0) return [];
  
  const allTags = posts.flatMap((post) => post.tags || []);
  
  return Array.from(new Set(allTags)).sort();
};