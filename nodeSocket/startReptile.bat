echo on
color f0
echo %cd%
call pm2 delete socket
call pm2 start app.js -i 0 --name "socket"
call pm2 flush
call pm2 logs
