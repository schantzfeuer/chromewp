@echo off
setlocal enabledelayedexpansion

set "folder=%~dp0images"
set "output=%~dp0photos.json"

if not exist "%folder%" (
    echo Folder images tidak ditemukan.
    exit /b 1
)

set "files="
for %%F in ("%folder%"\*) do (
    if not "%%~xF"=="" (
        set "name=%%~nxF"
        if defined files (
            set "files=!files!,"!name!""
        ) else (
            set "files="!name!""
        )
    )
)

echo [!files!] > "%output%"

echo Berhasil menulis %output%
