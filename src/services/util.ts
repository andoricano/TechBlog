import { IPost } from "../types/post";

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

/**
 * ID 리스트를 기준으로 해당하는 포스트들을 찾는 함수 (Dict 활용 버전)
 */
export const findPostsByIdList = (
  postsDict: Record<string, IPost>,
  idList: string[]
): IPost[] => {
  if (!idList || idList.length === 0 || !postsDict) return [];

  // map으로 ID에 해당하는 포스트를 바로 가져오고, 
  // 혹시 데이터가 없는 경우를 대비해 필터링(boolean) 처리합니다.
  return idList
    .map((id) => postsDict[id])
    .filter((post): post is IPost => !!post);
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

/**
 * @description yyyymmddhhmm 형식의 문자열을 읽기 쉬운 한글 날짜 형식으로 변환합니다.
 * @param {string} dateStr - 12자리 날짜 문자열 (예: 202603201129)
 * @returns {string} 변환된 날짜 문자열 또는 원본
 */
export const formatDate = (dateStr: string) => {
  if (dateStr.length < 12) return dateStr;

  const year = dateStr.substring(0, 4);
  const month = dateStr.substring(4, 6);
  const day = dateStr.substring(6, 8);
  const hour = dateStr.substring(8, 10);
  const minute = dateStr.substring(10, 12);

  return `${year}년 ${month}월 ${day}일 ${hour}시 ${minute}분`;
};

/**
 * @description yymmddhhmm 형식의 문자열을 읽기 쉬운 한글 날짜 형식으로 짧게 변환합니다.
 * @param {string} dateStr - 12자리 날짜 문자열 (예: 202603201129)
 * @returns {string} 변환된 날짜 문자열 또는 원본
 */
export const formatDaily = (dateStr: string) => {
  if (dateStr.length < 12) return dateStr;

  const year = dateStr.substring(2, 4);
  const month = dateStr.substring(4, 6);
  const day = dateStr.substring(6, 8);

  return `${year}년 ${month}월 ${day}일`;
};