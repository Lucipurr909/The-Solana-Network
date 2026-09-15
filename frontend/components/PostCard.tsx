import React, { useState } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface PostCardProps {
  post: any;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [liked, setLiked] = useState(false);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    // TODO: Call smart contract to like post
    setLiked(!liked);
  };

  return (
    <Link href={`/post/${post.id}`}>
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:bg-slate-800/75 transition-colors cursor-pointer">
        <div className="flex gap-4">
          {/* Avatar */}
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex-shrink-0" />

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center gap-2 flex-wrap">
              <Link href={`/profile/${post.author_username}`}>
                <span className="font-bold text-white hover:underline">{post.author_username}</span>
              </Link>
              <span className="text-slate-500">@{post.author_username}</span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-500 text-sm">
                {formatDistanceToNow(new Date(post.created_at * 1000), { addSuffix: true })}
              </span>
            </div>

            {/* Post Content */}
            <p className="text-white mt-2 break-words">{post.content}</p>

            {/* Image */}
            {post.image_url && (
              <img src={post.image_url} alt="Post" className="mt-3 rounded-lg max-w-full" />
            )}

            {/* Stats */}
            <div className="flex gap-8 mt-3 text-slate-500 text-sm">
              <span>💬 {post.replies}</span>
              <span>🔄 {post.reposts}</span>
              <span onClick={handleLike} className="cursor-pointer hover:text-pink-500">
                ❤️ {post.likes + (liked ? 1 : 0)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PostCard;
