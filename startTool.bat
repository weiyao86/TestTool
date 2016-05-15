echo on
echo %cd%
call pm2 kill
call pm2 start process.json --only express-mvc
call pm2 flush
call pm2 logs
