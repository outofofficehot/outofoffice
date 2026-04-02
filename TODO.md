# ✅ LinkedSpark TODO

## 🔥 Now (To Get Running Locally)

- [ ] Install Noir compiler
  ```bash
  curl -L https://raw.githubusercontent.com/noir-lang/noirup/main/install | bash
  noirup
  ```

- [ ] Install Aztec CLI
  ```bash
  curl -s https://install.aztec.network | bash
  aztecup
  ```

- [ ] Run quickstart
  ```bash
  cd /home/will/.openclaw/workspace/linkedspark
  ./quickstart.sh
  ```

- [ ] Start sandbox (Terminal 1)
  ```bash
  npm run sandbox
  ```

- [ ] Compile contract
  ```bash
  cd contracts/linked_spark
  nargo compile
  ```

- [ ] Generate TypeScript bindings
  ```bash
  npm run codegen
  ```

- [ ] Deploy locally (Terminal 2)
  ```bash
  npm run deploy:local
  ```

- [ ] Copy contract address to `.env`

- [ ] Start frontend (Terminal 3)
  ```bash
  npm run dev
  ```

- [ ] Test in browser: http://localhost:5173

---

## 🧪 Testing Checklist

- [ ] Alice signals Bob
- [ ] Bob signals Alice
- [ ] Check mutual match works
- [ ] Test one-sided signal (privacy check)
- [ ] Test withdraw after timeout
- [ ] Test LinkedIn ID extraction
- [ ] Test invalid LinkedIn URLs
- [ ] Mobile responsive test

---

## 🚀 Alpha Mainnet Deploy

- [ ] Get Aztec Alpha test tokens
- [ ] Deploy to Alpha mainnet
  ```bash
  NETWORK=alpha npm run deploy:alpha
  ```
- [ ] Update `.env` with Alpha contract address
- [ ] Test on Alpha
- [ ] Deploy frontend to Vercel
- [ ] Share with beta testers

---

## 🔐 Production Hardening

- [ ] Implement proper PSI in `check_mutual()`
- [ ] Add USDC token staking (Aztec bridge)
- [ ] Contract security audit
- [ ] Upgrade to Aztec v5 (post-July 2026)
- [ ] Load testing
- [ ] Error monitoring (Sentry)
- [ ] Analytics (PostHog/Mixpanel)

---

## 🎨 UX Improvements

- [ ] LinkedIn OAuth login
- [ ] Profile preview on match
- [ ] Email notifications
- [ ] In-app messaging
- [ ] Match history timeline
- [ ] Export matches (private)
- [ ] Bulk signal feature
- [ ] VIP/Premium tier

---

## 📣 Marketing / Launch

- [ ] Landing page
- [ ] Demo video
- [ ] Privacy explainer
- [ ] Blog post on ZK dating
- [ ] Twitter thread
- [ ] Product Hunt launch
- [ ] Hacker News post
- [ ] Privacy community outreach

---

## 🔧 Tech Debt

- [ ] Add unit tests (contract)
- [ ] Add integration tests (frontend)
- [ ] E2E test suite
- [ ] CI/CD pipeline
- [ ] Proper error handling
- [ ] Loading states
- [ ] Offline mode
- [ ] PWA support

---

## 💡 Future Ideas

- [ ] Signal multiple people (bundle)
- [ ] Time-limited signals
- [ ] Anonymous messaging pre-match
- [ ] Group matching (3+ people)
- [ ] Event-based matching
- [ ] Enterprise version (B2B networking)
- [ ] White-label for dating apps
- [ ] ZK credentials (verified profiles)

---

**Priority**: ✅ Get local testing working first!
