yarn
yarn run build
Set-Location ./dist
npx http-server  --port 8088 -P http://127.0.0.1:8088? -o .