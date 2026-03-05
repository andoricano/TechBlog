import { Post } from '../store/useStore';

export const loadPostsByIds = async (path: string, folderIds: string[]): Promise<Post[]> => {
  try {
    const postData = await Promise.all(
      folderIds.map(async (id) => {
        const res = await fetch(`${path}/${id}/data.json`);
        if (!res.ok) return null;

        const data = await res.json();

        return {
          ...data,
          folderId: id,
          thumbnailUrl: data.thumbnailUrl?.startsWith('http')
            ? data.thumbnailUrl
            : `${path}/${id}/${data.thumbnailUrl}`
        };
      })
    );

    return postData.filter((p): p is Post => p !== null);
  } catch (err) {
    console.error("데이터 로드 중 오류:", err);
    return [];
  }
};