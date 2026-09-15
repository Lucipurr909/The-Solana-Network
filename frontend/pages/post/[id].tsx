import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import PostDetail from '../../components/PostDetail';
import PostReplies from '../../components/PostReplies';

const PostPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [post, setPost] = useState<any>(null);
  const [replies, setReplies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (id) {
      loadPost();
    }
  }, [id]);

  const loadPost = async () => {
    try {
      const response = await fetch(`/api/post/${id}`);
      const data = await response.json();
      setPost(data.post);
      setReplies(data.replies || []);
      setLiked(data.liked || false);
    } catch (error) {
      console.error('Failed to load post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      // Call smart contract to like post
      setLiked(!liked);
      loadPost();
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const handleReply = async (content: string) => {
    try {
      // Call smart contract to create reply
      loadPost();
    } catch (error) {
      console.error('Failed to reply to post:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white">Loading post...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {post && (
          <>
            <PostDetail post={post} liked={liked} onLike={handleLike} />
            <PostReplies replies={replies} postId={id as string} onReply={handleReply} />
          </>
        )}
      </div>
    </div>
  );
};

export default PostPage;
