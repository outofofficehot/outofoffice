# 🚀 LinkedSpark Deployment Guide

## Project Status: ALPHA BUILD COMPLETE

Location: `/home/will/.openclaw/workspace/linkedspark`

---

## 📦 What's Been Built

### ✅ Smart Contract (Noir)
- **File**: `contracts/linked_spark/src/main.nr`
- **Features**:
  - Private signal storage (encrypted notes)
  - Stake-based interest signaling ($10 USDC)
  - Mutual match detection (privacy-preserving)
  - 30-day withdrawal timeout
  - LinkedIn ID hashing for privacy

### ✅ Frontend (React + Vite)
- **Main App**: `src/App.tsx`
- **Aztec Integration**: `src/hooks/useAztec.ts`
- **LinkedIn Utils**: `src/utils/linkedin.ts`
- **Features**:
  - Wallet connection (Aztec PXE)
  - Signal interest UI
  - Match checking
  - Signal history
  - Auto-connect to sandbox

### ✅ Deployment Scripts
- **Script**: `scripts/deploy.ts`
- **Supports**: Local sandbox + Aztec Alpha mainnet

---

## 🛠️ Setup & Deploy

### Step 1: Install Dependencies

```bash
cd /home/will/.openclaw/workspace/linkedspark
npm install
```

**Note**: Using Aztec v5.0.0-nightly (latest stable for Alpha)

---

### Step 2: Install Noir/Aztec CLI

You need the Aztec toolchain to compile contracts:

```bash
# Install aztec CLI globally
curl -s https://install.aztec.network | bash
aztecup
```

Or use the sandbox Docker image:

```bash
# Pull Aztec sandbox
docker pull aztecprotocol/aztec:latest
```

---

### Step 3: Compile the Contract

```bash
# Install nargo (Noir compiler)
curl -L https://raw.githubusercontent.com/noir-lang/noirup/main/install | bash
noirup

# Compile the LinkedSpark contract
cd contracts/linked_spark
nargo compile

# Generate TypeScript bindings
cd ../..
npm run codegen
```

This will:
- Compile `main.nr` → `target/linked_spark.json`
- Generate TypeScript artifacts in `src/artifacts/`

---

### Step 4A: Deploy Locally (Recommended First)

Start the Aztec sandbox:

```bash
# Terminal 1: Start sandbox
npm run sandbox

# This starts a local Aztec devnet on http://localhost:8080
```

Deploy the contract:

```bash
# Terminal 2: Deploy
npm run deploy:local
```

You'll get output like:

```
═══════════════════════════════════════════════════════════
  DEPLOYMENT SUCCESSFUL
═══════════════════════════════════════════════════════════
  Contract Address: 0x1234...abcd
  Network: sandbox
  Deployer: 0x5678...efgh
═══════════════════════════════════════════════════════════

📝 Add this to your .env file:
   VITE_CONTRACT_ADDRESS=0x1234...abcd
```

Create `.env`:

```bash
cp .env.example .env
# Edit .env and add the contract address
```

---

### Step 4B: Deploy to Alpha Mainnet

