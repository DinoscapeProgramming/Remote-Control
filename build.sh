wmic product where "name like '%Remote Control%'" call uninstall /nointeractive
cd client
rm -f ./build/*.exe
npm run build
./build/*.exe