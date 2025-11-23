#!/bin/bash

# Backup uploads directory before build
if [ -d "public/uploads" ]; then
    echo "📦 Backing up uploads directory..."
    cp -r public/uploads /tmp/blog-uploads-backup
fi

# Run the build
echo "🔨 Building Next.js application..."
npm run build

# Restore uploads directory after build
if [ -d "/tmp/blog-uploads-backup" ]; then
    echo "📥 Restoring uploads directory..."
    rm -rf public/uploads
    cp -r /tmp/blog-uploads-backup public/uploads
    rm -rf /tmp/blog-uploads-backup
    echo "✅ Uploads restored successfully"
fi

echo "✅ Deploy complete!"
