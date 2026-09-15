import React, { useState, useEffect } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import PostFeed from '../components/PostFeed';
import CreatePost from '../components/CreatePost';

const Home: React.FC = () => {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (connected && publicKey) {
      loadPosts();
    }
  }, [connected, publicKey]);

  const loadPosts = async () => {
    setLoading(true);
    try {
      // Fetch posts from indexer or blockchain
      const response = await fetch('/api/posts');
      const data = await response.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur border-b border-slate-700">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">S</span>
            </div>
            <h1 className="text-2xl font-bold text-white">SolanaView</h1>
          </div>
          <WalletMultiButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        {connected ? (
          <>
            {/* Create Post Section */}
            <CreatePost onPostCreated={loadPosts} />

            {/* Posts Feed */}
            <PostFeed posts={posts} loading={loading} onRefresh={loadPosts} />
          </>
        ) : (
          <div className="text-center py-12">
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h2>
              <p className="text-slate-300 mb-6">Connect your Solana wallet to get started with SolanaView</p>
              <p className="text-slate-400 text-sm">A permissionless social media platform on Solana</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
