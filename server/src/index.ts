import express from 'express';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import cors from 'cors';
import { DB_CONFIG } from './config/constants.js';
import { setupRoutes } from './routes/index.js'; // 라우트 통합 허브

dotenv.config();

const app = express();
const uri = process.env.MONGO_URI;

if (!uri) {
  console.error("❌ 에러: .env 파일에서 MONGO_URI를 읽지 못했습니다.");
  process.exit(1);
}

const client = new MongoClient(uri);

// 1. 글로벌 미들웨어 설정
app.use(cors());
app.use(express.json());

// 2. 서버 실행 및 초기화 로직
async function startServer() {
  try {
    // DB 연결
    await client.connect();
    console.log(`✅ MongoDB Atlas 연결 성공! (DB: ${DB_CONFIG.NAME})`);

    // 3. 라우트 연결 (DB 클라이언트를 주입하며 라우트 설정)
    setupRoutes(app, client);

    // 4. 서버 리스닝
    app.listen(DB_CONFIG.PORT, () => {
      console.log(`🚀 서버 시작: http://localhost:${DB_CONFIG.PORT}`);
    });
  } catch (e) {
    console.error("❌ 서버 시작 실패:", e);
    process.exit(1);
  }
}

startServer();