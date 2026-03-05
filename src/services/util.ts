/**
 * 모든 포스트에서 태그를 추출하여 중복 없는 리스트를 반환
 */
export const makeTagList = (posts: Post[]): string[] => {
  if (!posts || posts.length === 0) return [];
  
  const allTags = posts.flatMap((post) => post.tags || []);
  
  return Array.from(new Set(allTags)).sort();
};



export interface Post {
  id: string;          
  title: string;
  category: string[];
  tags: string[];
  createdAt: string;
  thumbnailUrl: string;
  description: string;
}


/**
 * ID를 기준으로 특정 포스트를 찾는 함수
 */
export const findPostById = (posts: Post[], id: string | null): Post | undefined => {
    if (!id) return undefined;
    return posts.find((post) => post.id === id);
};

export interface CategoryItem {
  name: string;
  parent: string;
}
export interface CategoryTreeItem extends CategoryItem {
  children: CategoryTreeItem[];
}

/**
 * 평면 카테고리 리스트를 계층적 트리 구조로 변환
 * @param list - category_map.json에서 온 배열
 * @param parentName - 시작할 부모 이름 (기본값 "Tech")
 */
export const makeCategoryTree = (
  list: CategoryItem[], 
  parentName: string = "master" 
): CategoryTreeItem[] => {
  return list
    .filter((item) => item.parent === parentName)
    .map((item) => ({
      ...item,
      children: makeCategoryTree(list, item.name),
    }));
};