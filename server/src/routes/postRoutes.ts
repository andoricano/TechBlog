import { Router } from 'express';
import { MongoClient } from 'mongodb';
import { postController } from '../controllers/postController.js';

export const postRouter = (client: MongoClient) => {
  const router = Router();
  const controller = postController(client);

  router.post('/seed', controller.seed);

  router.get('/dict', controller.getDict);

  router.get('/:id', controller.getOne);

  router.get('/', (req, res) => res.send("Post API Service is Running"));

  return router;
};