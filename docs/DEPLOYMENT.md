# Deployment Guide

## Local Development

### 1. Start Solana Test Validator

```bash
# In terminal 1
solana-test-validator
```

### 2. Build and Deploy Contracts

```bash
cd programs/solana_social
anchor build
anchor deploy
```

### 3. Start Frontend Development Server

```bash
cd ../../frontend
npm install
npm run dev
```

Visit `http://localhost:3000` and connect your wallet.

## Devnet Deployment

### Prerequisites

- Devnet SOL for fees (~2-5 SOL)
- Solana CLI configured for devnet

```bash
solana config set --url https://api.devnet.solana.com
solana airdrop 10  # Request devnet SOL
```

### Deploy Contracts

```bash
cd programs/solana_social

# Update Anchor.toml for devnet
# [provider]
# cluster = "devnet"

anchor build
anchor deploy --provider.cluster devnet
```

### Update Program IDs

After deployment, copy the new program ID:

```bash
# Get it from deploy output or:
solana program show <YOUR_WALLET_ADDRESS> --cluster devnet

# Update frontend/.env.local
NEXT_PUBLIC_PROGRAM_ID=<NEW_PROGRAM_ID>
```

### Deploy Frontend

#### Option A: Vercel

```bash
cd frontend
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod

# Set environment variables in Vercel dashboard
```

#### Option B: Self-Hosted

```bash
cd frontend
npm run build
npm start
```

## Mainnet Deployment

⚠️ **BEFORE MAINNET:**

1. Audit smart contracts
2. Test thoroughly on devnet
3. Verify all security measures
4. Consider insurance/liability

### Deploy Contracts

```bash
cd programs/solana_social

# Update Anchor.toml
# [provider]
# cluster = "mainnet-beta"

anchor build --release
anchor deploy --provider.cluster mainnet-beta
```

### Set Up Indexer

```bash
cd indexer

# Update .env for production
cat > .env << EOF
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/solana_social
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
PORT=3001
EOF

npm install
npm start
```

### Deploy Frontend

```bash
cd frontend

# Update .env.production
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
NEXT_PUBLIC_PROGRAM_ID=<MAINNET_PROGRAM_ID>

vercel --prod
```

## Forking & Custom Deployment

This project is designed to be forked! Here's how to deploy your own version:

### Step 1: Fork on GitHub

```bash
# Click "Fork" on https://github.com/Lucipurr909/The-Solana-Network
git clone https://github.com/YOUR_USERNAME/The-Solana-Network.git
cd The-Solana-Network
```

### Step 2: Generate New Program ID

```bash
solana-keygen grind-validator-key-v2 --starts-with YOUR
```

### Step 3: Update Configuration

**Anchor.toml:**
```toml
[programs.localnet]
solana_social = "YOURxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

[programs.devnet]
solana_social = "YOURxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

[programs.mainnet]
solana_social = "YOURxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

**programs/solana_social/src/lib.rs:**
```rust
declare_id!("YOURxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
```

### Step 4: Deploy Your Version

```bash
# Build
cd programs/solana_social
anchor build

# Deploy to devnet
anchor deploy --provider.cluster devnet

# Get actual deployed program ID
solana program show <YOUR_KEYPAIR_ADDRESS> --cluster devnet

# Update Anchor.toml with actual ID
# Re-deploy if needed
anchor deploy --provider.cluster devnet
```

### Step 5: Update Frontend

**frontend/.env.local:**
```
NEXT_PUBLIC_PROGRAM_ID=YOUR_ACTUAL_PROGRAM_ID
NEXT_PUBLIC_SOLANA_NETWORK=devnet
```

### Step 6: Run Locally

```bash
cd frontend
npm install
npm run dev
```

## Indexer Setup

### Local MongoDB

```bash
# Install MongoDB (macOS)
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Verify
mongo --version
```

### Deploy Indexer

```bash
cd indexer
npm install

# Create .env
cat > .env << EOF
MONGODB_URI=mongodb://localhost:27017
SOLANA_RPC_URL=https://api.devnet.solana.com
PORT=3001
EOF

# Start indexer
npm run start
```

Indexer will listen for on-chain events and update MongoDB.

## CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Devnet

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Solana
        run: |
          sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
          export PATH="/home/runner/.local/share/solana/install/active_release/bin:$PATH"
          solana --version
      
      - name: Setup Rust
        run: rustup update
      
      - name: Install Anchor
        run: npm install -g @project-serum/anchor-cli
      
      - name: Build & Deploy Contracts
        run: |
          cd programs/solana_social
          anchor build
          anchor deploy --provider.cluster devnet
      
      - name: Deploy Frontend
        run: |
          cd frontend
          npm install
          npm run build
          npm run deploy
```

## Monitoring

### Contract Events

```bash
# Watch transactions
solana logs <PROGRAM_ID> --url devnet
```

### Indexer Health

```bash
# Check indexer status
curl http://localhost:3001/health
```

### Frontend Performance

- Set up Vercel Analytics
- Monitor API response times
- Track user engagement

## Troubleshooting

### "Insufficient SOL for fees"

```bash
solana airdrop 5 --url devnet
```

### "Program not found at address"

- Verify program ID in `.env`
- Check deployment network
- Re-deploy if needed

### "MongoDB connection refused"

- Verify MongoDB is running
- Check connection string
- Verify network access

### "Wallet not connected"

- Clear browser cache/localStorage
- Reload page
- Verify RPC endpoint in `.env`

## Production Checklist

- [ ] Contract audit completed
- [ ] Testnet testing (>2 weeks)
- [ ] Security review passed
- [ ] Indexer uptime stable (>99%)
- [ ] Monitoring/alerting configured
- [ ] Backups automated
- [ ] Legal review (where applicable)
- [ ] Mainnet deployment plan
- [ ] Incident response plan
- [ ] Community communication plan

---

Need help? Check the README or create an issue!
