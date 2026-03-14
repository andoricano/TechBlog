import { Post } from "./util";


export const loadPostsByIds = async (path: string, folderIds: string[]): Promise<Post[]> => {
  try {
    const postData = await Promise.all(
      folderIds.map(async (id) => {
        const url = `${path}/${id}/data.json`;
        const res = await fetch(url);

        if (!res.ok) return null;

        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          console.warn(`파일 형식이 JSON이 아님: ${url}`);
          return null;
        }

        const data = await res.json();

        let finalThumbnailUrl = "";

        if (!data.thumbnailUrl || data.thumbnailUrl.trim() === "") {
          finalThumbnailUrl = "/post/black_mokoko.png";
        } else if (data.thumbnailUrl.startsWith('http') || data.thumbnailUrl.startsWith('/')) {
          finalThumbnailUrl = data.thumbnailUrl;
        } else {
          finalThumbnailUrl = `${path}/${id}/${data.thumbnailUrl}`;
        }

        return {
          ...data,
          folderId: id,
          thumbnailUrl: finalThumbnailUrl
        };
      })
    );

    return postData.filter((p): p is Post => p !== null);
  } catch (err) {
    console.error("데이터 로드 중 오류:", err);
    return [];
  }
};