#!/bin/bash

echo "Pushing to GitHub with token authentication..."

# Use the token for authentication
git remote set-url origin https://oauth2:${GITHUB_TOKEN}@github.com/ed23x/struckto-ai.git

# Push the branch
git push origin feature/autosave-diagrams

# Reset remote URL to avoid token in logs
git remote set-url origin https://github.com/ed23x/struckto-ai.git

echo "Push completed!"