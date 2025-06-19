import express from 'express';
import News from '../models/newsModel.js';
const router = express.Router();

router.get('/', async (req, res) => {
  const news = await News.find().sort({ createdAt: -1 });
  res.json(news);
});

router.post('/', async (req, res) => {
  const { title, content, category } = req.body;
  const news = new News({ title, content, category });
  await news.save();
  res.json(news);
});

export default router;
