# Secrets Management

This project uses [SOPS](https://github.com/getsops/sops) with [age](https://github.com/FiloSottile/age) encryption for secret management.

## Setup (New Machine)

### 1. Install tools

```bash
# Install sops
curl -Lo ~/.local/bin/sops https://github.com/getsops/sops/releases/latest/download/sops-linux-amd64
chmod +x ~/.local/bin/sops

# Install age
curl -Lo /tmp/age.tar.gz https://github.com/FiloSottile/age/releases/latest/download/age-linux-amd64.tar.gz
tar -xzf /tmp/age.tar.gz -C ~/.local/bin --strip-components=1
```

### 2. Get the age private key

The private key is stored securely outside this repo. Get it from:
- Password manager
- Secure team storage
- The person who set this up

Place it at: `~/.config/sops/age/keys.txt`

```bash
mkdir -p ~/.config/sops/age
# Copy key content to keys.txt
chmod 600 ~/.config/sops/age/keys.txt
```

## Usage

```bash
# Get a secret
./scripts/secrets.sh get github_token

# List all secrets
./scripts/secrets.sh list

# Edit secrets (opens in $EDITOR)
./scripts/secrets.sh edit

# Use in commands
GITHUB_TOKEN=$(./scripts/secrets.sh get github_token) git push
```

## Adding New Secrets

```bash
./scripts/secrets.sh edit
# Add new key-value pairs to the JSON
# Save and close - SOPS re-encrypts automatically
```

## Current Secrets

| Key | Description |
|-----|-------------|
| `github_token` | GitHub PAT for outofofficehot account |
| `vercel_token` | Vercel deployment token |
| `aztec_deployer_private_key` | Aztec contract deployer private key |
| `aztec_deployer_address` | Deployer address (fund with ETH) |
| `linkedin_client_id` | LinkedIn OAuth App Client ID |
| `linkedin_client_secret` | LinkedIn OAuth App Client Secret |

## LinkedIn OAuth Setup

1. Go to https://developer.linkedin.com/
2. Create a new app
3. Add OAuth 2.0 redirect URL: `https://outofoffice.hot/callback`
4. Request "Sign In with LinkedIn using OpenID Connect" product
5. Get Client ID and Client Secret
6. Add to secrets: `./scripts/secrets.sh edit`
7. Set in Vercel:
   - `VITE_LINKEDIN_CLIENT_ID` (public, for frontend)
   - `LINKEDIN_CLIENT_SECRET` (server only)

## Security Notes

- ✅ `secrets.json` is encrypted and safe to commit
- ❌ Never commit `~/.config/sops/age/keys.txt`
- ❌ Never commit decrypted files (`*.dec.*`)
- The age public key in `.sops.yaml` is safe to share

## Public Key

```
age1mau9emg8qujws6emtfdnycuu7fwpme2sp3xgwcrx59n2gvnvk37q6xd9ll
```
