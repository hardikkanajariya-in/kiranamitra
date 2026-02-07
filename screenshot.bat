@echo off
setlocal

set TIMESTAMP=%date:~-4%%date:~4,2%%date:~7,2%_%time:~0,2%%time:~3,2%%time:~6,2%
set TIMESTAMP=%TIMESTAMP: =0%
set FILENAME=screenshot_%TIMESTAMP%.png
set DEST=screenshots\%FILENAME%

if not exist screenshots mkdir screenshots

echo Taking screenshot...
adb shell screencap -p /sdcard/%FILENAME%
adb pull /sdcard/%FILENAME% "%DEST%"
adb shell rm /sdcard/%FILENAME%

echo Screenshot saved to %DEST%
endlocal
