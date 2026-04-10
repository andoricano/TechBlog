import { Handler } from '@netlify/functions';
import { MongoClient } from 'mongodb';

export const handler: Handler = async (event) => {
    const uri = process.env.MONGODB_URI!;
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const collection = client.db("TechblogDB").collection("posts");

        // 💡 경로에서 ID 추출 (예: /.netlify/functions/posts/123 -> id는 123)
        const pathParts = event.path.split('/');
        const pathId = pathParts[pathParts.length - 1];

        // 쿼리 파라미터 방식도 일단 유지 (하위 호환성)
        const queryId = event.queryStringParameters?.id;
        const type = event.queryStringParameters?.type;

        // 최종 사용할 ID 결정 (경로에 있거나 쿼리에 있거나)
        const effectiveId = (pathId && pathId !== 'posts') ? pathId : queryId;

        // 1. 단일 조회 (getOne) - ID가 확실히 식별될 때
        if (effectiveId) {
            console.log("🔍 단일 포스트 조회 시도 ID:", effectiveId);
            const post = await collection.findOne({ id: effectiveId });

            if (!post) {
                return {
                    statusCode: 404,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ error: "Post not found" })
                };
            }
            // 찾았으면 배열이 아닌 객체 { ... } 하나만 반환
            return {
                statusCode: 200,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(post)
            };
        }

        // 2. Dict 반환 (getDict)
        if (type === 'dict') {
            const posts = await collection.find({}).project({ _id: 0, content: 0 }).toArray();
            const dict = posts.reduce((acc: any, post: any) => {
                acc[post.id] = {
                    ...post,
                    content: "",
                    reservation1: post.reservation1 || [],
                    reservation2: post.reservation2 || []
                };
                return acc;
            }, {});
            return { statusCode: 200, headers: { "Content-Type": "application/json" }, body: JSON.stringify(dict) };
        }

        // 3. 기본값: 전체 목록 반환
        const allPosts = await collection.find({}).project({ content: 0 }).toArray();
        return { statusCode: 200, headers: { "Content-Type": "application/json" }, body: JSON.stringify(allPosts) };

    } catch (e: any) {
        return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
    } finally {
        await client.close();
    }
};