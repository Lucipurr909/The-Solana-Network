// Next.js API route for fetching a specific post
// pages/api/post/[id].ts

import type { NextApiRequest, NextApiResponse } from 'next';

type ResponseData = {
  post?: any;
  replies?: any[];
  liked?: boolean;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;

    // TODO: Fetch post and replies from Solana blockchain or indexer
    // This is a placeholder implementation
    const post = {
      id,
      author: 'user1',
      author_username: 'alice',
      content: 'Hello Solana! 🚀',
      image_url: null,
      likes: 42,
      replies: 5,
      reposts: 12,
      created_at: Math.floor(Date.now() / 1000),
    };

    const replies = [
      {
        id: 'reply1',
        author: 'user2',
        author_username: 'bob',
        parent_post: id,
        content: 'Great post!',
        likes: 5,
        created_at: Math.floor(Date.now() / 1000),
      },
    ];

    res.status(200).json({ post, replies, liked: false });
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
}
