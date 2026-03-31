import { MongoClient } from 'mongodb';
import { IPost } from '../types/post.js';
import { DB_CONFIG } from '../config/constants.js';

export const postService = (client: MongoClient) => {
  const db = client.db(DB_CONFIG.NAME);
  const collection = db.collection<IPost>(DB_CONFIG.COLLECTION_POSTS);

  return {
    async savePost(postData: IPost) {
      return await collection.insertOne(postData);
    },

    async getMetaDict() {
      const posts = await collection.find({}).toArray();
      return posts.reduce((acc: Record<string, any>, post) => {
        acc[post.id] = post.meta;
        return acc;
      }, {});
    },

    async getPostById(id: string) {
      return await collection.findOne({ id });
    }
  };
};