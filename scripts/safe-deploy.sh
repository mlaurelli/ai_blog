#!/bin/bash

# Safe deployment script with automatic backup
# This script ensures production data is never lost

set -e

echo "🔒 SAFE DEPLOY - Starting..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

SERVER_USER="ubuntu"
SERVER_IP="51.178.31.160"
SERVER_PATH="/home/ubuntu/michelelaurelli.it"
BACKUP_DIR="./backups/$(date +%Y%m%d_%H%M%S)"

# Create backup directory
mkdir -p "$BACKUP_DIR"

echo "${YELLOW}📦 Step 1: Backing up production data...${NC}"
scp -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP:$SERVER_PATH/data/posts.json "$BACKUP_DIR/posts.json"
scp -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP:$SERVER_PATH/data/authors.json "$BACKUP_DIR/authors.json"
scp -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP:$SERVER_PATH/data/glossary.json "$BACKUP_DIR/glossary.json"
echo "${GREEN}✅ Backup completed in $BACKUP_DIR${NC}"
echo ""

echo "${YELLOW}📥 Step 2: Syncing production data to local...${NC}"
cp "$BACKUP_DIR/posts.json" data/posts.json
cp "$BACKUP_DIR/authors.json" data/authors.json
cp "$BACKUP_DIR/glossary.json" data/glossary.json
echo "${GREEN}✅ Local data synced${NC}"
echo ""

echo "${YELLOW}💾 Step 3: Committing production data to git...${NC}"
git add data/posts.json data/authors.json data/glossary.json
if git diff --staged --quiet; then
    echo "${GREEN}✅ No changes to commit${NC}"
else
    git commit -m "Auto-sync: Production data backup $(date +'%Y-%m-%d %H:%M:%S')"
    git push origin main
    echo "${GREEN}✅ Changes committed and pushed${NC}"
fi
echo ""

echo "${YELLOW}🚀 Step 4: Deploying to production...${NC}"
ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP << 'ENDSSH'
source ~/.nvm/nvm.sh
cd /home/ubuntu/michelelaurelli.it
git stash
git pull origin main
npm install
npm run build
pm2 restart all
echo "✅ Deployment complete"
ENDSSH
echo "${GREEN}✅ Deploy complete!${NC}"
echo ""

echo "${GREEN}🎉 SAFE DEPLOY COMPLETED SUCCESSFULLY${NC}"
echo "Backup saved in: $BACKUP_DIR"
