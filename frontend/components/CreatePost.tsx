import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

interface CreatePostProps {
  onPostCreated: () => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ onPostCreated }) => {
  const { publicKey, sendTransaction } = useWallet();
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    setError('');

    try {
      // TODO: Call smart contract to create post
      const response = await fetch('/api/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: publicKey?.toBase58(),
          content,
          imageUrl: imageUrl || null,
        }),
      });

      if (response.ok) {
        setContent('');
        setImageUrl('');
        onPostCreated();
      } else {
        setError('Failed to create post');
      }
    } catch (err) {
      setError('Error creating post');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 mb-6">
      <div className="space-y-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          maxLength={280}
          className="w-full bg-slate-700 text-white placeholder-slate-400 rounded p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
          rows={3}
        />
        <div className="flex justify-between items-center">
          <div className="text-sm text-slate-400">
            {content.length}/280
          </div>
          <button
            type="submit"
            disabled={loading || !content.trim()}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-2 px-6 rounded-full hover:shadow-lg disabled:opacity-50 transition-all"
          >
            {loading ? 'Posting...' : 'Post'}
          </button>
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
      </div>
    </form>
  );
};

export default CreatePost;
