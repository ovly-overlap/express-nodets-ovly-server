#!/bin/bash

echo "🚀 Deploy 시작..."

cd /home/ubuntu/express-nodets-ovly-server

echo "📥 git pull 중..."
git pull origin main

echo "📦 npm install 중..."
npm install

echo "🔧 build 중..."
npm run build

echo "🔁 pm2 restart 중..."
pm2 restart ovly-server

echo "✅ Deploy 완료!"
