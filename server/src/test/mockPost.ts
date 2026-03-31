import { IPost } from '../types/post.js';

export const TEST_POSTS: IPost[] = [
  {
    id: "202603311200000001",
    meta: {
      title: "첫 번째 테스트 포스트",
      category: { hash: "h1", name: "Tech", parentId: null, slug: "tech"},
      createdAt: new Date(),
      thumbnailUrl: "https://picsum.photos/200",
      tags: ["test", "node"]
    },
    content: "# Hello World 1",
    reservation1: [],
    reservation2: []
  },
  {
    id: "202603311205000002",
    meta: {
      title: "두 번째 계층 포스트",
      category: { hash: "h2", name: "Web", parentId: "h1", slug: "web"},
      createdAt: new Date(),
      thumbnailUrl: "https://picsum.photos/201",
      tags: ["web", "express"]
    },
    content: "## Express is fun",
    reservation1: [],
    reservation2: []
  },
  {
    id: "202603311210000003",
    meta: {
      title: "세 번째 깊은 계층",
      category: { hash: "h3", name: "React", parentId: "h2", slug: "react"},
      createdAt: new Date(),
      thumbnailUrl: "https://picsum.photos/202",
      tags: ["frontend"]
    },
    content: "### React Deep Dive",
    reservation1: [],
    reservation2: []
  }
];