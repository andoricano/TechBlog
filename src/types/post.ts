// src/types/post.ts

export interface IPostMeta {
    title: string;
    category: ICategory;
    createdAt: string;
    updatedAt: string;
    thumbnailUrl: string;
    description: string;
    tags: string[];
}

interface ICategory {
    path: string;
    slug: string;
}

export interface IPost {
    id: string;
    meta: IPostMeta;
    content: string;
    reservation1: string[];
    reservation2: string[];
}