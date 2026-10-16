export const THUMBNAIL_FALLBACK = '/post/black_mokoko.png';

/**
 * thumbnail 값을 <img src> 로 변환한다.
 * - https://... (Cloudinary/외부 URL): 그대로 사용
 * - /thumbnail/x.png (public/thumbnail 정적 파일): 그대로 사용
 * - thumbnail/x.png: 앞에 "/" 를 붙여 사용
 * - 비어 있으면 기본 이미지
 */
export const resolveThumbnailSrc = (thumbnail?: string | null): string => {
    const value = thumbnail?.trim();
    if (!value) return THUMBNAIL_FALLBACK;
    if (/^(https?:)?\/\//.test(value) || value.startsWith('/') || value.startsWith('data:')) return value;
    return `/${value}`;
};

/** 같은 사이트의 정적 이미지(/thumbnail/..., 기본 이미지) 여부 */
export const isStaticThumbnail = (src: string): boolean => src.startsWith('/') && !src.startsWith('//');
