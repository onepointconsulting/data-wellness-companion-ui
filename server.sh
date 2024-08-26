#! /bin/bash
source /etc/profile
echo Executed profile
export PATH=/home/ubuntu/.nvm/versions/node/v18.19.1/bin:/home/ubuntu/miniconda3/bin:/home/ubuntu/miniconda3/condabin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin

cd /home/ubuntu/projects/data-wellness-companion-ui
yarn
yarn run build
npx http-server ./dist --port 8088 -P http://127.0.0.1:8088? -o .
