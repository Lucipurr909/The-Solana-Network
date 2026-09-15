import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

interface PostDetailProps {
  post: any;
  liked: boolean;
  onLike: () => void;
}

const PostDetail: React.FC<PostDetailProps> = ({ post, liked, onLike }) => {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 mb-6">
      {/* Author */}
      <Link href={`/profile/${post.author_username}`}>
        <div className="flex gap-4 mb-6 cursor-pointer hover:opacity-80">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full" />
          <div>
            <h2 className="text-xl font-bold text-white">{post.author_username}</h2>
            <p className="text-slate-400">@{post.author_username}</p>
          </div>
        </div>
      </Link>

      {/* Content */}
      <p className="text-2xl text-white mb-4">{post.content}</p>

      {/* Image */}
      {post.image_url && (
        <img src={post.image_url} alt="Post" className="rounded-lg w-full mb-4" />
      )}

      {/* Time */}
      <p className="text-slate-500 mb-6">
        {formatDistanceToNow(new Date(post.created_at * 1000), { addSuffix: true })}
      </p>

      {/* Stats and Actions */}
      <div className="border-t border-slate-700 pt-4">
        <div className="flex gap-8 text-slate-400 mb-4">
          <div className="text-center">
            <div className="text-white font-bold">{post.replies}</div>
            <div className="text-sm">Replies</div>
          </div>
          <div className="text-center">
            <div className="text-white font-bold">{post.reposts}</div>
            <div className="text-sm">Reposts</div>
          </div>
          <div className="text-center">
            <div className="text-white font-bold">{post.likes}</div>
            <div className="text-sm">Likes</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 border-t border-slate-700 pt-4">
          <button className="flex-1 text-slate-400 hover:text-blue-500 transition-colors">💬 Reply</button>
          <button className="flex-1 text-slate-400 hover:text-green-500 transition-colors">🔄 Repost</button>
          <button
            onClick={onLike}
            className={`flex-1 transition-colors ${
              liked ? 'text-pink-500' : 'text-slate-400 hover:text-pink-500'
            }`}
          >
            ❤️ Like
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
