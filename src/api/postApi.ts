import { IPost, IPostMeta } from "../types/post";
import { NETLIFY_FUNCTIONS_BASE } from "../config";

/**
 * 1. 모든 포스트의 메타 정보(Dict) 가져오기
 * 카테고리 목록을 만들거나 네비게이션을 구성할 때 사용합니다.
 * 서버에서 content를 제외하고 보내주므로 속도가 매우 빠릅니다.
 */
export const fetchPostMetaDict = async (): Promise<Record<string, IPost>> => {
    try {
        const res = await fetch(`${NETLIFY_FUNCTIONS_BASE}/posts?type=dict`);

        if (!res.ok) {
            throw new Error(`데이터 로드 실패: ${res.status}`);
        }

        return await res.json();
    } catch (error) {
        console.error("fetchPostMetaDict 에러:", error);
        return {};
    }
};

/**
 * 2. 특정 포스트의 전체 데이터 가져오기 (content 포함)
 * 사용자가 특정 게시글을 클릭하여 상세 페이지로 이동했을 때만 호출합니다.
 */
export const fetchPostDetail = async (id: string): Promise<IPost | null> => {
    try {
        const res = await fetch(`${NETLIFY_FUNCTIONS_BASE}/posts/${id}`);

        if (!res.ok) {
            throw new Error(`포스트 상세 로드 실패: ${res.status}`);
        }

        return await res.json();
    } catch (error) {
        console.error(`fetchPostDetail 에러 (ID: ${id}):`, error);
        return null;
    }
};