import { Router, Express } from 'express';
import { MongoClient } from 'mongodb';
import { postRouter } from './postRoutes.js';

export const setupRoutes = (app: Express, client: MongoClient) => {
  const router = Router();

  // 1. 상태 확인 (이제 경로는 /api/health 가 됩니다)
  router.get('/health', (req, res) => {
    res.send("서버 연결 상태 양호");
  });

  // 2. 포스트 라우터 연결 (/api/posts)
  router.use('/posts', postRouter(client));

  // 3. 메인 앱에 'api' 접두사로 통합 등록
  app.use('/api', router);
};