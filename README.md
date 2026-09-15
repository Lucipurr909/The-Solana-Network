# SolanaView - Permissionless Social Media on Solana

A decentralized social media platform built on the Solana blockchain using Anchor smart contracts and Next.js frontend. SolanaView enables users to create profiles, post content, interact with posts, and follow other users in a completely permissionless manner.

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Development](#development)
- [Deployment](#deployment)
- [Smart Contract Details](#smart-contract-details)
- [Frontend Structure](#frontend-structure)
- [API Routes](#api-routes)
- [Troubleshooting](#troubleshooting)

## Features

### Smart Contracts
- **User Profiles**: Create and manage user profiles with username and bio
- **Posts**: Create text posts (280 character limit) with optional image URLs
- **Interactions**: Like posts, reply to posts, and repost content
- **Follow System**: Follow and unfollow other users with follower/following counts
- **On-Chain Data**: All data stored on-chain using Solana's state system

### Frontend
- **Wallet Integration**: Seamless Solana wallet connection (Phantom, Solflare)
- **Feed**: Real-time post feed with infinite scroll
- **User Profiles**: View user profiles with stats and post history
- **Post Details**: Detailed view of individual posts with replies
- **Responsive Design**: Beautiful UI with Tailwind CSS
- **TypeScript**: Full type safety across the codebase

## Architecture

```
The-Solana-Network/
├── programs/
│   └── solana_social/           # Anchor smart contract program
│       ├── src/
│       │   └── lib.rs           # Contract logic
│       └── Cargo.toml
├── frontend/                     # Next.js frontend
│   ├── pages/
│   │   ├── _app.tsx             # App wrapper with wallet provider
│   │   ├── index.tsx            # Home/Feed page
│   │   ├── post/[id].tsx        # Post detail page
│   │   └── profile/[username].tsx # User profile page
│   ├── components/
│   │   ├── CreatePost.tsx       # Post creation form
│   │   ├── PostCard.tsx         # Individual post card
│   │   ├── PostFeed.tsx         # Feed container
│   │   ├── PostDetail.tsx       # Detailed post view
│   │   ├── PostReplies.tsx      # Reply list and form
│   │   ├── UserProfile.tsx      # Profile header
│   │   └── UserPosts.tsx        # User's posts list
│   ├── styles/
│   │   └── globals.css          # Global Tailwind styles
│   ├── pages/api/               # API routes (if needed)
│   ├── next.config.js
│   ├── tsconfig.json
│   └── package.json
├── indexer/                      # Optional: Blockchain indexer
├── Anchor.toml                   # Anchor configuration
├── package.json                  # Root workspace config
└── README.md                     # This file
```

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v16 or higher
- **npm**: v8 or higher
- **Rust**: Latest stable version
  ```bash
  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
  ```
- **Anchor CLI**: v0.29.0 or compatible
  ```bash
  cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
  avm install 0.29.0
  avm use 0.29.0
  ```
- **Solana CLI**: Latest version
  ```bash
  sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
  ```
- **Solana Local Validator** (for local development):
  - Or use Devnet/Testnet for testing

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Lucipurr909/The-Solana-Network.git
cd The-Solana-Network
```

### 2. Install Dependencies

Install all dependencies including smart contracts, frontend, and indexer:

```bash
npm run install:all
```

Or install individually:

```bash
# Root dependencies
npm install

# Frontend dependencies
npm install --prefix=frontend

# Indexer dependencies (if applicable)
npm install --prefix=indexer
```

## Configuration

### Solana Configuration

Set up your Solana configuration:

```bash
# Use localnet (default for development)
solana config set --url localhost

# Or use devnet
solana config set --url https://api.devnet.solana.com

# Verify your config
solana config get
```

### Anchor Configuration

The `Anchor.toml` file is already configured. Update if needed:

```toml
[provider]
cluster = "localnet"  # Change to "devnet" or "mainnet" as needed
wallet = "~/.config/solana/id.json"

[programs.localnet]
solana_social = "11111111111111111111111111111111"
# Update with deployed program ID after deployment
```

### Environment Variables

Create a `.env.local` file in the `frontend` directory:

```bash
cd frontend
echo "NEXT_PUBLIC_RPC_ENDPOINT=http://127.0.0.1:8899" > .env.local
```

For different environments:
- **Localnet**: `http://127.0.0.1:8899`
- **Devnet**: `https://api.devnet.solana.com`
- **Mainnet**: `https://api.mainnet-beta.solana.com`

## Development

### 1. Start the Solana Local Validator

In a new terminal window:

```bash
solana-test-validator
```

This starts a local Solana blockchain at `http://127.0.0.1:8899`

### 2. Build Smart Contracts

Build the Anchor program:

```bash
npm run contracts:build
```

### 3. Deploy Smart Contracts

Deploy to localnet:

```bash
npm run contracts:deploy
```

**Important**: After deployment, update the program ID in `Anchor.toml` and share it with the frontend team.

### 4. Test Smart Contracts

Run the contract test suite:

```bash
npm run contracts:test
```

### 5. Start Frontend Development Server

In another terminal:

```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:3000`

### 6. Full Development Setup (Concurrent)

Run everything together:

```bash
npm run dev
```

This runs:
- Frontend development server
- Indexer (if applicable)

## Deployment

### Smart Contract Deployment to Devnet

```bash
# Update Anchor.toml to use devnet
# Create a devnet keypair
solana-keygen new -o ~/.config/solana/devnet-keypair.json

# Fund your wallet (request from faucet)
solana airdrop 5 ~/.config/solana/devnet-keypair.json --url devnet

# Deploy
solana config set --url https://api.devnet.solana.com
solana config set --keypair ~/.config/solana/devnet-keypair.json
npm run contracts:deploy
```

### Frontend Deployment to Vercel

```bash
# Build the frontend
npm run build --prefix=frontend

# Deploy to Vercel
cd frontend
vercel
```

Or connect your GitHub repo to Vercel for automatic deployments.

## Smart Contract Details

### Data Structures

#### Profile
- `owner`: Public key of the profile owner
- `username`: Username (max 50 characters)
- `bio`: User biography (max 280 characters)
- `followers`: Number of followers
- `following`: Number of users being followed
- `posts`: Number of posts created
- `created_at`: Creation timestamp

#### Post
- `author`: Public key of the post author
- `content`: Post content (max 280 characters)
- `image_url`: Optional image URL (max 500 characters)
- `likes`: Number of likes
- `replies`: Number of replies
- `reposts`: Number of reposts
- `created_at`: Creation timestamp

#### Reply
- `author`: Public key of the reply author
- `parent_post`: Public key of the parent post
- `content`: Reply content (max 280 characters)
- `likes`: Number of likes
- `created_at`: Creation timestamp

#### Follow
- `follower`: Public key of the follower
- `followed`: Public key of the followed user
- `created_at`: Creation timestamp

### Instructions (Transactions)

1. **create_profile**: Create a new user profile
2. **create_post**: Create a new post
3. **like_post**: Like an existing post
4. **reply_to_post**: Reply to a post
5. **follow_user**: Follow another user
6. **unfollow_user**: Unfollow a user

## Frontend Structure

### Pages

- **`/`**: Home feed with all posts
- **`/profile/[username]`**: User profile with posts and stats
- **`/post/[id]`**: Detailed view of a post with replies

### Components

- **CreatePost**: Form to create new posts
- **PostCard**: Individual post card in the feed
- **PostFeed**: Container for multiple posts
- **PostDetail**: Detailed post view
- **PostReplies**: Reply section with reply form
- **UserProfile**: Profile header with user info
- **UserPosts**: List of user's posts

### Styling

The frontend uses:
- **Tailwind CSS**: Utility-first CSS framework
- **Dark Theme**: Slate color palette
- **Responsive Design**: Mobile and desktop optimized

## API Routes

### Endpoints (To be implemented)

- `GET /api/posts`: Fetch posts from the feed
- `POST /api/post`: Create a new post
- `GET /api/post/[id]`: Get a specific post with replies
- `GET /api/profile/[username]`: Get user profile data
- `POST /api/follow`: Follow a user
- `POST /api/unfollow`: Unfollow a user

These routes should interface with the on-chain data via an indexer or RPC calls.

## Troubleshooting

### Common Issues

#### 1. "Program not found" error
**Solution**: The program hasn't been deployed yet. Run:
```bash
npm run contracts:deploy
```

#### 2. "Wallet not connected" on frontend
**Solution**: Make sure you have a Solana wallet extension installed:
- [Phantom Wallet](https://phantom.app/)
- [Solflare Wallet](https://solflare.com/)

#### 3. Local validator fails to start
**Solution**: Restart the validator or check the port:
```bash
solana-test-validator --reset
```

#### 4. Build errors in contracts
**Solution**: Ensure Anchor is installed correctly:
```bash
avm use 0.29.0
anchor --version
```

#### 5. Frontend can't connect to blockchain
**Solution**: Verify the RPC endpoint in `.env.local`:
```bash
curl http://127.0.0.1:8899 -X POST -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"getHealth"}'
```

### Getting Help

- Check [Anchor Documentation](https://book.anchor-lang.com/)
- Check [Solana Documentation](https://docs.solana.com/)
- Review [Smart Contract Errors](#smart-contract-details)
- Open an issue on GitHub

## Performance Optimization

### Frontend
- Next.js automatic code splitting
- Image optimization with next/image
- CSS minification via Tailwind
- Wallet connection caching

### Smart Contract
- Efficient PDA seeds for account derivation
- Minimal state storage
- Optimized instruction processing

## Security Considerations

1. **Wallet Security**: Never share private keys
2. **Rate Limiting**: Implement on API routes if needed
3. **Input Validation**: Frontend validates content length
4. **Program Security**: Anchor validates all instruction inputs
5. **Devnet Testing**: Test thoroughly before mainnet deployment

## Future Enhancements

- [ ] Tip/Payment system using token transfers
- [ ] Image uploading to IPFS
- [ ] Hashtags and mentions
- [ ] Direct messaging
- [ ] Content moderation tools
- [ ] Analytics and insights
- [ ] Mobile app
- [ ] Real-time notifications

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, questions, or suggestions:
- Create an issue on GitHub
- Contact the development team
- Check existing documentation

---

**Happy building! 🚀**

Created with ❤️ for the Solana community
