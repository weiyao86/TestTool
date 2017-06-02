echo on
echo %cd%
call pm2 delete express-mvc
call pm2 start process.json --only restful
call pm2 flush
call pm2 logs
