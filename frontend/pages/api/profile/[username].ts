// Next.js API route for fetching user profile
// pages/api/profile/[username].ts

import type { NextApiRequest, NextApiResponse } from 'next';

type ResponseData = {
  profile?: any;
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
    const { username } = req.query;

    // TODO: Fetch profile data from Solana blockchain or indexer
    // This is a placeholder implementation
    const profile = {
      owner: 'user1',
      username,
      bio: 'Building on Solana 🔥',
      followers: 1234,
      following: 567,
      posts: 89,
      created_at: Math.floor(Date.now() / 1000),
    };

    const posts = [
      {
        id: '1',
        author: 'user1',
        author_username: username,
        content: 'Hello Solana! 🚀',
        image_url: null,
        likes: 42,
        replies: 5,
        reposts: 12,
        created_at: Math.floor(Date.now() / 1000),
      },
    ];

    res.status(200).json({ profile, posts });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
}
