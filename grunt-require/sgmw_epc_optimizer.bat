@echo off
@color 0A
d:
cd %cd%
tf get ../../  /r
tf checkout  ..\js\release  /r
tf checkout  ..\style\release /r
call grunt
tf checkin ..\js\release  /r  /c:压缩合并发布版js /noprompt
tf checkin ..\style\release /r /c:压缩合并发布版css /noprompt
exit
