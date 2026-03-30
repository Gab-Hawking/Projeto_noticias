@echo off
echo Iniciando NewsFilter...
start http://localhost:8080
python -m http.server 8080 --directory "%~dp0"
