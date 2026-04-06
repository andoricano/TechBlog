import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { MongoClient } from 'mongodb';

// 사용자님의 DB 설정 (상수)
const DB_NAME = "TechblogDB";

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
    // 환경 변수 체크 (타입 단언 사용)
    const uri = process.env.MONGODB_URI as string;

    if (!uri) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "MONGODB_URI 환경 변수가 설정되지 않았습니다." }),
        };
    }

    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db(DB_NAME);

        // 단순 연결 테스트: 데이터베이스 목록 가져오기
        const admin = db.admin();
        const dbInfo = await admin.listDatabases();

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                success: true,
                message: "MongoDB 연결 성공 (TypeScript)",
                databases: dbInfo.databases.map(d => d.name),
            }),
        };
    } catch (error: any) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                success: false,
                error: error.message,
            }),
        };
    } finally {
        // 서버리스 환경에서는 연결을 확실히 닫아주는 것이 좋습니다.
        await client.close();
    }
};