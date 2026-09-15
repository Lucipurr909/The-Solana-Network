import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import UserProfile from '../../components/UserProfile';
import UserPosts from '../../components/UserPosts';

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const { username } = router.query;
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [followed, setFollowed] = useState(false);

  useEffect(() => {
    if (username) {
      loadProfile();
    }
  }, [username]);

  const loadProfile = async () => {
    try {
      const response = await fetch(`/api/profile/${username}`);
      const data = await response.json();
      setProfile(data.profile);
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    try {
      // Call smart contract to follow user
      setFollowed(!followed);
      loadProfile();
    } catch (error) {
      console.error('Failed to follow user:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {profile && (
        <>
          <UserProfile profile={profile} isFollowed={followed} onFollow={handleFollow} isOwnProfile={publicKey?.toBase58() === profile.owner} />
          <UserPosts posts={posts} />
        </>
      )}
    </div>
  );
};

export default ProfilePage;
