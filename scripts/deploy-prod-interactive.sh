#!/bin/bash

# Configurazione server
SERVER_USER="ubuntu"
SERVER_IP="51.178.31.160"
SERVER_PATH="/home/ubuntu/ai_blog"
PROJECT_NAME="windsurf-project-2"

echo "🚀 Starting production deployment to $SERVER_IP"
echo "⚠️  You will be asked for the SSH password during deployment"
echo ""

# 1. Build locale
echo "📦 Building project locally..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build completed successfully"

# 2. Crea archivio escludendo node_modules e .git
echo "📦 Creating deployment archive..."
tar -czf /tmp/${PROJECT_NAME}.tar.gz \
    --exclude='node_modules' \
    --exclude='.git' \
    --exclude='.next/cache' \
    --exclude='.env.local' \
    .

echo "📤 Uploading to production server..."
echo "Password: 4.<CN47^yAl_*Y(bs5"
scp /tmp/${PROJECT_NAME}.tar.gz ${SERVER_USER}@${SERVER_IP}:/tmp/

if [ $? -ne 0 ]; then
    echo "❌ Upload failed!"
    rm /tmp/${PROJECT_NAME}.tar.gz
    exit 1
fi

# 4. Crea script da eseguire sul server
cat > /tmp/deploy_script.sh << 'DEPLOY_SCRIPT'
#!/bin/bash
cd /home/ubuntu

# Backup del vecchio deployment
if [ -d "ai_blog" ]; then
    echo "💾 Backing up current deployment..."
    BACKUP_DIR="ai_blog_backup_$(date +%Y%m%d_%H%M%S)"
    mv ai_blog "$BACKUP_DIR"
fi

# Crea nuova directory e estrae i file
echo "📥 Extracting new deployment..."
mkdir -p ai_blog
cd ai_blog
tar -xzf /tmp/windsurf-project-2.tar.gz
rm /tmp/windsurf-project-2.tar.gz

# Ripristina .env.local se esiste nel backup
LATEST_BACKUP=$(ls -td /home/ubuntu/ai_blog_backup_* 2>/dev/null | head -1)
if [ -n "$LATEST_BACKUP" ] && [ -f "$LATEST_BACKUP/.env.local" ]; then
    echo "🔑 Restoring .env.local..."
    cp "$LATEST_BACKUP/.env.local" .env.local
fi

# Ripristina directory uploads
if [ -n "$LATEST_BACKUP" ] && [ -d "$LATEST_BACKUP/public/uploads" ]; then
    echo "📁 Restoring uploads directory..."
    mkdir -p public
    cp -r "$LATEST_BACKUP/public/uploads" public/
fi

# Ripristina file JSON data
if [ -n "$LATEST_BACKUP" ] && [ -d "$LATEST_BACKUP/data" ]; then
    echo "💾 Restoring data files..."
    mkdir -p data
    cp "$LATEST_BACKUP/data"/*.json data/ 2>/dev/null || true
fi

# Installa dipendenze
echo "📦 Installing dependencies..."
npm install --production

# Riavvia il servizio PM2
echo "🔄 Restarting application..."
pm2 stop ai_blog 2>/dev/null || true
pm2 delete ai_blog 2>/dev/null || true
pm2 start npm --name "ai_blog" -- start
pm2 save

echo "✅ Deployment completed on server!"
DEPLOY_SCRIPT

# Trasferisce lo script sul server
echo "📤 Uploading deployment script..."
scp /tmp/deploy_script.sh ${SERVER_USER}@${SERVER_IP}:/tmp/

# Esegue lo script sul server
echo "🔧 Executing deployment on remote server..."
ssh -t ${SERVER_USER}@${SERVER_IP} "bash /tmp/deploy_script.sh && rm /tmp/deploy_script.sh"

# Pulizia locale
rm /tmp/${PROJECT_NAME}.tar.gz
rm /tmp/deploy_script.sh

echo ""
echo "✅ Production deployment completed successfully!"
echo "🌐 Your application should now be running on http://$SERVER_IP:3000"
echo ""
