import { Post } from '../store/useStore';

/**
 * 모든 포스트에서 태그를 추출하여 중복 없는 리스트를 반환
 */
export const makeTagList = (posts: Post[]): string[] => {
  if (!posts || posts.length === 0) return [];
  
  const allTags = posts.flatMap((post) => post.tags || []);
  
  return Array.from(new Set(allTags)).sort();
};

/**
 * ID를 기준으로 특정 포스트를 찾는 함수
 */
export const findPostById = (posts: Post[], id: string | null): Post | undefined => {
    if (!id) return undefined;
    return posts.find((post) => post.id === id);
};