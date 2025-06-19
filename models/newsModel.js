import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema({
  title: String,
  content: String,
  category: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('News', newsSchema);
