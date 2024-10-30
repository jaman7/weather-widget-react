# Skrypt PowerShell do odczytania plików i zapisania zawartości
$folderPath = "./map/"  # Podaj swoją ścieżkę do folderu
$outputFile = "./out.txt"

# Tworzymy plik wynikowy
New-Item -Path $outputFile -ItemType File -Force

# Iterujemy przez wszystkie pliki ts, html i scss w folderze
Get-ChildItem -Path $folderPath -Recurse -Include *.ts, *.tsx, *.html, *.scss | ForEach-Object {
    $fileName = $_.FullName
    $fileContent = Get-Content -Path $fileName
    Add-Content -Path $outputFile -Value "$($_.Name)"
    Add-Content -Path $outputFile -Value $fileContent
    Add-Content -Path $outputFile -Value "`n"  # Przerwa między plikami
}