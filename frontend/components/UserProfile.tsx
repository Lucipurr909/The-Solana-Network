import React from 'react';

interface UserProfileProps {
  profile: any;
  isFollowed: boolean;
  onFollow: () => void;
  isOwnProfile: boolean;
}

const UserProfile: React.FC<UserProfileProps> = ({ profile, isFollowed, onFollow, isOwnProfile }) => {
  return (
    <div className="bg-slate-800/50 border-b border-slate-700">
      <div className="max-w-2xl mx-auto">
        {/* Banner */}
        <div className="h-48 bg-gradient-to-r from-purple-600 to-pink-600" />

        {/* Profile Content */}
        <div className="px-4 pb-4 relative">
          {/* Avatar */}
          <div className="flex justify-between items-start -mt-16 relative z-10">
            <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full border-4 border-slate-900" />

            {/* Follow Button */}
            {!isOwnProfile && (
              <button
                onClick={onFollow}
                className={`mt-4 px-6 py-2 rounded-full font-bold transition-all ${
                  isFollowed
                    ? 'bg-slate-700 text-white hover:bg-slate-600'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg'
                }`}
              >
                {isFollowed ? 'Following' : 'Follow'}
              </button>
            )}
          </div>

          {/* Info */}
          <div className="mt-4">
            <h1 className="text-2xl font-bold text-white">{profile.username}</h1>
            <p className="text-slate-400">@{profile.username}</p>
            {profile.bio && <p className="text-white mt-2">{profile.bio}</p>}

            {/* Stats */}
            <div className="flex gap-6 mt-4 text-slate-400">
              <div>
                <span className="text-white font-bold">{profile.posts}</span>
                <span className="ml-2">Posts</span>
              </div>
              <div>
                <span className="text-white font-bold">{profile.following}</span>
                <span className="ml-2">Following</span>
              </div>
              <div>
                <span className="text-white font-bold">{profile.followers}</span>
                <span className="ml-2">Followers</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
