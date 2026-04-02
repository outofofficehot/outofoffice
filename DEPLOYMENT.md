# 🏖️ Out Of Office - Deployment Guide

**Domain**: outofoffice.hot

---

## Quick Start

```bash
# Install dependencies
npm install

# Compile contract (requires nargo)
npm run compile:contracts

# Start local dev
npm run sandbox   # Terminal 1: Aztec sandbox
npm run dev       # Terminal 2: Frontend

# Open http://localhost:5173
```

---

## Project Structure

```
outofoffice/
├── src/
│   ├── App.tsx                # Main app + routing
│   ├── pages/
│   │   └── Landing.tsx        # Landing page (outofoffice.hot)
│   ├── hooks/
│   │   └── useAztec.ts        # Aztec.js integration
│   └── utils/
│       └── linkedin.ts        # LinkedIn ID handling
├── contracts/
│   └── out_of_office/
│       ├── Nargo.toml
│       └── src/main.nr        # Noir smart contract
├── .github/workflows/
│   ├── ci.yml                 # Build + test
│   ├── deploy.yml             # Vercel deployment
│   └── release.yml            # GitHub releases
└── scripts/
    └── deploy.ts              # Contract deployment
```

---

## Deployment

### 1. Contract Deployment

**Local (sandbox):**
```bash
npm run deploy:local
```

**Alpha mainnet:**
```bash
DEPLOYER_SECRET_KEY=your_key NETWORK=alpha npm run deploy:alpha
```

### 2. Frontend Deployment

**Option A: Vercel (recommended)**
```bash
npm i -g vercel
vercel

# Set environment variables in Vercel dashboard:
# VITE_CONTRACT_ADDRESS=0x...
# VITE_AZTEC_PXE_URL=https://pxe.alpha.aztec.network
```

**Option B: Manual**
```bash
npm run build
# Upload dist/ to any static host
```

### 3. Domain Setup

Point `outofoffice.hot` to your deployment:
- **Vercel**: Add domain in project settings
- **Cloudflare**: Add CNAME record to Vercel/host

---

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_CONTRACT_ADDRESS` | Deployed contract address | `0x1234...` |
| `VITE_AZTEC_PXE_URL` | Aztec PXE endpoint | `https://pxe.alpha.aztec.network` |
| `VITE_LINKEDIN_CLIENT_ID` | LinkedIn OAuth (optional) | `abc123` |

---

## CI/CD

**On push to `main`:**
1. Build frontend ✓
2. Compile contract ✓
3. Deploy preview to Vercel

**On tag `v*`:**
1. Build release artifacts
2. Create GitHub release
3. Deploy to production

---

## URLs

| Environment | URL |
|-------------|-----|
| Production | https://outofoffice.hot |
| Preview | https://outofoffice-*.vercel.app |
| Local | http://localhost:5173 |

---

## ⚠️ Alpha Warning

Aztec Alpha has a disclosed vulnerability (March 2026) being fixed in v5 (July 2026). 
**Use test tokens only until v5 launches.**
