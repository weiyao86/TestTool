@echo off
@color 0A
d:
cd %cd%
tf get ../../  /r
tf checkout  ..\js\release  /r
tf checkout  ..\style\release /r
call grunt
tf checkin ..\js\release  /r  /c:ѹ���ϲ�������js /noprompt
tf checkin ..\style\release /r /c:ѹ���ϲ�������css /noprompt
exit
