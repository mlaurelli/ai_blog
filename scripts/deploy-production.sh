#!/bin/bash

# Configurazione server
SERVER_USER="ubuntu"
SERVER_IP="51.178.31.160"
SERVER_PATH="/home/ubuntu/ai_blog"
PROJECT_NAME="windsurf-project-2"

echo "🚀 Starting production deployment to $SERVER_IP"

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

# 3. Trasferisce l'archivio sul server
echo "📤 Uploading to production server..."
sshpass -p '4.<CN47^yAl_*Y(bs5' scp /tmp/${PROJECT_NAME}.tar.gz ${SERVER_USER}@${SERVER_IP}:/tmp/

# 4. Esegue comandi sul server remoto
echo "🔧 Deploying on remote server..."
sshpass -p '4.<CN47^yAl_*Y(bs5' ssh ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'
cd /home/ubuntu

# Backup del vecchio deployment
if [ -d "ai_blog" ]; then
    echo "💾 Backing up current deployment..."
    mv ai_blog ai_blog_backup_$(date +%Y%m%d_%H%M%S)
fi

# Crea nuova directory e estrae i file
echo "📥 Extracting new deployment..."
mkdir -p ai_blog
cd ai_blog
tar -xzf /tmp/windsurf-project-2.tar.gz
rm /tmp/windsurf-project-2.tar.gz

# Ripristina .env.local se esiste nel backup
if [ -f "../ai_blog_backup_"*"/.env.local" ]; then
    echo "🔑 Restoring .env.local..."
    cp ../ai_blog_backup_*/.env.local .env.local 2>/dev/null || true
fi

# Ripristina directory uploads se esiste nel backup
if [ -d "../ai_blog_backup_"*"/public/uploads" ]; then
    echo "📁 Restoring uploads directory..."
    mkdir -p public
    cp -r ../ai_blog_backup_*/public/uploads public/ 2>/dev/null || true
fi

# Ripristina file JSON se esistono nel backup
if [ -d "../ai_blog_backup_"*"/data" ]; then
    echo "💾 Restoring data files..."
    mkdir -p data
    cp ../ai_blog_backup_*/data/*.json data/ 2>/dev/null || true
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
ENDSSH

# 5. Pulizia
rm /tmp/${PROJECT_NAME}.tar.gz

echo ""
echo "✅ Production deployment completed successfully!"
echo "🌐 Your application should now be running on http://$SERVER_IP:3000"
echo ""