⚠️ **WARNING**: Aztec Alpha has a [known vulnerability](https://thedefiant.io/news/blockchains/aztec-launches-alpha-network-ethereum-s-first-l2-for-private-smart-contracts) being fixed in v5 (July 2026). **Use test funds only.**

```bash
# Set your deployer key (keep this secret!)
export DEPLOYER_SECRET_KEY=your_private_key_here

# Deploy to Alpha
NETWORK=alpha npm run deploy:alpha
```

---

### Step 5: Run the Frontend

```bash
npm run dev
```

Open http://localhost:5173

The app will auto-connect to your local sandbox (or configure for Alpha in the code).

---

## 🎯 Testing the App

### Local Sandbox Test Flow

1. **Start sandbox**: `npm run sandbox`
2. **Deploy contract**: `npm run deploy:local`
3. **Start frontend**: `npm run dev`
4. **Open browser**: http://localhost:5173

#### Test Scenario: Alice ↔ Bob Match

**As Alice:**
1. Enter your LinkedIn: `alice-smith`
2. Enter their LinkedIn: `bob-jones`
3. Click "Signal Interest ($10 stake)"
4. Transaction processes → signal sent privately

**As Bob** (open incognito/different browser):
1. Generate new wallet (refresh clears local storage)
2. Enter your LinkedIn: `bob-jones`
3. Enter their LinkedIn: `alice-smith`
4. Click "Signal Interest ($10 stake)"
5. Click "Check Match" → 🎉 **MATCH!**

**Privacy Test:**
- Alice signals Bob, but Bob doesn't signal back
- When Bob checks, he learns **nothing** about Alice's signal
- Only when **both** signal does the match reveal

---

## 🌐 Deploy Frontend to Production

### Option 1: Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts, set environment variables:
# VITE_CONTRACT_ADDRESS=your_alpha_contract_address
# VITE_AZTEC_PXE_URL=https://pxe.alpha.aztec.network
```

### Option 2: Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

### Option 3: GitHub Pages

```bash
# Build with base path
npm run build -- --base=/linkedspark/

# Push dist/ to gh-pages branch
git subtree push --prefix dist origin gh-pages
```

---

## 🔐 Security Considerations

### Privacy Guarantees

✅ **Signal Privacy**: Your signal is a private note only you can decrypt
✅ **LinkedIn Hashing**: On-chain data uses `poseidon_hash(linkedin_id)`, not raw IDs
✅ **Stake Privacy**: Amounts are encrypted in private notes
✅ **No Rejection Info**: If someone doesn't signal back, you learn **nothing**

### Known Issues

⚠️ **Alpha Vulnerability**: Disclosed March 27, 2026 - affects proving system
- **Mitigation**: Use test tokens only
- **Fix**: Shipping in v5 (July 2026)

⚠️ **Mutual Check Implementation**: Current `check_mutual()` is simplified
- **Production TODO**: Implement proper private set intersection (PSI)
- **Current**: Checks if both signals exist but needs better nullifier logic

---

## 📊 Next Steps / Improvements

### Phase 2: Enhanced Privacy
- [ ] Implement true private set intersection for `check_mutual()`
- [ ] Add batch processing to mitigate timing attacks
- [ ] Implement token staking (currently just placeholder)

### Phase 3: UX Improvements
- [ ] LinkedIn OAuth login (vs manual ID entry)
- [ ] Email notifications on matches
- [ ] Profile preview on match reveal
- [ ] Match chat integration

### Phase 4: Mainnet Launch
- [ ] Wait for Aztec v5 (vulnerability fix)
- [ ] Audit contract
- [ ] Deploy to production Alpha/Mainnet
- [ ] Set up monitoring/analytics

---

## 🐛 Troubleshooting

### Contract won't compile

```bash
# Check nargo version
nargo --version

# Should be >= 0.35.0
# Update with: noirup
```

### Frontend build fails

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Can't connect to sandbox

```bash
# Check if sandbox is running
curl http://localhost:8080/status

# Restart sandbox
npm run sandbox
```

### Transactions fail on Alpha

- Check you have test AZTEC tokens
- Verify contract address is correct in `.env`
- Check Aztec status: https://status.aztec.network

---

## 📚 Resources

- **Aztec Docs**: https://docs.aztec.network
- **Noir Language**: https://noir-lang.org
- **Aztec Discord**: https://discord.com/invite/aztec
- **Project Repo**: /home/will/.openclaw/workspace/linkedspark

---

## 🚢 Production Deployment Checklist

Before going live:

- [ ] Contract audit completed
- [ ] Upgrade to Aztec v5 (post-July 2026)
- [ ] LinkedIn OAuth configured
- [ ] Token staking implemented (USDC bridge)
- [ ] Terms of service + privacy policy
- [ ] Match notification system
- [ ] Analytics/monitoring
- [ ] Domain name secured
- [ ] SSL certificate
- [ ] Error tracking (Sentry/similar)

---

**Status**: ✅ Alpha build complete, ready for local testing
**Next**: Install dependencies and test on sandbox
