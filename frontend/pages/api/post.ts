// Next.js API route for creating posts
// pages/api/post.ts

import type { NextApiRequest, NextApiResponse } from 'next';

type ResponseData = {
  post?: any;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { author, content, imageUrl } = req.body;

    // Validate input
    if (!author || !content || content.length === 0 || content.length > 280) {
      return res.status(400).json({ error: 'Invalid post content' });
    }

    // TODO: Call Solana smart contract to create post
    // This is a placeholder implementation
    const post = {
      id: Math.random().toString(36).substr(2, 9),
      author,
      content,
      image_url: imageUrl,
      likes: 0,
      replies: 0,
      reposts: 0,
      created_at: Math.floor(Date.now() / 1000),
    };

    res.status(201).json({ post });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
}
