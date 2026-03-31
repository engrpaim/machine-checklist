echo "================================================================================="
echo "Updating Machining Checklist!"

git pull origin main

echo "=================================================================================="

read -p "Migrate Database? (y/n): " answer

if [[ "$answer" == "y" ||  "$answer" == "Y"]];then
    echo "Migrating database......"
    php artisan migrate
elif
    echo "Migration skipped..."
else
    echo "Invalid Input... Please type y or n"
fi
echo "Optimizing ........"

php artisan optimize:clear

echo "Building npm"

npm install
npm run build
