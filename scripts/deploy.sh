git fetch; 
git reset --hard origin/main; 
yarn install; 
yarn build; 
pm2 restart dist/src/main.js