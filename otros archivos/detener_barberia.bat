@echo off
:: 1. Detiene el proceso de Node.js de raíz (esto cerrará la terminal de npm run dev automáticamente)
echo Deteniendo servidor Node.js...
taskkill /f /im node.exe

:: 2. Detiene el servicio de MySQL 94
echo Deteniendo MySQL 94...
net stop MySQL94

echo ¡Todo apagado con éxito!
timeout /t 3
exit