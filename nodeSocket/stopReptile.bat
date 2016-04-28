echo on
color f0
echo %cd%
call pm2 delete socket
call pm2 delete socket-server

