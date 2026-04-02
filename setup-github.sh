#!/bin/bash
# Setup GitHub for LinkedSpark
# Run: ./setup-github.sh YOUR_GITHUB_TOKEN

set -e

if [ -z "$1" ]; then
    echo "Usage: ./setup-github.sh YOUR_GITHUB_TOKEN"
    echo ""
    echo "To create a token:"
    echo "1. Go to https://github.com/settings/tokens/new"
    echo "2. Name: 'linkedspark-deploy'"
    echo "3. Scopes: repo, workflow"
    echo "4. Generate and copy the token"
    exit 1
fi

GITHUB_TOKEN="$1"
REPO_NAME="outofoffice"

echo "🏖️ Setting up GitHub for Out Of Office..."

# Get username
GITHUB_USER=$(curl -s -H "Authorization: token ${GITHUB_TOKEN}" https://api.github.com/user | jq -r '.login')

if [ "$GITHUB_USER" == "null" ] || [ -z "$GITHUB_USER" ]; then
    echo "❌ Invalid token or API error"
    exit 1
fi

echo "✓ Authenticated as: $GITHUB_USER"

# Check if repo exists
REPO_EXISTS=$(curl -s -o /dev/null -w "%{http_code}" -H "Authorization: token ${GITHUB_TOKEN}" https://api.github.com/repos/${GITHUB_USER}/${REPO_NAME})

if [ "$REPO_EXISTS" == "200" ]; then
    echo "✓ Repository already exists: github.com/${GITHUB_USER}/${REPO_NAME}"
else
    echo "📦 Creating repository..."
    curl -s -X POST \
        -H "Authorization: token ${GITHUB_TOKEN}" \
        -H "Accept: application/vnd.github.v3+json" \
        https://api.github.com/user/repos \
        -d "{
            \"name\": \"${REPO_NAME}\",
            \"description\": \"Private mutual interest signaling for the workplace. Built on Aztec Network.\",
            \"private\": false,
            \"has_issues\": true,
            \"has_projects\": false,
            \"has_wiki\": false
        }" > /dev/null
    echo "✓ Repository created: github.com/${GITHUB_USER}/${REPO_NAME}"
fi

# Set remote
echo "🔗 Configuring git remote..."
git remote remove origin 2>/dev/null || true
git remote add origin "https://${GITHUB_TOKEN}@github.com/${GITHUB_USER}/${REPO_NAME}.git"

# Push
echo "🚀 Pushing to GitHub..."
git push -u origin main

echo ""
echo "═══════════════════════════════════════════════════════"
echo "  ✅ SUCCESS!"
echo "═══════════════════════════════════════════════════════"
echo ""
echo "  Repository: https://github.com/${GITHUB_USER}/${REPO_NAME}"
echo ""
echo "  Next steps:"
echo "  1. Add secrets in GitHub repo settings:"
echo "     - VERCEL_TOKEN (for deployment)"
echo "     - VERCEL_ORG_ID"
echo "     - VERCEL_PROJECT_ID"
echo "     - VITE_CONTRACT_ADDRESS (after contract deploy)"
echo ""
echo "  2. Or deploy manually:"
echo "     vercel"
echo ""
echo "═══════════════════════════════════════════════════════"
