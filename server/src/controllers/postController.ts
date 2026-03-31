import { Request, Response } from 'express';
import { MongoClient } from 'mongodb';
import { postService } from '../services/postService.js';
import { HTTP_STATUS } from '../config/constants.js';
import { TEST_POSTS } from '../test/mockPost.js';

export const postController = (client: MongoClient) => {
  const service = postService(client);

  return {
    // 1 & 2번 테스트: Seed
    seed: async (_: Request, res: Response) => {
      try {
        for (const post of TEST_POSTS) {
          await service.savePost(post);
        }
        res.status(HTTP_STATUS.CREATED).json({ success: true });
      } catch (e: any) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: e.message });
      }
    },

    // 3번 테스트: Dict 반환
    getDict: async (_: Request, res: Response) => {
      try {
        const dict = await service.getMetaDict();
        res.status(HTTP_STATUS.OK).json(dict);
      } catch (e: any) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: e.message });
      }
    },

    // 4번 테스트: 단일 조회
    getOne: async (req: Request, res: Response) => {
      try {
        const post = await service.getPostById(req.params.id);
        if (!post) {
          return res.status(HTTP_STATUS.NOT_FOUND).json({ error: "Post not found" });
        }
        res.status(HTTP_STATUS.OK).json(post);
      } catch (e: any) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: e.message });
      }
    }
  };
};