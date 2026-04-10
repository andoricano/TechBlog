// src/types/post.ts
export interface IPostMeta {
    title: string;
    category: ICategory;
    createdAt: string;
    updatedAt: string;
    thumbnailUrl: string;
    tags: string[];
}

interface ICategory {
    path: string; // 예: "tech/report/web" (계층 구조 및 식별자 역할)
    slug: string; // 예: "web" (URL 파라미터 및 해당 카테고리 고유 명칭)
}

export interface IPost {
    id: string;          // 예: 202603311230000001
    meta: IPostMeta;
    content: string;
    reservation1: string[];
    reservation2: string[];
}