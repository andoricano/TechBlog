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
            const posts = await collection
                .find({})
                .project({
                    _id: 0,
                    content: 0
                })
                .toArray();

            const dict = posts.reduce((acc: any, post: any) => {
                acc[post.id] = {
                    ...post,
                    content: "", // 타입 규격을 맞추기 위한 빈 값
                    reservation1: post.reservation1 || [],
                    reservation2: post.reservation2 || []
                };
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