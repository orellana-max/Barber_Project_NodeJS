@echo off
:: 1. Inicia el servicio de MySQL en modo silencioso
echo Iniciando MySQL 94...
net start MySQL94

:: 2. Abre una NUEVA ventana de CMD en la ruta de tu proyecto y ejecuta el servidor de Node
echo Abriendo proyecto de Node.js...
start cmd /k "cd /d C:\Users\Maxi\Documents\Barber_Project_NodeJS && npm run dev"

:: 3. Cierra esta primera ventana de administrador automáticamente
exit