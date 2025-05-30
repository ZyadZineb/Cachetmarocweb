@echo off
echo Setting up Node.js environment...
set PATH=%PATH%;C:\Program Files\nodejs
echo Node.js version:
"C:\Program Files\nodejs\node.exe" --version
echo npm version:
"C:\Program Files\nodejs\npm.cmd" --version
echo.
echo Installing project dependencies...
cd /d "c:\Users\ziyad sobhi\Desktop\CACHETS MAROC\Nouveau dossier\WEBSITE\stamp-it-design-shop-99-main"
"C:\Program Files\nodejs\npm.cmd" install
echo.
echo Installation complete!
pause
