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
            const posts = await collection.find({}).toArray();
            // Service 로직: 받아온 데이터를 리액트가 쓰기 좋게 Dict로 변환
            const dict = posts.reduce((acc: any, post: any) => {
                acc[post.id] = post.meta;
                return acc;
            }, {});
            return { statusCode: 200, body: JSON.stringify(dict) };
        }

        // 그 외 기본값: 전체 목록 반환
        const allPosts = await collection.find({}).toArray();
        return { statusCode: 200, body: JSON.stringify(allPosts) };

    } catch (e: any) {
        return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
    } finally {
        await client.close();
    }
};