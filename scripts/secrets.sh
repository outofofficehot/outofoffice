#!/bin/bash
# SOPS secrets helper for Out Of Office
# 
# Usage:
#   ./scripts/secrets.sh get github_token    # Get a single secret
#   ./scripts/secrets.sh get vercel_token
#   ./scripts/secrets.sh list                # List all secret keys
#   ./scripts/secrets.sh edit                # Edit secrets (opens editor)
#   ./scripts/secrets.sh export              # Export as env vars

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
SECRETS_FILE="$PROJECT_DIR/secrets/secrets.json"

export PATH="$HOME/.local/bin:$PATH"
export SOPS_AGE_KEY_FILE="${SOPS_AGE_KEY_FILE:-$HOME/.config/sops/age/keys.txt}"

if [ ! -f "$SOPS_AGE_KEY_FILE" ]; then
    echo "Error: Age key not found at $SOPS_AGE_KEY_FILE"
    echo "Run: age-keygen -o ~/.config/sops/age/keys.txt"
    exit 1
fi

case "$1" in
    get)
        if [ -z "$2" ]; then
            echo "Usage: $0 get <key>"
            exit 1
        fi
        sops -d "$SECRETS_FILE" | jq -r ".$2"
        ;;
    list)
        sops -d "$SECRETS_FILE" | jq -r 'keys[]'
        ;;
    edit)
        sops "$SECRETS_FILE"
        ;;
    export)
        # Export all secrets as environment variables
        eval "$(sops -d "$SECRETS_FILE" | jq -r 'to_entries | .[] | "export \(.key | ascii_upcase)=\(.value)"')"
        echo "Secrets exported to environment"
        ;;
    decrypt)
        # Show decrypted file (for debugging)
        sops -d "$SECRETS_FILE"
        ;;
    *)
        echo "SOPS Secrets Helper"
        echo ""
        echo "Usage: $0 <command> [args]"
        echo ""
        echo "Commands:"
        echo "  get <key>   Get a single secret value"
        echo "  list        List all secret keys"
        echo "  edit        Edit secrets in \$EDITOR"
        echo "  export      Export secrets as env vars"
        echo "  decrypt     Show decrypted secrets (debug)"
        echo ""
        echo "Examples:"
        echo "  $0 get github_token"
        echo "  $0 list"
        echo "  GITHUB_TOKEN=\$($0 get github_token) git push"
        ;;
esac
