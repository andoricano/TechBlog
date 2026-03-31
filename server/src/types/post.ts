// src/types/post.ts
export interface IPostMeta {
    title: string;
    category:ICategory;
    createdAt: Date;
    thumbnailUrl: string;
    tags: string[];
}

interface ICategory {
    hash: string;
    name: string;
    parentId: string | null;
    slug: string;
}

export interface IPost {
    id: string;          // 예: 202603311230000001
    meta: IPostMeta;
    content: string;
    reservation1: string[];
    reservation2: string[];
}