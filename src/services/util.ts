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
  category: string;
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
  id: number;
  name: string;
  parentId: number | null;
}

export interface CategoryTreeItem extends CategoryItem {
  children: CategoryTreeItem[];
}

/**
 * 평면 카테고리 리스트를 계층적 트리 구조로 변환
 * @param list - category_map.json에서 온 배열
 * @param parentId - 시작할 부모 ID (최상위 노드를 찾으려면 null 전달)
 */
export const makeCategoryTree = (
  list: CategoryItem[],
  parentId: number | null = null
): CategoryTreeItem[] => {
  return list
    .filter((item) => item.parentId === parentId)
    .map((item) => ({
      ...item,
      children: makeCategoryTree(list, item.id),
    }));
};

/**
 * ID로 TAG 이름 찾기, 없을 시 Tech 반환
 * @param list makeCategoryTree로 만들어진 Tree Item
 * @param id - Name을 찾을 아이디
 */
export const getCategoryNameById = (
  list: CategoryItem[],
  id: string
): string => {
  const categoryId = Number(id);
  const category = list.find((item) => item.id === categoryId);
  
  return category ? category.name : "Tech";
};