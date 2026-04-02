# LinkedSpark 💘🔒

A privacy-preserving mutual interest signaling app built on Aztec Network.

## Concept

Ever wanted to tell someone you're interested, but afraid of rejection? LinkedSpark solves this with cryptographic privacy:

1. **Signal Interest**: Stake $10 to privately signal interest in someone (via their LinkedIn)
2. **Private by Default**: If they don't signal back, *no one ever knows* you expressed interest
3. **Mutual Match**: If they signal you back, you both get notified and can connect
4. **Stake Recovery**: Get your stake back after a match, or withdraw after 30 days

## How It Works

```
You ──► Signal Alice ($10 stake) ──► Private note created
                                      ↓
Alice ──► Signal You ($10 stake) ──► Private note created
                                      ↓
                              Check for mutual? ──► YES! Both notified
                                      ↓
                              Stakes returned to both parties
```

## Privacy Guarantees

- **Zero-knowledge signaling**: Your signal is encrypted. Only you can see your outgoing signals.
- **No rejection exposure**: If someone doesn't signal back, they literally cannot tell you signaled them.
- **LinkedIn ID hashing**: On-chain data uses `hash(linkedin_id)`, not actual profiles.
- **Private stake amounts**: Even the amount staked is hidden.

## Tech Stack

- **Smart Contract**: Noir / Aztec.nr (privacy-first smart contracts)
- **Network**: Aztec Alpha mainnet (Ethereum L2)
- **Frontend**: React + Aztec.js
- **Identity**: LinkedIn OAuth

## ⚠️ Alpha Warning

This app runs on Aztec Alpha mainnet. There is a [disclosed vulnerability](https://thedefiant.io/news/blockchains/aztec-launches-alpha-network-ethereum-s-first-l2-for-private-smart-contracts) in v4 being fixed in v5 (July 2026). Use test tokens only for now.

## Quick Start

```bash
# Run the quick start script
./quickstart.sh

# Or manually:
npm install
npm run sandbox      # Terminal 1
npm run deploy:local # Terminal 2 (after sandbox is ready)
npm run dev         # Terminal 3

# Open http://localhost:5173
```

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for full instructions.

## Project Structure

```
linkedspark/
├── contracts/
│   └── linked_spark/
│       ├── Nargo.toml
│       └── src/
│           └── main.nr          # Noir smart contract
├── src/
│   ├── App.tsx                  # React frontend
│   ├── contracts/               # Generated contract artifacts
│   └── hooks/
│       └── useAztec.ts          # Aztec.js integration
├── package.json
└── README.md
```

## License

MIT
