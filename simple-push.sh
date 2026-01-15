#!/bin/bash

echo "Setting up git remote with token..."

# Check if GITHUB_TOKEN is set
if [ -z "$GITHUB_TOKEN" ]; then
  echo "Error: GITHUB_TOKEN environment variable is not set!"
  echo "Please set your GitHub token first:"
  echo "export GITHUB_TOKEN=your_github_personal_access_token"
  exit 1
fi

# Use the token for authentication
git remote set-url origin https://oauth2:${GITHUB_TOKEN}@github.com/ed23x/struckto-ai.git

# Push to branch
git push origin feature/autosave-diagrams

# Reset remote URL to avoid token in logs (for security)
git remote set-url origin https://github.com/ed23x/struckto-ai.git

echo "Push completed successfully!"