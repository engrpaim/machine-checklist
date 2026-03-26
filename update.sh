#!/bin/bash

echo "======================="
echo "Start Update Machining Checklist"

git pull origin main

echo "Clear Laravel caches..."

php artisan view:clear
php artisan route:clear
php artisan config:clear
php artisan cache:clear
php artisan optimize:clear


echo "Optimize Laravel"
php artisan optimize

echo "Optimize js/pages"
npm run build

echo "Update Completed!"
