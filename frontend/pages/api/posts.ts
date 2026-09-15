// Next.js API route for fetching posts
// pages/api/posts.ts

import type { NextApiRequest, NextApiResponse } from 'next';

type ResponseData = {
  posts?: any[];
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
    // TODO: Fetch posts from Solana blockchain or indexer
    // This is a placeholder implementation
    const posts = [
      {
        id: '1',
        author: 'user1',
        author_username: 'alice',
        content: 'Hello Solana! 🚀',
        image_url: null,
        likes: 42,
        replies: 5,
        reposts: 12,
        created_at: Math.floor(Date.now() / 1000),
      },
    ];

    res.status(200).json({ posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
}
