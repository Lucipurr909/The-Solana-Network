import React from 'react';
import Link from 'next/link';
import PostCard from './PostCard';

interface PostFeedProps {
  posts: any[];
  loading: boolean;
  onRefresh: () => void;
}

const PostFeed: React.FC<PostFeedProps> = ({ posts, loading, onRefresh }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">Feed</h2>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="text-slate-400 hover:text-white transition-colors"
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {posts.length === 0 ? (
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 text-center">
          <p className="text-slate-400">No posts yet. Be the first to post!</p>
        </div>
      ) : (
        posts.map((post) => <PostCard key={post.id} post={post} />)
      )}
    </div>
  );
};

export default PostFeed;
