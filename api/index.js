import app, { connectDB } from '../server/index.js';

export default async function handler(req, res) {
  try {
    await connectDB();
  } catch (err) {
    console.error('MongoDB Atlas Connection Error in Serverless Handler:', err);
  }

  return app(req, res);
}
