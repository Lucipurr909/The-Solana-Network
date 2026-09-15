import React, { useState } from 'react';
import PostCard from './PostCard';

interface PostRepliesProps {
  replies: any[];
  postId: string;
  onReply: (content: string) => void;
}

const PostReplies: React.FC<PostRepliesProps> = ({ replies, postId, onReply }) => {
  const [replyContent, setReplyContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    setLoading(true);
    try {
      // TODO: Call smart contract to create reply
      await onReply(replyContent);
      setReplyContent('');
    } catch (error) {
      console.error('Failed to reply:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Reply Input */}
      <form onSubmit={handleReply} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 mb-6">
        <textarea
          value={replyContent}
          onChange={(e) => setReplyContent(e.target.value)}
          placeholder="Post your reply..."
          maxLength={280}
          className="w-full bg-slate-700 text-white placeholder-slate-400 rounded p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none mb-3"
          rows={3}
        />
        <div className="flex justify-between items-center">
          <div className="text-sm text-slate-400">{replyContent.length}/280</div>
          <button
            type="submit"
            disabled={loading || !replyContent.trim()}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-2 px-6 rounded-full hover:shadow-lg disabled:opacity-50 transition-all"
          >
            {loading ? 'Replying...' : 'Reply'}
          </button>
        </div>
      </form>

      {/* Replies List */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white mb-4">Replies ({replies.length})</h3>
        {replies.length === 0 ? (
          <div className="text-center text-slate-400 py-8">
            <p>No replies yet. Be the first to reply!</p>
          </div>
        ) : (
          replies.map((reply) => <PostCard key={reply.id} post={reply} />)
        )}
      </div>
    </div>
  );
};

export default PostReplies;
