import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, MessageCircle, Repeat2, Share } from 'lucide-react';

interface PostCardProps {
  post: any;
  onLike?: () => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onLike }) => {
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    if (onLike) {
      onLike();
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  return (
    <Link href={`/post/${post.id}`}>
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:bg-slate-800/80 transition-colors cursor-pointer">
        <div className="flex space-x-4">
          {/* Avatar */}
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex-shrink-0" />
          
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="font-bold text-white truncate">{post.author_username || 'Anonymous'}</h3>
              <span className="text-slate-500 text-sm">@{post.author}</span>
              <span className="text-slate-500 text-sm">·</span>
              <span className="text-slate-500 text-sm">{formatDate(post.created_at)}</span>
            </div>

            {/* Content */}
            <p className="text-white mb-3 break-words">{post.content}</p>

            {/* Image */}
            {post.image_url && (
              <img 
                src={post.image_url} 
                alt="Post image" 
                className="rounded-lg mb-3 max-w-full h-auto"
              />
            )}

            {/* Stats & Actions */}
            <div className="flex justify-between text-slate-500 text-sm max-w-md">
              <div className="flex items-center space-x-2 hover:text-blue-400 group cursor-pointer">
                <MessageCircle className="w-4 h-4 group-hover:bg-blue-400/10 rounded-full p-2 w-8 h-8" />
                <span className="group-hover:bg-blue-400/10 rounded px-2">{post.replies || 0}</span>
              </div>
              <div className="flex items-center space-x-2 hover:text-green-400 group cursor-pointer">
                <Repeat2 className="w-4 h-4 group-hover:bg-green-400/10 rounded-full p-2 w-8 h-8" />
                <span className="group-hover:bg-green-400/10 rounded px-2">{post.reposts || 0}</span>
              </div>
              <div 
                className="flex items-center space-x-2 hover:text-red-400 group cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  handleLike();
                }}
              >
                <Heart 
                  className={`w-4 h-4 group-hover:bg-red-400/10 rounded-full p-2 w-8 h-8 ${liked ? 'fill-red-400 text-red-400' : ''}`} 
                />
                <span className="group-hover:bg-red-400/10 rounded px-2">{post.likes || 0}</span>
              </div>
              <div className="flex items-center space-x-2 hover:text-blue-400 group cursor-pointer">
                <Share className="w-4 h-4 group-hover:bg-blue-400/10 rounded-full p-2 w-8 h-8" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PostCard;
