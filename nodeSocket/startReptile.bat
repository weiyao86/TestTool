echo on
color f0
echo %cd%
call pm2 delete socket
call pm2 delete socket-server
call pm2 start app.js -i 2 --name "socket"
cd forksocket
echo %cd%
call pm2 start server.js -i 2 --name "socket-server"
call pm2 flush
call pm2 logs
