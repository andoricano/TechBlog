import { Handler } from '@netlify/functions';
import { MongoClient } from 'mongodb';

export const handler: Handler = async (event) => {
    const uri = process.env.MONGODB_URI!;
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const collection = client.db("TechblogDB").collection("posts");

        const id = event.queryStringParameters?.id;
        const type = event.queryStringParameters?.type;

        // 1. 단일 조회 (getOne) - id가 있을 때
        if (id) {
            const post = await collection.findOne({ id });
            if (!post) {
                return { statusCode: 404, body: JSON.stringify({ error: "Post not found" }) };
            }
            return { statusCode: 200, body: JSON.stringify(post) };
        }

        // 2. Dict 반환 (getDict) - type이 dict일 때
        if (type === 'dict') {
            // DB에서 가져올 때부터 content를 제외(0)합니다.
            const posts = await collection.find({}).project({ content: 0 }).toArray();

            const dict = posts.reduce((acc: any, post: any) => {
                // post.meta가 존재하는지 확인 후 할당
                acc[post.id] = post.meta;
                return acc;
            }, {});
            return { statusCode: 200, body: JSON.stringify(dict) };
        }

        // 그 외 기본값: 전체 목록 반환 시에도 content 제외
        const allPosts = await collection.find({}).project({ content: 0 }).toArray();
        return { statusCode: 200, body: JSON.stringify(allPosts) };

    } catch (e: any) {
        return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
    } finally {
        await client.close();
    }
};