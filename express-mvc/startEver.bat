@echo on
echo %cd%
call forever stop node-mvc
call forever start --minUptime 1000 --spinSleepTime 1000 --uid="node-mvc" -l node-mvc.log -a -o ./forever/out.log -a -e ./forever/err.log -a app.js

@Rem --uid node-mvc --minUptime 1000 --spinSleepTime 1000  -l ./forever/node-mvc.log -o ./forever/out.log -e ./forever/err.log -a -w app.js