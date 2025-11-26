#!/bin/bash

# Daily Paper Import Script
# This script runs daily at midnight to import new AI research papers from arXiv

# Exit on error
set -e

# Navigate to project directory
cd /home/ubuntu/michelelaurelli.it

# Load NVM
source ~/.nvm/nvm.sh

# Log start
echo "========================================"
echo "Daily Paper Import - $(date)"
echo "========================================"

# Run the import script
npm run daily-import-papers

# Check if there are changes
if git diff --quiet data/papers.json; then
  echo "No new papers imported, skipping commit"
else
  echo "New papers detected, committing changes..."
  
  # Commit and push changes
  git add data/papers.json
  git commit -m "Auto-import: Daily paper update $(date +%Y-%m-%d)"
  git push origin main
  
  echo "Changes pushed to repository"
  
  # Rebuild and restart the application
  echo "Rebuilding application..."
  npm run build
  
  echo "Restarting PM2..."
  pm2 restart all
  
  echo "✅ Application updated with new papers"
fi

echo "========================================"
echo "Daily import completed - $(date)"
echo "========================================"
